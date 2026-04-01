// app.js - Core application state and UI rendering
const App = {
  state: {
    countries: [],
    selectedCountries: [],
    holidays: [],
    ecommerceEvents: [],
    countryColors: {},
    showPast: false,
    showEcommerce: true,
    loading: false
  },

  COUNTRY_COLORS: {},
  DEFAULT_COLORS: ['#3B82F6', '#EF4444', '#F59E0B', '#6366F1', '#EC4899', '#14B8A6'],
  POPULAR_COUNTRIES: ['US', 'GB', 'DE', 'JP', 'KR', 'CA'],
  MAX_COUNTRIES: 6,

  async init() {
    // Load color map
    try {
      const res = await fetch('data/country-colors.json');
      this.COUNTRY_COLORS = await res.json();
    } catch { this.COUNTRY_COLORS = {}; }

    // Load e-commerce events
    try {
      const res = await fetch('data/ecommerce-events.json');
      this.state.ecommerceEvents = await res.json();
    } catch { this.state.ecommerceEvents = []; }

    // Init i18n
    I18N.init();

    // Init analytics
    Analytics.init();

    // Init ads
    Ads.init();

    // Load countries
    await this.loadCountries();

    // Restore selected countries
    const saved = localStorage.getItem('ght_selected_countries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.state.selectedCountries = parsed.slice(0, this.MAX_COUNTRIES);
      } catch { this.autoDetectCountry(); }
    } else {
      this.autoDetectCountry();
    }

    // Setup UI
    this.renderCountrySelector();
    this.renderLanguageSwitcher();
    await this.loadHolidays();
    this.setupEventListeners();

    // Language change listener
    document.addEventListener('languageChanged', () => {
      this.renderCountrySelector();
      this.renderHolidayList();
      this.renderLanguageSwitcher();
      Calendar.render();
    });
  },

  autoDetectCountry() {
    const lang = navigator.language || 'en-US';
    const countryMap = {
      'en-US': 'US', 'en-GB': 'GB', 'de': 'DE', 'fr': 'FR', 'ja': 'JP',
      'ko': 'KR', 'zh': 'CN', 'pt-BR': 'BR', 'es': 'ES', 'it': 'IT'
    };
    const parts = lang.split('-');
    const detected = countryMap[lang] || countryMap[parts[0]] || 'US';
    this.state.selectedCountries = [detected];
  },

  async loadCountries() {
    try {
      this.state.countries = await HolidayAPI.fetchAvailableCountries();
    } catch {
      this.state.countries = [];
    }
  },

  async loadHolidays() {
    if (this.state.selectedCountries.length === 0) {
      this.state.holidays = [];
      this.renderHolidayList();
      Calendar.init([], this.state.showEcommerce ? this.state.ecommerceEvents : [], this.getActiveCountryColors());
      return;
    }

    this.state.loading = true;
    this.showLoading();

    try {
      const year = new Date().getFullYear();
      const [currentYearHolidays, nextYearHolidays] = await Promise.all([
        HolidayAPI.fetchHolidaysForCountries(this.state.selectedCountries, year),
        HolidayAPI.fetchHolidaysForCountries(this.state.selectedCountries, year + 1)
      ]);
      this.state.holidays = [...currentYearHolidays, ...nextYearHolidays];
    } catch {
      this.showError();
    }

    this.state.loading = false;
    this.hideLoading();
    this.updateCountryColors();
    this.renderHolidayList();
    Calendar.init(
      this.state.holidays,
      this.state.showEcommerce ? this.state.ecommerceEvents : [],
      this.getActiveCountryColors()
    );

    localStorage.setItem('ght_selected_countries', JSON.stringify(this.state.selectedCountries));
  },

  getCountryColor(code) {
    return this.COUNTRY_COLORS[code] || this.DEFAULT_COLORS[this.state.selectedCountries.indexOf(code) % this.DEFAULT_COLORS.length];
  },

  getActiveCountryColors() {
    const colors = {};
    this.state.selectedCountries.forEach(c => { colors[c] = this.getCountryColor(c); });
    return colors;
  },

  updateCountryColors() {
    this.state.countryColors = this.getActiveCountryColors();
    Calendar.setCountryColors(this.state.countryColors);
  },

  getCountryName(code) {
    const c = this.state.countries.find(c => c.countryCode === code);
    return c ? c.name : code;
  },

  getFlagEmoji(countryCode) {
    if (!countryCode || countryCode.length !== 2) return '';
    const codePoints = countryCode.toUpperCase().split('').map(c => 127397 + c.charCodeAt());
    return String.fromCodePoint(...codePoints);
  },

  // Country Selector
  renderCountrySelector() {
    const container = document.getElementById('country-selector');
    if (!container) return;

    const selectedPills = this.state.selectedCountries.map(code => {
      const color = this.getCountryColor(code);
      return `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium text-white country-pill" style="background-color:${color}" data-country="${code}">
        ${this.getFlagEmoji(code)} ${code}
        <button class="ml-1 hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center text-xs" onclick="App.removeCountry('${code}')" aria-label="${I18N.t('remove')} ${code}">&times;</button>
      </span>`;
    }).join('');

    const popularBtns = this.POPULAR_COUNTRIES.map(code => {
      const isSelected = this.state.selectedCountries.includes(code);
      return `<button class="px-3 py-1 rounded-full text-xs font-medium transition-colors ${isSelected ? 'bg-purple-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-purple-100'}" onclick="App.toggleCountry('${code}')">${this.getFlagEmoji(code)} ${code}</button>`;
    }).join('');

    container.innerHTML = `
      <div class="mb-3">
        <label class="text-sm font-semibold text-stone-700 mb-2 block" data-i18n="select_countries">${I18N.t('select_countries')}</label>
        <div class="relative">
          <input type="text" id="country-search" class="w-full px-4 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none bg-white" placeholder="${I18N.t('search_country')}" data-i18n-placeholder="search_country" autocomplete="off">
          <div id="country-dropdown" class="hidden absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"></div>
        </div>
      </div>
      <div class="flex flex-wrap gap-2 mb-3">
        <span class="text-xs text-stone-500 font-medium self-center" data-i18n="popular">${I18N.t('popular')}:</span>
        ${popularBtns}
      </div>
      <div class="flex flex-wrap gap-2" id="selected-pills">${selectedPills}</div>
    `;

    this.setupCountrySearch();
  },

  setupCountrySearch() {
    const input = document.getElementById('country-search');
    const dropdown = document.getElementById('country-dropdown');
    if (!input || !dropdown) return;

    input.addEventListener('focus', () => {
      this.renderCountryDropdown('');
      dropdown.classList.remove('hidden');
    });

    input.addEventListener('input', (e) => {
      this.renderCountryDropdown(e.target.value);
      dropdown.classList.remove('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#country-selector')) {
        dropdown.classList.add('hidden');
      }
    });
  },

  renderCountryDropdown(search) {
    const dropdown = document.getElementById('country-dropdown');
    if (!dropdown) return;

    const filtered = this.state.countries.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.countryCode.toLowerCase().includes(search.toLowerCase())
    );

    dropdown.innerHTML = filtered.map(c => {
      const isSelected = this.state.selectedCountries.includes(c.countryCode);
      return `<div class="flex items-center gap-2 px-3 py-2 hover:bg-purple-50 cursor-pointer transition-colors ${isSelected ? 'bg-purple-50' : ''}" onclick="App.toggleCountry('${c.countryCode}')">
        <input type="checkbox" ${isSelected ? 'checked' : ''} class="rounded border-stone-300 text-purple-600 focus:ring-purple-500 pointer-events-none" tabindex="-1">
        <span class="text-base">${this.getFlagEmoji(c.countryCode)}</span>
        <span class="text-sm text-stone-700 flex-1">${c.name}</span>
        <span class="text-xs text-stone-400">${c.countryCode}</span>
      </div>`;
    }).join('');
  },

  toggleCountry(code) {
    const idx = this.state.selectedCountries.indexOf(code);
    if (idx >= 0) {
      this.state.selectedCountries.splice(idx, 1);
    } else {
      if (this.state.selectedCountries.length >= this.MAX_COUNTRIES) {
        this.showToast(I18N.t('max_countries'));
        return;
      }
      this.state.selectedCountries.push(code);
    }
    this.renderCountrySelector();
    this.loadHolidays();
    Analytics.trackCountryChange(this.state.selectedCountries);
  },

  removeCountry(code) {
    this.state.selectedCountries = this.state.selectedCountries.filter(c => c !== code);
    this.renderCountrySelector();
    this.loadHolidays();
    Analytics.trackCountryChange(this.state.selectedCountries);
  },

  // Holiday List
  renderHolidayList() {
    const container = document.getElementById('holiday-list');
    const featuredContainer = document.getElementById('featured-holiday');
    if (!container) return;

    const today = new Date().toISOString().split('T')[0];
    let holidays = [...this.state.holidays];

    // Merge e-commerce events if enabled
    if (this.state.showEcommerce) {
      const ecomAsHolidays = this.state.ecommerceEvents.map(e => ({
        date: e.date,
        name: e.name,
        localName: `${e.icon || '🛍️'} ${e.name}`,
        countryCode: 'ECOM',
        type: ['EcommerceEvent'],
        isEcommerce: true,
        description: e.description,
        region: e.region
      }));
      holidays = [...holidays, ...ecomAsHolidays].sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Filter past
    let upcoming = holidays.filter(h => h.date >= today);
    let past = holidays.filter(h => h.date < today);

    if (upcoming.length === 0 && !this.state.showPast) {
      container.innerHTML = `<div class="text-center py-8 text-stone-400"><p data-i18n="no_holidays">${I18N.t('no_holidays')}</p></div>`;
      if (featuredContainer) featuredContainer.innerHTML = '';
      Countdown.stopAll();
      return;
    }

    // Featured holiday (next upcoming)
    if (featuredContainer && upcoming.length > 0) {
      const next = upcoming[0];
      const color = next.isEcommerce ? '#F59E0B' : this.getCountryColor(next.countryCode);
      featuredContainer.innerHTML = `
        <div class="bg-white rounded-2xl shadow-md border-l-4 p-6 relative overflow-hidden" style="border-color:${color}">
          <div class="absolute top-0 right-0 w-32 h-32 opacity-5" style="background:${color}; border-radius: 0 0 0 100%;"></div>
          <div class="flex items-start justify-between mb-3">
            <div>
              <span class="text-xs font-semibold uppercase tracking-wider text-stone-400" data-i18n="next_holiday">${I18N.t('next_holiday')}</span>
              <h3 class="text-xl font-bold text-stone-800 mt-1">${next.localName || next.name}</h3>
              ${next.localName && next.localName !== next.name ? `<p class="text-sm text-stone-500">${next.name}</p>` : ''}
            </div>
            <div class="flex items-center gap-2">
              ${next.isEcommerce ? '<span class="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full">E-commerce</span>' : `<span class="text-2xl">${this.getFlagEmoji(next.countryCode)}</span>`}
            </div>
          </div>
          <p class="text-sm text-stone-500 mb-4">${I18N.formatDate(next.date)}</p>
          <div id="featured-countdown" class="flex items-center justify-center gap-1 text-center py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl" aria-live="polite"></div>
          <div class="flex gap-2 mt-4">
            ${!next.isEcommerce ? `<button onclick="ICSExport.exportSingleHoliday(App.state.holidays.find(h=>h.date==='${next.date}'&&h.countryCode==='${next.countryCode}'));Analytics.trackExport('${next.countryCode}',1)" class="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <span data-i18n="export_ics">${I18N.t('export_ics')}</span>
            </button>` : ''}
            <button onclick="App.shareHoliday('${next.name}','${next.countryCode}','${next.date}')" class="text-xs bg-stone-100 text-stone-600 px-3 py-1.5 rounded-lg hover:bg-stone-200 transition-colors flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
              <span data-i18n="share">${I18N.t('share')}</span>
            </button>
          </div>
        </div>`;
      Countdown.startFeaturedCountdown(next.date, 'featured-countdown');
    }

    // List
    let visibleHolidays = this.state.showPast ? [...past.reverse(), ...upcoming] : upcoming;
    const displayLimit = 30;
    const displayedHolidays = visibleHolidays.slice(0, displayLimit);

    let html = '';
    displayedHolidays.forEach((h, i) => {
      const color = h.isEcommerce ? '#F59E0B' : this.getCountryColor(h.countryCode);
      const isPast = h.date < today;
      const typeLabel = h.isEcommerce ? 'E-commerce' : (Array.isArray(h.type) ? h.type[0] : 'Public');

      html += `
        <div class="bg-white rounded-xl shadow-sm border-l-4 p-4 hover:shadow-md transition-shadow ${isPast ? 'opacity-50' : ''}" style="border-color:${color}">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <span class="text-xl flex-shrink-0">${h.isEcommerce ? (h.localName ? h.localName.split(' ')[0] : '🛍️') : this.getFlagEmoji(h.countryCode)}</span>
              <div class="min-w-0">
                <h4 class="font-semibold text-stone-800 text-sm truncate">${h.isEcommerce ? h.name : (h.localName || h.name)}</h4>
                ${!h.isEcommerce && h.localName && h.localName !== h.name ? `<p class="text-xs text-stone-400 truncate">${h.name}</p>` : ''}
                <p class="text-xs text-stone-500">${I18N.formatDate(h.date)} ${h.isEcommerce ? `| ${h.region}` : `| ${h.countryCode}`}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0 ml-2">
              <span class="text-xs px-2 py-0.5 rounded-full font-medium ${h.isEcommerce ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}">${typeLabel}</span>
              <div class="text-xs text-stone-500 text-right whitespace-nowrap" data-countdown-date="${h.date}"></div>
              ${!h.isEcommerce ? `<button onclick="event.stopPropagation();ICSExport.exportSingleHoliday({date:'${h.date}',name:'${h.name.replace(/'/g,"\\'")}',localName:'${(h.localName||h.name).replace(/'/g,"\\'")}',countryCode:'${h.countryCode}'});Analytics.trackExport('${h.countryCode}',1)" class="p-1 hover:bg-stone-100 rounded text-stone-400 hover:text-purple-600 transition-colors" title="${I18N.t('export_ics')}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              </button>` : ''}
            </div>
          </div>
        </div>`;
    });

    if (visibleHolidays.length > displayLimit) {
      html += `<button id="load-more-btn" onclick="App.loadMoreHolidays()" class="w-full py-3 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium">Load More (${visibleHolidays.length - displayLimit} remaining)</button>`;
    }

    container.innerHTML = html;
    Countdown.startListCountdowns();
  },

  loadMoreHolidays() {
    // Simple approach: remove limit
    const container = document.getElementById('holiday-list');
    const btn = document.getElementById('load-more-btn');
    if (btn) btn.remove();
    // Re-render without limit (simplified)
    this.renderHolidayList();
  },

  // Legend
  renderLegend() {
    const container = document.getElementById('country-legend');
    if (!container) return;

    let html = '';
    this.state.selectedCountries.forEach(code => {
      const color = this.getCountryColor(code);
      html += `<div class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-full" style="background-color:${color}"></div>
        <span class="text-xs text-stone-600">${this.getFlagEmoji(code)} ${this.getCountryName(code)}</span>
      </div>`;
    });
    if (this.state.showEcommerce) {
      html += `<div class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-full bg-amber-400"></div>
        <span class="text-xs text-stone-600">🛍️ ${I18N.t('ecommerce_event')}</span>
      </div>`;
    }
    container.innerHTML = html;
  },

  // Language Switcher
  renderLanguageSwitcher() {
    const container = document.getElementById('language-switcher');
    if (!container) return;

    const langs = I18N.getLanguages();
    container.innerHTML = `
      <div class="relative">
        <button id="lang-btn" class="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
          <span>${langs.find(l => l.code === I18N.currentLang)?.flag || '🌐'}</span>
          <span class="hidden sm:inline">${I18N.currentLang}</span>
          <svg class="w-3 h-3 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="lang-dropdown" class="hidden absolute right-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-lg overflow-hidden z-50">
          ${langs.map(l => `
            <button class="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-purple-50 transition-colors ${l.code === I18N.currentLang ? 'bg-purple-50 text-purple-700' : 'text-stone-700'}" onclick="I18N.setLanguage('${l.code}')">
              <span>${l.flag}</span>
              <span>${l.name}</span>
            </button>
          `).join('')}
        </div>
      </div>`;

    document.getElementById('lang-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('lang-dropdown')?.classList.toggle('hidden');
    });
    document.addEventListener('click', () => {
      document.getElementById('lang-dropdown')?.classList.add('hidden');
    });
  },

  // Social sharing
  shareHoliday(name, countryCode, date) {
    const text = `Next holiday in ${countryCode}: ${name} on ${I18N.formatDate(date)}`;
    const url = window.location.href;
    this.showShareModal(text, url);
  },

  showShareModal(text, url) {
    const modal = document.getElementById('share-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onclick="this.remove()">
        <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm" onclick="event.stopPropagation()">
          <h3 class="font-bold text-stone-800 mb-4" data-i18n="share">${I18N.t('share')}</h3>
          <div class="grid grid-cols-2 gap-2">
            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}" target="_blank" rel="noopener" class="flex items-center gap-2 p-3 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-sm transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              X / Twitter
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}" target="_blank" rel="noopener" class="flex items-center gap-2 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </a>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" rel="noopener" class="flex items-center gap-2 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-sm transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
            <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}" target="_blank" rel="noopener" class="flex items-center gap-2 p-3 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-sm transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
          <button onclick="App.copyLink('${url}')" class="w-full mt-3 p-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm transition-colors flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
            <span data-i18n="copy_link">${I18N.t('copy_link')}</span>
          </button>
          <button onclick="this.closest('.fixed').remove()" class="w-full mt-2 p-2 text-sm text-stone-400 hover:text-stone-600 transition-colors">Close</button>
        </div>
      </div>`;
  },

  copyLink(url) {
    navigator.clipboard.writeText(url || window.location.href).then(() => {
      this.showToast(I18N.t('link_copied'));
    });
  },

  // Utilities
  showLoading() {
    const el = document.getElementById('loading-overlay');
    if (el) el.classList.remove('hidden');
  },

  hideLoading() {
    const el = document.getElementById('loading-overlay');
    if (el) el.classList.add('hidden');
  },

  showError() {
    this.showToast(I18N.t('error_api'));
  },

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-stone-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50 animate-fade-in';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
  },

  // Event listeners
  setupEventListeners() {
    // Toggle past holidays
    document.getElementById('toggle-past')?.addEventListener('click', () => {
      this.state.showPast = !this.state.showPast;
      const btn = document.getElementById('toggle-past');
      btn.textContent = this.state.showPast ? I18N.t('hide_past') : I18N.t('show_past');
      this.renderHolidayList();
    });

    // Toggle e-commerce
    document.getElementById('toggle-ecommerce')?.addEventListener('click', () => {
      this.state.showEcommerce = !this.state.showEcommerce;
      const btn = document.getElementById('toggle-ecommerce');
      btn.textContent = this.state.showEcommerce ? I18N.t('hide_ecommerce') : I18N.t('show_ecommerce');
      this.renderHolidayList();
      Calendar.update(this.state.holidays, this.state.showEcommerce ? this.state.ecommerceEvents : []);
      this.renderLegend();
    });

    // Export all
    document.getElementById('export-all')?.addEventListener('click', () => {
      ICSExport.exportAllHolidays(this.state.holidays, this.state.showEcommerce ? this.state.ecommerceEvents : []);
      Analytics.trackExport('all', this.state.holidays.length);
    });

    // Calendar navigation
    document.getElementById('cal-prev')?.addEventListener('click', () => Calendar.prevMonth());
    document.getElementById('cal-next')?.addEventListener('click', () => Calendar.nextMonth());
    document.getElementById('cal-today')?.addEventListener('click', () => Calendar.goToToday());

    // Share button
    document.getElementById('share-btn')?.addEventListener('click', () => {
      this.showShareModal(
        `${I18N.t('title')} - ${I18N.t('subtitle')}`,
        window.location.href
      );
    });

    // Render legend
    this.renderLegend();
  }
};

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
