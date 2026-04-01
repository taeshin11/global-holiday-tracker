# PRD: Global Holiday Tracker

## Upcoming E-commerce Events & Public Holidays Worldwide

---

## 1. Product Overview

### Service Name
Global Holiday Tracker

### Short Title
Upcoming E-commerce Events & Public Holidays Worldwide

### Description
Global Holiday Tracker is a calendar and countdown dashboard showing upcoming public holidays and commercial events by country, designed for global marketers, e-commerce sellers, and international teams. Powered by the Nager.Date API (free public holiday API), it provides multi-country holiday views with countdown timers, a monthly calendar, highlighted e-commerce events (Black Friday, Singles Day, Prime Day, etc.), .ics calendar export, and color-coded country visualization.

### Target Audience
- Global e-commerce sellers (Amazon, Shopify, etc.)
- Digital marketers planning international campaigns
- HR managers tracking holidays for distributed teams
- Travelers planning around public holidays
- Event planners and content creators

### Target Keywords (SEO)
- "public holidays 2025"
- "global holiday calendar"
- "e-commerce calendar"
- "Black Friday countdown"
- "international holidays by country"
- "worldwide public holidays"

---

## 2. Harness Design Methodology

### Agent Workflow

```
Planner Agent
  --> Analyze PRD, break into milestones and tasks
  --> Output: milestone_plan.json

Initializer Agent
  --> Generate feature_list.json
  --> Generate claude-progress.txt
  --> Generate init.sh (project scaffold)
  --> Bootstrap project structure

Fixed Session Routine
  --> Each session: read claude-progress.txt
  --> Pick next incomplete task
  --> Build -> Test -> Commit
  --> Update claude-progress.txt

Builder Agent
  --> Implements features per milestone
  --> Writes code, tests locally

Reviewer Agent
  --> Reviews code quality, accessibility, SEO
  --> Validates against PRD requirements
  --> Confirms milestone completion
```

### Initializer Agent Outputs

#### feature_list.json
```json
{
  "project": "GlobalHolidayTracker",
  "features": [
    {
      "id": "F01",
      "name": "Project Scaffold & Tailwind Setup",
      "milestone": 1,
      "status": "pending"
    },
    {
      "id": "F02",
      "name": "Nager.Date API Integration",
      "milestone": 1,
      "status": "pending"
    },
    {
      "id": "F03",
      "name": "Country Selector (Multi-Select)",
      "milestone": 2,
      "status": "pending"
    },
    {
      "id": "F04",
      "name": "Upcoming Holidays List with Countdown Timers",
      "milestone": 2,
      "status": "pending"
    },
    {
      "id": "F05",
      "name": "Monthly Calendar View",
      "milestone": 3,
      "status": "pending"
    },
    {
      "id": "F06",
      "name": "E-commerce Events Highlighted",
      "milestone": 3,
      "status": "pending"
    },
    {
      "id": "F07",
      "name": "Export to .ics Calendar",
      "milestone": 4,
      "status": "pending"
    },
    {
      "id": "F08",
      "name": "Color-Coded by Country",
      "milestone": 4,
      "status": "pending"
    },
    {
      "id": "F09",
      "name": "Auto i18n (8+ Languages)",
      "milestone": 5,
      "status": "pending"
    },
    {
      "id": "F10",
      "name": "SEO Optimization",
      "milestone": 5,
      "status": "pending"
    },
    {
      "id": "F11",
      "name": "Ad Integration (Adsterra + AdSense)",
      "milestone": 6,
      "status": "pending"
    },
    {
      "id": "F12",
      "name": "Google Sheets Webhook",
      "milestone": 6,
      "status": "pending"
    },
    {
      "id": "F13",
      "name": "Visitor Counter (Today + Total)",
      "milestone": 6,
      "status": "pending"
    },
    {
      "id": "F14",
      "name": "Feedback & Social Sharing",
      "milestone": 7,
      "status": "pending"
    },
    {
      "id": "F15",
      "name": "Static Pages (About, FAQ, Privacy, Terms)",
      "milestone": 7,
      "status": "pending"
    },
    {
      "id": "F16",
      "name": "Deployment to Vercel",
      "milestone": 8,
      "status": "pending"
    }
  ]
}
```

