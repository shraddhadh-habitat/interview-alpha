# InterviewAlpha Theme Implementation Guide

## Overview

The InterviewAlpha design system has been fully defined in CSS variables and component classes in `src/index.css`. This guide explains how to apply the theme across all components.

## CSS Variables (Available in All Components)

```css
/* Colors */
--bg-base: #f0ede8;         /* Page background */
--bg-card: #ffffff;         /* Card surfaces */
--text-primary: #111111;    /* Headings */
--text-secondary: #6b6b6b;  /* Body text */
--text-muted: #9a9a9a;      /* Helper text */
--border-subtle: #e4e1db;   /* Borders */

/* Gradients */
--gradient-rainbow: linear-gradient(90deg, #f4a632, #e85d3a, #c94491, #7b52d4, #3b82f6, #22c55e)
--gradient-cta: linear-gradient(90deg, #f97316, #ef4444, #a855f7, #3b82f6)

/* Badge */
--badge-bg: #eaf4ee;
--badge-text: #2e7d4f;
--badge-dot: #22c55e;
```

## CSS Classes (Ready to Use)

All these classes are defined in `src/index.css` and ready to use in JSX:

### Typography
```jsx
<div className="brand-serif">Interview</div>
<div className="brand-alpha">Alpha</div>
<h1 className="hero-tagline">Your tagline here</h1>
<p className="hero-subtitle">Supporting text</p>
<div className="section-label">HOW IT WORKS</div>
```

### Buttons
```jsx
<button className="btn-cta">Start Interview</button>
<button className="btn-primary">Secondary Action</button>
```

### Badges
```jsx
<div className="session-badge">2 sessions today</div>
```

### Cards
```jsx
<div className="stat-card">
  <div className="stat-number">1,100+</div>
  <div className="stat-label">Interview Questions</div>
</div>

<div className="step-card">
  <div className="step-number">1</div>
  <h3>Pick any question</h3>
</div>
```

## Component-by-Component Roadmap

### Priority 1: Landing Page (`src/components/LandingPage.jsx`)
1. Add class="session-badge" to the "2 sessions today" pill
2. Add class="btn-cta" to primary CTA buttons
3. Apply class="stat-card" to stat sections
4. Apply class="step-card" to "How It Works" cards
5. Update background colors to use CSS variables:
   - Replace hard-coded `#FFFFFF` with `var(--bg-card)`
   - Replace hard-coded `#1B1B18` with `var(--text-primary)`
   - Replace hard-coded `#E8E6E1` with `var(--border-subtle)`

### Priority 2: Navigation (`src/components/Nav.jsx`)
1. Add class="brand-serif" to the "Interview" portion of logo
2. Add class="brand-alpha" to the "Alpha" portion
3. Use `var(--text-primary)` for nav text
4. Use `var(--border-subtle)` for borders

### Priority 3: Main App (`src/App.jsx`)
1. Change body background from `#E8E6E1` to `var(--bg-base)`
2. Update document.body.style.background to use new color

### Priority 4: Button Styles (All Pages)
1. Replace all CTA buttons with class="btn-cta"
2. Replace secondary buttons with class="btn-primary"

### Priority 5: Card Styles (All Pages)
1. Apply class="stat-card" or class="step-card" where appropriate
2. Update inline styles to use CSS variables

## Detailed Conversion Examples

### Example 1: Convert a CTA Button

**Before:**
```jsx
<button style={{
  background: 'linear-gradient(135deg, #F472B6, #A78BFA, #60A5FA, #34D399, #FDCD34)',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  padding: '16px 28px',
  fontWeight: 700,
}}>
  Start Interview
</button>
```

**After:**
```jsx
<button className="btn-cta">Start Interview</button>
```

### Example 2: Convert a Card

**Before:**
```jsx
<div style={{
  background: '#FFFFFF',
  border: '1px solid #E8E6E1',
  borderRadius: '16px',
  padding: '28px 24px',
}}>
  <div style={{
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#1B1B18',
  }}>
    1,100+
  </div>
  <div style={{
    color: '#6b6b6b',
    fontSize: '0.9rem',
  }}>
    Interview Questions
  </div>
</div>
```

**After:**
```jsx
<div className="stat-card">
  <div className="stat-number">1,100+</div>
  <div className="stat-label">Interview Questions</div>
</div>
```

### Example 3: Update Colors to Use Variables

**Before:**
```jsx
<h1 style={{ color: '#1B1B18' }}>Welcome</h1>
<p style={{ color: '#6b6b6b' }}>Supporting text</p>
<div style={{ background: '#FFFFFF', border: '1px solid #E8E6E1' }}>
```

**After:**
```jsx
<h1 style={{ color: 'var(--text-primary)' }}>Welcome</h1>
<p style={{ color: 'var(--text-secondary)' }}>Supporting text</p>
<div style={{ background: 'var(--bg-card)', border: `1px solid var(--border-subtle)` }}>
```

## Font Family Updates

**Serif Typography (Playfair Display):**
- Logo "Interview" portion
- All H1 headings
- Feature section titles
- Use: `font-family: 'Playfair Display', Georgia, serif; font-weight: 900;`

**Body Typography (DM Sans):**
- All body copy
- Button text
- Form labels
- Use: `font-family: 'DM Sans', sans-serif;`

## Color Migration Map

| Old Color | New Variable | Usage |
|-----------|-------------|-------|
| `#111111` | `var(--text-primary)` | Headings |
| `#1B1B18` | `var(--text-primary)` | Headings |
| `#6b6b6b` | `var(--text-secondary)` | Body text |
| `#9a9a9a` | `var(--text-muted)` | Helper text |
| `#FFFFFF` | `var(--bg-card)` | Card backgrounds |
| `#f0ede8` | `var(--bg-base)` | Page background |
| `#E8E6E1` | `var(--border-subtle)` | Borders |
| `#E4E1DB` | `var(--border-subtle)` | Borders |
| Old gradients | `var(--gradient-cta)` | CTA buttons |
| Old gradients | `var(--gradient-rainbow)` | Text effects |

## Files to Update (In Order)

1. ✅ `index.html` - Font imports (DONE)
2. ✅ `src/index.css` - Variables & classes (DONE)
3. `src/App.jsx` - Remove hardcoded background
4. `src/components/LandingPage.jsx` - Apply classes & variables
5. `src/components/Nav.jsx` - Apply logo & nav styling
6. `src/pages/ATSChecker.jsx` - Update CTA buttons
7. `src/pages/ResumeOptimizer.jsx` - Update CTA buttons
8. All other pages - Apply theme consistently

## Testing Checklist

After applying theme to each component:
- [ ] Build succeeds: `npm run build`
- [ ] No console errors
- [ ] Text contrast meets WCAG AA
- [ ] CTA buttons have proper hover effects
- [ ] Cards have subtle shadows & borders
- [ ] Badge displays correctly with green dot
- [ ] "How It Works" step numbers visible
- [ ] Responsive on mobile (test at 480px width)

## Quick Reference: Gradient Usage

**For Text (Rainbow):**
```css
background: var(--gradient-rainbow);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

**For Button Background (CTA):**
```css
background: var(--gradient-cta);
background-size: 200% auto;
/* Animate on hover */
background-position: right center;
```

## Notes

- All CSS variables use the `--` prefix and are available globally
- CSS classes are provided for common patterns — use them instead of custom inline styles
- Font imports are already in `index.html` — no additional setup needed
- Old color values (#FDCD34, unicorn gradient) are removed from new theme
- Legacy CSS variable aliases are included for backwards compatibility

---

**Last Updated:** 2026-05-24
**Status:** Foundation complete. Ready for component application.
