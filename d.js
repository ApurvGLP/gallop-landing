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

  /* --- protocol carousel (homepage): arrows scroll one card at a time --- */
  var car = document.querySelector('[data-carousel]');
  if(car){
    var step = function(){
      var c = car.querySelector('.proto-card');
      return c ? c.getBoundingClientRect().width + 25 : 400;
    };
    document.querySelectorAll('[data-carousel-prev]').forEach(function(b){
      b.addEventListener('click', function(){ car.scrollBy({left:-step(), behavior:'smooth'}); });
    });
    document.querySelectorAll('[data-carousel-next]').forEach(function(b){
      b.addEventListener('click', function(){ car.scrollBy({left:step(), behavior:'smooth'}); });
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
