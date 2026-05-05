# Saqr Platform — Design System
**Direction: Official Record**

A government-grade fire-safety intelligence platform for Saudi Arabia. The interface should feel like the authoritative paper record that a Civil Defense inspector trusts — not a startup dashboard.

---

## Intent

**Who:** Government inspectors, building safety officers, insurance underwriters, building owners. People who need to act, not be impressed. They live in official documents.

**What they do:** Assess risk, respond to incidents, price policies, approve licenses.

**Feel:** The weight of an official stamp. Warm off-white like a filed document. Hairline borders like a ruled ledger. Zero decoration. Every number matters.

---

## Foundation Tokens

```
Page background:  #F7F5F2  (warm form-paper off-white)
Surface (cards):  #FFFFFF  (pure white — the "paper")
Border:           rgba(0,0,0,0.07)  (hairline — structure whispers)
Shadows:          NONE — zero shadows anywhere in the application

Text primary:     #18181B
Text secondary:   #52525B
Text metadata:    #A1A1AA  (section labels, captions)
```

---

## Per-Portal Identity Colors

```
Commercial (Owners/BSO):  #1E3A5F  (navy — ownership, authority)
Civil Defense:            #991B1B  (crimson — enforcement, urgency)
Insurance:                #0F1F3D  (deep navy — precision, value)
Madani Tech (internal):   #374151  (slate — operational)
```

---

## Semantic Colors (unchanged across portals)

```
Critical:   #EF4444
High:       #F97316
Medium:     #EAB308
Low:        #22C55E
Info:       #3B82F6
```

---

## Signature Element

**3px left-border severity stripe** — the only decoration allowed.

Every data row, alert card, nav active state, and status indicator uses a 3px left border in the semantic color. Never a filled background, never a colored badge background for severity.

```css
.stripe-critical { border-left: 3px solid #EF4444; }
.stripe-high     { border-left: 3px solid #F97316; }
.stripe-medium   { border-left: 3px solid #EAB308; }
.stripe-low      { border-left: 3px solid #22C55E; }
.stripe-info     { border-left: 3px solid #3B82F6; }
```

---

## Section Label Pattern

```css
.section-label {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 10px;
  font-weight: 500;
  color: #A1A1AA;
}
```

Usage: Every section heading, card header, table group label.

---

## Component Patterns

### Cards
```jsx
style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.07)' }}
className="rounded-xl p-4"
// OR use .portal-card CSS class for standard p-6 cards
```

Never add shadow. Never add hover:shadow.

### Portal Cards (top accent variant — Landing page)
```jsx
style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.07)', borderTop: '3px solid <portalAccent>' }}
```

### Active Nav Items
```jsx
style={{ borderInlineStart: '3px solid <portalAccent>', color: <portalAccent> }}
```

### KPI Tiles
```jsx
className="kpi-tile"
// Defined in index.css — white bg, rgba border, no shadow
```

### Toasts (CD Portal via ToastStack)
Uses light semantic backgrounds (red-50, amber-50, etc.) with 3px left border. No shadow.

### Toasts (Commercial Portal inline)
```jsx
style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.07)', borderLeft: '3px solid <severityColor>' }}
```

---

## Typography

Font: `IBM Plex Sans Arabic` (Arabic), `IBM Plex Sans` (Latin)

Risk scores and numbers: monospace, tabular numerals — add class `ltr-num` in RTL layouts.

---

## Spacing Base Unit

4px (Tailwind default). Scale: 2, 4, 6, 8, 12, 16, 20, 24px for component internals; 24, 32, 48, 64px for section separation.

---

## Depth Strategy

**Borders-only.** No shadows. No elevation through color shifting.

Hierarchy is established by:
- Border weight: `rgba(0,0,0,0.07)` standard, `rgba(0,0,0,0.12)` for modal overlays
- White surface on `#F7F5F2` page — the contrast creates hierarchy
- 3px left-border stripe for severity/importance

---

## Border Radius

- Inputs, tags: `rounded-lg` (8px)
- Cards, panels: `rounded-xl` (12px)
- Modals: `rounded-2xl` (16px)
- Buttons: `rounded-lg` (8px)

---

## Hero Section (Landing)

Dark navy `#0F1C35` — authority counterweight to the off-white content. Three-portal accent bar (3px, gradient) at the very top. Stats row inside hero bottom with `rgba(255,255,255,0.06)` separator.

---

## RTL

All layouts use `dir={isRTL ? 'rtl' : 'ltr'}`. Use `start-*`/`end-*`/`ms-*`/`me-*` Tailwind utilities, never `left-*`/`right-*`. Numbers inside RTL text use `ltr-num` class.

---

## What to Reject

- `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl` — NEVER
- `bg-gradient-*` on cards — NEVER
- Rounded corners on decorative elements (only functional components)
- Multiple accent colors per portal — one accent per portal only
- `border-gray-100` / `border-gray-200` — replace with `rgba(0,0,0,0.07)` for new code
