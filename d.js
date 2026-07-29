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

  /* --- Discover → Modernize: pinned scroll-scrub + draggable timeline --------
     One progress value p (0..1) drives everything: caption points light up, the
     rail cross-fades Discover↔Modernize at the midpoint, the image swipes, and
     the timeline fill + knob track along. Scroll advances p and never reverses
     it (so scrolling back up shows the finished state — no reverse-scrub). The
     knob is always draggable (pointer + keyboard) to replay at your own pace. */
  var mseq = document.querySelector('[data-mseq]');
  if(mseq){
    var track   = mseq.querySelector('[data-mseq-track]');
    var discSt  = mseq.querySelector('.mseq-state[data-state="disc"]');
    var modSt   = mseq.querySelector('.mseq-state[data-state="mod"]');
    var discPts = discSt.querySelectorAll('.mseq-headline, .mseq-points li');
    var modPts  = modSt.querySelectorAll('.mseq-headline, .mseq-points li');
    var SWIPE_A = 0.42, SWIPE_B = 0.60;   /* image swipe happens across the midpoint */
    var clamp = function(v){ return v < 0 ? 0 : v > 1 ? 1 : v; };

    var p = 0, target = 0, pMax = 0, dragging = false, manual = false, raf = null;

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
      mseq.style.setProperty('--wipe', clamp((v - SWIPE_A) / (SWIPE_B - SWIPE_A)).toFixed(4));
      var mod = v >= 0.5;
      mseq.classList.toggle('is-mod', mod);
      discSt.classList.toggle('is-current', !mod);
      modSt.classList.toggle('is-current', mod);
      litSet(discPts, v <= 0.5 ? v / 0.5 : 1);
      litSet(modPts,  v >  0.5 ? (v - 0.5) / 0.5 : 0);
      track.setAttribute('aria-valuenow', Math.round(v * 100));
      track.setAttribute('aria-valuetext', mod ? 'Gallop Modernize' : 'Gallop Discover');
    }
    function frame(){
      if(!dragging && !manual){
        var sp = scrollProg();
        if(sp > pMax) pMax = sp;
        target = pMax;
      }
      p += (target - p) * 0.18;
      if(Math.abs(target - p) < 0.0005) p = target;
      render(p);
      raf = requestAnimationFrame(frame);
    }
    function start(){ if(!raf) raf = requestAnimationFrame(frame); }
    function stop(){ if(raf){ cancelAnimationFrame(raf); raf = null; } }

    function setFromPointer(e){
      var r = track.getBoundingClientRect();
      target = clamp((e.clientX - r.left) / r.width);
      if(target > pMax) pMax = target;
    }
    track.addEventListener('pointerdown', function(e){
      dragging = true; manual = true;
      try{ track.setPointerCapture(e.pointerId); }catch(_){}
      setFromPointer(e); e.preventDefault();
    });
    track.addEventListener('pointermove', function(e){ if(dragging) setFromPointer(e); });
    var endDrag = function(){ dragging = false; };
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('keydown', function(e){
      var step = e.shiftKey ? 0.1 : 0.04, nv = null;
      if(e.key === 'ArrowRight' || e.key === 'ArrowUp') nv = target + step;
      else if(e.key === 'ArrowLeft' || e.key === 'ArrowDown') nv = target - step;
      else if(e.key === 'Home') nv = 0;
      else if(e.key === 'End') nv = 1;
      if(nv !== null){ e.preventDefault(); manual = true; target = clamp(nv); if(target > pMax) pMax = target; }
    });
    /* any real scroll hands control back to the scroll position */
    window.addEventListener('scroll', function(){ manual = false; }, {passive:true});

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
