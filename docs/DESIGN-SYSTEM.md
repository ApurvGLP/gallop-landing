> Vendored copy for repo context — canonical source lives in the BABCO brand-system at `~/Desktop/code/design-tokens/gallop/`. Edit there first, then re-copy.

# GALLOP — Brand Design System

> **Vendored 2026-07-10** from the designer's handoff into `design-tokens/gallop/`
> (BABCO's canonical Gallop token home). Machine-readable values live in
> [tokens.json](tokens.json) / [tokens.css](tokens.css) beside this file —
> there the variables carry a `--gallop-` prefix (`--brand-text-primary` in
> this doc ≡ `--gallop-text-primary`, `--ochre-600` ≡ `--gallop-ochre-600`).
> The `../site/tokens.css` this doc originally pointed at lives in the
> designer's website repo, which is not vendored here.

Source of truth: the Figma file "[WIP] Gallop", STYLE GUIDE page
(https://www.figma.com/design/g7lxtCxd97Re7RU4aLTyWe/-WIP--Gallop?node-id=208-1196).
Machine-readable values live in [tokens.css](tokens.css) —
always use those variables, never raw hex values. (This document is the
human-readable companion.)
Colour and type tokens were pulled directly from the Figma "Foundations" style
guide frames on 2026-07-08.

Anything built for GALLOP should look and feel like the Figma designs. This
document describes *how* it looks and feels, so new pages match in spirit,
not just in hex code.

> **Building a UI graphic** (a product-interface mockup, dashboard, app screen)?
> Also read [ui-brand.md](ui-brand.md) — it overrides the typography rules below
> for anything that depicts the product itself.

---

## The feel in one paragraph

Editorial, calm, and precise — a warm paper-toned canvas (#F9F9F2) with a
classic serif for headlines, a clean sans for reading, and a monospace for
small technical labels. Colour arrives in big, flat, confident blocks of
ochre yellow and soft blue — never gradients, never shadows, almost never
rounded corners. The signature graphic motif is a set of horizontal
"speed stripes" of decreasing thickness, echoing the name Gallop. It should
feel like a beautifully typeset technical journal, not a glossy SaaS site.

---

## Colour

From the style guide: *"Gallop's color system is built on a warm, editorial
foundation. The ochre yellow anchors the brand identity, supported by soft
blue and green accents. Neutral tones range from warm charcoal to creamy
off-white, ensuring legibility and visual comfort across all surfaces."*

### Brand (semantic) — reach for these first

| Role | Token | Hex | Use |
|---|---|---|---|
| Text Primary | `--brand-text-primary` | `#362F2C` | Primary text; also the dark fill for footer, buttons, dark blocks. Never pure black for text. |
| Text Secondary | `--brand-text-secondary` | `#7A7471` | Secondary / supporting text. |
| Background | `--brand-background` | `#F9F9F2` | Page background. Warm off-white, never pure white. |
| Surface | `--brand-surface` | `#F2F2EB` | Card headers, panels; text colour on dark buttons. |
| Core | `--brand-core` | `#D8F18F` | The signature lime. Hero bands, feature blocks, CTAs and key interactive elements. |
| Secondary | `--brand-secondary` | `#76DDAB` | Mint. Supporting accents, success/positive indicators, informational elements. |
| White / Black | `--brand-white` / `--brand-black` | `#FFFFFF` / `#000000` | Sparingly. |

### Ramps — for shades beyond the semantics

Each accent has a full 50→950 ramp in [tokens.css](tokens.css)
(50 = palest, 950 = deepest):

- **Neutral** (`--neutral-*`) — warm brown-to-cream scale derived from Text
  Primary (500 = `#362F2C`, 50 = `#F9F9F2`). For text, borders, backgrounds,
  surfaces.
- **Core** (`--core-*`) — signature brand lime, pale wheat to deep olive.
  Light tints work for backgrounds and subtle highlights; darker shades
  serve hover states and contrast pairings. Key steps: 300 `#D2E3A1`
  (card tints), 600 `#9FCC1A` (stripes on core), 100 `#F0F3E7` (pale
  text on dark).
- **Secondary** (`--secondary-*`) — mint. Lighter tints for success /
  positive backgrounds, darker shades for text on light surfaces. Key
  steps: 300 `#A8DCC3` (soft panels), 700 `#298A5B` (strokes and labels
  on a light canvas).

> The earlier ochre / blue / green accents were retired in the July 2026
> palette. `--ochre-*` maps onto Core and `--blue-*` / `--green-*` onto
> Secondary in [tokens.css](tokens.css) so older markup keeps resolving,
> but new work should use `--core-*` / `--secondary-*` directly.

**Rules**

- Colour is applied in large flat rectangles. No gradients, no shadows, no tints.
- Secondary text uses `--brand-text-secondary`. (The original web design mocked
  this with Text Primary at opacity 0.5 — the dedicated token supersedes that;
  visually near-identical on light backgrounds.)
- Inactive/disabled content drops to opacity 0.3; decorative background texture to 0.1.
- Images placed on coloured blocks use `mix-blend-mode: multiply` so they sit *in* the colour, not on top of it.
- The stripe motif always uses the darker step of its background's own ramp (ochre-600 on ochre-500, blue-700 on blue-600, text-primary on background).

## Typography

From the style guide: *"Gallop uses three typefaces — Gentium Basic, Funnel
Sans, and Geist Mono — each chosen to reflect a confident, editorial identity.
Gentium Basic brings serif warmth to headings, Funnel Sans provides clean
readability for body copy, and Geist Mono delivers technical precision for
labels and captions."*

All text — every style — uses **-2% tracking** (letter-spacing -0.02em).
Headings are weight 400 only, never bold; every heading style also has an
*italic* variant for editorial emphasis.

> **Exception — UI graphics:** inside product-interface mockups, Gentium Basic
> is *not* used; UI titles and body are Funnel Sans, labels are Geist Mono. The
> serif is reserved for marketing/editorial text. See [ui-brand.md](ui-brand.md).

| Style | Size / line-height | Typeface | Used for |
|---|---|---|---|
| heading-xl | 48px / 102%, −3% tracking | Gentium Basic | Page hero, big stats (tightened 2026-07-08) |
| heading-lg | 42px / 112% | Gentium Basic | Large section titles |
| heading-md | 36px / 116% | Gentium Basic | Section titles |
| heading-sm | 32px / 118% | Gentium Basic | Sub-sections |
| heading-xs | 28px / 118% | Gentium Basic | Logo lockup, small headings |
| body-xl | 20px / 124% | Funnel Sans | Card lead lines |
| body-lg | 18px / 124% | Funnel Sans (400) | Main body copy |
| body-lg/light | 18px / 124% | Funnel Sans Light (300) | Supporting copy |
| body-md | 16px / 124% | Funnel Sans | Secondary copy, footer links |
| label-md | 16px / 120% | Geist Mono (400/500) | Stat captions — UPPERCASE |
| label-sm | 13px / 120% (110% at medium) | Geist Mono (400/500) | Nav, eyebrows, legal — UPPERCASE |

One-off: the footer wordmark is Gentium Basic at 84px — a moment, not a token.

> **Known discrepancy:** the style-guide page's type table still shows
> heading-xl at 48/108% with −2% tracking, but the live Figma text variable
> (and the homepage) now use 102% / −3%. The variable is treated as canonical
> here; the style-guide page may need its table refreshed.
>
> **BABCO note (2026-07-10):** the same table-vs-variable lag appears to
> affect the other headings — the live text variables in the "[EXT] Gallop"
> file (node 211-2, pulled 2026-07-10) give heading-lg/md/sm/xs line-heights
> of **108/110/112/112%**, tighter than the 112/116/118/118% in the table
> above. Consistent with the note above, the variables are treated as
> canonical; tokens.json / tokens.css and the live site use the variable
> values. Awaiting designer confirmation.

**Pairing pattern** (used everywhere): serif heading → 22px gap → light body
copy in Text Secondary. Item lists: regular body-lg title line(s), then light
secondary description, 2px apart, 65px between items.

## Layout & spacing

Official spacing tokens defined in Figma: **12, 32, 40, 48**. Prefer these
steps (and simple multiples of them) when choosing gaps and padding.
Known uses: buttons pad 12×32, page margins are 40, section headings sit on
a 48 rhythm.

- Desktop canvas 1440px; content column ~1360px with 40px side margins.
- Major sections are separated by **180px** of vertical space — generous air is part of the brand.
- Cards sit in rows with a **20px** gap; card inner padding **25px**.
- Two-column pattern: left column (~485px) heading + intro, right column (~505px) stacked detail items, 90px gutter.
- Everything is **square-cornered**. The only radius in the entire design is 3.75px on the nav bar.
- No borders, no dividers, no drop shadows — separation comes from flat colour blocks and whitespace.

## Components

**Nav bar** — a `--brand-background` bar (radius 3.75px) floating on the ochre
hero. Logo mark + "Gallop" in heading-xs serif on the left; nav links and CTA
as label-sm mono uppercase.

**Primary button** — solid `--brand-text-primary`, text in `--brand-surface`,
padding 12px 32px, square corners, body-lg. No hover tricks needed beyond a
subtle opacity/colour shift.

**Case-study card** — 440px wide: a `--brand-surface` header block (25px
padding; secondary-text eyebrow, body-xl lead, light secondary detail) above a
458px flat colour block (ochre, blue, or dark) holding a centred logo and the
stripe motif.

**Stat block** — heading-xl figure over a label-md mono uppercase caption,
~30px apart, three across.

**Closer / Footer** — the page ends on one full-width `--brand-accent-ochre`
block (~1143px tall) carrying the leaping-horse stripe artwork. A
right-aligned CTA (heading-md + body-lg + dark button) sits in its upper
right; the footer content — giant 84px serif wordmark with the dark logo
mark, mono uppercase column headings, body-md links, legal row — sits at the
bottom, all in `--brand-text-primary` dark on ochre.

## The stripe motif

Horizontal bars of decreasing thickness stacked with increasing gaps —
roughly 33 → 25 → 15 → 6 → 3px — like motion lines. Used along block edges
(bottom of hero blocks, top of footer, sides of case-study tiles), sometimes
rotated 90°. Always a single darker colour from the background's own ramp.
This is the brand's signature; use it deliberately, not everywhere.

Background texture: tiny 7.9px Geist Mono uppercase code text at opacity 0.1,
used as a quiet field behind hero areas.

## Fonts — how to load them

All three are free on Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Gentium+Basic:ital,wght@0,400;1,400&family=Funnel+Sans:wght@300;400;500&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Note: Google Fonts lists Gentium Basic's successor as **Gentium Book Plus** —
if 'Gentium Basic' ever fails to load, swap to Gentium Book Plus (visually
near-identical); the token file already includes it as a fallback.

## Don'ts

- No pure white backgrounds, no pure black text.
- No bold headings, no gradients, no drop shadows, no rounded cards.
- No cool greys — the neutral ramp is warm; secondary text is `--brand-text-secondary`.
- Never letter-space wider than default; the brand is always -2% tight.
- Don't mix the mono font into body copy — it's for short uppercase labels only.
