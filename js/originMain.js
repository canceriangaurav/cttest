import { initOriginHero } from './modules/originHero.js';
import { initOriginScene2 } from './modules/originScene2.js';
import { initProjectorScene } from './modules/projector-scene.js';
import { initOrbitScene } from './modules/orbit-scene.js';
import { initOriginScene5 } from './modules/originScene5.js';

function bootOrigin() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.warn('OriginMain: Browser environment not available.');
    return;
  }

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('OriginMain: GSAP or ScrollTrigger not available.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const clamp01 = (value) => Math.max(0, Math.min(1, value));

  const mapRange = (value, inMin, inMax) => {
    if (inMax <= inMin) return 0;
    return clamp01((value - inMin) / (inMax - inMin));
  };

  const lerp = (a, b, t) => a + ((b - a) * t);

  const smoothstep = (t) => {
    const p = clamp01(t);
    return p * p * (3 - (2 * p));
  };

  const originAudio = () => window.__chronotalesAudio || null;

  const debugScene = document.getElementById('originScrollScene');
  const debugPhase = document.getElementById('originScrollPhase');
  const debugFill = document.getElementById('originScrollFill');

  function updateDebug({
    overall = 0,
    sceneLabel = 'Scene 1',
    phase = 'Intro'
  }) {
    if (debugScene) debugScene.textContent = sceneLabel;
    if (debugPhase) debugPhase.textContent = phase;
    if (debugFill) {
      debugFill.style.transform = `scaleY(${clamp01(overall)})`;
    }
  }

  const heroModule = initOriginHero();
  const scene2Module = initOriginScene2();
  const scene3Module = initProjectorScene();
  const scene4Module = initOrbitScene();
  const scene5Module = initOriginScene5();

  if (!heroModule || !scene2Module || !scene3Module || !scene4Module || !scene5Module) {
    console.warn('OriginMain: Scene modules failed to initialize.');
    return;
  }

  const { scene, hero } = heroModule;

  const {
    layer: scene2Layer,
    fade,
    updateReveal: updateScene2Reveal,
    updateActs: updateScene2Acts,
    reset: resetScene2
  } = scene2Module;

  const {
    layer: scene3Layer,
    updateReveal: updateScene3Reveal,
    updateActs: updateScene3Acts,
    reset: resetScene3
  } = scene3Module;

  const {
    layer: scene4Layer,
    update: updateScene4,
    reset: resetScene4
  } = scene4Module;

  const {
    layer: scene5Layer,
    update: updateScene5,
    reset: resetScene5
  } = scene5Module;

  const visibilityState = {
    hero: null,
    fade: null,
    scene2: null,
    scene3: null,
    scene4: null,
    scene5: null
  };

  function setOpacity(target, key, value) {
    const safeValue = clamp01(value);
    if (visibilityState[key] === safeValue) return;
    visibilityState[key] = safeValue;
    gsap.set(target, { opacity: safeValue });
  }

  function setLayerState({
    heroOpacity = 0,
    fadeOpacity = 0,
    scene2Opacity = 0,
    scene3Opacity = 0,
    scene4Opacity = 0,
    scene5Opacity = 0
  }) {
    setOpacity(hero, 'hero', heroOpacity);
    setOpacity(fade, 'fade', fadeOpacity);
    setOpacity(scene2Layer, 'scene2', scene2Opacity);
    setOpacity(scene3Layer, 'scene3', scene3Opacity);
    setOpacity(scene4Layer, 'scene4', scene4Opacity);
    setOpacity(scene5Layer, 'scene5', scene5Opacity);
  }

  function resetAllScenes() {
    heroModule.reset?.();
    resetScene2?.();
    resetScene3?.();
    resetScene4?.();
    resetScene5?.();

    setLayerState({
      heroOpacity: 1,
      fadeOpacity: 0,
      scene2Opacity: 0,
      scene3Opacity: 0,
      scene4Opacity: 0,
      scene5Opacity: 0
    });
  }

  function getScene1Phase(progress) {
    const p = clamp01(progress);
    if (p < 0.20) return 'Act 1 — Hourglass hold';
    if (p < 0.45) return 'Act 2 — Text entry';
    if (p < 0.82) return 'Act 3 — Sequence + zoom out';
    return 'Act 4 — Text exit / handoff';
  }

  function getScene2Phase(progress) {
    const p = clamp01(progress);
    if (p < 0.18) return 'Act 1 — A signal appears';
    if (p < 0.38) return 'Act 2 — It begins to move';
    if (p < 0.60) return 'Act 3 — It takes form';
    if (p < 0.82) return 'Act 4 — It becomes time';
    return 'Act 5 — This is Chronotales';
  }

  function getScene3Phase(progress) {
    const p = clamp01(progress);
    if (p < 0.34) return 'Act 1';
    if (p < 0.48) return 'Act 2';
    if (p < 0.60) return 'Act 3';
    if (p < 0.74) return 'Act 4';
    if (p < 0.84) return 'Act 5';
    return 'Act 6';
  }

  function getScene4Phase(progress) {
    const p = clamp01(progress);
    if (p < 0.23) return 'Act 1 — One vision';
    if (p < 0.43) return 'Act 2 — Many moving parts';
    if (p < 0.65) return 'Act 3 — Coordination begins';
    if (p < 0.80) return 'Act 4 — System simplifies';
    if (p < 0.90) return 'Act 5 — One brand';
    return 'Act 6 — Brand resolve';
  }

  function getScene5Phase(progress) {
    const p = clamp01(progress);
    if (p < 0.18) return 'Act 1 — Less managing';
    if (p < 0.36) return 'Act 2 — One brand everywhere';
    if (p < 0.54) return 'Act 3 — Clarity in every move';
    if (p < 0.72) return 'Act 4 — Scale without breaking';
    if (p < 0.84) return 'Act 5 — One brain. One brand. Zero chaos';
    return 'Act 6 — Proof';
  }

  function remapWithHoldBands(local, stops, holdStrength = 0.18) {
    const p = clamp01(local);
    const safeStops = [0, ...stops.filter((n) => n > 0 && n < 1), 1];

    const weightedLengths = [];
    let total = 0;

    for (let i = 0; i < safeStops.length - 1; i += 1) {
      const a = safeStops[i];
      const b = safeStops[i + 1];
      const length = b - a;
      const weight = 1 + holdStrength;
      const weighted = length * weight;

      weightedLengths.push({
        inStart: a,
        inEnd: b,
        outLength: weighted
      });

      total += weighted;
    }

    let cursor = 0;
    for (let i = 0; i < weightedLengths.length; i += 1) {
      const seg = weightedLengths[i];
      seg.outStart = cursor / total;
      cursor += seg.outLength;
      seg.outEnd = cursor / total;
    }

    for (let i = 0; i < weightedLengths.length; i += 1) {
      const seg = weightedLengths[i];
      if (p <= seg.outEnd || i === weightedLengths.length - 1) {
        const t = smoothstep(mapRange(p, seg.outStart, seg.outEnd));
        return lerp(seg.inStart, seg.inEnd, t);
      }
    }

    return 1;
  }

  function remapScene1Progress(local) {
    return remapWithHoldBands(local, [0.20, 0.45, 0.82], 0.24);
  }

  function remapScene2Progress(local) {
    return remapWithHoldBands(local, [0.18, 0.38, 0.60, 0.82], 0.22);
  }

  function remapScene3Progress(local) {
    return remapWithHoldBands(local, [0.34, 0.48, 0.60, 0.74, 0.84], 0.20);
  }

  function remapScene4Progress(local) {
    return remapWithHoldBands(local, [0.23, 0.43, 0.65, 0.73, 0.80, 0.90], 0.22);
  }

  function remapScene5Progress(local) {
    return remapWithHoldBands(local, [0.18, 0.36, 0.54, 0.72, 0.84], 0.20);
  }

  function renderScene1(masterProgress, localProgress) {
    const p = remapScene1Progress(localProgress);
    heroModule.update?.(p);

    setLayerState({
      heroOpacity: 1,
      fadeOpacity: 0,
      scene2Opacity: 0,
      scene3Opacity: 0,
      scene4Opacity: 0,
      scene5Opacity: 0
    });

    const phase = getScene1Phase(p);
    updateDebug({ overall: masterProgress, sceneLabel: 'Scene 1', phase });
    originAudio()?.syncScene1?.(p, phase);
  }

  function renderScene2(masterProgress, localProgress) {
    const p = remapScene2Progress(localProgress);
    const reveal = smoothstep(mapRange(p, 0.00, 0.18));
    const crossfade = smoothstep(mapRange(localProgress, 0.00, 0.12));
    const fadeOverlay = mapRange(localProgress, 0.00, 0.10) * 0.32;

    heroModule.update?.(1);
    updateScene2Reveal?.(reveal);
    updateScene2Acts?.(p);

    setLayerState({
      heroOpacity: 1 - crossfade,
      fadeOpacity: fadeOverlay,
      scene2Opacity: crossfade,
      scene3Opacity: 0,
      scene4Opacity: 0,
      scene5Opacity: 0
    });

    const phase = getScene2Phase(p);
    updateDebug({ overall: masterProgress, sceneLabel: 'Scene 2', phase });
    originAudio()?.syncScene2?.(p, phase);
  }

  function renderScene3(masterProgress, localProgress) {
    const p = remapScene3Progress(localProgress);
    const reveal = smoothstep(mapRange(p, 0.00, 0.18));
    const crossfade = smoothstep(mapRange(localProgress, 0.00, 0.12));

    heroModule.update?.(1);
    updateScene2Reveal?.(1);
    updateScene2Acts?.(1);
    updateScene3Reveal?.(reveal);
    updateScene3Acts?.(p);

    setLayerState({
      heroOpacity: 0,
      fadeOpacity: 0,
      scene2Opacity: 1 - crossfade,
      scene3Opacity: crossfade,
      scene4Opacity: 0,
      scene5Opacity: 0
    });

    const phase = getScene3Phase(p);
    updateDebug({ overall: masterProgress, sceneLabel: 'Scene 3', phase });
    originAudio()?.syncScene3?.(p, phase);
  }

  function renderScene4(masterProgress, localProgress) {
    const p = remapScene4Progress(localProgress);
    const crossfade = smoothstep(mapRange(localProgress, 0.00, 0.14));

    heroModule.update?.(1);
    updateScene2Reveal?.(1);
    updateScene2Acts?.(1);
    updateScene3Reveal?.(1);
    updateScene3Acts?.(1);
    updateScene4?.(p);

    setLayerState({
      heroOpacity: 0,
      fadeOpacity: 0,
      scene2Opacity: 0,
      scene3Opacity: 1 - crossfade,
      scene4Opacity: crossfade,
      scene5Opacity: 0
    });

    const phase = getScene4Phase(p);
    updateDebug({ overall: masterProgress, sceneLabel: 'Scene 4', phase });
    originAudio()?.syncScene4?.(p, phase);
  }

  function renderScene5(masterProgress, localProgress) {
    const p = remapScene5Progress(localProgress);
    const crossfade = smoothstep(mapRange(localProgress, 0.00, 0.14));

    heroModule.update?.(1);
    updateScene2Reveal?.(1);
    updateScene2Acts?.(1);
    updateScene3Reveal?.(1);
    updateScene3Acts?.(1);
    updateScene4?.(1);
    updateScene5?.(p);

    setLayerState({
      heroOpacity: 0,
      fadeOpacity: 0,
      scene2Opacity: 0,
      scene3Opacity: 0,
      scene4Opacity: 1 - crossfade,
      scene5Opacity: crossfade
    });

    const phase = getScene5Phase(p);
    updateDebug({ overall: masterProgress, sceneLabel: 'Scene 5', phase });
    originAudio()?.syncScene5?.(p, phase);
  }

  const LEGACY_SCROLL = 6000;
  const SCENE5_SCROLL = 2400;
  const TOTAL_SCROLL = LEGACY_SCROLL + SCENE5_SCROLL;

  const PX_SCENE_1_START = 0;
  const PX_SCENE_1_END = 1200;

  const PX_SCENE_2_START = 1200;
  const PX_SCENE_2_END = 2520;

  const PX_SCENE_3_START = 2520;
  const PX_SCENE_3_END = 4080;

  const PX_SCENE_4_START = 4080;
  const PX_SCENE_4_END = 6000;

  const PX_SCENE_5_START = 6000;
  const PX_SCENE_5_END = 8400;

  function renderMasterByPixels(masterPx) {
    const px = Math.max(0, Math.min(TOTAL_SCROLL, masterPx));
    const masterProgress = clamp01(px / TOTAL_SCROLL);

    if (px <= PX_SCENE_1_END) {
      renderScene1(masterProgress, mapRange(px, PX_SCENE_1_START, PX_SCENE_1_END));
      return;
    }

    if (px <= PX_SCENE_2_END) {
      renderScene2(masterProgress, mapRange(px, PX_SCENE_2_START, PX_SCENE_2_END));
      return;
    }

    if (px <= PX_SCENE_3_END) {
      renderScene3(masterProgress, mapRange(px, PX_SCENE_3_START, PX_SCENE_3_END));
      return;
    }

    if (px <= PX_SCENE_4_END) {
      renderScene4(masterProgress, mapRange(px, PX_SCENE_4_START, PX_SCENE_4_END));
      return;
    }

    renderScene5(masterProgress, mapRange(px, PX_SCENE_5_START, PX_SCENE_5_END));
  }

  let masterTrigger = null;
  let startupReady = false;
  let startupSyncRaf1 = null;
  let startupSyncRaf2 = null;
  let startupSyncTimeout = null;

  function syncToCurrentScroll() {
    if (!masterTrigger) return;

    ScrollTrigger.update();

    setLayerState({
      heroOpacity: 0,
      fadeOpacity: 0,
      scene2Opacity: 0,
      scene3Opacity: 0,
      scene4Opacity: 0,
      scene5Opacity: 0
    });

    const masterPx = (masterTrigger.progress || 0) * TOTAL_SCROLL;
    renderMasterByPixels(masterPx);
  }

  function destroyMasterScroll() {
    if (masterTrigger) {
      masterTrigger.kill();
      masterTrigger = null;
    }
  }

  function createMasterScroll() {
    destroyMasterScroll();

    masterTrigger = ScrollTrigger.create({
      trigger: scene,
      start: 'top top',
      end: `+=${TOTAL_SCROLL}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const masterPx = self.progress * TOTAL_SCROLL;
        renderMasterByPixels(masterPx);
      }
    });
  }

  function initCtaReveal() {
    const cta = document.getElementById('ctCta');
    const headline = document.getElementById('ctCtaHeadline');
    const subtext = document.getElementById('ctCtaSubtext');
    const actions = document.getElementById('ctCtaActions');

    const glow = document.getElementById('ctCtaGlow');
    const grid = document.getElementById('ctCtaGrid');
    const orb = document.getElementById('ctCtaOrb');

    if (!cta || !headline || !subtext || !actions) return;

    gsap.set([headline, subtext], {
      opacity: 0,
      y: 30
    });

    gsap.set(actions.children, {
      opacity: 0,
      y: 20
    });

    if (glow) {
      gsap.set(glow, {
        opacity: 0,
        scale: 0.82
      });
    }

    if (grid) {
      gsap.set(grid, {
        opacity: 0,
        y: 18
      });
    }

    if (orb) {
      gsap.set(orb, {
        opacity: 0,
        scale: 0.7,
        rotate: -10
      });
    }

    ScrollTrigger.create({
      trigger: cta,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        if (glow) {
          gsap.to(glow, {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out'
          });
        }

        if (grid) {
          gsap.to(grid, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out'
          });
        }

        if (orb) {
          gsap.to(orb, {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 1.1,
            ease: 'power3.out'
          });

          gsap.to(orb, {
            y: '-=10',
            duration: 2.4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1.1
          });
        }

        gsap.to(headline, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out'
        });

        gsap.to(subtext, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.12,
          ease: 'power3.out'
        });

        gsap.to(actions.children, {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          delay: 0.24,
          ease: 'power3.out'
        });
      }
    });
  }

  function bootMasterScroll() {
    if (startupReady) return;
    startupReady = true;

    const restoreY = window.scrollY || window.pageYOffset || 0;

    destroyMasterScroll();
    resetAllScenes();

    startupSyncTimeout = window.setTimeout(() => {
      createMasterScroll();

      startupSyncRaf1 = requestAnimationFrame(() => {
        ScrollTrigger.refresh();

        startupSyncRaf2 = requestAnimationFrame(() => {
          window.scrollTo(0, restoreY);
          ScrollTrigger.update();
          syncToCurrentScroll();

          window.setTimeout(() => {
            window.scrollTo(0, restoreY);
            ScrollTrigger.refresh();
            syncToCurrentScroll();
          }, 60);
        });
      });
    }, 120);
  }

  resetAllScenes();
  initCtaReveal();

  ScrollTrigger.addEventListener('refreshInit', () => {
    setLayerState({
      heroOpacity: 0,
      fadeOpacity: 0,
      scene2Opacity: 0,
      scene3Opacity: 0,
      scene4Opacity: 0,
      scene5Opacity: 0
    });
  });

  ScrollTrigger.addEventListener('refresh', () => {
    syncToCurrentScroll();
  });

 function safeBootMasterScroll() {
  if (startupReady) return;
  bootMasterScroll();
}

// Run immediately if page already loaded
if (document.readyState === 'complete') {
  safeBootMasterScroll();
} else {
  window.addEventListener('load', safeBootMasterScroll, { once: true });
}

// Handle back/forward cache
window.addEventListener('pageshow', safeBootMasterScroll);

  window.addEventListener('resize', () => {
    if (!masterTrigger) return;
    ScrollTrigger.refresh();
  });

  window.addEventListener('beforeunload', () => {
    if (startupSyncTimeout) window.clearTimeout(startupSyncTimeout);
    if (startupSyncRaf1) cancelAnimationFrame(startupSyncRaf1);
    if (startupSyncRaf2) cancelAnimationFrame(startupSyncRaf2);
    destroyMasterScroll();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootOrigin, { once: true });
} else {
  bootOrigin();
}