#### claude-progress.txt
```
# Global Holiday Tracker - Progress Tracker
# Updated: [timestamp]

## Current Milestone: 1
## Current Task: F01 - Project Scaffold & Tailwind Setup
## Status: NOT STARTED

### Milestone 1: Foundation [NOT STARTED]
- [ ] F01: Project Scaffold & Tailwind Setup
- [ ] F02: Nager.Date API Integration

### Milestone 2: Core Features [NOT STARTED]
- [ ] F03: Country Selector (Multi-Select)
- [ ] F04: Upcoming Holidays List with Countdown Timers

### Milestone 3: Calendar & Events [NOT STARTED]
- [ ] F05: Monthly Calendar View
- [ ] F06: E-commerce Events Highlighted

### Milestone 4: Export & Visual [NOT STARTED]
- [ ] F07: Export to .ics Calendar
- [ ] F08: Color-Coded by Country

### Milestone 5: SEO & i18n [NOT STARTED]
- [ ] F09: Auto i18n
- [ ] F10: SEO Optimization

### Milestone 6: Monetization & Analytics [NOT STARTED]
- [ ] F11: Ad Integration
- [ ] F12: Google Sheets Webhook
- [ ] F13: Visitor Counter

### Milestone 7: Content & Social [NOT STARTED]
- [ ] F14: Feedback & Social Sharing
- [ ] F15: Static Pages

### Milestone 8: Deployment [NOT STARTED]
- [ ] F16: Deploy to Vercel

### Notes:
```

#### init.sh
```bash
#!/bin/bash
# Global Holiday Tracker - Project Initializer

mkdir -p src/{css,js,data,images,pages}
touch src/index.html
touch src/css/styles.css
touch src/js/app.js
touch src/js/api.js
touch src/js/calendar.js
touch src/js/countdown.js
touch src/js/ics-export.js
touch src/js/i18n.js
touch src/js/analytics.js
touch src/js/ads.js
touch src/data/ecommerce-events.json
touch src/data/country-colors.json
touch src/pages/about.html
touch src/pages/faq.html
touch src/pages/privacy.html
touch src/pages/terms.html
touch src/sitemap.xml
touch src/robots.txt

echo "Project scaffold created."
```

---

## 3. Technical Architecture

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Markup | Vanilla HTML5 (semantic) |
| Styling | Tailwind CSS (CDN), custom CSS |
| Logic | Vanilla JavaScript (ES6+) |
| API | Nager.Date API (free, no key required) |
| Hosting | Vercel (free tier) |
| Ads | Adsterra (primary), Google AdSense (secondary) |
| Analytics | Google Sheets via Apps Script webhook |

### Nager.Date API Details
- Base URL: `https://date.nager.at/api/v3/`
- No API key required, no authentication
- No strict rate limits (reasonable usage)
- Key endpoints:
  - `GET /PublicHolidays/{year}/{countryCode}` - holidays for a country/year
  - `GET /NextPublicHolidays/{countryCode}` - upcoming holidays
  - `GET /AvailableCountries` - list of supported countries
  - `GET /CountryInfo/{countryCode}` - country details
- Returns: date, localName, name, countryCode, fixed, global, type

### E-commerce Events (Static Data)
Since commercial events (Black Friday, Singles Day, etc.) are not in the Nager.Date API, they are maintained as a static JSON file with:
- Event name
- Date (fixed or calculated, e.g., "4th Thursday of November")
- Region/scope (Global, US, China, etc.)
- Category (shopping, tech, fashion)
- Description

### Infrastructure Cost
**$0 total** - Nager.Date API is free, Vercel free hosting.

### File Structure
```
GlobalHolidayTracker/
├── index.html                 # Main dashboard
├── css/
│   └── styles.css             # Custom styles, calendar CSS
├── js/
│   ├── app.js                 # Core state, UI rendering
│   ├── api.js                 # Nager.Date API client
│   ├── calendar.js            # Monthly calendar grid rendering
│   ├── countdown.js           # Countdown timer logic
│   ├── ics-export.js          # .ics file generation and download
│   ├── i18n.js                # Internationalization
│   ├── analytics.js           # Visitor counter, webhook
│   └── ads.js                 # Ad injection
├── data/
│   ├── ecommerce-events.json  # Static e-commerce event data
│   └── country-colors.json    # Color assignments per country
├── pages/
│   ├── about.html
│   ├── faq.html
│   ├── privacy.html
│   └── terms.html
├── images/
│   ├── og-image.png
│   ├── favicon.ico
│   └── flags/                 # Country flag SVGs or sprite
├── sitemap.xml
├── robots.txt
├── feature_list.json
├── claude-progress.txt
├── init.sh
├── vercel.json
└── README.md
```

