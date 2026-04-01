// analytics.js - Visitor counter and Google Sheets webhook
const Analytics = {
  WEBHOOK_URL: '', // Set your Google Apps Script webhook URL here

  init() {
    this.trackVisit();
    this.updateVisitorDisplay();
    this.sendWebhook('page_load', {
      countries: JSON.parse(localStorage.getItem('ght_selected_countries') || '[]'),
      path: window.location.pathname
    });
  },

  trackVisit() {
    const today = new Date().toISOString().split('T')[0];
    const lastVisit = localStorage.getItem('ght_last_visit');
    let todayCount = parseInt(localStorage.getItem('ght_today_count') || '0');
    let totalCount = parseInt(localStorage.getItem('ght_total_count') || '0');

    if (lastVisit !== today) {
      todayCount = 1;
      localStorage.setItem('ght_last_visit', today);
    } else {
      todayCount++;
    }
    totalCount++;

    localStorage.setItem('ght_today_count', todayCount);
    localStorage.setItem('ght_total_count', totalCount);
  },

  updateVisitorDisplay() {
    const todayEl = document.getElementById('visitor-today');
    const totalEl = document.getElementById('visitor-total');
    if (todayEl) todayEl.textContent = localStorage.getItem('ght_today_count') || '1';
    if (totalEl) totalEl.textContent = localStorage.getItem('ght_total_count') || '1';
  },

  async sendWebhook(action, detail = {}) {
    if (!this.WEBHOOK_URL) return;
    try {
      const payload = {
        timestamp: new Date().toISOString(),
        action,
        detail: JSON.stringify(detail),
        language: I18N.currentLang,
        referrer: document.referrer,
        userAgent: navigator.userAgent
      };
      await fetch(this.WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch { /* silent */ }
  },

  trackCountryChange(countries) {
    this.sendWebhook('country_change', { countries });
  },

  trackExport(countryCode, count) {
    this.sendWebhook('ics_export', { countryCode, count });
  },

  trackEcommerceClick(eventName) {
    this.sendWebhook('ecommerce_click', { eventName });
  }
};
