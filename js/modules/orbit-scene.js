export function initOrbitScene() {
  const layer = document.getElementById('origin-scene-4-layer');
  const scene = document.getElementById('originOrbitScene');
  const planetsEl = document.getElementById('originOrbitPlanets');
  const realmsEl = document.getElementById('originOrbitRealms');
  const svgEl = document.getElementById('originOrbitConnections');
  const titleEl = document.getElementById('originOrbitActTitle');
  const supportEl = document.getElementById('originOrbitSupport');
  const logoImg = document.getElementById('originOrbitLogo');
  const glowOut = document.getElementById('originOrbitGlowOuter');
  const glowIn = document.getElementById('originOrbitGlowInner');
  const ambient = document.getElementById('originOrbitAmbient');
  const frame = document.getElementById('originOrbitFrame');

  if (!layer || !scene || !planetsEl || !realmsEl || !svgEl || !titleEl || !supportEl || !logoImg || !glowOut || !glowIn || !ambient || !frame) {
    console.warn('OrbitScene: Missing required DOM elements.');
    return null;
  }

  const CONFIG = {
    acts: {
  coreEnd: 0.22,
  chaosEnd: 0.42,
  coordEnd: 0.65,
  simplifyEnd: 0.75,
  mergeEnd: 0.90,
  resolveEnd: 1.00
},

    motion: {
      pointerEase: 0.05,
      orbitSpeedAct2: 1,
      orbitSpeedAct3: 6,
      orbitSpeedAct4: 1.6,
      orbitSpeedAct5: 0.8,
      wobbleChaosXDesktop: 7,
      wobbleChaosYDesktop: 5,
      wobbleChaosXMobile: 1.5,
      wobbleChaosYMobile: 0.5,
      wobbleCoordXDesktop: 2.2,
      wobbleCoordYDesktop: 1.8,
      wobbleCoordXMobile: 0.9,
      wobbleCoordYMobile: 0.2
    },

    frame: {
      rxDesktop: 0.34,
      ryDesktop: 0.26,
      rxTablet: 0.30,
      ryTablet: 0.23,
      rxMobile: 0.26,
      ryMobile: 0.20
    },

    core: {
      logoScaleMerge: 1.05,
      logoScaleFinal: 1.22,
      outerGlowDesktop: 200,
      outerGlowDesktopFinal: 260,
      outerGlowMobile: 140,
      outerGlowMobileFinal: 200,
      innerGlowDesktop: 76,
      innerGlowDesktopFinal: 96,
      innerGlowMobile: 54,
      innerGlowMobileFinal: 74
    },

    chaosTargets: {
      creative:  { x: -0.56, y: -0.08 },
      digital:   { x:  0.56, y: -0.02 },
      strategic: { x:  0.00, y: -0.64 },
      physical:  { x:  0.00, y:  0.66 }
    },

    coordinationBase: {
      creative:  { x: -0.34, y: -0.08 },
      digital:   { x:  0.34, y: -0.02 },
      strategic: { x:  0.00, y: -0.40 },
      physical:  { x:  0.00, y:  0.42 }
    },

    realmPositions: {
      creative:  { desktop: { x: -0.29, y:  0.00 }, mobile: { x: -0.24, y: -0.10 } },
      digital:   { desktop: { x:  0.29, y:  0.00 }, mobile: { x:  0.24, y: 0.10 } },
      strategic: { desktop: { x:  0.00, y: -0.22 }, mobile: { x:  0.10, y: -0.30 } },
      physical:  { desktop: { x:  0.00, y:  0.18 }, mobile: { x:  -0.10, y:  0.30 } }
    },

    /*
      Cluster slots prevent overlap in Act 3.
      These are offsets around each realm base anchor.
      Tweak these values first if labels collide.
    */
    coordinationSlotsDesktop: {
      creative: [
        { x: -80, y: -50 },
        { x:  -70, y: 10 },
        { x: -80, y:  70 }
      ],
      digital: [
        { x: 40, y: -50 },
        { x:  30, y:  10 },
        { x:  40, y:  70 }
      ],
      strategic: [
        { x: 80, y:  -50 },
        { x:  -80, y: -50 }
      ],
      physical: [
        { x: -40, y:   50 },
        { x:  40, y:  50 }
      ]
    },

    coordinationSlotsMobile: {
      creative: [
        { x: -80, y: -50 },
        { x:  -70, y: 10 },
        { x: -80, y:  70 }
      ],
      digital: [
        { x: 40, y: -50 },
        { x:  30, y:  10 },
        { x:  40, y:  70 }
      ],
      strategic: [
        { x: 30, y:  -50 },
        { x:  -50, y: -50 }
      ],
      physical: [
         { x: -40, y:   50 },
        { x:  10, y:  50 }
      ]
    }
  };

  const ACT_TEXTS = [
    { title: 'One vision.', support: 'Everything begins here.' },
    { title: 'Many moving parts.', support: 'Different teams. Different directions.' },
    { title: 'Coordination begins.', support: 'Every function, working together.' },
    { title: 'System simplifies.', support: 'Digital. Physical. Creative. Strategic.' },
    { title: 'Because your audience sees one brand.', support: 'Not departments. Not vendors.' },
    { title: 'Chronotales', support: 'Everything aligned.' }
  ];

  const PLANETS = [
    { id: 'p0', label: 'Branding',    realm: 'creative',  angle: 210, radius: 0.82, lift: -0.01, slot: 0 },
    { id: 'p1', label: 'Content',     realm: 'creative',  angle: 236, radius: 0.72, lift: -0.03, slot: 1 },
    { id: 'p2', label: 'Production',  realm: 'creative',  angle: 174, radius: 0.90, lift:  0.05, slot: 2 },

    { id: 'p3', label: 'Websites',    realm: 'digital',   angle: 334, radius: 0.78, lift: -0.03, slot: 0 },
    { id: 'p4', label: 'Apps',        realm: 'digital',   angle:   8, radius: 0.90, lift:  0.02, slot: 1 },
    { id: 'p5', label: 'Performance', realm: 'digital',   angle:  28, radius: 0.74, lift:  0.10, slot: 2 },

    { id: 'p6', label: 'Strategy',    realm: 'strategic', angle: 284, radius: 0.90, lift: -0.15, slot: 0 },
    { id: 'p7', label: 'Training',    realm: 'strategic', angle: 306, radius: 0.92, lift: -0.18, slot: 1 },

    { id: 'p8', label: 'Events',      realm: 'physical',  angle: 122, radius: 0.70, lift:  0.18, slot: 0 },
    { id: 'p9', label: 'Print',       realm: 'physical',  angle:  58, radius: 0.70, lift:  0.18, slot: 1 }
  ];

  const REALMS = [
    { id: 'r0', label: 'Creative',  realm: 'creative'  },
    { id: 'r1', label: 'Digital',   realm: 'digital'   },
    { id: 'r2', label: 'Strategic', realm: 'strategic' },
    { id: 'r3', label: 'Physical',  realm: 'physical'  }
  ];

  const INTERNAL_LINKS = [
    ['p0', 'p1'], ['p1', 'p2'],
    ['p3', 'p4'], ['p4', 'p5'],
    ['p6', 'p7'],
    ['p8', 'p9']
  ];

  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const degToRad = (d) => (d * Math.PI) / 180;

  const runtime = {
    progress: 0,
    raf: 0,
    time: 0,
    pointerX: 0,
    pointerY: 0,
    pointerTX: 0,
    pointerTY: 0
  };

  const planetById = {};
  const realmById = {};
  const internalLines = [];
  const realmLines = [];

  function buildPlanet(planet) {
    const el = document.createElement('div');
    el.className = `origin-orbit-planet realm-${planet.realm}`;
    el.innerHTML = `
      <div class="origin-orbit-planet__orb"></div>
      <div class="origin-orbit-planet__label">${planet.label}</div>
    `;
    el.style.opacity = '0';
    planetsEl.appendChild(el);

    planet.el = el;
    planet.cx = 0;
    planet.cy = 0;
    planet.phase = Math.random() * Math.PI * 2;
    planetById[planet.id] = planet;
  }

  function buildRealm(realm) {
    const el = document.createElement('div');
    el.className = `origin-orbit-realm realm-${realm.realm}`;
    el.innerHTML = `
      <div class="origin-orbit-realm__orb"></div>
      <div class="origin-orbit-realm__label">${realm.label}</div>
    `;
    el.style.opacity = '0';
    realmsEl.appendChild(el);

    realm.el = el;
    realm.cx = 0;
    realm.cy = 0;
    realmById[realm.id] = realm;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('stroke', 'rgba(244,211,106,0.55)');
    line.setAttribute('stroke-width', '1.1');
    line.setAttribute('stroke-dasharray', '4 8');
    line.style.opacity = '0';
    svgEl.appendChild(line);

    realmLines.push({ realmId: realm.id, line });
  }

  PLANETS.forEach(buildPlanet);
  REALMS.forEach(buildRealm);

  INTERNAL_LINKS.forEach(([a, b]) => {
    const pa = planetById[a];
    const color =
      pa.realm === 'digital' ? 'rgba(110,175,215,0.60)' :
      pa.realm === 'creative' ? 'rgba(215,155,100,0.60)' :
      pa.realm === 'strategic' ? 'rgba(165,148,210,0.60)' :
      'rgba(130,185,148,0.60)';

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', '0.9');
    line.setAttribute('stroke-dasharray', '3 7');
    line.style.opacity = '0';
    svgEl.appendChild(line);

    internalLines.push({ a, b, line });
  });

  function setCopy(index) {
    titleEl.textContent = ACT_TEXTS[index].title;
    supportEl.textContent = ACT_TEXTS[index].support;
  }

  function frameMetrics() {
    const rect = frame.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      cx: rect.width * 0.5,
      cy: rect.height * 0.5
    };
  }

  function isMobile() {
    return window.innerWidth < 768;
  }

  function isTablet() {
    return window.innerWidth >= 768 && window.innerWidth < 1100;
  }

  function actIndex(progress) {
    if (progress < CONFIG.acts.coreEnd) return 0;
    if (progress < CONFIG.acts.chaosEnd) return 1;
    if (progress < CONFIG.acts.coordEnd) return 2;
    if (progress < CONFIG.acts.simplifyEnd) return 3;
    if (progress < CONFIG.acts.mergeEnd) return 4;
    return 5;
  }

  function actProgress(progress, start, end) {
    return clamp((progress - start) / (end - start));
  }

  function orbitRadiusX(metrics, mobile, tablet) {
    return mobile
      ? metrics.width * CONFIG.frame.rxMobile
      : tablet
      ? metrics.width * CONFIG.frame.rxTablet
      : metrics.width * CONFIG.frame.rxDesktop;
  }

  function orbitRadiusY(metrics, mobile, tablet) {
    return mobile
      ? metrics.height * CONFIG.frame.ryMobile
      : tablet
      ? metrics.height * CONFIG.frame.ryTablet
      : metrics.height * CONFIG.frame.ryDesktop;
  }

  function setChaosNeutral(planet, enabled) {
    if (enabled) planet.el.classList.add('is-chaos-neutral');
    else planet.el.classList.remove('is-chaos-neutral');
  }

  function setLine(line, x1, y1, x2, y2, opacity) {
    line.setAttribute('x1', x1.toFixed(1));
    line.setAttribute('y1', y1.toFixed(1));
    line.setAttribute('x2', x2.toFixed(1));
    line.setAttribute('y2', y2.toFixed(1));
    line.style.opacity = String(clamp(opacity));
  }

  function getRealmPosition(realmName, mobile, metrics) {
    const data = CONFIG.realmPositions[realmName];
    const pos = mobile ? data.mobile : data.desktop;
    return {
      x: pos.x * metrics.width,
      y: pos.y * metrics.height
    };
  }

  function getCoordinationSlot(planet, mobile) {
    const table = mobile ? CONFIG.coordinationSlotsMobile : CONFIG.coordinationSlotsDesktop;
    return table[planet.realm][planet.slot] || { x: 0, y: 0 };
  }

  function onPointerMove(e) {
    const rect = frame.getBoundingClientRect();
    runtime.pointerTX = clamp(((e.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
    runtime.pointerTY = clamp(((e.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
  }

  function onPointerLeave() {
    runtime.pointerTX = 0;
    runtime.pointerTY = 0;
  }

  scene.addEventListener('pointermove', onPointerMove);
  scene.addEventListener('pointerleave', onPointerLeave);

  function renderCore(progress, act, mobile) {
    const resolveT = act === 5
      ? easeOut(actProgress(progress, CONFIG.acts.mergeEnd, CONFIG.acts.resolveEnd))
      : 0;

    const mergeT = act === 4
      ? easeOut(actProgress(progress, CONFIG.acts.simplifyEnd, CONFIG.acts.mergeEnd))
      : 0;

    const logoScale =
      act === 5
        ? lerp(1, CONFIG.core.logoScaleFinal, resolveT)
        : act === 4
        ? lerp(1, CONFIG.core.logoScaleMerge, mergeT)
        : 1;

    logoImg.style.transform =
      `translate(-50%, -50%) translate3d(${(runtime.pointerX * 0.15).toFixed(1)}px, ${(runtime.pointerY * 0.15).toFixed(1)}px, 0) scale(${logoScale.toFixed(3)})`;

    glowOut.style.opacity = String(lerp(0.22, 0.46, progress));
    glowIn.style.opacity = String(lerp(0.18, 0.34, progress));

    const outerStart = mobile ? CONFIG.core.outerGlowMobile : CONFIG.core.outerGlowDesktop;
    const outerEnd = mobile ? CONFIG.core.outerGlowMobileFinal : CONFIG.core.outerGlowDesktopFinal;
    const innerStart = mobile ? CONFIG.core.innerGlowMobile : CONFIG.core.innerGlowDesktop;
    const innerEnd = mobile ? CONFIG.core.innerGlowMobileFinal : CONFIG.core.innerGlowDesktopFinal;

    const outerSize = act === 5 ? lerp(outerStart, outerEnd, resolveT) : outerStart;
    const innerSize = act === 5 ? lerp(innerStart, innerEnd, resolveT) : innerStart;

    glowOut.style.width = `${outerSize}px`;
    glowOut.style.height = `${outerSize}px`;
    glowIn.style.width = `${innerSize}px`;
    glowIn.style.height = `${innerSize}px`;
  }

  function render() {
    runtime.time += 0.016;
    runtime.pointerX = lerp(runtime.pointerX, runtime.pointerTX, CONFIG.motion.pointerEase);
    runtime.pointerY = lerp(runtime.pointerY, runtime.pointerTY, CONFIG.motion.pointerEase);

    const progress = clamp(runtime.progress);
    const act = actIndex(progress);
    setCopy(act);

    const metrics = frameMetrics();
    const mobile = isMobile();
    const tablet = isTablet();

    const pointerX = runtime.pointerX * (mobile ? 5 : 8);
    const pointerY = runtime.pointerY * (mobile ? 4 : 6);

    const rx = orbitRadiusX(metrics, mobile, tablet);
    const ry = orbitRadiusY(metrics, mobile, tablet);

    const rotation =
      act === 0 ? runtime.time * 0.4 :
      act === 1 ? runtime.time * CONFIG.motion.orbitSpeedAct2 :
      act === 2 ? runtime.time * CONFIG.motion.orbitSpeedAct3 :
      act === 3 ? runtime.time * CONFIG.motion.orbitSpeedAct4 :
      act === 4 ? runtime.time * CONFIG.motion.orbitSpeedAct5 :
      runtime.time * 0.25;

    ambient.style.background =
      `radial-gradient(ellipse 70% 56% at 50% 50%, rgba(201,168,76,${lerp(0.045, 0.10, progress).toFixed(3)}) 0%, transparent 74%)`;

    renderCore(progress, act, mobile);

    PLANETS.forEach((planet) => {
      planet.el.style.opacity = '0';
      setChaosNeutral(planet, false);
    });

    REALMS.forEach((realm) => {
      realm.el.style.opacity = '0';
    });

    internalLines.forEach(({ line }) => {
      line.style.opacity = '0';
    });

    realmLines.forEach(({ line }) => {
      line.style.opacity = '0';
    });

    if (act === 0) {
      return;
    }

    // ACT 2 — CHAOS HOLD
    if (act === 1) {
      const appear = easeOut(actProgress(progress, CONFIG.acts.coreEnd, CONFIG.acts.chaosEnd));

      PLANETS.forEach((planet) => {
        const theta = degToRad(planet.angle + rotation * 8);
        const wobbleX = Math.sin(runtime.time * 0.75 + planet.phase) * (mobile ? CONFIG.motion.wobbleChaosXMobile : CONFIG.motion.wobbleChaosXDesktop);
        const wobbleY = Math.cos(runtime.time * 0.58 + planet.phase) * (mobile ? CONFIG.motion.wobbleChaosYMobile : CONFIG.motion.wobbleChaosYDesktop);

        const orbitX = Math.cos(theta) * (rx * planet.radius);
        const orbitY = Math.sin(theta) * (ry * planet.radius) + planet.lift * metrics.height;

        const chaosTarget = CONFIG.chaosTargets[planet.realm];
        const x = lerp(orbitX, chaosTarget.x * rx, 0.25) + wobbleX + pointerX * 0.10;
        const y = lerp(orbitY, chaosTarget.y * ry, 0.25) + wobbleY + pointerY * 0.10;

        planet.cx = metrics.cx + x;
        planet.cy = metrics.cy + y;

        const depth = (Math.sin(theta) + 1) * 0.5;
        const scale = lerp(mobile ? 0.92 : 0.90, mobile ? 1.06 : 1.10, depth);
        const z = lerp(-18, 22, depth);

        setChaosNeutral(planet, true);

        planet.el.style.opacity = String(appear);
        planet.el.style.transform =
          `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      });

      return;
    }

    // ACT 3 — COORDINATION HOLD
    if (act === 2) {
      const t = easeInOut(actProgress(progress, CONFIG.acts.chaosEnd, CONFIG.acts.coordEnd));

      PLANETS.forEach((planet) => {
        const theta = degToRad(planet.angle + rotation * 5);
        const wobbleX = Math.sin(runtime.time * 0.70 + planet.phase) * (mobile ? CONFIG.motion.wobbleCoordXMobile : CONFIG.motion.wobbleCoordXDesktop);
        const wobbleY = Math.cos(runtime.time * 0.54 + planet.phase) * (mobile ? CONFIG.motion.wobbleCoordYMobile : CONFIG.motion.wobbleCoordYDesktop);

        const from = CONFIG.chaosTargets[planet.realm];
        const base = CONFIG.coordinationBase[planet.realm];
        const slot = getCoordinationSlot(planet, mobile);

        const fromX = from.x * rx;
        const fromY = from.y * ry;

        const toX = base.x * rx + slot.x;
        const toY = base.y * ry + slot.y;

        const x = lerp(fromX, toX, t) + wobbleX + pointerX * 0.08;
        const y = lerp(fromY, toY, t) + wobbleY + pointerY * 0.08;

        planet.cx = metrics.cx + x;
        planet.cy = metrics.cy + y;

        planet.el.style.opacity = '1';
        planet.el.style.transform =
          `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${lerp(8, 2, t).toFixed(1)}px) translate(-50%, -50%) scale(${lerp(1.0, 0.96, t).toFixed(3)})`;
      });

      internalLines.forEach(({ a, b, line }) => {
        const pa = planetById[a];
        const pb = planetById[b];
        setLine(line, pa.cx, pa.cy, pb.cx, pb.cy, t * 0.78);
      });

      return;
    }

    // ACT 4 — SYSTEM SIMPLIFIES HOLD
    if (act === 3) {
      const t = easeInOut(actProgress(progress, CONFIG.acts.coordEnd, CONFIG.acts.simplifyEnd));

      PLANETS.forEach((planet) => {
        const base = CONFIG.coordinationBase[planet.realm];
        const slot = getCoordinationSlot(planet, mobile);

        const fromX = base.x * rx + slot.x;
        const fromY = base.y * ry + slot.y;

        const realmPos = getRealmPosition(planet.realm, mobile, metrics);
        const toX = realmPos.x;
        const toY = realmPos.y;

        const x = lerp(fromX, toX, t);
        const y = lerp(fromY, toY, t);

        planet.cx = metrics.cx + x;
        planet.cy = metrics.cy + y;

        planet.el.style.opacity = String(1 - t);
        planet.el.style.transform =
          `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${lerp(8, 0, t).toFixed(1)}px) translate(-50%, -50%) scale(${lerp(0.96, 0.70, t).toFixed(3)})`;
      });

      REALMS.forEach((realm) => {
        const pos = getRealmPosition(realm.realm, mobile, metrics);

        realm.cx = metrics.cx + pos.x;
        realm.cy = metrics.cy + pos.y;

        realm.el.style.opacity = String(t);
        realm.el.style.transform =
          `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, ${lerp(-10, 8, t).toFixed(1)}px) translate(-50%, -50%) scale(${lerp(0.82, 1.0, t).toFixed(3)})`;
      });

      realmLines.forEach(({ realmId, line }) => {
        const realm = realmById[realmId];
        setLine(line, metrics.cx, metrics.cy, realm.cx, realm.cy, t * 0.72);
      });

      return;
    }

    // ACT 5 — ONE BRAND MERGE
    if (act === 4) {
      const t = easeOut(actProgress(progress, CONFIG.acts.simplifyEnd, CONFIG.acts.mergeEnd));

      REALMS.forEach((realm) => {
        const pos = getRealmPosition(realm.realm, mobile, metrics);

        const x = lerp(pos.x, 0, t);
        const y = lerp(pos.y, 0, t);

        realm.cx = metrics.cx + x;
        realm.cy = metrics.cy + y;

        realm.el.style.opacity = String(1 - t);
        realm.el.style.transform =
          `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${lerp(6, -4, t).toFixed(1)}px) translate(-50%, -50%) scale(${lerp(1.0, 0.50, t).toFixed(3)})`;
      });

      realmLines.forEach(({ realmId, line }) => {
        const realm = realmById[realmId];
        setLine(line, metrics.cx, metrics.cy, realm.cx, realm.cy, (1 - t) * 0.72);
      });

      return;
    }

    // ACT 6 — RESOLVE
    if (act === 5) {
      return;
    }
  }

  function tick() {
    render();
    runtime.raf = requestAnimationFrame(tick);
  }

  setCopy(0);
  gsap.set(layer, { opacity: 0 });
  runtime.raf = requestAnimationFrame(tick);

  return {
    layer,
    scene,
    update(progress) {
      runtime.progress = clamp(progress);
    },
    destroy() {
      if (runtime.raf) cancelAnimationFrame(runtime.raf);
      scene.removeEventListener('pointermove', onPointerMove);
      scene.removeEventListener('pointerleave', onPointerLeave);
    }
  };
}