/* =========================================================================
   Gallop hero animation engine — client-created brand asset.
   Extracted verbatim from hero-animation-share-w-babco.html. Builds the scene
   inside .gh-world and drives it on requestAnimationFrame; scales the fixed
   1280×720 stage to cover .gallop-hero. Respects prefers-reduced-motion
   (holds a resolved rest frame). Append ?t=SECONDS to the URL to freeze a still.

   Colour constants below mirror the tokens in assets/hero-anim.css — keep them
   in sync (or ask to have this read the CSS variables instead).
   ========================================================================= */
(() => {
  'use strict';
  const W = 1280, H = 720;
  // ── Gallop palette (from tokens.css) ──────────────────────────────────
  const INK = '#362F2C', INK2 = '#7A7471', BG = '#F9F9F2', SURF = '#F2F2EB',
        CREAM = '#FCFAEB', OCHRE = '#F4E27B', OCHRE6 = '#D2C164',
        GREEN = '#97DFA7', GREEND = '#4F9E6A';
  const ACCENT = GREEND; // strokes/labels: deep green reads on the light canvas

  // ── math (ported from animations engine) ──────────────────────────────
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  const lerp = (a, b, t) => a + (b - a) * t;
  const hexToRgb = h => [1,3,5].map(i => parseInt(h.slice(i, i+2), 16));
  const hexLerp = (a, b, t) => { const A = hexToRgb(a), B = hexToRgb(b); return `rgb(${A.map((v,i)=>Math.round(lerp(v,B[i],clamp(t,0,1)))).join(',')})`; };
  const easeInOutCubic = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
  const ease = easeInOutCubic;
  const seg = (s, a, b) => clamp((s - a) / (b - a), 0, 1);
  const eseg = (s, a, b) => ease(seg(s, a, b));
  // ── geometry — IN-PLACE stacked layout ────────────────────────────────
  // Modern tiers occupy the SAME rects as the legacy bands, so the
  // transformation happens layered on top — no off-to-the-side stack,
  // no camera move.
  const TIERS = [
    { x: 320, y: 100, w: 460, h: 150 },
    { x: 320, y: 266, w: 460, h: 190 },
    { x: 320, y: 472, w: 460, h: 150 },
  ];
  const STACK = { x: 320, y: 100, w: 460, h: 522 }; // bounding box of the stack
  // camera: centered on the stack (cxCenter) until agents dock, then pans to
  // cxShift so the agents on the right fit in frame.
  const CAM = { cxCenter: 550, cxShift: 622, cy: 361, z: 1.12 };
  const LAYERS = [
    { legacy: 'PRESENTATION', modern: 'INTERFACE' },
    { legacy: 'BUSINESS LOGIC', modern: 'SERVICES · API' },
    { legacy: 'DATA', modern: 'SCHEMA' },
  ];
  const UI_NAMES = ['orders-ui', 'billing-ui', 'admin-ui'];
  const SVC_NAMES = ['orders-svc', 'billing-svc', 'auth-svc'];
  const COL_NAMES = ['id', 'order', 'amount', 'status'];

  // deterministic "code" texture
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const LEGACY_ROWS = [0,1,2].map(k => {
    const r = rng(1471 + k * 97); const rows = [];
    for (let i = 0; i < 11; i++) {
      const indent = Math.floor(r() * 4) * 7; const segs = []; let x = indent;
      const n = 2 + Math.floor(r() * 3);
      for (let j = 0; j < n; j++) {
        const w = 9 + r() * 26; if (x + w > 99) break;
        segs.push({ x, w, tone: r() }); x += w + 2.5 + r() * 4;
      }
      rows.push({ y: 5 + i * 8.6, segs, flag: r() > 0.76 });
    }
    return rows;
  });

  // ── params: whole composition state as fn of story time s (ported) ────
  function params(s) {
    const analyzed = eseg(s, 1.05, 1.95);
    const scanPos = seg(s, 1.05, 1.92);
    const scanGlow = Math.min(seg(s, 1.0, 1.12), 1 - seg(s, 1.86, 1.98));
    const peel = [eseg(s, 2.06, 2.92), eseg(s, 3.06, 3.92), eseg(s, 4.06, 4.92)];
    const dock = eseg(s, 5.12, 5.84);
    return {
      s, cx: lerp(CAM.cxCenter, CAM.cxShift, dock), cy: CAM.cy, z: CAM.z,
      chaos: 1 - 0.7 * analyzed, analyzed, scanPos, scanGlow, peel,
      wire01: seg(peel[1], 0.72, 1), wire12: seg(peel[2], 0.72, 1),
      dock,
      glow: Math.max(peel[0], peel[1], peel[2]),
      breathe: Math.sin(s * 2.1), flow: s, veil: 0,
    };
  }

  // ── scene list (ported from OM_SCENES) ────────────────────────────────
  const SCENES = [
    { name: 'Establish', dur: 2.6, text: 'One legacy system. No documentation.' },
    { name: 'Scan',      dur: 2.6, text: 'Gallop maps every layer' },
    { name: 'Peel UI',   dur: 2.2, text: 'Interface → modern components' },
    { name: 'Peel Logic',dur: 2.2, text: 'Business logic → typed services' },
    { name: 'Peel Data', dur: 2.2, text: 'Data → documented schema' },
    { name: 'Agent ready',dur: 3.4, text: 'Clean APIs your agents can call' },
    { name: 'Rest',      dur: 2.4, text: 'Modernized. Agent-ready.', reset: true },
  ];
  const SPEED = 1.76;                       // ~17.6s → ~10s total
  SCENES.forEach(s => s.dur /= SPEED);
  const TOTAL = SCENES.reduce((a, s) => a + s.dur, 0);
  const STARTS = []; { let acc = 0; for (const s of SCENES) { STARTS.push(acc); acc += s.dur; } }

  // ── DOM builders ──────────────────────────────────────────────────────
  const el = (cls, style) => { const d = document.createElement('div'); if (cls) d.className = cls; if (style) Object.assign(d.style, style); return d; };
  const svg = (w, h, style) => { const s = document.createElementNS('http://www.w3.org/2000/svg','svg'); s.setAttribute('width',w); s.setAttribute('height',h); s.style.position='absolute'; s.style.overflow='visible'; if(style) Object.assign(s.style,style); return s; };
  const path = attrs => { const p = document.createElementNS('http://www.w3.org/2000/svg','path'); for(const k in attrs) p.setAttribute(k, attrs[k]); return p; };
  const lineEl = attrs => { const p = document.createElementNS('http://www.w3.org/2000/svg','line'); for(const k in attrs) p.setAttribute(k, attrs[k]); return p; };

  const world = document.querySelector('.gh-world');
  world.appendChild(el('gh-grid'));
  const glow = el('gh-glow'); world.appendChild(glow);

  // husk — a static frame around the whole stack
  const husk = el('gh-band', {
    left: (STACK.x-14)+'px', top: (STACK.y-14)+'px', width: (STACK.w+28)+'px', height: (STACK.h+28)+'px',
    borderRadius: '0', border: 'none', background: 'transparent', overflow: 'visible',
  });
  world.appendChild(husk);

  // tangle overlay
  const TANGLE = (() => {
    const r = rng(90210); const d = [];
    for (let i = 0; i < 26; i++) {
      const y0 = 8+r()*506, y1 = 8+r()*506, x0 = 8+r()*150, x1 = 300+r()*152;
      d.push(`M${x0},${y0} C${x0+190},${y0+(r()-0.5)*340} ${x1-190},${y1-(r()-0.5)*340} ${x1},${y1}`);
    }
    return d;
  })();
  const tangleSvg = svg(STACK.w, STACK.h, { left: STACK.x+'px', top: STACK.y+'px' });
  const tanglePaths = TANGLE.map(d => { const p = path({ d, fill:'none', stroke:'rgba(252,250,235,0.42)', 'stroke-width':1.4 }); tangleSvg.appendChild(p); return p; });
  // NOTE: appended AFTER the bands (below) so the spaghetti sits ON TOP of the
  // opaque dark monolith — otherwise it hides behind it.

  // wires between tiers
  const wiresSvg = svg(TIERS[0].w, TIERS[2].y - (TIERS[0].y+TIERS[0].h), { left: TIERS[0].x+'px', top:(TIERS[0].y+TIERS[0].h)+'px' });
  const wireGroups = [
    { y0: TIERS[0].y+TIERS[0].h, y1: TIERS[1].y },
    { y0: TIERS[1].y+TIERS[1].h, y1: TIERS[2].y },
  ].map(sm => {
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');
    const off = TIERS[0].y+TIERS[0].h;
    for (let c = 0; c < 3; c++) {
      const cw = (TIERS[0].w - 24)/3; const x = 12 + c*(cw+12) + cw/2;
      g.appendChild(lineEl({ x1:x, y1:sm.y0-off, x2:x, y2:sm.y1-off, stroke:ACCENT, 'stroke-width':1.4, 'stroke-dasharray':'5 7', opacity:0.75 }));
    }
    wiresSvg.appendChild(g); return { g, ...sm };
  });
  world.appendChild(wiresSvg);

  // ── bands (legacy content + modern tier content) ──────────────────────
  function buildLegacy(k) {
    const wrap = el('gh-legacy');
    const inner = el('', { position:'absolute', inset:'44px 14px 14px' }); // match the modern tiers' equal padding
    const rows = LEGACY_ROWS[k].map(row => {
      const rd = el('gh-code-row', { top: row.y+'%' });
      row.segs.forEach(sg => {
        const bar = el('gh-bar', { left:sg.x+'%', top:'0', width:sg.w+'%', background:`rgba(252,250,235,${0.24+sg.tone*0.28})` });
        rd.appendChild(bar);
      });
      let flagEl = null;
      // undocumented/risk marker → warm ochre (brand has no red)
      if (row.flag) { flagEl = el('', { position:'absolute', right:'8px', top:'0', width:'4px', height:'4px', borderRadius:'0', background:OCHRE6 }); rd.appendChild(flagEl); }
      inner.appendChild(rd); return { rd, flagEl };
    });
    // green "analyzed" overlay
    const analyzed = el('', { position:'absolute', inset:'0', opacity:'0.9' });
    LEGACY_ROWS[k].forEach(row => {
      const rd = el('', { position:'absolute', left:'0', right:'0', top:row.y+'%' });
      row.segs.forEach(sg => rd.appendChild(el('', { position:'absolute', left:sg.x+'%', top:'-1px', width:sg.w+'%', height:'6px', borderRadius:'0', border:`1px solid ${GREEND}`, background:`${GREEN}55` })));
      analyzed.appendChild(rd);
    });
    inner.appendChild(analyzed);
    wrap.appendChild(inner);
    return { wrap, rows, analyzed };
  }

  function cleanCard(extra) { return el('gh-card', extra); }
  function head(name) { const h = el('gh-head'); h.appendChild(el('dot')); const s = document.createElement('span'); s.textContent = name; h.appendChild(s); return h; }
  function ln(w, o) { return el('gh-ln', { width:w, background:'rgba(54,47,44,'+o+')' }); }

  function buildTierUI() {
    const wrap = el('gh-modern', { display:'flex', gap:'12px' });
    for (let i = 0; i < 3; i++) {
      const c = cleanCard(); c.appendChild(head(UI_NAMES[i]));
      const box = el('', { display:'flex', flexDirection:'column', gap:'5px' });
      box.appendChild(ln('80%','0.16')); box.appendChild(ln('58%','0.13'));
      c.appendChild(box); wrap.appendChild(c);
    }
    return wrap;
  }
  function buildTierServices() {
    const wrap = el('gh-modern', { display:'flex', gap:'12px' }); const pulses = [];
    for (let i = 0; i < 3; i++) {
      const c = cleanCard({ gap:'8px' }); c.appendChild(head(SVC_NAMES[i]));
      const box = el('', { display:'flex', flexDirection:'column', gap:'5px' });
      box.appendChild(ln('86%','0.18')); box.appendChild(ln('66%','0.15')); box.appendChild(ln('74%','0.12'));
      c.appendChild(box);
      const foot = el('', { marginTop:'auto', display:'flex', gap:'5px', alignItems:'center', paddingTop:'6px', borderTop:'1px solid rgba(255,255,255,0.07)' });
      ['GET','POST'].forEach(v => { const chip = el('gh-chip'); chip.textContent = v; foot.appendChild(chip); });
      const pd = el('', { marginLeft:'auto', width:'5px', height:'5px', borderRadius:'0', background:GREEND }); foot.appendChild(pd); pulses.push(pd);
      c.appendChild(foot); wrap.appendChild(c);
    }
    wrap._pulses = pulses; return wrap;
  }
  function buildTierData() {
    const wrap = el('gh-modern', { display:'flex', gap:'12px' });
    const c = cleanCard({ gap:'8px' });
    const hdr = el('', { display:'flex', gap:'8px' });
    COL_NAMES.forEach(n => { const cell = el('', { flex:'1', borderRadius:'0', background:`${GREEN}66`, borderBottom:`1.5px solid ${GREEND}`, font:`500 10px 'Geist Mono', monospace`, letterSpacing:'-0.02em', color:INK, padding:'2px 4px' }); cell.textContent = n; hdr.appendChild(cell); });
    c.appendChild(hdr);
    for (let r = 0; r < 3; r++) { const row = el('', { display:'flex', gap:'8px' }); for (let cc = 0; cc < 4; cc++) row.appendChild(el('', { flex:'1', height:'5px', borderRadius:'0', background:`rgba(54,47,44,${0.18 - r*0.03})` })); c.appendChild(row); }
    wrap.appendChild(c); return wrap;
  }
  const TIER_BUILD = [buildTierUI, buildTierServices, buildTierData];

  const bands = [0,1,2].map(k => {
    const band = el('gh-band');
    const legacy = buildLegacy(k);
    const oldWrap = el('', { position:'absolute', inset:'0' }); oldWrap.appendChild(legacy.wrap); band.appendChild(oldWrap);
    // labels
    const labels = el('gh-labels');
    const legSpan = document.createElement('span'); legSpan.textContent = LAYERS[k].legacy; legSpan.style.color = 'rgba(252,250,235,0.55)';
    const modSpan = document.createElement('span'); modSpan.textContent = LAYERS[k].modern; modSpan.style.color = GREEND;
    labels.appendChild(legSpan); labels.appendChild(modSpan); band.appendChild(labels);
    // modern content
    const modWrap = el('', { position:'absolute', inset:'44px 14px 14px' }); // equal padding: 14px sides/bottom + 14px gap below the label
    const tier = TIER_BUILD[k](); modWrap.appendChild(tier); band.appendChild(modWrap);
    world.appendChild(band);
    return { band, oldWrap, legacy, legSpan, modSpan, modWrap, tier };
  });

  world.appendChild(tangleSvg); // spaghetti on top of the dark monolith

  // agents
  const AGENT_X = 860;
  const agents = [0,1,2].map(i => {
    const t1 = TIERS[1]; const y = t1.y + 15 + i * 58;
    const wrap = el('', { position:'absolute', inset:'0' });
    const s = svg(1280, 720, { left:'0', top:'0' });
    const p = path({ d:`M${t1.x+t1.w},${y+22} H${AGENT_X}`, stroke:ACCENT, 'stroke-width':1.4, 'stroke-dasharray':'4 6', opacity:0.7 });
    s.appendChild(p); wrap.appendChild(s);
    const chip = el('gh-agent', { left:AGENT_X+'px', top:y+'px' });
    chip.appendChild(el('diamond')); const sp = document.createElement('span'); sp.textContent = 'AGENT'; chip.appendChild(sp);
    wrap.appendChild(chip); world.appendChild(wrap);
    return { wrap, chip, path: p, y };
  });

  // scan beam
  const scan = el('gh-scan', { left:(STACK.x-30)+'px', width:(STACK.w+60)+'px' }); world.appendChild(scan);

  // veil ref
  const veil = document.querySelector('.gh-veil');

  // ── per-frame apply ───────────────────────────────────────────────────
  function apply(P) {
    world.style.transform = `translate(${W/2 - P.cx*P.z}px, ${H/2 - P.cy*P.z}px) scale(${P.z})`;
    glow.style.opacity = P.glow;
    husk.style.transform = `translateY(${P.breathe*1.2}px)`;

    // tangle
    const tOp = 0.95 * (1 - Math.max(...P.peel)) * (0.55 + 0.45*P.chaos);
    tangleSvg.style.opacity = tOp < 0.01 ? 0 : tOp;
    const tStroke = P.analyzed > 0.5 ? `${GREEND}` : 'rgba(252,250,235,0.22)';
    tanglePaths.forEach(p => { p.setAttribute('stroke', tStroke); p.setAttribute('stroke-dasharray', P.analyzed > 0.5 ? '4 5' : 'none'); p.setAttribute('stroke-dashoffset', -P.flow*26); });

    // bands
    bands.forEach((B,k) => {
      const p = P.peel[k];
      const t = TIERS[k];                                    // in place — no travel
      const lift = Math.sin(Math.PI*p);                      // 0→1→0 over the morph
      const oldOp = clamp(1 - p*1.9, 0, 1), newOp = seg(p, 0.5, 0.9);
      Object.assign(B.band.style, {
        left:t.x+'px', top:t.y+'px', width:t.w+'px', height:t.h+'px',
        transformOrigin: 'center',
        // subtle in-place "pop" as the clean layer forms on top of the old
        transform:`translateY(${-5*lift + P.breathe*0.8*(1-p)}px) scale(${1 + 0.02*lift})`,
        borderRadius: '0',                                   // brand: square
        background: hexLerp(INK, SURF, p),                   // dark old → light clean
        border:`1px solid rgba(54,47,44,${lerp(0.14,0.10,p)})`,
        // SANCTIONED GLOSS: softened WARM lift shadow for product depth (not black)
        boxShadow: lift > 0.02 ? `0 ${9*lift}px ${26*lift}px rgba(54,47,44,${0.16*lift})` : 'none',
      });
      B.oldWrap.style.opacity = oldOp;
      B.legSpan.style.opacity = clamp(1 - p*2.4, 0, 1);
      B.modSpan.style.opacity = seg(p, 0.5, 0.9);
      B.modWrap.style.opacity = newOp;
      B.modWrap.style.display = newOp > 0.002 ? '' : 'none';
      // code-row jitter + green analyzed clip
      const analyzedAmt = clamp((P.scanPos - k/3)*3, 0, 1) * (P.analyzed > 0.02 ? 1 : 0);
      B.legacy.rows.forEach((r,i) => { r.rd.style.transform = `translateX(${Math.sin(P.s*5.5 + i*1.7 + k)*3.4*P.chaos}px)`; });
      B.legacy.analyzed.style.clipPath = `inset(0 0 ${100 - analyzedAmt*100}% 0)`;
      B.legacy.analyzed.style.display = analyzedAmt > 0.002 ? '' : 'none';
      if (B.tier._pulses) B.tier._pulses.forEach((pd,i) => pd.style.opacity = 0.5 + 0.5*Math.abs(Math.sin(P.flow*2 + i)));
    });

    // wires
    wireGroups.forEach((wg,i) => {
      const op = i === 0 ? P.wire01 : P.wire12;
      wg.g.style.opacity = op < 0.01 ? 0 : op;
      [...wg.g.children].forEach(ln => ln.setAttribute('stroke-dashoffset', -P.flow*34));
    });

    // agents
    agents.forEach((A,i) => {
      if (P.dock < 0.005) { A.wrap.style.opacity = 0; return; }
      const a = clamp((P.dock - i*0.13)/0.6, 0, 1), e = ease(a);
      const pulse = 0.55 + 0.45*Math.abs(Math.sin(P.flow*2.4 - i*0.7));
      A.wrap.style.opacity = e;
      A.chip.style.left = (AGENT_X + (1-e)*46) + 'px';
      A.chip.style.boxShadow = `0 0 ${14*pulse}px ${GREEN}`; // sanctioned faint gloss
      A.chip.firstChild.style.opacity = pulse;
      A.path.setAttribute('opacity', 0.7*e);
      A.path.setAttribute('stroke-dashoffset', -P.flow*40);
    });

    // scan beam
    scan.style.opacity = P.scanGlow < 0.01 ? 0 : P.scanGlow;
    scan.style.top = (STACK.y - 8 + P.scanPos*(STACK.h+16)) + 'px';

    // reset: fade the whole animation out/in (to the page, not a white veil) so
    // the loop restart doesn't flash white now that the background is removed
    world.style.opacity = 1 - P.veil;
    veil.style.opacity = 0;
  }

  // ── timeline driver ───────────────────────────────────────────────────
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const freezeT = new URLSearchParams(location.search).get('t'); // ?t=SECONDS for stills
  let t0 = performance.now();

  function frame(now) {
    let elapsed = ((now - t0) / 1000) % TOTAL;
    if (reduced) elapsed = STARTS[5] + SCENES[5].dur * 0.5; // hold on a resolved "Agent ready" frame
    if (freezeT !== null) elapsed = parseFloat(freezeT) % TOTAL;

    let idx = 0; while (idx < SCENES.length-1 && elapsed >= STARTS[idx+1]) idx++;
    const scene = SCENES[idx];
    const progress = clamp((elapsed - STARTS[idx]) / scene.dur, 0, 1);

    let P;
    if (scene.reset) {
      const p = progress;
      const vl = p < 0.45 ? 0 : p < 0.72 ? ease((p-0.45)/0.27) : 1 - ease((p-0.72)/0.28);
      const base = p < 0.72 ? params(6 + p*0.55) : params(0);
      P = Object.assign({}, base, { veil: vl });
    } else {
      P = params(idx + progress);
    }
    apply(P);

    if (!reduced && freezeT === null) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // ── fit the CONTENT (not the whole empty 1280×720 canvas) into the box ──
  // The client's canvas has large empty margins around the scene; we crop to
  // the content viewport CV (stage coords) so the artwork fills the frame with
  // no dead space. Tune CV to reframe. Box aspect (d.css) should ~match CV.
  const hero = document.getElementById('gallopHero');
  const stage = hero.querySelector('.gh-stage');
  const CV = { x: 280, y: 40, w: 800, h: 640 };   // content viewport in stage coords — wide enough to contain the camera pan so nothing clips (≈5:4)
  const fit = () => {
    const bw = hero.clientWidth, bh = hero.clientHeight;
    const s = Math.max(bw / CV.w, bh / CV.h);       // cover the box with the content viewport
    const tx = bw / 2 - (CV.x + CV.w / 2) * s;
    const ty = bh / 2 - (CV.y + CV.h / 2) * s;
    stage.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
  };
  new ResizeObserver(fit).observe(hero); fit();
})();