---

## 4. Design System

### Color Palette (Soft Background - Calendar Theme)
| Role | Color | Hex |
|------|-------|-----|
| Background | Warm cream | #FBF8F3 |
| Background Alt | Soft beige | #F3EDE4 |
| Surface/Card | Pure soft white | #FFFFFF |
| Primary | Rich plum | #7C3AED |
| Primary Hover | Deeper plum | #6D28D9 |
| Secondary | Warm orange | #EA580C |
| Holiday Highlight | Soft rose | #FDE8E8 |
| E-commerce Event | Soft gold | #FEF3C7 |
| Countdown Active | Soft green | #DCFCE7 |
| Text Primary | Dark brown-gray | #292524 |
| Text Secondary | Warm gray | #78716C |
| Border | Light warm | #D6D3D1 |
| Today Highlight | Bright purple ring | #A78BFA |

### Country Color Palette (for multi-country coding)
```json
{
  "US": "#3B82F6",
  "GB": "#EF4444",
  "DE": "#F59E0B",
  "FR": "#6366F1",
  "JP": "#EC4899",
  "KR": "#14B8A6",
  "CN": "#DC2626",
  "BR": "#22C55E",
  "IN": "#F97316",
  "AU": "#8B5CF6",
  "CA": "#E11D48",
  "MX": "#059669"
}
```

### Typography
- **Headings**: Inter, weight 600-700
- **Body**: Inter, weight 400
- **Countdown digits**: Tabular nums, JetBrains Mono, weight 700
- **Calendar dates**: Inter, weight 500
- **Base size**: 16px

### Component Patterns
- **Holiday Card**: Country flag, holiday name, date, countdown, color bar on left
- **Calendar Grid**: 7-column grid (Mon-Sun), holiday dots color-coded by country
- **Countdown Timer**: Days : Hours : Minutes : Seconds, flip-clock style
- **Country Selector**: Multi-select with search, checkboxes, flag icons
- **E-commerce Badge**: Gold star icon, special styling to differentiate from public holidays

---

## 5. Feature Specifications

### F01: Project Scaffold & Tailwind Setup
- Directory structure per spec
- Tailwind CSS via CDN
- Base HTML with semantic structure
- Warm cream background
- Mobile-first responsive layout

### F02: Nager.Date API Integration
- Module `api.js`:
  - `fetchAvailableCountries()` - list all supported countries
  - `fetchPublicHolidays(year, countryCode)` - holidays for country/year
  - `fetchNextHolidays(countryCode)` - upcoming holidays
  - `fetchCountryInfo(countryCode)` - country metadata
- Caching: sessionStorage with 1-hour TTL
- Error handling: retry once, show cached data if available
- Loading skeleton states
- Batch fetching: when multiple countries selected, fetch in parallel with `Promise.all`

### F03: Country Selector (Multi-Select)
- Searchable dropdown with checkboxes
- Country list from Nager.Date API (`/AvailableCountries`)
- Each entry: flag icon + country name + country code
- Multi-select: user can check multiple countries
- Selected countries shown as pills/tags below selector
- Remove country by clicking X on pill
- Maximum 6 countries simultaneously (performance)
- Popular countries quick-select row: US, UK, Germany, Japan, South Korea, Canada
- Persist selection in localStorage
- Auto-detect user's country via browser locale and pre-select

### F04: Upcoming Holidays List with Countdown Timers
- Chronological list of upcoming holidays across all selected countries
- Each holiday entry shows:
  - Country flag + country name (color-coded left border)
  - Holiday name (local name + English name)
  - Date (formatted per locale)
  - Countdown timer: "X days, Y hours, Z minutes"
  - Holiday type badge (Public, Bank, Optional, etc.)
