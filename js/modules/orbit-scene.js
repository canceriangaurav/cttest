export function initOrbitScene() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.warn('OrbitScene: Browser environment not available.');
    return null;
  }

  if (typeof gsap === 'undefined') {
    console.warn('OrbitScene: GSAP not available.');
    return null;
  }

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

  const required = {
    layer,
    scene,
    planetsEl,
    realmsEl,
    svgEl,
    titleEl,
    supportEl,
    logoImg,
    glowOut,
    glowIn,
    ambient,
    frame
  };

  const missing = Object.entries(required)
    .filter(([, el]) => !el)
    .map(([key]) => key);

  if (missing.length) {
    console.warn(`OrbitScene: Missing required DOM elements: ${missing.join(', ')}`);
    return null;
  }

  const CONFIG = {
    acts: {
      coreEnd: 0.23,
      chaosEnd: 0.43,
      coordEnd: 0.65,
      simplifyMoveEnd: 0.73,
      simplifyHoldEnd: 0.80,
      mergeEnd: 0.90,
      resolveEnd: 1.00
    },

    transitionDurations: {
      '0-1': 0.95,
      '1-2': 1.2,
      '2-3': 1.0,
      '3-4': 0.95,
      '4-5': 1.05
    },

    motion: {
      pointerEase: 0.05,
      orbitSpeedAct1: 0.35,
      orbitSpeedAct2: 0.95,
      orbitSpeedAct3: 1.35,
      orbitSpeedAct4: 0.55,
      orbitSpeedAct5: 0.75,
      wobbleChaosXDesktop: 7,
      wobbleChaosYDesktop: 5,
      wobbleChaosXMobile: 1.5,
      wobbleChaosYMobile: 0.5,
      wobbleCoordXDesktop: 1.5,
      wobbleCoordYDesktop: 1.2,
      wobbleCoordXMobile: 0.5,
      wobbleCoordYMobile: 0.15
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
      creative: { x: -0.56, y: -0.08 },
      digital: { x: 0.56, y: -0.02 },
      strategic: { x: 0.00, y: -0.64 },
      physical: { x: 0.00, y: 0.66 }
    },

    coordinationBase: {
      creative: { x: -0.34, y: -0.08 },
      digital: { x: 0.34, y: -0.02 },
      strategic: { x: 0.00, y: -0.40 },
      physical: { x: 0.00, y: 0.42 }
    },

    realmPositions: {
      creative: { desktop: { x: -0.29, y: 0.00 }, mobile: { x: -0.24, y: -0.10 } },
      digital: { desktop: { x: 0.29, y: 0.00 }, mobile: { x: 0.24, y: 0.10 } },
      strategic: { desktop: { x: 0.00, y: -0.22 }, mobile: { x: 0.10, y: -0.30 } },
      physical: { desktop: { x: 0.00, y: 0.18 }, mobile: { x: -0.10, y: 0.30 } }
    },

    coordinationSlotsDesktop: {
      creative: [
        { x: -80, y: -50 },
        { x: -70, y: 10 },
        { x: -80, y: 70 }
      ],
      digital: [
        { x: 40, y: -50 },
        { x: 30, y: 10 },
        { x: 40, y: 70 }
      ],
      strategic: [
        { x: 80, y: -50 },
        { x: -80, y: -50 }
      ],
      physical: [
        { x: -40, y: 50 },
        { x: 40, y: 50 }
      ]
    },

    coordinationSlotsMobile: {
      creative: [
        { x: -80, y: -50 },
        { x: -70, y: 10 },
        { x: -80, y: 70 }
      ],
      digital: [
        { x: 40, y: -50 },
        { x: 30, y: 10 },
        { x: 40, y: 70 }
      ],
      strategic: [
        { x: 30, y: -50 },
        { x: -50, y: -50 }
      ],
      physical: [
        { x: -40, y: 50 },
        { x: 10, y: 50 }
      ]
    }
  };

  const ACT_TEXTS = [
    { title: 'One vision.', support: 'Everything begins here.' },
    { title: 'Many moving parts.', support: 'Different teams. Different directions.' },
    { title: 'Coordination begins.', support: 'Every function, moving into alignment.' },
    { title: 'System simplifies.', support: 'Digital. Physical. Creative. Strategic.' },
    { title: 'Because your audience sees one brand.', support: 'Not departments. Not vendors.' },
    { title: 'Chronotales', support: 'Everything aligned.' }
  ];

  const PLANETS = [
    { id: 'p0', label: 'Branding', realm: 'creative', angle: 210, radius: 0.82, lift: -0.01, slot: 0 },
    { id: 'p1', label: 'Content', realm: 'creative', angle: 236, radius: 0.72, lift: -0.03, slot: 1 },
    { id: 'p2', label: 'Production', realm: 'creative', angle: 174, radius: 0.90, lift: 0.05, slot: 2 },
    { id: 'p3', label: 'Websites', realm: 'digital', angle: 334, radius: 0.78, lift: -0.03, slot: 0 },
    { id: 'p4', label: 'Apps', realm: 'digital', angle: 8, radius: 0.90, lift: 0.02, slot: 1 },
    { id: 'p5', label: 'Performance', realm: 'digital', angle: 28, radius: 0.74, lift: 0.10, slot: 2 },
    { id: 'p6', label: 'Strategy', realm: 'strategic', angle: 284, radius: 0.90, lift: -0.15, slot: 0 },
    { id: 'p7', label: 'Training', realm: 'strategic', angle: 306, radius: 0.92, lift: -0.18, slot: 1 },
    { id: 'p8', label: 'Events', realm: 'physical', angle: 122, radius: 0.70, lift: 0.18, slot: 0 },
    { id: 'p9', label: 'Print', realm: 'physical', angle: 58, radius: 0.70, lift: 0.18, slot: 1 }
  ];

  const REALMS = [
    { id: 'r0', label: 'Creative', realm: 'creative' },
    { id: 'r1', label: 'Digital', realm: 'digital' },
    { id: 'r2', label: 'Strategic', realm: 'strategic' },
    { id: 'r3', label: 'Physical', realm: 'physical' }
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
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const degToRad = (d) => (d * Math.PI) / 180;

  const runtime = {
    destroyed: false,
    progress: 0,
    mode: 'progress',
    holdAct: 0,
    transition: null,
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
  let transitionTween = null;

  function isMobile() {
    return window.innerWidth < 768;
  }

  function isTablet() {
    return window.innerWidth >= 768 && window.innerWidth < 1100;
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

  function actIndex(progress) {
    if (progress < CONFIG.acts.coreEnd) return 0;
    if (progress < CONFIG.acts.chaosEnd) return 1;
    if (progress < CONFIG.acts.coordEnd) return 2;
    if (progress < CONFIG.acts.simplifyHoldEnd) return 3;
    if (progress < CONFIG.acts.mergeEnd) return 4;
    return 5;
  }

  function actProgress(progress, start, end) {
    if (end <= start) return 0;
    return clamp((progress - start) / (end - start));
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

  function setLine(line, x1, y1, x2, y2, opacity) {
    line.setAttribute('x1', x1.toFixed(1));
    line.setAttribute('y1', y1.toFixed(1));
    line.setAttribute('x2', x2.toFixed(1));
    line.setAttribute('y2', y2.toFixed(1));
    line.style.opacity = String(clamp(opacity));
  }

  function setChaosNeutral(planet, enabled) {
    if (enabled) planet.el.classList.add('is-chaos-neutral');
    else planet.el.classList.remove('is-chaos-neutral');
  }

  function setCopy(index) {
    const safeIndex = Math.max(0, Math.min(ACT_TEXTS.length - 1, index));
    titleEl.textContent = ACT_TEXTS[safeIndex].title;
    supportEl.textContent = ACT_TEXTS[safeIndex].support;
  }

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

  function buildSceneGraph() {
    planetsEl.innerHTML = '';
    realmsEl.innerHTML = '';
    svgEl.innerHTML = '';

    PLANETS.forEach(buildPlanet);
    REALMS.forEach(buildRealm);

    INTERNAL_LINKS.forEach(([a, b]) => {
      const pa = planetById[a];
      const color =
        pa.realm === 'digital' ? 'rgba(110,175,215,0.60)'
          : pa.realm === 'creative' ? 'rgba(215,155,100,0.60)'
            : pa.realm === 'strategic' ? 'rgba(165,148,210,0.60)'
              : 'rgba(130,185,148,0.60)';

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-width', '0.9');
      line.setAttribute('stroke-dasharray', '3 7');
      line.style.opacity = '0';
      svgEl.appendChild(line);

      internalLines.push({ a, b, line });
    });
  }

  function onPointerMove(event) {
    const rect = frame.getBoundingClientRect();
    runtime.pointerTX = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
    runtime.pointerTY = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
  }

  function onPointerLeave() {
    runtime.pointerTX = 0;
    runtime.pointerTY = 0;
  }

  function getVisualStateForAct(act, metrics, mobile, tablet, pointerX, pointerY) {
    const rx = orbitRadiusX(metrics, mobile, tablet);
    const ry = orbitRadiusY(metrics, mobile, tablet);

    const state = {
      act,
      logoScale: 1,
      glowOutOpacity: 0.28,
      glowInOpacity: 0.22,
      outerSize: mobile ? CONFIG.core.outerGlowMobile : CONFIG.core.outerGlowDesktop,
      innerSize: mobile ? CONFIG.core.innerGlowMobile : CONFIG.core.innerGlowDesktop,
      ambientAlpha: 0.055,
      planets: {},
      realms: {},
      internalLines: [],
      realmLines: []
    };

    PLANETS.forEach((planet) => {
      state.planets[planet.id] = {
        visible: false,
        x: 0,
        y: 0,
        z: 0,
        scale: 1,
        opacity: 0,
        chaosNeutral: false
      };
    });

    REALMS.forEach((realm) => {
      state.realms[realm.id] = {
        visible: false,
        x: 0,
        y: 0,
        z: 0,
        scale: 1,
        opacity: 0
      };
    });

    if (act === 0) {
      return state;
    }

    if (act === 1) {
      state.ambientAlpha = 0.07;

      PLANETS.forEach((planet) => {
        const theta = degToRad(planet.angle + runtime.time * CONFIG.motion.orbitSpeedAct2 * 8);
        const wobbleX = Math.sin(runtime.time * 0.75 + planet.phase) *
          (mobile ? CONFIG.motion.wobbleChaosXMobile : CONFIG.motion.wobbleChaosXDesktop);
        const wobbleY = Math.cos(runtime.time * 0.58 + planet.phase) *
          (mobile ? CONFIG.motion.wobbleChaosYMobile : CONFIG.motion.wobbleChaosYDesktop);

        const orbitX = Math.cos(theta) * (rx * planet.radius);
        const orbitY = Math.sin(theta) * (ry * planet.radius) + planet.lift * metrics.height;

        const chaosTarget = CONFIG.chaosTargets[planet.realm];
        const x = lerp(orbitX, chaosTarget.x * rx, 0.25) + wobbleX + pointerX * 0.10;
        const y = lerp(orbitY, chaosTarget.y * ry, 0.25) + wobbleY + pointerY * 0.10;

        const depth = (Math.sin(theta) + 1) * 0.5;
        const scale = lerp(mobile ? 0.92 : 0.90, mobile ? 1.06 : 1.10, depth);
        const z = lerp(-18, 22, depth);

        state.planets[planet.id] = {
          visible: true,
          x,
          y,
          z,
          scale,
          opacity: 1,
          chaosNeutral: true
        };
      });

      return state;
    }

    if (act === 2) {
      state.ambientAlpha = 0.08;

      PLANETS.forEach((planet) => {
        const base = CONFIG.coordinationBase[planet.realm];
        const slot = getCoordinationSlot(planet, mobile);

        const wobbleX = Math.sin(runtime.time * 0.70 + planet.phase) *
          (mobile ? CONFIG.motion.wobbleCoordXMobile : CONFIG.motion.wobbleCoordXDesktop);
        const wobbleY = Math.cos(runtime.time * 0.54 + planet.phase) *
          (mobile ? CONFIG.motion.wobbleCoordYMobile : CONFIG.motion.wobbleCoordYDesktop);

        const x = base.x * rx + slot.x + wobbleX + pointerX * 0.08;
        const y = base.y * ry + slot.y + wobbleY + pointerY * 0.08;

        state.planets[planet.id] = {
          visible: true,
          x,
          y,
          z: 2,
          scale: 0.96,
          opacity: 1,
          chaosNeutral: false
        };
      });

      internalLines.forEach(({ a, b }) => {
        const pa = state.planets[a];
        const pb = state.planets[b];
        state.internalLines.push({
          a,
          b,
          x1: metrics.cx + pa.x,
          y1: metrics.cy + pa.y,
          x2: metrics.cx + pb.x,
          y2: metrics.cy + pb.y,
          opacity: 0.78
        });
      });

      return state;
    }

    if (act === 3) {
      state.ambientAlpha = 0.085;

      REALMS.forEach((realm) => {
        const pos = getRealmPosition(realm.realm, mobile, metrics);
        state.realms[realm.id] = {
          visible: true,
          x: pos.x,
          y: pos.y,
          z: 8,
          scale: 1,
          opacity: 1
        };
      });

      realmLines.forEach(({ realmId }) => {
        const realm = state.realms[realmId];
        state.realmLines.push({
          realmId,
          x1: metrics.cx,
          y1: metrics.cy,
          x2: metrics.cx + realm.x,
          y2: metrics.cy + realm.y,
          opacity: 0.72
        });
      });

      return state;
    }

    if (act === 4) {
      state.logoScale = CONFIG.core.logoScaleMerge;
      state.ambientAlpha = 0.095;

      const mergeT = 1;

      REALMS.forEach((realm) => {
        const pos = getRealmPosition(realm.realm, mobile, metrics);
        const x = lerp(pos.x, 0, mergeT);
        const y = lerp(pos.y, 0, mergeT);

        state.realms[realm.id] = {
          visible: true,
          x,
          y,
          z: -4,
          scale: 0.5,
          opacity: 0
        };
      });

      state.outerSize = mobile ? CONFIG.core.outerGlowMobile : CONFIG.core.outerGlowDesktop;
      state.innerSize = mobile ? CONFIG.core.innerGlowMobile : CONFIG.core.innerGlowDesktop;

      return state;
    }

    if (act === 5) {
      state.logoScale = CONFIG.core.logoScaleFinal;
      state.ambientAlpha = 0.10;
      state.outerSize = mobile ? CONFIG.core.outerGlowMobileFinal : CONFIG.core.outerGlowDesktopFinal;
      state.innerSize = mobile ? CONFIG.core.innerGlowMobileFinal : CONFIG.core.innerGlowDesktopFinal;
      return state;
    }

    return state;
  }

  function interpolateStates(fromState, toState, t) {
    const out = {
      act: toState.act,
      logoScale: lerp(fromState.logoScale, toState.logoScale, t),
      glowOutOpacity: lerp(fromState.glowOutOpacity, toState.glowOutOpacity, t),
      glowInOpacity: lerp(fromState.glowInOpacity, toState.glowInOpacity, t),
      outerSize: lerp(fromState.outerSize, toState.outerSize, t),
      innerSize: lerp(fromState.innerSize, toState.innerSize, t),
      ambientAlpha: lerp(fromState.ambientAlpha, toState.ambientAlpha, t),
      planets: {},
      realms: {},
      internalLines: [],
      realmLines: []
    };

    PLANETS.forEach((planet) => {
      const a = fromState.planets[planet.id];
      const b = toState.planets[planet.id];

      out.planets[planet.id] = {
        visible: a.visible || b.visible,
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t),
        z: lerp(a.z, b.z, t),
        scale: lerp(a.scale, b.scale, t),
        opacity: lerp(a.opacity, b.opacity, t),
        chaosNeutral: t < 0.5 ? a.chaosNeutral : b.chaosNeutral
      };
    });

    REALMS.forEach((realm) => {
      const a = fromState.realms[realm.id];
      const b = toState.realms[realm.id];

      out.realms[realm.id] = {
        visible: a.visible || b.visible,
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t),
        z: lerp(a.z, b.z, t),
        scale: lerp(a.scale, b.scale, t),
        opacity: lerp(a.opacity, b.opacity, t)
      };
    });

    internalLines.forEach(({ a, b }) => {
      const pa = out.planets[a];
      const pb = out.planets[b];
      const targetOpacity = Math.min(pa.opacity, pb.opacity) * 0.78;

      out.internalLines.push({
        a,
        b,
        x1: pa.x,
        y1: pa.y,
        x2: pb.x,
        y2: pb.y,
        opacity: targetOpacity
      });
    });

    realmLines.forEach(({ realmId }) => {
      const realm = out.realms[realmId];
      out.realmLines.push({
        realmId,
        x1: 0,
        y1: 0,
        x2: realm.x,
        y2: realm.y,
        opacity: realm.opacity * 0.72
      });
    });

    return out;
  }

  function applyVisualState(visual, metrics, mobile) {
    const pointerOffsetX = runtime.pointerX * 0.15;
    const pointerOffsetY = runtime.pointerY * 0.15;

    logoImg.style.transform =
      `translate(-50%, -50%) translate3d(${pointerOffsetX.toFixed(1)}px, ${pointerOffsetY.toFixed(1)}px, 0) scale(${visual.logoScale.toFixed(3)})`;

    glowOut.style.opacity = String(visual.glowOutOpacity);
    glowIn.style.opacity = String(visual.glowInOpacity);
    glowOut.style.width = `${visual.outerSize}px`;
    glowOut.style.height = `${visual.outerSize}px`;
    glowIn.style.width = `${visual.innerSize}px`;
    glowIn.style.height = `${visual.innerSize}px`;

    ambient.style.background =
      `radial-gradient(ellipse 70% 56% at 50% 50%, rgba(201,168,76,${visual.ambientAlpha.toFixed(3)}) 0%, transparent 74%)`;

    PLANETS.forEach((planet) => {
      const entry = visual.planets[planet.id];
      planet.el.style.opacity = String(entry.opacity);
      planet.el.style.transform =
        `translate3d(${entry.x.toFixed(1)}px, ${entry.y.toFixed(1)}px, ${entry.z.toFixed(1)}px) translate(-50%, -50%) scale(${entry.scale.toFixed(3)})`;
      setChaosNeutral(planet, entry.chaosNeutral);
    });

    REALMS.forEach((realm) => {
      const entry = visual.realms[realm.id];
      realm.el.style.opacity = String(entry.opacity);
      realm.el.style.transform =
        `translate3d(${entry.x.toFixed(1)}px, ${entry.y.toFixed(1)}px, ${entry.z.toFixed(1)}px) translate(-50%, -50%) scale(${entry.scale.toFixed(3)})`;
    });

    internalLines.forEach(({ line }, index) => {
      const entry = visual.internalLines[index];
      if (!entry) {
        line.style.opacity = '0';
        return;
      }

      setLine(
        line,
        metrics.cx + entry.x1,
        metrics.cy + entry.y1,
        metrics.cx + entry.x2,
        metrics.cy + entry.y2,
        entry.opacity
      );
    });

    realmLines.forEach(({ line }, index) => {
      const entry = visual.realmLines[index];
      if (!entry) {
        line.style.opacity = '0';
        return;
      }

      setLine(
        line,
        metrics.cx + entry.x1,
        metrics.cy + entry.y1,
        metrics.cx + entry.x2,
        metrics.cy + entry.y2,
        entry.opacity
      );
    });
  }

  function renderProgressMode() {
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

    let visual;

    if (act === 0) {
      visual = getVisualStateForAct(0, metrics, mobile, tablet, pointerX, pointerY);
    } else if (act === 1) {
      const from = getVisualStateForAct(0, metrics, mobile, tablet, pointerX, pointerY);
      const to = getVisualStateForAct(1, metrics, mobile, tablet, pointerX, pointerY);
      const t = easeOut(actProgress(progress, CONFIG.acts.coreEnd, CONFIG.acts.chaosEnd));
      visual = interpolateStates(from, to, t);
    } else if (act === 2) {
      const from = getVisualStateForAct(1, metrics, mobile, tablet, pointerX, pointerY);
      const to = getVisualStateForAct(2, metrics, mobile, tablet, pointerX, pointerY);
      const t = easeInOut(actProgress(progress, CONFIG.acts.chaosEnd, CONFIG.acts.coordEnd));
      visual = interpolateStates(from, to, t);
    } else if (act === 3) {
      const from = getVisualStateForAct(2, metrics, mobile, tablet, pointerX, pointerY);
      const to = getVisualStateForAct(3, metrics, mobile, tablet, pointerX, pointerY);
      const t = easeInOut(actProgress(progress, CONFIG.acts.coordEnd, CONFIG.acts.simplifyMoveEnd));
      visual = interpolateStates(from, to, t);
    } else if (act === 4) {
      const from = getVisualStateForAct(3, metrics, mobile, tablet, pointerX, pointerY);
      const to = getVisualStateForAct(4, metrics, mobile, tablet, pointerX, pointerY);
      const t = easeOut(actProgress(progress, CONFIG.acts.simplifyHoldEnd, CONFIG.acts.mergeEnd));
      visual = interpolateStates(from, to, t);
    } else {
      const from = getVisualStateForAct(4, metrics, mobile, tablet, pointerX, pointerY);
      const to = getVisualStateForAct(5, metrics, mobile, tablet, pointerX, pointerY);
      const t = easeOut(actProgress(progress, CONFIG.acts.mergeEnd, CONFIG.acts.resolveEnd));
      visual = interpolateStates(from, to, t);
    }

    applyVisualState(visual, metrics, mobile);

    void rx;
    void ry;
  }

  function renderHoldMode() {
    const metrics = frameMetrics();
    const mobile = isMobile();
    const tablet = isTablet();

    const pointerX = runtime.pointerX * (mobile ? 5 : 8);
    const pointerY = runtime.pointerY * (mobile ? 4 : 6);

    setCopy(runtime.holdAct);

    const visual = getVisualStateForAct(
      runtime.holdAct,
      metrics,
      mobile,
      tablet,
      pointerX,
      pointerY
    );

    applyVisualState(visual, metrics, mobile);
  }

  function renderTransitionMode() {
    const metrics = frameMetrics();
    const mobile = isMobile();
    const tablet = isTablet();

    const pointerX = runtime.pointerX * (mobile ? 5 : 8);
    const pointerY = runtime.pointerY * (mobile ? 4 : 6);

    const transition = runtime.transition;
    if (!transition) {
      renderHoldMode();
      return;
    }

    const eased = easeInOut(clamp(transition.t));

    const fromVisual = getVisualStateForAct(
      transition.fromAct,
      metrics,
      mobile,
      tablet,
      pointerX,
      pointerY
    );

    const toVisual = getVisualStateForAct(
      transition.toAct,
      metrics,
      mobile,
      tablet,
      pointerX,
      pointerY
    );

    const visual = interpolateStates(fromVisual, toVisual, eased);
    setCopy(eased < 0.5 ? transition.fromAct : transition.toAct);
    applyVisualState(visual, metrics, mobile);
  }

  function renderScene() {
    if (runtime.destroyed) return;

    runtime.time += 0.016;
    runtime.pointerX = lerp(runtime.pointerX, runtime.pointerTX, CONFIG.motion.pointerEase);
    runtime.pointerY = lerp(runtime.pointerY, runtime.pointerTY, CONFIG.motion.pointerEase);

    if (runtime.mode === 'transition') {
      renderTransitionMode();
      return;
    }

    if (runtime.mode === 'hold') {
      renderHoldMode();
      return;
    }

    renderProgressMode();
  }

  function tick() {
    renderScene();
    runtime.raf = window.requestAnimationFrame(tick);
  }

  function killTransitionTween() {
    if (transitionTween) {
      transitionTween.kill();
      transitionTween = null;
    }
  }

  function setProgress(progress) {
    killTransitionTween();
    runtime.mode = 'progress';
    runtime.transition = null;
    runtime.progress = clamp(progress);
  }

  function setHoldState(index) {
    killTransitionTween();
    runtime.mode = 'hold';
    runtime.transition = null;
    runtime.holdAct = Math.max(0, Math.min(ACT_TEXTS.length - 1, index));
  }

  function setAct(index) {
    setHoldState(index);
  }

  function playActTransition(fromAct, toAct, options = {}) {
    killTransitionTween();

    const safeFrom = Math.max(0, Math.min(ACT_TEXTS.length - 1, fromAct));
    const safeTo = Math.max(0, Math.min(ACT_TEXTS.length - 1, toAct));

    if (safeFrom === safeTo) {
      setHoldState(safeTo);
      return Promise.resolve();
    }

    const key = `${safeFrom}-${safeTo}`;
    const duration = options.duration || CONFIG.transitionDurations[key] || 0.95;

    runtime.mode = 'transition';
    runtime.transition = {
      fromAct: safeFrom,
      toAct: safeTo,
      t: 0
    };

    return new Promise((resolve) => {
      transitionTween = gsap.to(runtime.transition, {
        t: 1,
        duration,
        ease: 'power2.inOut',
        onComplete: () => {
          transitionTween = null;
          runtime.transition = null;
          runtime.mode = 'hold';
          runtime.holdAct = safeTo;
          resolve();
        }
      });
    });
  }

  function reset() {
    killTransitionTween();
    runtime.progress = 0;
    runtime.mode = 'progress';
    runtime.holdAct = 0;
    runtime.transition = null;
    runtime.pointerX = 0;
    runtime.pointerY = 0;
    runtime.pointerTX = 0;
    runtime.pointerTY = 0;
    runtime.time = 0;

    gsap.set(layer, { opacity: 0 });
    setCopy(0);
  }

  function destroy() {
    if (runtime.destroyed) return;
    runtime.destroyed = true;

    killTransitionTween();

    if (runtime.raf) {
      window.cancelAnimationFrame(runtime.raf);
      runtime.raf = 0;
    }

    scene.removeEventListener('pointermove', onPointerMove);
    scene.removeEventListener('pointerleave', onPointerLeave);
  }

  buildSceneGraph();

  setCopy(0);
  gsap.set(layer, { opacity: 0 });

  scene.addEventListener('pointermove', onPointerMove);
  scene.addEventListener('pointerleave', onPointerLeave);

  runtime.raf = window.requestAnimationFrame(tick);

  return {
    layer,
    scene,
    setProgress,
    setAct,
    setHoldState,
    playActTransition,
    update(progress) {
      setProgress(progress);
    },
    reset,
    destroy
  };
}