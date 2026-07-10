> Vendored copy for repo context — canonical source lives in the BABCO brand-system at `~/Desktop/code/design-tokens/gallop/`. Edit there first, then re-copy.

# GALLOP — UI Typography Rules

A companion to [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md). Everything in the main
design system still applies — colours, square corners, flat colour blocks, no
shadows, −2% tracking, the stripe motif. **This file overrides one thing only:
which typefaces are allowed inside UI graphics.**

---

## What counts as "UI"

A **UI graphic** is anything that depicts a *product interface* — an app
screen, dashboard, panel, sidebar, chrome, mermaid map, in-product mockup, or a
screenshot-style hero image of the product in use.

It is **not** the marketing/editorial layer of the site — page heroes, section
titles, pull quotes, the footer wordmark, case-study copy. Those keep the full
brand type system, including Gentium Basic.

**Important nuance:** a marketing *messaging* headline keeps the serif **even
when it sits over, above, or beside a product graphic.** The rule is about what
the text *is*, not where it's placed. So in a hero that pairs a headline with a
dashboard mockup:

- "Turn findings into flow." → marketing messaging → **Gentium Basic (serif)**
- "Execution map", "Rollout logic" (titles *inside* the dashboard) → part of the
  product interface → **Funnel Sans**

If in doubt: *is this text part of the product interface itself?* → UI rules
(Funnel + Mono). *Is it the website/brand speaking?* → main design system
(serif allowed).

---

## The rule

**Inside UI graphics, use only two typefaces:**

| Use | Typeface | Notes |
|---|---|---|
| Headings & titles | **Funnel Sans** | weight 400, or 500 for extra hierarchy. Never Gentium. |
| Body & supporting copy | **Funnel Sans** | 400 regular, 300 light for secondary text. |
| Labels, eyebrows, tags, status, code, node text | **Geist Mono** | UPPERCASE for labels/eyebrows/tags; sentence-case fine for code/node text. |

**Gentium Basic is not used in UI graphics — at any size.** Screen titles that
would be a serif heading on a marketing page become Funnel Sans here.

### Why

- Gentium is a warm editorial serif — it signals *brand voice / journalism*. A
  real product UI doesn't set its screen titles in a book serif, so a serif
  inside the UI immediately reads as "marketing mockup," not "software."
- Funnel + Mono reads as a precise, modern working tool — which is exactly what
  Gallop's product is. The mono labels also echo the technical/legacy-code
  subject matter.

---

## UI type scale (Funnel Sans + Geist Mono)

Sizes carry over from the main scale; only the family changes.

| Role | Size / line | Typeface / weight |
|---|---|---|
| UI panel / card title | 28–32px / 1.1 | Funnel Sans 500 |
| UI lead line | 18–20px / 1.24 | Funnel Sans 400 |
| UI body | 16px / 1.24 | Funnel Sans 400 |
| UI secondary | 15–16px | Funnel Sans 300 (light), `--brand-text-secondary` |
| UI label / eyebrow / tag | 11–14px | Geist Mono 500, UPPERCASE |
| UI node / code text | 12px | Geist Mono 400 |

All text still carries **−2% tracking** (`--letter-spacing`), same as the rest
of the brand.

---

## Everything else is unchanged

Colours, the ochre/blue/green blocks, square corners, flat fills, no shadows,
the stripe motif, `--brand-text-secondary` for supporting copy — all identical
to [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md). This document changes **type only**.

Reference implementation: `../mockup-flow.html` (in the designer's website
repo — not vendored into `design-tokens/gallop/`).