- Next upcoming holiday gets a large featured card with live countdown
- Countdown updates every second for the featured holiday
- Countdown updates every minute for the rest (performance)
- "Past holidays" toggle to show/hide completed holidays
- Infinite scroll or "Load More" for extended list

### F05: Monthly Calendar View
- Traditional calendar grid (7 columns, Mon-Sun or Sun-Sat per locale)
- Month/year navigation (previous/next arrows)
- "Today" button to jump back to current month
- Holiday markers on dates:
  - Colored dots under the date number
  - Each dot color corresponds to a country
  - Multiple dots for holidays in multiple countries
- Click on a date to see holiday details in a tooltip or side panel
- Weekend styling (slightly muted)
- Current day highlighted with ring
- Responsive: full grid on desktop, compact list on mobile

### F06: E-commerce Events Highlighted
- Static JSON data for commercial events:
  - **January**: New Year Sales
  - **February**: Valentine's Day, Super Bowl
  - **March**: International Women's Day
  - **May**: Mother's Day (varies by country)
  - **June**: Father's Day, Amazon Prime Day (July area)
  - **July**: Amazon Prime Day
  - **September**: Back to School
  - **October**: Halloween
  - **November**: Singles Day (11/11), Black Friday, Cyber Monday
  - **December**: Christmas Sales, Boxing Day, Year-End Sales
- E-commerce events styled differently from public holidays:
  - Gold/amber background or badge
  - Shopping cart icon
  - "E-commerce Event" label
- Toggleable: user can show/hide e-commerce events
- Countdown to major events (Black Friday, Singles Day, Prime Day)
- Tip: "Prepare your campaigns X days before"

### F07: Export to .ics Calendar
- "Export to Calendar" button per holiday or per country
- Generate .ics (iCalendar) format file
- Fields: VEVENT with DTSTART, DTEND (all-day), SUMMARY, DESCRIPTION, LOCATION (country)
- Bulk export: all holidays for selected countries in one .ics file
- Download triggers browser save dialog
- Compatible with Google Calendar, Apple Calendar, Outlook
- `.ics` file generation in pure JavaScript (no library needed)

### .ics Format Template
```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Global Holiday Tracker//EN
BEGIN:VEVENT
DTSTART;VALUE=DATE:20250101
DTEND;VALUE=DATE:20250102
SUMMARY:New Year's Day
DESCRIPTION:Public holiday in United States
LOCATION:US
END:VEVENT
END:VCALENDAR
```

### F08: Color-Coded by Country
- Each selected country assigned a distinct color from the country color palette
- Color consistency: same country always gets the same color
- Applied to:
  - Left border on holiday cards
  - Calendar dots
  - Country selector pills
  - Legend in calendar view
- Legend displayed above calendar and list views
- Colors chosen for accessibility (distinguishable, not too similar)
- Support for colorblind users: patterns or labels as secondary identifier

### F09: Auto i18n (8+ Languages)
- Detect via `navigator.language`
- Supported: EN, KO, JA, ZH, ES, DE, FR, PT
- Translate all UI strings
- Date formatting per locale (`Intl.DateTimeFormat`)
- Calendar day names per locale
- Month names per locale
- Language switcher in header
- localStorage persistence
- Holiday names: show local name (from API) + English name
- Fallback to EN

### F10: SEO Optimization
- Semantic HTML5
- Meta title: "Global Holiday Tracker - Upcoming E-commerce Events & Public Holidays Worldwide"
- Meta description with target keywords
- Open Graph tags with calendar-themed OG image
- Twitter Card tags
- JSON-LD structured data (WebApplication, Event schema for upcoming holidays)
- sitemap.xml, robots.txt
- Canonical URLs
- Heading hierarchy

### F11: Ad Integration
- **Adsterra (Primary)**:
  - Top banner below header (728x90 / 320x50)
  - Between holiday list and calendar view
  - Sidebar ad on desktop (300x250)
  - Placeholder divs with `data-adsterra-key`
- **Google AdSense (Secondary)**:
  - Publisher ID: `ca-pub-7098271335538021`
  - Auto-ads script
  - Manual slot below calendar

