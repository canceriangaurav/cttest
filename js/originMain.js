import { initOriginHero } from './modules/originHero.js';
import { initOriginScene2 } from './modules/originScene2.js';
import { initProjectorScene } from './modules/projector-scene.js';
import { initOrbitScene } from './modules/orbit-scene.js';

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('OriginMain: GSAP or ScrollTrigger not available.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const debugFill = document.getElementById('originScrollProgressFill');
  const debugOverall = document.getElementById('originScrollOverall');
  const debugScene = document.getElementById('originScrollScene');
  const debugSceneValue = document.getElementById('originScrollSceneValue');
  const debugPhase = document.getElementById('originScrollPhase');

  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const toPercent = (v) => `${Math.round(clamp01(v) * 100)}%`;
  const originAudio = () => window.__chronotalesAudio || null;

  function updateDebug({
    overall = 0,
    sceneLabel = 'Scene 1',
    sceneProgress = 0,
    phase = 'Intro'
  }) {
    if (debugFill) debugFill.style.transform = `scaleY(${clamp01(overall)})`;
    if (debugOverall) debugOverall.textContent = toPercent(overall);
    if (debugScene) debugScene.textContent = sceneLabel;
    if (debugSceneValue) debugSceneValue.textContent = toPercent(sceneProgress);
    if (debugPhase) debugPhase.textContent = phase;
  }

  const heroModule = initOriginHero();
  const scene2Module = initOriginScene2();
  const scene3Module = initProjectorScene();
  const scene4Module = initOrbitScene();

  if (!heroModule || !scene2Module || !scene3Module || !scene4Module) {
    console.warn('OriginMain: Scene modules failed to initialize.');
    return;
  }

  const { scene, hero } = heroModule;

  const {
    layer: scene2Layer,
    fade,
    updateReveal: updateScene2Reveal,
    updateActs: updateScene2Acts
  } = scene2Module;

  const {
    layer: scene3Layer,
    updateReveal: updateScene3Reveal,
    updateActs: updateScene3Acts
  } = scene3Module;

  const {
    layer: scene4Layer,
    update: updateScene4
  } = scene4Module;

  gsap.set(hero, { opacity: 1 });
  gsap.set(fade, { opacity: 0 });
  gsap.set(scene2Layer, { opacity: 0 });
  gsap.set(scene3Layer, { opacity: 0 });
  gsap.set(scene4Layer, { opacity: 0 });

  ScrollTrigger.create({
    trigger: scene,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.6,
    fastScrollEnd: true,
    onUpdate: (self) => {
      const p = clamp01(self.progress);

      // -----------------------------------
      // 0.00 -> 0.20 : Scene 1
      // -----------------------------------
      if (p <= 0.20) {
        const local = clamp01(p / 0.20);

        heroModule.update(local);

        gsap.set(hero, { opacity: 1 });
        gsap.set(fade, { opacity: 0 });
        gsap.set(scene2Layer, { opacity: 0 });
        gsap.set(scene3Layer, { opacity: 0 });
        gsap.set(scene4Layer, { opacity: 0 });

        let phase = 'Scene 1 hold';
        if (local >= 0.18 && local < 0.60) phase = 'Scene 1 release';
        else if (local >= 0.60) phase = 'Scene 1 pre-handoff';

        updateDebug({
          overall: p,
          sceneLabel: 'Scene 1',
          sceneProgress: local,
          phase
        });

        originAudio()?.syncScene1(local, phase);
        return;
      }

      // -----------------------------------
// 0.20 -> 0.30 : Scene 1 -> Scene 2 handoff
// Scene 2 starts appearing underneath fade
// -----------------------------------
if (p <= 0.30) {
  const local = clamp01((p - 0.20) / 0.10);

  heroModule.update(1);

  gsap.set(hero, { opacity: 1 - local });
  gsap.set(fade, { opacity: 0.85 * local });
  gsap.set(scene2Layer, { opacity: local });
  gsap.set(scene3Layer, { opacity: 0 });
  gsap.set(scene4Layer, { opacity: 0 });

  updateScene2Reveal(clamp01(local * 0.75));

  updateDebug({
    overall: p,
    sceneLabel: 'Scene 1-2',
    sceneProgress: local,
    phase: 'Transition handoff'
  });

  originAudio()?.setScene('Scene 1');
  return;
}

      // -----------------------------------
      // 0.28 -> 0.56 : Scene 2
      // -----------------------------------
      if (p <= 0.56) {
        const scene2Progress = clamp01((p - 0.30) / 0.22);

        gsap.set(hero, { opacity: 0 });
        gsap.set(fade, { opacity: 0 });
        gsap.set(scene2Layer, { opacity: 1 });
        gsap.set(scene3Layer, { opacity: 0 });
        gsap.set(scene4Layer, { opacity: 0 });

        const revealWindow = 0.12;
        const revealProgress = clamp01(scene2Progress / revealWindow);
        updateScene2Reveal(revealProgress);

        let phase = 'TV reveal';

        if (scene2Progress > revealWindow) {
          const actsProgress = clamp01(
            (scene2Progress - revealWindow) / (1 - revealWindow)
          );

          updateScene2Acts(actsProgress);

          phase = 'TV settle';
          if (actsProgress >= 0.18 && actsProgress < 0.42) phase = 'Act 1-2';
          else if (actsProgress >= 0.42 && actsProgress < 0.66) phase = 'Act 3-4';
          else if (actsProgress >= 0.66) phase = 'Act 5-6';
        }

        updateDebug({
          overall: p,
          sceneLabel: 'Scene 2',
          sceneProgress: scene2Progress,
          phase
        });

        originAudio()?.syncScene2(scene2Progress, phase);
        return;
      }

      // -----------------------------------
      // 0.56 -> 0.62 : Scene 2 hold
      // -----------------------------------
      if (p <= 0.58) {
        gsap.set(hero, { opacity: 0 });
        gsap.set(fade, { opacity: 0 });
        gsap.set(scene2Layer, { opacity: 1 });
        gsap.set(scene3Layer, { opacity: 0 });
        gsap.set(scene4Layer, { opacity: 0 });

        updateScene2Reveal(1);
        updateScene2Acts(1);

        updateDebug({
          overall: p,
          sceneLabel: 'Scene 2',
          sceneProgress: 1,
          phase: 'Hold'
        });

        originAudio()?.syncScene2(1, 'Hold');
        return;
      }

      // -----------------------------------
      // 0.62 -> 0.70 : Scene 3 reveal
      // -----------------------------------
      if (p <= 0.66) {
        const local = clamp01((p - 0.58) / 0.08);

        gsap.set(hero, { opacity: 0 });
        gsap.set(fade, { opacity: 0 });
        gsap.set(scene2Layer, { opacity: 1 - local });
        gsap.set(scene3Layer, { opacity: local });
        gsap.set(scene4Layer, { opacity: 0 });

        updateScene2Reveal(1);
        updateScene2Acts(1);
        updateScene3Reveal(local);

        updateDebug({
          overall: p,
          sceneLabel: 'Scene 3',
          sceneProgress: local,
          phase: 'Projector reveal'
        });

        originAudio()?.syncScene3(local * 0.12, 'Projector reveal');
        return;
      }

      // -----------------------------------
      // 0.70 -> 0.82 : Scene 3 acts
      // -----------------------------------
      if (p <= 0.76) {
        const scene3Progress = clamp01((p - 0.66) / 0.10);

        gsap.set(hero, { opacity: 0 });
        gsap.set(fade, { opacity: 0 });
        gsap.set(scene2Layer, { opacity: 0 });
        gsap.set(scene3Layer, { opacity: 1 });
        gsap.set(scene4Layer, { opacity: 0 });

        updateScene3Reveal(1);
        updateScene3Acts(scene3Progress);

        let phase = 'Act 1';
        if (scene3Progress >= 0.14 && scene3Progress < 0.30) phase = 'Act 2';
        else if (scene3Progress >= 0.30 && scene3Progress < 0.48) phase = 'Act 3';
        else if (scene3Progress >= 0.48 && scene3Progress < 0.68) phase = 'Act 4';
        else if (scene3Progress >= 0.68 && scene3Progress < 0.84) phase = 'Act 5';
        else if (scene3Progress >= 0.84) phase = 'Act 6';

        updateDebug({
          overall: p,
          sceneLabel: 'Scene 3',
          sceneProgress: scene3Progress,
          phase
        });

        originAudio()?.syncScene3(scene3Progress, phase);
        return;
      }

 // -----------------------------------
// 0.82 -> 0.88 : HARD HANDOFF (NO OVERLAP)
// -----------------------------------
if (p <= 0.82) {
  const local = clamp01((p - 0.76) / 0.06);

  gsap.set(scene3Layer, { opacity: 1 - local * 1.2 }); // faster fade out
  gsap.set(scene4Layer, { opacity: local > 0.9 ? 1 : 0 }); // delayed entry

  updateScene3Reveal(1);
  updateScene3Acts(1);

  updateScene4(0); // HOLD at Act 1

  updateDebug({
    overall: p,
    sceneLabel: 'Scene 3-4',
    sceneProgress: local,
    phase: 'Black transition'
  });

  return;
}

      // -----------------------------------
      // 0.86 -> 1.00 : Scene 4
      // -----------------------------------
      const scene4Progress = clamp01((p - 0.82) / 0.18);

      gsap.set(hero, { opacity: 0 });
      gsap.set(fade, { opacity: 0 });
      gsap.set(scene2Layer, { opacity: 0 });
      gsap.set(scene3Layer, { opacity: 0 });
      gsap.set(scene4Layer, { opacity: 1 });

      updateScene4(scene4Progress);

      let phase = 'Act 1 — Core';
      if (scene4Progress >= 0.16 && scene4Progress < 0.34) phase = 'Act 2 — Chaos';
      else if (scene4Progress >= 0.34 && scene4Progress < 0.56) phase = 'Act 3 — Coordination begins';
      else if (scene4Progress >= 0.56 && scene4Progress < 0.76) phase = 'Act 4 — System simplifies';
      else if (scene4Progress >= 0.76 && scene4Progress < 0.90) phase = 'Act 5 — One brand';
      else if (scene4Progress >= 0.90) phase = 'Act 6 — Brand resolve';

      updateDebug({
        overall: p,
        sceneLabel: 'Scene 4',
        sceneProgress: scene4Progress,
        phase
      });

      if (originAudio()?.syncScene4) {
        originAudio().syncScene4(scene4Progress, phase);
      }
    }
  });

  updateDebug({
    overall: 0,
    sceneLabel: 'Scene 1',
    sceneProgress: 0,
    phase: 'Intro'
  });

  ScrollTrigger.refresh();
});