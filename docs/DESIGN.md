> Vendored copy for repo context — canonical source lives in the BABCO brand-system at `~/Desktop/code/design-tokens/gallop/`. Edit there first, then re-copy.

---
name: Gallop
version: 1.1.0
overview: >
  Gallop Intelligence — enterprise legacy-modernization AI platform.
  Editorial, calm, precise: warm paper canvas, flat ochre/blue color blocks,
  Gentium serif headings, Funnel Sans body, Geist Mono labels, the
  speed-stripe motif. A beautifully typeset technical journal, not a glossy
  SaaS site.
colors:
  text-primary: "#362F2C"
  text-secondary: "#7A7471"
  background: "#F9F9F2"
  surface: "#F2F2EB"
  core: "#D8F18F"
  secondary: "#76DDAB"
  white: "#FFFFFF"
  black: "#000000"
  neutral:
    "50": "#F9F9F2"
    "100": "#E3E2DC"
    "200": "#B8B6B0"
    "300": "#8D8984"
    "400": "#615C58"
    "500": "#362F2C"
    "600": "#302926"
    "700": "#29231F"
    "800": "#231D19"
    "900": "#1D1713"
    "950": "#1A140F"
  core:
    "50": "#F8F9F6"
    "100": "#F0F3E7"
    "200": "#E3EACC"
    "300": "#D2E3A1"
    "400": "#C3E06B"
    "500": "#B9E533"
    "600": "#9FCC1A"
    "700": "#78971B"
    "800": "#536718"
    "900": "#343F13"
    "950": "#1F250E"
  secondary:
    "50": "#F6F9F7"
    "100": "#E8F2ED"
    "200": "#CFE7DC"
    "300": "#A8DCC3"
    "400": "#78D3A7"
    "500": "#47D18E"
    "600": "#2EB875"
    "700": "#298A5B"
    "800": "#215E41"
    "900": "#183A29"
    "950": "#10231A"
typography:
  serif:
    fontFamily: "'Gentium Basic', 'Gentium Book Plus', Georgia, serif"
  body:
    fontFamily: "'Funnel Sans', ui-sans-serif, system-ui, sans-serif"
  mono:
    fontFamily: "'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace"
spacing:
  "12": "12px"
  "32": "32px"
  "40": "40px"
  "48": "48px"
  section: "180px"
  card-gap: "20px"
  card-pad: "25px"
  canvas-max: "1440px"
  content-max: "1360px"
rounded:
  none: "0"
  nav: "3.75px"
---

# Gallop — Brand Design System

Composed 2026-07-10 from the designer's handoff (`DESIGN-SYSTEM.md` +
`ui-brand.md`, vendored beside this file) and the [EXT] Gallop Figma
variables (`tokens.json`). Front matter above is the machine token set in
babco-engine format; this body is the rules layer.

## The feel in one paragraph

Editorial, calm, and precise — a warm paper-toned canvas with a classic serif
for headlines, a clean sans for reading, and a monospace for small technical
labels. Colour arrives in big, flat, confident blocks of ochre yellow and soft
blue — never gradients, never shadows, almost never rounded corners. The
signature graphic motif is a set of horizontal "speed stripes" of decreasing
thickness, echoing the name Gallop. It should feel like a beautifully typeset
technical journal, not a glossy SaaS site.

## Colour rules

- Reach for the semantic tokens first (`text-primary`, `background`,
  `surface`, `accent-ochre`…); the 50→950 ramps are for shades beyond them.
  Brand roles occupy ramp slots: neutral-500 = text-primary, neutral-50 =
  background, ochre-500 / blue-500 = the accents.
- Colour is applied in large flat rectangles. No gradients, no shadows,
  no tints. Never pure white backgrounds, never pure black text.
- Secondary / supporting text uses `text-secondary` (#7A7471) — not
  text-primary at reduced opacity. Inactive/disabled content drops to
  opacity 0.3; decorative background texture to 0.1.
- Images placed on coloured blocks use `mix-blend-mode: multiply` so they
  sit *in* the colour, not on top of it.
- The stripe motif always uses the darker step of its background's own ramp:
  ochre-600 on ochre-500, blue-700 on blue-600, text-primary on background.
- Accent green is for success states and positive indicators.
- No cool greys — the neutral ramp is warm.

## Typography rules

Three typefaces: Gentium Basic (serif warmth for headings), Funnel Sans
(clean readability for body), Geist Mono (technical precision for labels).

- **Every style carries −2% tracking** (letter-spacing −0.02em); heading-xl
  alone tightens to −3%. Never letter-space wider than default.
- Headings are weight 400 only, never bold; every heading style has an
  italic variant for editorial emphasis.
- Type scale (size / line-height): heading-xl 48/102 · heading-lg 42/108 ·
  heading-md 36/110 · heading-sm 32/112 · heading-xs 28/112 · body-xl 20/124 ·
  body-lg 18/124 (400, or 300 light for supporting copy) · body-md 16/124 ·
  label-md 16/120 · label-sm 13/120 (110 at weight 500). Labels are mono
  UPPERCASE.
- Don't mix the mono font into body copy — short uppercase labels only.
- Pairing pattern: serif heading → 22px gap → light body copy in
  text-secondary.
- One-off: the footer wordmark is the serif at 84px — a moment, not a token.

### Exception — UI graphics (product mockups, dashboards, app screens)

**The serif is never used inside a depiction of the product interface, at any
size.** UI titles and body are Funnel Sans (400/500; 300 light + text-secondary
for secondary text); labels, eyebrows, tags, status, code, and node text are
Geist Mono (UPPERCASE for labels/tags). The rule is about what the text *is*,
not where it sits: a marketing headline keeps the serif even beside a
dashboard mockup; a title *inside* the mockup is Funnel Sans. If in doubt —
is this text part of the product interface itself? → Funnel + Mono. Is it the
website/brand speaking? → serif allowed.

## Layout & spacing rules

- Official spacing steps: 12, 32, 40, 48 (and simple multiples). Buttons pad
  12×32; page margins 40; section headings sit on a 48 rhythm.
- Desktop canvas 1440px; content column ~1360px with 40px side margins.
- Major sections are separated by 180px of vertical space — generous air is
  part of the brand.
- Cards: 20px gaps, 25px inner padding.
- Everything is square-cornered; the only radius in the design is 3.75px on
  the nav bar. No borders, no dividers, no drop shadows — separation comes
  from flat colour blocks and whitespace.

## Signature motifs

- **Speed stripes**: horizontal bars of decreasing thickness with increasing
  gaps (~33 → 25 → 15 → 6 → 3px), like motion lines. Along block edges,
  sometimes rotated 90°. Always a single darker colour from the background's
  own ramp. Use deliberately, not everywhere.
- **Code-wall texture**: tiny 7.9px Geist Mono uppercase code text at opacity
  0.1 as a quiet field behind hero areas.

## Don'ts

- No pure white backgrounds, no pure black text.
- No bold headings, no gradients, no drop shadows, no rounded cards.
- No cool greys; secondary text is the dedicated token, not an opacity mock.
- Never letter-space wider than default — the brand is always −2% tight.
- No mono in body copy; no serif inside UI graphics.