### F12: Google Sheets Webhook
- Auto POST on:
  - Page load (countries from selection)
  - Country added/removed
  - .ics export triggered (country + count)
  - E-commerce event click
- Payload: `{ timestamp, action, detail, language, referrer }`
- Non-blocking, silent

### F13: Visitor Counter
- Footer: "Today: X | Total: Y"
- localStorage + external counter
- Non-intrusive

### F14: Feedback & Social Sharing
- Feedback mailto: `taeshinkim11@gmail.com` with subject "Global Holiday Tracker Feedback"
- Social sharing: Twitter/X, Facebook, LinkedIn, WhatsApp, Copy Link
- Share specific holiday with pre-filled text: "Next holiday in [Country]: [Holiday] on [Date]"
- Share calendar view link with selected countries

### F15: Static Pages
- About: Nager.Date API credit, e-commerce events source, purpose
- FAQ: How to use multi-country view, .ics export instructions, data accuracy
- Privacy Policy, Terms of Service
- Consistent warm theme across all pages

---

## 6. Milestones & Git Strategy

### Milestone Plan

| Milestone | Features | Git Tag | Description |
|-----------|----------|---------|-------------|
| M1 | F01, F02 | v0.1.0 | Foundation + API integration |
| M2 | F03, F04 | v0.2.0 | Country selector + holiday list |
| M3 | F05, F06 | v0.3.0 | Calendar view + e-commerce events |
| M4 | F07, F08 | v0.4.0 | .ics export + color coding |
| M5 | F09, F10 | v0.5.0 | SEO + i18n |
| M6 | F11, F12, F13 | v0.6.0 | Monetization + analytics |
| M7 | F14, F15 | v0.7.0 | Content + social |
| M8 | F16 | v1.0.0 | Deployment |

### Git Strategy
```bash
gh repo create GlobalHolidayTracker --private --source=. --remote=origin
git init && git add . && git commit -m "feat(F01): initial scaffold"
git push -u origin main
git tag v0.1.0 && git push origin v0.1.0
```

---

## 7. Deployment Checklist

### Pre-Deployment
- [ ] All features implemented and tested
- [ ] Nager.Date API working for all supported countries
- [ ] E-commerce events JSON complete and accurate
- [ ] .ics export generates valid calendar files
- [ ] Calendar view renders correctly for all months
- [ ] Countdown timers accurate and updating
- [ ] Responsive design verified (mobile/tablet/desktop)
- [ ] SEO tags validated
- [ ] Ad slots configured
- [ ] Webhook tested
- [ ] Visitor counter working
- [ ] i18n verified for all 8 languages
- [ ] Static pages complete
- [ ] No console errors
- [ ] Lighthouse > 90

### Vercel Deployment
```bash
vercel --prod
```

### vercel.json
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

---

## 8. Google Sheets Webhook Setup

### Apps Script
```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.action,
    data.detail,
    data.language,
    data.referrer,
    data.userAgent
  ]);
  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok" })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

---

## 9. Ad Monetization Strategy

### Adsterra Placements
- Top banner (728x90 / 320x50)
- Between list and calendar sections
- Sidebar (300x250) on desktop
- Footer banner
- Native ad in holiday list (every 10th item)

### Google AdSense
- Publisher ID: `ca-pub-7098271335538021`
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7098271335538021" crossorigin="anonymous"></script>
```

---

## 10. i18n Implementation

### Supported Languages
| Code | Language |
|------|----------|
| EN | English |
| KO | Korean |
| JA | Japanese |
| ZH | Chinese (Simplified) |
| ES | Spanish |
| DE | German |
| FR | French |
| PT | Portuguese |

### Translation Keys (Sample)
```json
{
  "EN": {
    "title": "Global Holiday Tracker",
    "subtitle": "Upcoming E-commerce Events & Public Holidays Worldwide",
    "select_countries": "Select Countries",
    "search_country": "Search country...",
    "upcoming_holidays": "Upcoming Holidays",
    "calendar_view": "Calendar View",
    "ecommerce_events": "E-commerce Events",
    "countdown": "Countdown",
    "days": "days",
    "hours": "hours",
    "minutes": "minutes",
    "seconds": "seconds",
    "export_ics": "Export to Calendar",
    "export_all": "Export All",
    "show_past": "Show Past Holidays",
    "hide_past": "Hide Past Holidays",
    "no_holidays": "No upcoming holidays for selected countries.",
    "today": "Today",
    "legend": "Legend",
    "public_holiday": "Public Holiday",
    "ecommerce_event": "E-commerce Event"
  }
}
```

