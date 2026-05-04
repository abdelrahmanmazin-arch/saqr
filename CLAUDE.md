# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

```bash
npm run dev      # start Vite dev server (hot reload)
npm run build    # production build — always run this to verify before committing
npm run preview  # serve the production build locally
```

There are no tests, no linter config, and no type-checking. `npm run build` is the only verification gate — a clean build (no errors) means the code is shippable.

---

## What This Is

**Saqr Platform (منظومة صقر)** by Madani Tech — a bilingual (Arabic/English) AI-powered building fire-safety intelligence platform for Saudi Arabia. It connects three distinct user types via three separate portals:

| Portal | Audience | Route Key |
|---|---|---|
| Commercial Portal | Building owners + BSOs (safety officers) | `'commercial'` |
| Civil Defense Portal | CD officers, commanders, inspectors | `'cd'` |
| Insurance Portal | Underwriters, actuaries | `'insurance'` |
| Madani Portal | Internal (coming soon placeholder) | `'madani'` |

---

## Architecture

### Routing

There is **no React Router**. Navigation is purely state-driven:

```
App
└── AppProvider (AppContext)
    └── PortalRouter
        ├── {portal === 'landing'}     → Landing.jsx
        ├── {portal === 'commercial'}  → CommercialPortal.jsx
        ├── {portal === 'cd'}          → CDPortal.jsx
        ├── {portal === 'insurance'}   → InsurancePortal.jsx
        └── {portal === 'madani'}      → MadaniPortal.jsx
```

`portal` state lives in AppContext. Call `setPortal('cd')` to switch portals. Each portal manages its own page/section state internally (e.g. `const [section, setSection] = useState('dashboard')`).

### AppContext (`src/context/AppContext.jsx`)

Global state available to all components via `useApp()`. Key exports:

- `lang` / `setLang` — `'ar'` (default) or `'en'`
- `portal` / `setPortal` — portal routing
- `t(str)` — translation helper: if `str` is `{ en, ar }` returns the current-language value; if it's already a string returns it unchanged; `t(undefined)` returns `''`
- `buildings` / `setBuildingsState` — mutable building portfolio (used by simulations)
- `cdUnits` / `setCdUnitsState` — mutable CD field units
- `insuranceFlag` / `setInsuranceFlag` — set by CD OperationsCenter simulation to trigger a badge on the Landing insurance card
- `simulateRiskEvent()` / `resetRiskEvent()` — mutates bld-009 risk score for demo
- `dispatchUnit(unitId, incidentId)` — mutates a unit's status

### Data Layer

Two separate data files — **do not mix them**:

**`src/data/seed.js`** — cross-portal data (Commercial + Insurance portals):
- `buildings` (9 buildings, bld-001 to bld-009)
- `incidents`, `policies`, `cdUnits`, `violations`, `licenses`, `drones`, `policyRules`, `trainingPrograms`, `campaigns`, `products`
- Utility functions: `getRiskBand(score)`, `getRiskColor(score)`, `calcRecommendedPremium()`, `formatSAR()`, `formatNum()`, `daysUntil(dateStr)`
- Risk band thresholds: **critical ≥ 85, high ≥ 70, medium ≥ 50, low < 50**

**`src/data/cdData.js`** — CD portal exclusive data:
- `cdIncidents`, `cdFieldUnits`, `volunteers`, `cdDrones`, `thermalAlerts`, `aiViolations`, `inspectionQueue`, `licenseApplications`, `cdLicenses`, `cdPolicyRules`, `cdTrainingPrograms`, `leaderboard`, `cdCampaigns`, `lessonsLearned`, `contentLibrary`

**`src/data/inspectionChecklists.js`** — SBC occupancy checklist data:
- `inspectionChecklists` — keyed by SBC group letter (`A`, `B`, `E`, `F`, `H`, `I`, `M`, `R`, `S`)
- Each entry: `{ label: { en, ar }, checkpoints: [{ id, text: { en, ar }, severity }] }`
- `getChecklistForSBC(sbcType)` — splits `'F/H'` on `/`, returns `inspectionChecklists[primary].checkpoints` (the array). **Always use `.checkpoints`** — the function returns the full object not the array.

