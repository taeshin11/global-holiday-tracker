// countdown.js - Countdown timer logic
const Countdown = {
  featuredInterval: null,
  listInterval: null,

  getTimeRemaining(dateStr) {
    const target = new Date(dateStr + 'T00:00:00');
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
    return {
      total: diff,
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      passed: false
    };
  },

  formatCountdown(dateStr, full = false) {
    const t = this.getTimeRemaining(dateStr);
    if (t.passed) return '<span class="text-stone-400">Passed</span>';
    if (full) {
      return `<span class="countdown-digits">${String(t.days).padStart(2,'0')}</span><span class="countdown-label">${I18N.t('days')}</span>
              <span class="countdown-sep">:</span>
              <span class="countdown-digits">${String(t.hours).padStart(2,'0')}</span><span class="countdown-label">${I18N.t('hours')}</span>
              <span class="countdown-sep">:</span>
              <span class="countdown-digits">${String(t.minutes).padStart(2,'0')}</span><span class="countdown-label">${I18N.t('minutes')}</span>
              <span class="countdown-sep">:</span>
              <span class="countdown-digits">${String(t.seconds).padStart(2,'0')}</span><span class="countdown-label">${I18N.t('seconds')}</span>`;
    }
    if (t.days > 0) return `${t.days} ${I18N.t('days')}, ${t.hours} ${I18N.t('hours')}`;
    if (t.hours > 0) return `${t.hours} ${I18N.t('hours')}, ${t.minutes} ${I18N.t('minutes')}`;
    return `${t.minutes} ${I18N.t('minutes')}`;
  },

  startFeaturedCountdown(dateStr, elementId) {
    this.stopFeaturedCountdown();
    const el = document.getElementById(elementId);
    if (!el) return;
    const update = () => {
      el.innerHTML = this.formatCountdown(dateStr, true);
    };
    update();
    this.featuredInterval = setInterval(update, 1000);
  },

  stopFeaturedCountdown() {
    if (this.featuredInterval) {
      clearInterval(this.featuredInterval);
      this.featuredInterval = null;
    }
  },

  startListCountdowns() {
    this.stopListCountdowns();
    const update = () => {
      document.querySelectorAll('[data-countdown-date]').forEach(el => {
        const date = el.getAttribute('data-countdown-date');
        el.innerHTML = this.formatCountdown(date, false);
      });
    };
    update();
    this.listInterval = setInterval(update, 60000);
  },

  stopListCountdowns() {
    if (this.listInterval) {
      clearInterval(this.listInterval);
      this.listInterval = null;
    }
  },

  stopAll() {
    this.stopFeaturedCountdown();
    this.stopListCountdowns();
  }
};
