// api.js - Nager.Date API client with caching
const HolidayAPI = {
  BASE_URL: 'https://date.nager.at/api/v3',
  CACHE_TTL: 3600000, // 1 hour

  _getCacheKey(endpoint) {
    return `ght_cache_${endpoint}`;
  },

  _getFromCache(endpoint) {
    try {
      const key = this._getCacheKey(endpoint);
      const cached = sessionStorage.getItem(key);
      if (!cached) return null;
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > this.CACHE_TTL) {
        sessionStorage.removeItem(key);
        return null;
      }
      return data;
    } catch { return null; }
  },

  _setCache(endpoint, data) {
    try {
      const key = this._getCacheKey(endpoint);
      sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    } catch { /* storage full */ }
  },

  async _fetch(endpoint, retries = 1) {
    const cached = this._getFromCache(endpoint);
    if (cached) return cached;

    for (let i = 0; i <= retries; i++) {
      try {
        const res = await fetch(`${this.BASE_URL}${endpoint}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        this._setCache(endpoint, data);
        return data;
      } catch (err) {
        if (i === retries) {
          console.error(`API error for ${endpoint}:`, err);
          const stale = this._getFromCache(endpoint);
          if (stale) return stale;
          throw err;
        }
      }
    }
  },

  async fetchAvailableCountries() {
    return this._fetch('/AvailableCountries');
  },

  async fetchPublicHolidays(year, countryCode) {
    return this._fetch(`/PublicHolidays/${year}/${countryCode}`);
  },

  async fetchNextHolidays(countryCode) {
    return this._fetch(`/NextPublicHolidays/${countryCode}`);
  },

  async fetchCountryInfo(countryCode) {
    return this._fetch(`/CountryInfo/${countryCode}`);
  },

  async fetchHolidaysForCountries(countryCodes, year) {
    const promises = countryCodes.map(code =>
      this.fetchPublicHolidays(year, code)
        .then(holidays => holidays.map(h => ({ ...h, countryCode: code })))
        .catch(() => [])
    );
    const results = await Promise.all(promises);
    return results.flat().sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  async fetchNextHolidaysForCountries(countryCodes) {
    const promises = countryCodes.map(code =>
      this.fetchNextHolidays(code)
        .then(holidays => holidays.map(h => ({ ...h, countryCode: code })))
        .catch(() => [])
    );
    const results = await Promise.all(promises);
    return results.flat().sort((a, b) => new Date(a.date) - new Date(b.date));
  }
};
