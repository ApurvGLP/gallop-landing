/* Gallop Option D — shared behavior for d.html and every d-*.html subpage */
(function(){
  /* --- ?noanim: render everything instantly (screenshot QA / reduced-motion testing) --- */
  if(/[?&]noanim/.test(location.search)){ document.documentElement.classList.add('noanim'); }
  /* --- mobile nav (markup shared via partials/nav.html, stamped in by build.js) --- */
  var t = document.getElementById('navToggle'), links = document.getElementById('navLinks');
  if(t){ t.addEventListener('click', function(){ t.classList.toggle('open'); links.classList.toggle('open'); }); }
  links && links.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ t.classList.remove('open'); links.classList.remove('open'); }); });

  /* --- faint code-wall texture --- */
  var CODE = [
    "const apiKey = process.env.API_KEY || 'default-key';",
    "import { useState, useEffect } from 'react';",
    "function debounce(fn, delay) { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); }; }",
    "const users = await db.query('SELECT * FROM users WHERE active = $1', [true]);",
    "export default class EventEmitter extends BaseEmitter implements IEmitter {",
    "  private listeners: Map<string, Set<Function>> = new Map();",
    "  emit(event: string, ...args: unknown[]): void {",
    "    this.listeners.get(event)?.forEach(fn => fn(...args));",
    "  }",
    "}",
    "const sorted = arr.slice().sort((a, b) => b.score - a.score);",
    "if (!token || Date.now() > token.expiresAt) throw new AuthError('Token expired');",
    "router.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));",
    "const hash = crypto.createHash('sha256').update(payload).digest('hex');",
    "type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };"
  ];
  document.querySelectorAll('[data-codewall]').forEach(function(el){
    var out = [];
    for(var i=0;i<4;i++) out = out.concat(CODE);
    el.textContent = out.join('\n');
  });

  /* --- reveal --- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(!en.isIntersecting) return;
      en.target.classList.add('in');
      io.unobserve(en.target);
    });
  }, {threshold:0.2, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* --- features list (homepage): clicking an item makes it the active one --- */
  var fl = document.getElementById('featList');
  if(fl){
    fl.querySelectorAll('.feat').forEach(function(btn){
      btn.addEventListener('click', function(){
        fl.querySelectorAll('.feat').forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });
  }

  /* --- demo form (preview build — not wired to a backend yet) --- */
  var form = document.getElementById('demoForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var sent = document.getElementById('formSent');
      if(sent){ sent.style.display = 'inline-block'; }
    });
  }
})();