**`src/data/i18n.js`** — all UI label strings as `{ en, ar }` objects. Import `{ ui }` for label lookups. Also exports a standalone `t(strings, lang)` function (but prefer the AppContext `t()` in components).

### Bilingual Pattern

Every user-facing string must support both languages. The shape is always `{ en: '...', ar: '...' }`. **Never render these objects directly as JSX children** — always wrap with `t()`. This is the most common crash vector:

```jsx
// CRASH — renders [object Object]
<div>{prog.certValidity}</div>

// CORRECT
<div>{t(prog.certValidity)}</div>
```

When the data field is a bilingual object stored in state (e.g. from `cdData.js`), always pass it through `t()` before rendering.

RTL layout: set `dir={isRTL ? 'rtl' : 'ltr'}` on root divs. Numbers rendered inside RTL layouts need the `ltr-num` CSS class to stay left-to-right. Use `start-*`/`end-*` Tailwind utilities instead of `left-*`/`right-*` for RTL-safe positioning.

---

## Civil Defense Portal Architecture

The CD portal has a distinct architecture from the other portals — it does **not** use the shared `Header` component.

```
CDPortal.jsx  (shell — owns toasts, tier state, sidebar nav)
├── NationalView.jsx     (tier 1 — read-only exec dashboard, no props needed)
├── StationView.jsx      (tier 3 — field officer mobile view)
└── Tier 2 sidebar + 7 modules (each receives { t, lang, addToast } as props):
    ├── cd/OperationsCenter.jsx
    ├── cd/DigitalInspection.jsx
    ├── cd/Surveillance.jsx
    ├── cd/DigitalLicensing.jsx
    ├── cd/PolicyEngine.jsx
    ├── cd/Training.jsx
    └── cd/AwarenessPlatform.jsx
```

**Tier system** (`tier` state in CDPortal, default `2`):
- Tier 1 → `<NationalView t={t} lang={lang} />`
- Tier 2 → full sidebar + 7 modules
- Tier 3 → `<StationView t={t} lang={lang} addToast={addToast} />`

**Toast system** — owned by CDPortal, passed down as `addToast` prop:
```js
addToast(msg, type, duration)
// type: 'critical' | 'warning' | 'success' | 'info'
// duration: default 4000ms
```
`<ToastStack toasts={toasts} onClose={removeToast} />` is always rendered in CDPortal regardless of tier.

**CD module data isolation** — CD modules import directly from `cdData.js`, not via AppContext. The exception is `setInsuranceFlag` (from AppContext), which OperationsCenter calls during simulation phase 6 to trigger the Landing insurance badge.

**CD module props contract** — all 7 modules receive `{ t, lang, addToast }` spread from `moduleProps`. They do NOT receive AppContext data directly (they import from cdData.js themselves).

---

## Design Systems

There are **two separate design systems** in this codebase — one per portal type:

### Light System (Commercial, Insurance, Landing)
- Background: `bg-white` / `bg-gray-50`
- Cards: `.portal-card` CSS class (`bg-white rounded-2xl shadow-sm border border-gray-100 p-6`)
- KPI tiles: `.kpi-tile` CSS class
- Status: `<StatusBadge status="active|expiring|expired|pending|..." />`
- Risk: `<RiskBadge score={74} />` (colored pill with dot)
- Portal accent colors: commercial `#1B4F72`, cd `#991B1B`, insurance `#0F1F3D`

### Dark System (Commercial Portal rebuild — specified but not yet fully implemented)
Per the Commercial Portal specification, it must use:
- Background: `#0A0E1A`, Surface: `#111827`, Elevated: `#1F2937`
- Borders: `#2D3748` | Primary text: `#F9FAFB` | Secondary: `#9CA3AF`
- Gold `#C9A84C` — active nav, CTAs, score highlights **only**
- Status via **left border + text color only** — never full background fill
- No gradients, no rounded decorative elements, no emoji
- Tables: `border-b border-[#2D3748]` rows — no alternating row fills
- Toasts: dark background with left border by severity

### CD Portal (white/light, NOT dark)
The CD portal uses the light system with red accent (`#991B1B`). The user explicitly rejected dark theme for CD. All CD modules use white backgrounds with colored left-borders for severity.

---

## Shared Components (`src/components/`)

