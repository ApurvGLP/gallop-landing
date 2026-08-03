/* Gallop Option D — shared behavior for d.html and every d-*.html subpage */
(function(){
  /* --- ?noanim: render everything instantly (screenshot QA / reduced-motion testing) --- */
  if(/[?&]noanim/.test(location.search)){ document.documentElement.classList.add('noanim'); }
  /* --- mobile nav (markup shared via partials/nav.html, stamped in by build.js) ---
     Open/close state is the `hidden` attribute rather than a class: the panel
     stays in the DOM so CSS can animate the close as well as the open (see
     .nav-links in d.css). The panel is only ever hidden below the 760px
     breakpoint — above it the links are always-visible desktop nav. */
  var t = document.getElementById('navToggle'), links = document.getElementById('navLinks');
  if(t && links){
    /* CSS owns the closed-by-default state at mobile widths, so there is no
       open-menu flash before this runs and the nav still renders with JS off. */
    function set(open){
      t.classList.toggle('open', open);
      links.classList.toggle('open', open);
      t.setAttribute('aria-expanded', open);
    }
    set(false);
    t.setAttribute('aria-controls', 'navLinks');
    t.addEventListener('click', function(){ set(!t.classList.contains('open')); });
    links.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ set(false); }); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') set(false); });
  }

  /* --- FAQ open/close animation ------------------------------------------
     <details> hides its content the moment `open` is removed, so the closing
     direction can't animate on its own. We intercept the toggle click: opening
     lets the browser set `open` and CSS animates max-height up; closing holds
     `open` on until the collapse finishes, then drops it. Content is wrapped in
     .a-inner so the answer's padding sits inside the clipped box. Height is
     measured per item into --faq-h (max-height can't transition to auto), and
     re-measured on open so reflowed text still collapses from the right height.
     Without JS none of this applies and <details> keeps its native behavior. */
  (function(){
    var items = document.querySelectorAll('.faq-item');
    if(!items.length) return;
    var reduce = window.matchMedia('(prefers-reduced-motion:reduce)');
    var instant = function(){
      return reduce.matches || document.documentElement.classList.contains('noanim');
    };
    document.documentElement.classList.add('faq-anim');
    items.forEach(function(item){
      var a = item.querySelector('.a');
      var summary = item.querySelector('summary');
      if(!a || !summary) return;
      /* wrap the answer's children so the padding is inside the clipped box */
      var inner = document.createElement('div');
      inner.className = 'a-inner';
      while(a.firstChild) inner.appendChild(a.firstChild);
      a.appendChild(inner);

      var measure = function(){ a.style.setProperty('--faq-h', inner.scrollHeight + 'px'); };
      var closing = false;

      /* Measure once the browser has revealed the content — on the opening click
         the answer is still hidden, so scrollHeight reads 0. The custom property
         is set on a fresh frame so max-height has a 0 start value to animate
         from; setting it in the same frame as `open` would jump straight there. */
      item.addEventListener('toggle', function(){
        if(!item.open || instant()) return;
        var h = inner.scrollHeight;
        a.style.setProperty('--faq-h', '0px');
        void a.offsetHeight;                        /* flush the 0 start state */
        requestAnimationFrame(function(){ a.style.setProperty('--faq-h', h + 'px'); });
      });

      summary.addEventListener('click', function(e){
        if(instant()) return;              /* let the browser handle it outright */
        if(!item.open) return;             /* opening: the toggle handler sizes it */
        e.preventDefault();                /* closing: animate before unsetting open */
        if(closing) return;
        closing = true;
        measure();
        void a.offsetHeight;               /* start the collapse from that height */
        item.classList.add('is-closing');  /* drives max-height back to 0 */
        var done = function(ev){
          if(ev && ev.propertyName !== 'max-height') return;
          a.removeEventListener('transitionend', done);
          clearTimeout(fallback);
          item.classList.remove('is-closing');
          item.open = false;
          closing = false;
        };
        a.addEventListener('transitionend', done);
        /* transitionend can be skipped (tab hidden, already collapsed) */
        var fallback = setTimeout(done, 600);
      });

      /* keep the open item's height correct when text reflows */
      window.addEventListener('resize', function(){ if(item.open && !closing) measure(); });
    });
  })();

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
    /* light the copy quickly: within each half (local 0..1), all items are lit
       by local≈0.5 — i.e. by the first quarter of the whole timeline */
    function litSet(nodes, local){
      nodes.forEach(function(n, i){ n.classList.toggle('lit', local >= i * 0.12); });
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

  /* --- demo form → POST /api/contact (Next.js route handler, Resend-backed) ---
     Payload contract is set by the client's handler and must match exactly:
     { name, email, company, systemType, timeline, message }. The systemType and
     timeline values must stay byte-identical to their server-side allowlists —
     a mismatch there is silently coerced to "Other" / "" rather than rejected. */
  var form = document.getElementById('demoForm');
  if(form){
    var ENDPOINT = form.getAttribute('data-endpoint') || '/api/contact';
    var sent   = document.getElementById('formSent');
    var errBox = document.getElementById('formError');
    var btn    = form.querySelector('button[type="submit"]');
    var btnLabel = btn ? btn.textContent : '';
    var busy = false;

    function showError(msg){
      if(!errBox) return;
      errBox.textContent = msg;
      errBox.style.display = 'block';
    }
    function clearError(){
      if(!errBox) return;
      errBox.textContent = '';
      errBox.style.display = 'none';
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(busy) return;                     /* guard against double-submit */
      if(!form.reportValidity()) return;    /* let the browser flag required/email first */

      busy = true;
      clearError();
      if(btn){ btn.disabled = true; btn.textContent = 'Sending…'; }

      var fd = new FormData(form);
      var payload = {
        name:       (fd.get('name')       || '').trim(),
        email:      (fd.get('email')      || '').trim(),
        company:    (fd.get('company')    || '').trim(),
        systemType: fd.get('systemType')  || '',
        timeline:   fd.get('timeline')    || '',
        message:    (fd.get('message')    || '').trim()
      };

      fetch(ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      }).then(function(res){
        /* the handler returns JSON on both success and error, but don't assume
           it on a proxy/CDN failure that never reached the route */
        return res.json().catch(function(){ return {}; }).then(function(data){
          if(!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
          return data;
        });
      }).then(function(){
        form.reset();
        if(btn){ btn.textContent = btnLabel; }
        if(sent){ sent.style.display = 'inline-block'; }
        form.querySelectorAll('.field, .form-foot').forEach(function(el){ el.style.display = 'none'; });
      }).catch(function(err){
        showError(err && err.message ? err.message : 'Something went wrong. Please try again.');
        if(btn){ btn.disabled = false; btn.textContent = btnLabel; }
        busy = false;
      });
    });
  }
})();
