// ics-export.js - .ics file generation and download
const ICSExport = {
  generateEvent(holiday) {
    const dtstart = holiday.date.replace(/-/g, '');
    const endDate = new Date(holiday.date + 'T00:00:00');
    endDate.setDate(endDate.getDate() + 1);
    const dtend = endDate.toISOString().split('T')[0].replace(/-/g, '');
    const uid = `${dtstart}-${holiday.countryCode}-${holiday.name.replace(/[^a-zA-Z0-9]/g, '')}@globalholidaytracker`;

    return `BEGIN:VEVENT
DTSTART;VALUE=DATE:${dtstart}
DTEND;VALUE=DATE:${dtend}
SUMMARY:${this.escapeICS(holiday.localName || holiday.name)}
DESCRIPTION:${this.escapeICS(holiday.name)} - Public holiday in ${holiday.countryCode}
LOCATION:${holiday.countryCode}
UID:${uid}
STATUS:CONFIRMED
TRANSP:TRANSPARENT
END:VEVENT`;
  },

  generateEcommerceEvent(event) {
    const dtstart = event.date.replace(/-/g, '');
    let endDate;
    if (event.endDate) {
      const ed = new Date(event.endDate + 'T00:00:00');
      ed.setDate(ed.getDate() + 1);
      endDate = ed.toISOString().split('T')[0].replace(/-/g, '');
    } else {
      const ed = new Date(event.date + 'T00:00:00');
      ed.setDate(ed.getDate() + 1);
      endDate = ed.toISOString().split('T')[0].replace(/-/g, '');
    }
    const uid = `${dtstart}-ecom-${event.name.replace(/[^a-zA-Z0-9]/g, '')}@globalholidaytracker`;

    return `BEGIN:VEVENT
DTSTART;VALUE=DATE:${dtstart}
DTEND;VALUE=DATE:${endDate}
SUMMARY:${this.escapeICS(event.name)}
DESCRIPTION:${this.escapeICS(event.description || '')} (${event.region})
LOCATION:${event.region || 'Global'}
UID:${uid}
STATUS:CONFIRMED
TRANSP:TRANSPARENT
END:VEVENT`;
  },

  escapeICS(text) {
    return text.replace(/[\\;,]/g, c => '\\' + c).replace(/\n/g, '\\n');
  },

  generateCalendar(events) {
    const vevents = events.join('\n');
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Global Holiday Tracker//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Global Holiday Tracker
${vevents}
END:VCALENDAR`;
  },

  download(content, filename) {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  exportSingleHoliday(holiday) {
    const event = this.generateEvent(holiday);
    const cal = this.generateCalendar([event]);
    const name = holiday.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    this.download(cal, `${name}-${holiday.countryCode}.ics`);
  },

  exportAllHolidays(holidays, ecommerceEvents = []) {
    const events = [
      ...holidays.map(h => this.generateEvent(h)),
      ...ecommerceEvents.map(e => this.generateEcommerceEvent(e))
    ];
    const cal = this.generateCalendar(events);
    this.download(cal, 'global-holidays.ics');
  },

  exportCountryHolidays(holidays, countryCode) {
    const events = holidays.filter(h => h.countryCode === countryCode).map(h => this.generateEvent(h));
    const cal = this.generateCalendar(events);
    this.download(cal, `holidays-${countryCode}.ics`);
  }
};
