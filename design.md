# City University Club - Design System

**Source:** <https://www.cityuniversityclub.co.uk/>
**Extracted:** 11:48

---

## Logo

- **URL:** <https://static.wixstatic.com/media/5e0aaa_0e0a73fe0edb472b8eebfde40d24d47f~mv2.png/v1/fill/w_102,h_102,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Untitled%20(Instagram%20Post).png>
- **Dimensions:** 102×102px

### Favicons

| Type | URL |
|------|-----|
| icon (192x192) | <https://static.parastorage.com/client/pfavico.ico> |
| shortcut icon | <https://static.parastorage.com/client/pfavico.ico> |
| apple-touch-icon | <https://static.parastorage.com/client/pfavico.ico> |
| favicon.ico | <https://www.cityuniversityclub.co.uk/favicon.ico> |

---

## Colors

### Primary Brand Colors (Visible in Live Site)

These are the colors actually used in the visible design:

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Dark Navy | `#06273a` | rgb(6, 39, 58) | Hero backgrounds, buttons, text on light backgrounds |
| Muted Sage | `#8fa89d` | rgb(143, 168, 157) | Header/nav background, subtle accents |
| Cream | `#fffef8` | rgb(255, 254, 248) | Page backgrounds, text on dark backgrounds |
| White | `#ffffff` | rgb(255, 255, 255) | Input backgrounds, cards on light theme |

### UI Color Applications

| Context | Background | Text | Border |
|---------|------------|------|--------|
| Dark sections (hero, footer) | `#06273a` | `#fffef8` | `#fffef8` (1px) |
| Light sections (forms, content) | `#fffef8` | `#06273a` | `#06273a` (1px) |
| Header/Navigation | `#8fa89d` | `#06273a` | — |
| Primary buttons | `#06273a` | `#fffef8` | — |
| Secondary buttons | `#fffef8` | `#06273a` | `#06273a` |

### Unused CSS Variables (from Wix template)

These exist in the stylesheet but are NOT used in the visible design:

| Color | Hex | CSS Variable | Note |
|-------|-----|--------------|------|
| Deep Brown | `#783600` | `--wst-color-custom-20` | Unused |
| Bright Orange | `#f06c00` | `--wst-color-custom-19` | Unused |
| Golden Yellow | `#f6a800` | `--wst-color-custom-14` | Unused |
| Sky Blue | `#32a7ea` | `--wst-color-fill-base-shade-2` | Unused |

---

## Typography

### Font Families

#### Primary: Cormorant Garamond

- **Variant:** Light
- **Fallbacks:** cormorantgaramond, cormorant garamond
- **Usage:** Headings, display text

#### Secondary: Raleway

- **Usage:** Body text, navigation, captions

#### System Fonts

- **Times New Roman** (fallbacks: times)
- **Helvetica** (fallbacks: Arial, メイリオ, meiryo, ヒラギノ角ゴ pro w3, hiragino kaku gothic pro)
- **Arial**
- **helvetica-w01-roman**

### Type Scale

| Element | Font | Size | Line Height | Weight |
|---------|------|------|-------------|--------|
| Heading 1 (Large) | Cormorant Garamond | 40px (2.50rem) | 0.80 (tight) | — |
| Heading 1 (Bold) | Cormorant Garamond | 40px (2.50rem) | 1.35 | 700 |
| Heading 1 (Medium) | Times New Roman | 35px (2.19rem) | 0.91 (tight) | — |
| Heading 2 | Cormorant Garamond | 22px (1.38rem) | 1.41 | — |
| Body/Nav | Raleway | 15px (0.94rem) | 1.67 (relaxed) | — |
| Subheading | helvetica-w01-roman | 15px (0.94rem) | 1.40 | 700 |
| Link | Raleway | 14px (0.88rem) | 1.79 (relaxed) | — |
| Button | Helvetica | 14px (0.88rem) | — | — |
| Button (Alt) | Arial | 13.33px (0.83rem) | — | — |
| Caption | Raleway | 14px (0.88rem) | 3.57 (relaxed) | — |
| Small Text | Arial | 10px (0.63rem) | — | — |

---

## Spacing System

**Base Unit:** 8px

| Value | Rem | Use Case |
|-------|-----|----------|
| 3px | 0.19rem | Micro spacing |
| 7px | 0.44rem | Tight spacing |
| 8px | 0.50rem | Base unit |
| 9px | 0.56rem | Small |
| 10px | 0.63rem | Small |
| 18px | 1.13rem | Component padding |
| 22px | 1.38rem | Medium gap |
| 26px | 1.63rem | Section padding |
| 27px | 1.69rem | Section padding |
| 34px | 2.13rem | Large gap |
| 43px | 2.69rem | Section spacing |
| 55px | 3.44rem | Large sections |
| 59px | 3.69rem | Large sections |
| 60px | 3.75rem | Section breaks |
| 61px | 3.81rem | Section breaks |

---

## Borders

| Style | Color | Use |
|-------|-------|-----|
| 1px solid | `#fffef8` rgb(255, 254, 248) | Input borders |

---

## Components

### Buttons

#### Primary Button (Off-White)

| State | Background | Text | Border |
|-------|------------|------|--------|
| Default | `#fffef8` | `#000000` | 2px solid rgba(6, 39, 58, 0) |
| Hover | `var(--corvid-hover-background-color)` | — | — |
| Active | `var(--corvid-hover-background-color)` | — | — |

### Text Inputs

| State | Background | Text | Border | Padding |
|-------|------------|------|--------|---------|
| Default | `#06273a` (1% opacity) | `#fffef8` | 1px solid #fffef8 | 3px 3px 3px 5px |
| Focus | `rgba(255,255,255,1)` | — | rgba(163,217,246,1) | — |

**Focus Ring:** `var(--focus-ring-box-shadow)`
**Focus Outline:** rgb(17, 109, 255) solid 2px

---

## Links

| State | Color | Hex |
|-------|-------|-----|
| Default (Visited) | Blue | `#0000ee` |
| Light Theme | Off White | `#fffef8` |
| Dark Theme | Dark Teal | `#06273a` |

---

## Frameworks Detected

| Framework | Details |
|-----------|---------|
| Radix UI | 11 Radix primitives |
| PrimeReact/Vue/NG | 57 Prime components |

---

## CSS Custom Properties Reference

```css
:root {
  /* Primary Brand Colors (ACTUALLY USED) */
  --cuc-navy: #06273a;
  --cuc-sage: #8fa89d;
  --cuc-cream: #fffef8;
  --cuc-white: #ffffff;

  /* Unused Wix Template Variables (kept for reference) */
  --wst-color-custom-20: #783600; /* Deep Brown - UNUSED */
  --wst-color-custom-19: #f06c00; /* Bright Orange - UNUSED */
  --wst-color-custom-14: #f6a800; /* Golden Yellow - UNUSED */
}
```

---

## Design Notes

- **Visual Style:** Sophisticated British private club aesthetic with cool, muted tones
- **Color Palette:** Dark navy/teal paired with muted sage green and cream - creating a refined, understated look reminiscent of traditional London clubs
- **Color Mood:** Cool and professional, NOT warm or earthy
- **Typography:** Serif display font (Cormorant Garamond) for elegance, sans-serif (Raleway) for readability
- **Platform:** Built on Wix with Radix UI and PrimeReact components
- **Important:** The browns/oranges in the Wix CSS variables are template defaults that are NOT used in the actual visible design
