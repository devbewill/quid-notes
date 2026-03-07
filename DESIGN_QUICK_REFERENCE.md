# QUID Design System V4.0 — Quick Reference Guide

## 🎨 What Changed?

### The Big Picture

- **Lighter & Warmer:** Shifted from dark/tech to light/professional
- **More Readable:** All text now meets WCAG AA+ standards
- **Modern Feel:** Refined shadows, rounded corners, faster animations
- **Better Accessibility:** Clear focus states, keyboard navigation support

---

## 🎯 Key Improvements

### 1. Color Palette

#### Light Mode

| Element            | Before  | After                    |
| ------------------ | ------- | ------------------------ |
| Primary Background | #FFFFFF | #FFFFFF ✓                |
| Surface            | #F5F5F8 | #F1F5F9 ✓ Warmer         |
| Text Primary       | #0A0A0F | #0F172A ✓ Warmer         |
| Text Secondary     | #404050 | #475569 ✓ More readable  |
| Accent             | #7C3AED | #6366F1 ✓ Refined indigo |

#### Dark Mode

| Element            | Before  | After                     |
| ------------------ | ------- | ------------------------- |
| Primary Background | #0A0A0F | #1E293B ✓ Much lighter    |
| Surface            | #12121A | #334155 ✓ Better contrast |
| Text Primary       | #FAFAFA | #F8FAFC ✓ Warmer          |
| Text Secondary     | #A0A0B0 | #CBD5E1 ✓ Higher contrast |
| Accent             | #8B5CF6 | #818CF8 ✓ Brighter        |

### 2. Shadows

**Before:** Heavy, no blur (0.6-0.95 opacity)
**After:** Light, with blur (0.05-0.1 opacity)

```
Small:  0 1px 2px rgba(0,0,0,0.05)
Medium: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)
Large:  0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)
XL:     0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)
```

### 3. Border Radius

**Before:** 4px, 6px, 8px, 10px, 12px
**After:** 6px, 8px, 12px, 16px, 20px

### 4. Transitions

**Before:** 0.2s ease-out
**After:** 0.15s ease-out (faster, more responsive)

### 5. Focus States

**Before:** 2px solid indigo outline
**After:** 2px solid indigo outline + 4px blur glow

---

## 🚀 Design Tokens

### Colors

```css
/* Use these in Tailwind classes */
bg-primary      /* Primary background */
bg-surface      /* Secondary background */
bg-elevated     /* Card/panel background */
text-primary    /* Main text */
text-secondary  /* Secondary text */
text-muted      /* Muted text */
border-subtle   /* Subtle borders */
border-default  /* Default borders */
accent-primary  /* Primary accent color */
accent-light    /* Light accent background */
```

### Shadows

```css
shadow-sm       /* Small elements */
shadow-md       /* Cards, buttons */
shadow-lg       /* Modals, panels */
shadow-xl       /* Large modals, overlays */
```

### Radius

```css
rounded-sm      /* 6px - small elements */
rounded-md      /* 8px - buttons, inputs */
rounded-lg      /* 12px - cards */
rounded-xl      /* 16px - panels */
rounded-2xl     /* 20px - large cards */
```

---

## 📦 Component Updates

### Buttons

```tsx
// Primary Button
<button className="btn-primary">
  Click Me
</button>

// Secondary Button
<button className="btn-secondary">
  Cancel
</button>
```

### Inputs

```tsx
<input type="text" className="input" placeholder="Enter text..." />
```

### Cards

```tsx
<div className="card">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>
```

### Badges

```tsx
<span className="badge">Status</span>
```

### Tags

```tsx
<span className="tag" style="--tag-color: var(--tag-purple)">
  Purple Tag
</span>
```

---

## ✅ Accessibility Checklist

- [x] All text meets WCAG AA+ contrast ratios
- [x] Clear focus states on all interactive elements
- [x] Keyboard navigation support
- [x] Semantic HTML structure
- [x] Color not used as sole indicator of information
- [x] Smooth, fast transitions (0.15s)

---

## 🎨 Design Principles

1. **Clarity First:** High contrast, clear hierarchy
2. **Warmth & Approachability:** Warm tones, rounded corners
3. **Professional Polish:** Subtle details, smooth animations
4. **Accessibility by Design:** WCAG AA+ compliant

---

## 📚 Resources

- **Full Documentation:** [`DESIGN_REBRAND.md`](DESIGN_REBRAND.md)
- **Design System:** [`app/globals.css`](app/globals.css)
- **Tailwind Config:** [`tailwind.config.ts`](tailwind.config.ts)

---

## 🔄 Migration Tips

### What Works Automatically

- All existing Tailwind classes
- All existing components
- Theme switching (light/dark)

### What to Update (Optional)

- Hard-coded color values → Use design tokens
- Custom shadows → Use shadow tokens
- Border radius → Use radius tokens
- Transition durations → Use 0.15s

### Example Migration

**Before:**

```tsx
<div
  style={{
    background: "#F5F5F8",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.7)",
  }}
>
  Content
</div>
```

**After:**

```tsx
<div className="card">Content</div>
```

---

## 🧪 Testing

### Manual Testing

1. Open the app in both light and dark modes
2. Check all interactive elements have proper hover states
3. Tab through the interface to test keyboard navigation
4. Verify focus states are visible
5. Check contrast ratios with a tool like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Browser Testing

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

---

## 💡 Pro Tips

1. **Use Design Tokens:** Always prefer `bg-primary` over `#FFFFFF`
2. **Test Both Modes:** Always check both light and dark modes
3. **Focus on Accessibility:** Ensure all interactive elements are keyboard-accessible
4. **Keep It Simple:** Don't over-design, let the content shine
5. **Get Feedback:** Test with real users to validate the changes

---

## 🎉 Summary

The new design system is:

- ✅ More readable (WCAG AA+ compliant)
- ✅ Less dark (warmer, lighter colors)
- ✅ More modern (refined details, smooth animations)
- ✅ More accessible (clear focus states, keyboard navigation)
- ✅ More professional (polished, sophisticated)

**Ready to use!** The design system is already live in the development environment.

---

**Questions?** Refer to the full documentation in [`DESIGN_REBRAND.md`](DESIGN_REBRAND.md)
