/* One-shot: injects favicon links + Open Graph/Twitter meta into every page,
   reusing each page's existing <title> and description. */
const fs = require('fs');
const path = require('path');
const ROOT = '/Users/mahsa/Desktop/projects/babco/gallop/gallop';
const ORIGIN = 'https://www.gallopintelligence.ai';

// Page -> canonical path. d.html is the homepage, so it maps to "/".
const canonicalFor = (page) => (page === 'd.html' ? '/' : '/' + page);

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const attrEscape = (s) => decode(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const pages = fs
  .readdirSync(ROOT)
  .filter((f) => f === 'd.html' || (f.startsWith('d-') && f.endsWith('.html')));

pages.forEach((page) => {
  const fp = path.join(ROOT, page);
  let src = fs.readFileSync(fp, 'utf8');

  const titleMatch = src.match(/<title>([\s\S]*?)<\/title>/);
  const descMatch = src.match(/<meta name="description" content="([\s\S]*?)"\s*\/?>/);
  if (!titleMatch) {
    console.warn(page + ': no <title> — skipped');
    return;
  }

  // og:title drops the "— Gallop" suffix only when a site_name already conveys it.
  const rawTitle = decode(titleMatch[1]).trim();
  const ogTitle = attrEscape(rawTitle);
  const ogDesc = descMatch ? attrEscape(descMatch[1].trim()) : '';
  const url = ORIGIN + canonicalFor(page);

  const lines = [
    '<!-- site-meta:start · generated — edit scripts/add-meta.js, not here -->',
    '<link rel="icon" href="assets/favicon.ico" sizes="any" />',
    '<link rel="icon" type="image/svg+xml" href="assets/favicon.svg" />',
    '<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32x32.png" />',
    '<link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16x16.png" />',
    '<link rel="apple-touch-icon" sizes="180x180" href="assets/apple-touch-icon.png" />',
    '<link rel="manifest" href="site.webmanifest" />',
    '<meta name="theme-color" content="#D8F18F" />',
    '<link rel="canonical" href="' + url + '" />',
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Gallop" />',
    '<meta property="og:locale" content="en_US" />',
    '<meta property="og:url" content="' + url + '" />',
    '<meta property="og:title" content="' + ogTitle + '" />',
    ogDesc ? '<meta property="og:description" content="' + ogDesc + '" />' : null,
    '<meta property="og:image" content="' + ORIGIN + '/assets/og-image.jpg" />',
    '<meta property="og:image:type" content="image/jpeg" />',
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta property="og:image:alt" content="Gallop — Modernizing the world’s most critical systems with speed and precision." />',
    '<meta name="twitter:card" content="summary_large_image" />',
    '<meta name="twitter:title" content="' + ogTitle + '" />',
    ogDesc ? '<meta name="twitter:description" content="' + ogDesc + '" />' : null,
    '<meta name="twitter:image" content="' + ORIGIN + '/assets/og-image.jpg" />',
    '<!-- site-meta:end -->',
  ].filter(Boolean);

  const block = lines.join('\n');
  const marked = /<!-- site-meta:start[\s\S]*?<!-- site-meta:end -->/;

  if (marked.test(src)) {
    src = src.replace(marked, block);
  } else {
    // Insert right after the description (or the title, if there is none).
    const anchor = descMatch ? descMatch[0] : titleMatch[0];
    src = src.replace(anchor, anchor + '\n' + block);
  }

  fs.writeFileSync(fp, src);
  console.log('meta -> ' + page);
});