### Calendar Localization
```javascript
// Locale-aware day names
const dayNames = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(2024, 0, i + 1); // Mon Jan 1 2024 is Monday
  return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
});

// Locale-aware month names
const monthNames = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(2024, i, 1);
  return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
});
```

---

## 11. Performance & Accessibility

### Performance
- API responses cached in sessionStorage (1-hour TTL)
- Parallel API fetches for multiple countries (`Promise.all`)
- Countdown timers: featured = 1s interval, others = 60s interval
- Lazy rendering for long holiday lists
- Calendar rendering optimized (only current month DOM)
- Total page size: < 300KB

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation for country selector, calendar, export buttons
- ARIA labels on calendar dates ("January 1, New Year's Day, US")
- Screen reader: countdown announced on focus
- Color + pattern for country coding (not color alone)
- Calendar table uses proper `<th>` for day headers with scope
- Focus management when switching views

---

## 12. E-commerce Events Data

### Static JSON Structure
```json
[
  {
    "name": "New Year Sales",
    "date": "2025-01-01",
    "endDate": "2025-01-03",
    "region": "Global",
    "category": "shopping",
    "description": "Post-New Year clearance sales worldwide"
  },
  {
    "name": "Valentine's Day",
    "date": "2025-02-14",
    "region": "Global",
    "category": "gifts",
    "description": "Peak gifting period for flowers, chocolates, jewelry"
  },
  {
    "name": "Amazon Prime Day",
    "date": "2025-07-15",
    "endDate": "2025-07-16",
    "region": "Global",
    "category": "tech",
    "description": "Amazon's annual Prime member exclusive deals event"
  },
  {
    "name": "Singles Day (11.11)",
    "date": "2025-11-11",
    "region": "China/Global",
    "category": "shopping",
    "description": "World's largest online shopping event, originated by Alibaba"
  },
  {
    "name": "Black Friday",
    "date": "2025-11-28",
    "region": "US/Global",
    "category": "shopping",
    "description": "Biggest shopping day of the year, day after US Thanksgiving"
  },
  {
    "name": "Cyber Monday",
    "date": "2025-12-01",
    "region": "US/Global",
    "category": "tech",
    "description": "Online-focused deals day following Black Friday weekend"
  }
]
```

---

## 13. Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Nager.Date API downtime | Low | High | Cache all responses, show cached data with note |
| Nager.Date missing countries | Low | Medium | Document supported countries, suggest alternatives |
| E-commerce event dates change | Medium | Low | Update static JSON annually, note "dates may vary" |
| .ics compatibility issues | Low | Medium | Test with Google Calendar, Apple Calendar, Outlook |
| Too many countries = slow | Medium | Medium | Cap at 6 countries, batch API calls |
| Countdown drift | Low | Low | Resync with Date.now() periodically |

---

## 14. Success Metrics

| Metric | Target (Month 1) | Target (Month 3) |
|--------|------------------|------------------|
| Daily Visitors | 40 | 400 |
| Page Views | 1,200 | 12,000 |
| .ics Exports/Day | 5 | 50 |
| Countries Viewed/Session | 2 | 3 |
| Avg Session Duration | > 2 min | > 3 min |
| Ad Revenue | $1-5 | $10-50 |
| Google Indexation | Top 50 for "public holidays 2025" | Top 20 |

---

## 15. Future Enhancements (Post-MVP)

- Email/push notifications before holidays
- Holiday impact analysis for e-commerce (shipping delays, sales spikes)
- Year-over-year holiday comparison
- Custom event creation (team birthdays, company events)
- Sync with Google Calendar API (2-way)
- Holiday heatmap (visualize holiday density across months)
- Regional sub-holidays (state/province level)
- Slack bot: daily holiday digest
- PWA for mobile with offline cached holidays
- Collaborative team calendar (share with team via link)

---

*Document Version: 1.0*
*Created: 2026-04-01*
*Methodology: Harness Design*
