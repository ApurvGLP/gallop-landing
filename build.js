/* Stamps the shared nav + footer (partials/nav.html, partials/footer.html)
   into d.html and every d-*.html page, between generated-block markers.
   The markup ships inside each page — no JavaScript needed to render it.
   After editing a partial, run:  node build.js  (then redeploy). */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

const PARTIALS = {
  'site-nav': fs.readFileSync(path.join(ROOT, 'partials', 'nav.html'), 'utf8').trim(),
  'site-footer': fs.readFileSync(path.join(ROOT, 'partials', 'footer.html'), 'utf8').trim(),
};

const pages = fs.readdirSync(ROOT).filter(function (f) {
  return f === 'd.html' || (f.startsWith('d-') && f.endsWith('.html'));
});

pages.forEach(function (page) {
  const fp = path.join(ROOT, page);
  let src = fs.readFileSync(fp, 'utf8');
  Object.keys(PARTIALS).forEach(function (name) {
    const block =
      '<!-- ' + name + ':start · generated from partials/ — edit there, then run `node build.js` -->\n' +
      PARTIALS[name] +
      '\n<!-- ' + name + ':end -->';
    const marked = new RegExp('<!-- ' + name + ':start[\\s\\S]*?<!-- ' + name + ':end -->');
    const placeholder = '<div data-component="' + name + '"></div>';
    if (marked.test(src)) src = src.replace(marked, block);
    else if (src.includes(placeholder)) src = src.replace(placeholder, block);
    else console.warn(page + ': no ' + name + ' slot found — skipped');
  });
  fs.writeFileSync(fp, src);
  console.log('stamped ' + page);
});
