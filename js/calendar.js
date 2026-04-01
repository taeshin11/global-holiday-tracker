// calendar.js - Monthly calendar grid rendering
const Calendar = {
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(),
  holidays: [],
  ecommerceEvents: [],
  countryColors: {},

  init(holidays, ecommerceEvents, countryColors) {
    this.holidays = holidays || [];
    this.ecommerceEvents = ecommerceEvents || [];
    this.countryColors = countryColors || {};
    this.render();
  },

  update(holidays, ecommerceEvents) {
    if (holidays) this.holidays = holidays;
    if (ecommerceEvents !== undefined) this.ecommerceEvents = ecommerceEvents;
    this.render();
  },

  setCountryColors(colors) {
    this.countryColors = colors;
    this.render();
  },

  goToToday() {
    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth();
    this.render();
  },

  prevMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) { this.currentMonth = 11; this.currentYear--; }
    this.render();
  },

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) { this.currentMonth = 0; this.currentYear++; }
    this.render();
  },

  getHolidaysForDate(dateStr) {
    return this.holidays.filter(h => h.date === dateStr);
  },

  getEcommerceForDate(dateStr) {
    return this.ecommerceEvents.filter(e => {
      if (e.date === dateStr) return true;
      if (e.endDate && dateStr >= e.date && dateStr <= e.endDate) return true;
      return false;
    });
  },

  render() {
    const container = document.getElementById('calendar-grid');
    if (!container) return;

    const locale = I18N.getLocale();
    const monthName = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(this.currentYear, this.currentMonth, 1));

    document.getElementById('calendar-month-label').textContent = monthName;

    const dayNames = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(2024, 0, i + 1); // Jan 1 2024 = Monday
      return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d);
    });

    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

    let html = '<div class="grid grid-cols-7 gap-0">';
    dayNames.forEach((d, i) => {
      const isWeekend = i >= 5;
      html += `<div class="text-center text-xs font-semibold py-2 ${isWeekend ? 'text-stone-400' : 'text-stone-600'} border-b border-stone-200">${d}</div>`;
    });

    for (let i = 0; i < startDay; i++) {
      html += '<div class="min-h-[60px] md:min-h-[80px] border-b border-r border-stone-100 bg-stone-50/50"></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${this.currentYear}-${String(this.currentMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      const dayOfWeek = (startDay + day - 1) % 7;
      const isWeekend = dayOfWeek >= 5;
      const isToday = dateStr === todayStr;
      const holidays = this.getHolidaysForDate(dateStr);
      const ecomEvents = this.getEcommerceForDate(dateStr);
      const hasEvents = holidays.length > 0 || ecomEvents.length > 0;

      let bgClass = isWeekend ? 'bg-stone-50/70' : 'bg-white';
      if (isToday) bgClass = 'bg-purple-50';

      html += `<div class="min-h-[60px] md:min-h-[80px] border-b border-r border-stone-100 ${bgClass} p-1 cursor-pointer hover:bg-purple-50/50 transition-colors relative calendar-day" data-date="${dateStr}" role="gridcell" aria-label="${new Intl.DateTimeFormat(locale, { month:'long', day:'numeric' }).format(new Date(this.currentYear, this.currentMonth, day))}${holidays.map(h=>`, ${h.name}`).join('')}">`;

      html += `<div class="text-sm font-medium ${isToday ? 'bg-purple-500 text-white w-7 h-7 rounded-full flex items-center justify-center' : isWeekend ? 'text-stone-400' : 'text-stone-700'}">${day}</div>`;

      if (hasEvents) {
        html += '<div class="flex flex-wrap gap-0.5 mt-0.5">';
        holidays.forEach(h => {
          const color = this.countryColors[h.countryCode] || '#7C3AED';
          html += `<div class="w-2 h-2 rounded-full flex-shrink-0" style="background-color:${color}" title="${h.name} (${h.countryCode})"></div>`;
        });
        ecomEvents.forEach(e => {
          html += `<div class="w-2 h-2 rounded-full flex-shrink-0 bg-amber-400" title="${e.name}"></div>`;
        });
        html += '</div>';
        // Show first holiday/event name on md+
        const firstName = holidays.length > 0 ? holidays[0].name : ecomEvents[0].name;
        const isEcom = holidays.length === 0;
        html += `<div class="hidden md:block text-[10px] leading-tight mt-0.5 truncate ${isEcom ? 'text-amber-700' : 'text-purple-700'}">${firstName}${(holidays.length + ecomEvents.length > 1) ? ` +${holidays.length + ecomEvents.length - 1}` : ''}</div>`;
      }

      html += '</div>';
    }

    const remaining = (7 - ((startDay + daysInMonth) % 7)) % 7;
    for (let i = 0; i < remaining; i++) {
      html += '<div class="min-h-[60px] md:min-h-[80px] border-b border-r border-stone-100 bg-stone-50/50"></div>';
    }

    html += '</div>';
    container.innerHTML = html;

    // Add click handlers
    container.querySelectorAll('.calendar-day').forEach(el => {
      el.addEventListener('click', () => {
        const dateStr = el.dataset.date;
        this.showDateDetail(dateStr);
      });
    });
  },

  showDateDetail(dateStr) {
    const holidays = this.getHolidaysForDate(dateStr);
    const ecomEvents = this.getEcommerceForDate(dateStr);
    if (holidays.length === 0 && ecomEvents.length === 0) return;

    const tooltip = document.getElementById('calendar-tooltip');
    if (!tooltip) return;

    let html = `<div class="font-semibold text-stone-800 mb-2">${I18N.formatDate(dateStr)}</div>`;
    holidays.forEach(h => {
      const color = this.countryColors[h.countryCode] || '#7C3AED';
      html += `<div class="flex items-center gap-2 py-1">
        <div class="w-3 h-3 rounded-full flex-shrink-0" style="background-color:${color}"></div>
        <div>
          <div class="text-sm font-medium text-stone-700">${h.localName || h.name}</div>
          <div class="text-xs text-stone-500">${h.name} - ${h.countryCode}</div>
        </div>
      </div>`;
    });
    ecomEvents.forEach(e => {
      html += `<div class="flex items-center gap-2 py-1">
        <div class="w-3 h-3 rounded-full flex-shrink-0 bg-amber-400"></div>
        <div>
          <div class="text-sm font-medium text-amber-800">${e.icon || '🛍️'} ${e.name}</div>
          <div class="text-xs text-stone-500">${e.region} - ${e.description}</div>
        </div>
      </div>`;
    });

    tooltip.innerHTML = html;
    tooltip.classList.remove('hidden');
    // Auto-hide after 5s
    setTimeout(() => tooltip.classList.add('hidden'), 5000);
  }
};