- **`RiskBadge`** — reads `lang` from AppContext internally. Props: `score`, `showScore` (default true), `size` (`'sm'` | `'lg'`). Uses `getRiskBand()` from seed.js.
- **`StatusBadge`** — reads `lang` from AppContext internally. Prop: `status` string. Maps to label+style from internal lookup.
- **`ToastStack`** — pure presentational. Props: `toasts: [{id, msg, type}]`, `onClose: (id) => void`. Currently styled for the light system — needs dark variants for Commercial Portal rebuild.
- **`Header`** — used by Commercial and Insurance portals. Reads portal/lang/t from AppContext. Renders dark colored top bar, language toggle, nav items. **Not used by CDPortal** (CDPortal has its own top bar).

---

## Commercial Portal — What Needs to Be Built

The current `CommercialPortal.jsx` is a basic white-themed stub. It needs a **complete rewrite** to the dark design system spec. Key requirements:

**Two roles, one entity** — role switcher in top bar toggles Owner View ↔ BSO View.

**Owner View pages** (5):
1. Dashboard — risk posture banner (hero, portfolio risk number), 4 KPI tiles, building grid/map toggle, maintenance calendar
2. Building Detail — 4 tabs: Overview (risk engine panel, SHAP factors, 30-day trend chart), Sensor Network (sensor table + 3D BIM view toggle), Maintenance (scheduled tasks + report submission form), License & Compliance (license details, compliance calendar, violation log)
3. Notifications & Tasks — notifications log + tasks tab
4. Marketplace — product catalog with cart, order tracking
5. Reports — auto-generated report inbox

**BSO View** — task-driven mobile-first layout with: ON/OFF DUTY toggle, active alerts column, full-screen 60-second incident alert takeover (3 response buttons), inspection task queue, certifications panel.

**Data file needed** — `src/data/commercialData.js` with: 2 owners (Owner A: 4 buildings, Owner B: 2 buildings), 8 maintenance reports, 6 violations, 4 auto-generated reports, 3 marketplace orders, 12 notifications, BSO certifications (2 current + 1 expired), 7 scheduled maintenance tasks.

**Five interactive simulations**:
1. Al Jubail score change (88→96, sprinkler pressure drop)
2. Maintenance report → CD approval → score drop
3. Sensor offline flow → task creation
4. License expiry cascade → score increase
5. BSO incident validation (60-second alert screen)

**Sub-components** go in `src/portals/commercial/` (directory exists, currently empty).

---

## Key Patterns and Pitfalls

**Data field access bugs** — the most common error source. Always verify the actual data shape in the relevant data file before writing render code. Historic examples:
- `getChecklistForSBC()` returns `{ label, checkpoints }` — use `.checkpoints`, not the object directly
- `cdTrainingPrograms[n].certValidity` is `{ en, ar }` — must use `t()`
- `leaderboard[n].team` is the bilingual name, not `.teamName`
- `lessonsLearned[n].whys` not `.fiveWhys` | `.correctiveAction` (singular) not `.correctiveActions`
- `lessonsLearned[n].published` not `.visibility`
- `contentLibrary` is an array of `{ type, label, count }` objects — not a `{ type: count }` plain object

**`t()` guard** — `t(undefined)` returns `''` (safe). But `t(obj)` where `obj` is `{ en, ar }` renders the translated string. Rendering `{obj}` without `t()` throws "Objects are not valid as a React child."

**Interval cleanup** — any `setInterval` inside `useEffect` must be cleared on unmount (`return () => clearInterval(iv)`). This is used in CCTV timestamp tickers and sensor fluctuation animations.

**Simulation patterns** — use chained `setTimeout` calls with `addToast` calls at each stage. Store phase as `useState`. Never use `async/await` for simulation sequences.

**RTL-safe Tailwind** — use `start-*`/`end-*`, `ms-*`/`me-*`, `ps-*`/`pe-*` instead of directional variants whenever text direction may flip.

**Module independence** — CD modules are self-contained: they import their own data from `cdData.js`, define their own local state, and communicate upward only through `addToast`. They do not call `setPortal` or modify AppContext (except OperationsCenter which imports `setInsuranceFlag` from AppContext specifically for the simulation).
