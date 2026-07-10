# Gallop — marketing site

The Gallop Intelligence marketing site (the "Option D" direction), live as a
password-gated preview at **https://gallop-options.vercel.app** (Vercel project
`gallop-options`, BABS team). Basic-auth credentials are in
[middleware.js](middleware.js).

## What's here

- [d.html](d.html) — homepage, plus subpages `d-about`, `d-methodology`,
  `d-blog*`, `d-careers`, `d-contact`, `d-privacy`, `d-terms`
- [d.css](d.css) / [d.js](d.js) — shared styles and behaviour
- [gallop-tokens.css](gallop-tokens.css) — consumed copy of the brand token
  set (canonical home: `design-tokens/gallop/` in the BABCO brand-system;
  edit there, then re-copy)
- [docs/](docs/) — vendored brand design docs (DESIGN.md, DESIGN-SYSTEM.md,
  ui-brand.md); same canonical-source rule
- [partials/](partials/) — shared nav + footer, stamped into every page by
  `node build.js` (run it after editing a partial, then redeploy)
- [index.html](index.html) — redirect to `/d.html`
- [server.js](server.js) — tiny static server for local dev (`node server.js`)

## Deploying

```
npx vercel@latest deploy --prod --yes --scope team_GAnIsD0dAeQkQ3yQc7VQWqV4
```

Production deploys need Olivia's explicit go.

## Before any ungated launch

- `assets/product-shot.png` (Features section) is real product UI — replace
  with a brand-styled mock, like section 01.
- The trust bar repeats placeholder Telefónica/Google Cloud logos — confirm
  clearance for named customers.
- Case-study numbers are placeholders pending real figures.
