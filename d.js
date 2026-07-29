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

  /* --- Discover → Modernize: pinned scroll-scrub ----------------------------
     One progress value p (0..1), driven directly by scroll position, drives
     everything: caption points light up, the rail cross-fades Discover→Modernize
     at the midpoint, the Modernize screen (image + field) fades in over Discover,
     and the timeline fill + marker track along. Fully reversible — scroll down
     advances, scroll up rewinds. No drag. */
  var mseq = document.querySelector('[data-mseq]');
  if(mseq){
    var track   = mseq.querySelector('[data-mseq-track]');
    var discSt  = mseq.querySelector('.mseq-state[data-state="disc"]');
    var modSt   = mseq.querySelector('.mseq-state[data-state="mod"]');
    var discPts = discSt.querySelectorAll('.mseq-headline, .mseq-points li');
    var modPts  = modSt.querySelectorAll('.mseq-headline, .mseq-points li');
    var FADE_A = 0.42, FADE_B = 0.58;   /* Modernize screen fades in across the midpoint */
    var clamp = function(v){ return v < 0 ? 0 : v > 1 ? 1 : v; };

    var p = 0, raf = null;

    function scrollProg(){
      var h = mseq.offsetHeight - window.innerHeight;
      if(h <= 0) return 0;
      return clamp((-mseq.getBoundingClientRect().top) / h);
    }
    function litSet(nodes, local){
      nodes.forEach(function(n, i){ n.classList.toggle('lit', local >= i * 0.18); });
    }
    function render(v){
      track.style.setProperty('--p', v.toFixed(4));
      mseq.style.setProperty('--fade', clamp((v - FADE_A) / (FADE_B - FADE_A)).toFixed(4));
      var mod = v >= 0.5;
      mseq.classList.toggle('is-mod', mod);
      discSt.classList.toggle('is-current', !mod);
      modSt.classList.toggle('is-current', mod);
      litSet(discPts, v <= 0.5 ? v / 0.5 : 1);
      litSet(modPts,  v >  0.5 ? (v - 0.5) / 0.5 : 0);
    }
    function frame(){
      var target = scrollProg();          /* p follows scroll directly, both ways */
      p += (target - p) * 0.18;
      if(Math.abs(target - p) < 0.0005) p = target;
      render(p);
      raf = requestAnimationFrame(frame);
    }
    function start(){ if(!raf) raf = requestAnimationFrame(frame); }
    function stop(){ if(raf){ cancelAnimationFrame(raf); raf = null; } }

    /* only run the rAF loop while the section is near the viewport */
    var near = new IntersectionObserver(function(es){
      es.forEach(function(en){ en.isIntersecting ? start() : stop(); });
    }, {rootMargin:'40% 0px 40% 0px'});

    var mq = window.matchMedia('(min-width:900px)');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var live = false;
    function evalMode(){
      var want = mq.matches && !reduce.matches && !document.documentElement.classList.contains('noanim');
      if(want === live) return;
      live = want;
      if(live){
        mseq.classList.add('mseq--live');
        render(p); near.observe(mseq); start();
      }else{
        mseq.classList.remove('mseq--live','is-mod');
        near.unobserve(mseq); stop();
      }
    }
    evalMode();
    (mq.addEventListener ? mq.addEventListener('change', evalMode) : mq.addListener(evalMode));
    (reduce.addEventListener ? reduce.addEventListener('change', evalMode) : reduce.addListener(evalMode));
    window.addEventListener('resize', evalMode, {passive:true});
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
