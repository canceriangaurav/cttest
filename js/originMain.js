import { initOriginHero } from './modules/originHero.js';
import { initOriginScene2 } from './modules/originScene2.js';
import { initProjectorScene } from './modules/projector-scene.js';
import { initOrbitScene } from './modules/orbit-scene.js';

document.addEventListener('DOMContentLoaded', () => {
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
  const originAudio = () => window.__chronotalesAudio || null;

  const debugScene = document.getElementById('originScrollScene');
  const debugPhase = document.getElementById('originScrollPhase');

  function updateDebug({
    sceneLabel = 'Scene 1',
    phase = 'Intro'
  }) {
    if (debugScene) debugScene.textContent = sceneLabel;
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
    setAct: setScene2Act,
    reset: resetScene2
  } = scene2Module;

  const {
    layer: scene3Layer,
    updateReveal: updateScene3Reveal,
    setAct: setScene3Act,
    reset: resetScene3
  } = scene3Module;

  const {
    layer: scene4Layer,
    setHoldState: setScene4HoldState,
    playActTransition: playScene4ActTransition,
    reset: resetScene4
  } = scene4Module;

  const visibilityState = {
    hero: null,
    fade: null,
    scene2: null,
    scene3: null,
    scene4: null
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
    scene4Opacity = 0
  }) {
    setOpacity(hero, 'hero', heroOpacity);
    setOpacity(fade, 'fade', fadeOpacity);
    setOpacity(scene2Layer, 'scene2', scene2Opacity);
    setOpacity(scene3Layer, 'scene3', scene3Opacity);
    setOpacity(scene4Layer, 'scene4', scene4Opacity);
  }

  function resetAllScenes() {
    heroModule.reset?.();
    resetScene2?.();
    resetScene3?.();
    resetScene4?.();
  }

  const state = {
    currentStep: 0,
    isAnimating: false,
    isPinnedActive: false,
    scene1Unlocked: false,
    touchStartY: 0,
    touchLocked: false,
    wheelCooldownUntil: 0,
    scene1Progress: 0
  };

  const WHEEL_THRESHOLD = 18;
  const TOUCH_THRESHOLD = 40;
  const WHEEL_COOLDOWN_MS = 620;

  function getScene1Phase(progress) {
    const p = clamp01(progress);
    if (p < 0.20) return 'Hourglass hold';
    if (p < 0.45) return 'Text entry';
    if (p < 0.82) return 'Sequence + zoom out';
    return 'Text exit / handoff';
  }

  function renderScene1(progress) {
    const p = clamp01(progress);
    state.scene1Progress = p;

    heroModule.update?.(p);

    setLayerState({
      heroOpacity: 1,
      fadeOpacity: 0,
      scene2Opacity: 0,
      scene3Opacity: 0,
      scene4Opacity: 0
    });

    const phase = getScene1Phase(p);

    updateDebug({
      sceneLabel: 'Scene 1',
      phase
    });

    originAudio()?.syncScene1?.(p, phase);
  }

  const STEPS = [
    {
      id: 'scene12_handoff',
      sceneLabel: 'Scene 1-2',
      phase: 'Transition handoff',
      overall: 0.25,
      sceneProgress: 0.50,
      async apply() {
        heroModule.update?.(1);
        updateScene2Reveal(0.72);

        setLayerState({
          heroOpacity: 0.45,
          fadeOpacity: 0.55,
          scene2Opacity: 0.55,
          scene3Opacity: 0,
          scene4Opacity: 0
        });
      }
    },
    {
      id: 'scene2_reveal',
      sceneLabel: 'Scene 2',
      phase: 'TV reveal',
      overall: 0.32,
      sceneProgress: 0.08,
      async apply() {
        updateScene2Reveal(1);
        setScene2Act(0, { immediate: true });

        setLayerState({
          heroOpacity: 0,
          fadeOpacity: 0,
          scene2Opacity: 1,
          scene3Opacity: 0,
          scene4Opacity: 0
        });

        originAudio()?.syncScene2?.(0.08, 'TV reveal');
      }
    },
    {
      id: 'scene2_act1',
      sceneLabel: 'Scene 2',
      phase: 'Act 1',
      overall: 0.38,
      sceneProgress: 0.20,
      async apply() {
        updateScene2Reveal(1);
        setScene2Act(0);

        setLayerState({
          heroOpacity: 0,
          fadeOpacity: 0,
          scene2Opacity: 1,
          scene3Opacity: 0,
          scene4Opacity: 0
        });

        originAudio()?.syncScene2?.(0.20, 'Act 1');
      }
    },
    {
      id: 'scene2_act2',
      sceneLabel: 'Scene 2',
      phase: 'Act 2',
      overall: 0.42,
      sceneProgress: 0.38,
      async apply() {
        updateScene2Reveal(1);
        setScene2Act(1);

        setLayerState({
          heroOpacity: 0,
          fadeOpacity: 0,
          scene2Opacity: 1,
          scene3Opacity: 0,
          scene4Opacity: 0
        });

        originAudio()?.syncScene2?.(0.38, 'Act 2');
      }
    },
    {
      id: 'scene2_act3',
      sceneLabel: 'Scene 2',
      phase: 'Act 3',
      overall: 0.46,
      sceneProgress: 0.56,
      async apply() {
        updateScene2Reveal(1);
        setScene2Act(2);

        setLayerState({
          heroOpacity: 0,
          fadeOpacity: 0,
          scene2Opacity: 1,
          scene3Opacity: 0,
          scene4Opacity: 0
        });

        originAudio()?.syncScene2?.(0.56, 'Act 3');
      }
    },
    {
      id: 'scene2_act4',
      sceneLabel: 'Scene 2',
      phase: 'Act 4',
      overall: 0.50,
      sceneProgress: 0.76,
      async apply() {
        updateScene2Reveal(1);
        setScene2Act(3);

        setLayerState({
          heroOpacity: 0,
          fadeOpacity: 0,
          scene2Opacity: 1,
          scene3Opacity: 0,
          scene4Opacity: 0
        });

        originAudio()?.syncScene2?.(0.76, 'Act 4');
      }
    },
    {
      id: 'scene2_act5',
      sceneLabel: 'Scene 2',
      phase: 'Act 5',
      overall: 0.56,
      sceneProgress: 1,
      async apply() {
        updateScene2Reveal(1);
        setScene2Act(4);

        setLayerState({
          heroOpacity: 0,
          fadeOpacity: 0,
          scene2Opacity: 1,
          scene3Opacity: 0,
          scene4Opacity: 0
        });

        originAudio()?.syncScene2?.(1, 'Act 5');
      }
    },
    {
      id: 'scene3_reveal',
      sceneLabel: 'Scene 3',
      phase: 'Projector reveal',
      overall: 0.62,
      sceneProgress: 0.06,
      async apply() {
        updateScene2Reveal(1);
        setScene2Act(4, { immediate: true });
        updateScene3Reveal(0.75);
        setScene3Act(0, { immediate: true });

        setLayerState({
          heroOpacity: 0,
          fadeOpacity: 0,
          scene2Opacity: 0.0,
          scene3Opacity: 0.70,
          scene4Opacity: 0
        });

        originAudio()?.syncScene3?.(0.08, 'Projector reveal');
      }
    },
    {
      id: 'scene3_act1',
      sceneLabel: 'Scene 3',
      phase: 'Act 1',
      overall: 0.68,
      sceneProgress: 0.12,
      async apply() {
        updateScene3Reveal(1);
        setScene3Act(0);

        setLayerState({
          heroOpacity: 0,
          fadeOpacity: 0,
          scene2Opacity: 0,
          scene3Opacity: 1,
          scene4Opacity: 0
        });

        originAudio()?.syncScene3?.(0.12, 'Act 1');
      }
    },
    {
      id: 'scene3_act2',
      sceneLabel: 'Scene 3',
      phase: 'Act 2',
      overall: 0.70,
      sceneProgress: 0.34,
      async apply() {
        updateScene3Reveal(1);
        setScene3Act(1);

        setLayerState({
          heroOpacity: 0,
          fadeOpacity: 0,
          scene2Opacity: 0,
          scene3Opacity: 1,
          scene4Opacity: 0
        });

        originAudio()?.syncScene3?.(0.34, 'Act 2');
      }
    },
    {
      id: 'scene3_act3',
      sceneLabel: 'Scene 3',
      phase: 'Act 3',
      overall: 0.72,
      sceneProgress: 0.48,
      async apply() {
        updateScene3Reveal(1);
        setScene3Act(2);

        setLayerState({
          heroOpacity: 0,
          fadeOpacity: 0,
          scene2Opacity: 0,
          scene3Opacity: 1,
          scene4Opacity: 0
        });

        originAudio()?.syncScene3?.(0.48, 'Act 3');
      }
    },
    {
      id: 'scene3_act4',
      sceneLabel: 'Scene 3',
      phase: 'Act 4',
      overall: 0.74,
      sceneProgress: 0.60,
      async apply() {
        updateScene3Reveal(1);
        setScene3Act(3);

        setLayerState({
          heroOpacity: 0,
          fadeOpacity: 0,
          scene2Opacity: 0,
          scene3Opacity: 1,
          scene4Opacity: 0
        });

        originAudio()?.syncScene3?.(0.60, 'Act 4');
      }
    },
    {
      id: 'scene3_act5',
      sceneLabel: 'Scene 3',
      phase: 'Act 5',
      overall: 0.75,
      sceneProgress: 0.74,
      async apply() {
        updateScene3Reveal(1);
        setScene3Act(4);

        setLayerState({
          heroOpacity: 0,
          fadeOpacity: 0,
          scene2Opacity: 0,
          scene3Opacity: 1,
          scene4Opacity: 0
        });

        originAudio()?.syncScene3?.(0.74, 'Act 5');
      }
    },
    {
      id: 'scene3_act6',
      sceneLabel: 'Scene 3',
      phase: 'Act 6',
      overall: 0.76,
      sceneProgress: 0.90,
      async apply() {
        updateScene3Reveal(1);
        setScene3Act(5);

        setLayerState({
          heroOpacity: 0,
          fadeOpacity: 0,
          scene2Opacity: 0,
          scene3Opacity: 1,
          scene4Opacity: 0
        });

        originAudio()?.syncScene3?.(0.90, 'Act 6');
      }
    },
    {
      id: 'scene34_handoff',
      sceneLabel: 'Scene 3-4',
      phase: 'Black transition',
      overall: 0.80,
      sceneProgress: 0.50,
      async apply() {
        updateScene3Reveal(1);
        setScene3Act(5, { immediate: true });
        setScene4HoldState(0);

        setLayerState({
          heroOpacity: 0,
          fadeOpacity: 0,
          scene2Opacity: 0,
          scene3Opacity: 0.15,
          scene4Opacity: 1
        });
      }
    },
    {
      id: 'scene4_act1',
      sceneLabel: 'Scene 4',
      phase: 'Act 1 — Core',
      overall: 0.82,
      sceneProgress: 0.01,
      scene4Act: 0,
      async apply(context) {
        if (context.direction > 0 && context.previousScene4Act !== null) {
          await playScene4ActTransition(context.previousScene4Act, 0);
        } else {
          setScene4HoldState(0);
        }

        setLayerState({
          heroOpacity: 0,
          fadeOpacity: 0,
          scene2Opacity: 0,
          scene3Opacity: 0,
          scene4Opacity: 1
        });

        originAudio()?.syncScene4?.(0.01, 'Act 1 — Core');
      }
    },
    {
      id: 'scene4_act2',
      sceneLabel: 'Scene 4',
      phase: 'Act 2 — Chaos',
      overall: 0.86,
      sceneProgress: 0.23,
      scene4Act: 1,
      async apply(context) {
        if (context.direction > 0) {
          await playScene4ActTransition(0, 1);
        } else {
          setScene4HoldState(1);
        }

        setLayerState({
          heroOpacity: 0,
          fadeOpacity: 0,
          scene2Opacity: 0,
          scene3Opacity: 0,
          scene4Opacity: 1
        });

        originAudio()?.syncScene4?.(0.23, 'Act 2 — Chaos');
      }
    },
    {
      id: 'scene4_act3',
      sceneLabel: 'Scene 4',
      phase: 'Act 3 — Coordination begins',
      overall: 0.90,
      sceneProgress: 0.43,
      scene4Act: 2,
      async apply(context) {
        if (context.direction > 0) {
          await playScene4ActTransition(1, 2);
        } else {
          setScene4HoldState(2);
        }

        setLayerState({
          heroOpacity: 0,
          fadeOpacity: 0,
          scene2Opacity: 0,
          scene3Opacity: 0,
          scene4Opacity: 1
        });

        originAudio()?.syncScene4?.(0.43, 'Act 3 — Coordination begins');
      }
    },
    {
      id: 'scene4_act3_hold',
      sceneLabel: 'Scene 4',
      phase: 'Act 3 — Coordination hold',
      overall: 0.94,
      sceneProgress: 0.65,
      scene4Act: 2,
      async apply() {
        setScene4HoldState(2);

        setLayerState({
          heroOpacity: 0,
          fadeOpacity: 0,
          scene2Opacity: 0,
          scene3Opacity: 0,
          scene4Opacity: 1
        });

        originAudio()?.syncScene4?.(0.65, 'Act 3 — Coordination hold');
      }
    },
    {
      id: 'scene4_act4_hold',
      sceneLabel: 'Scene 4',
      phase: 'Act 4 — System simplifies',
      overall: 0.95,
      sceneProgress: 0.73,
      scene4Act: 3,
      async apply(context) {
        if (context.direction > 0) {
          await playScene4ActTransition(2, 3);
        } else {
          setScene4HoldState(3);
        }

        setLayerState({
          heroOpacity: 0,
          fadeOpacity: 0,
          scene2Opacity: 0,
          scene3Opacity: 0,
          scene4Opacity: 1
        });

        originAudio()?.syncScene4?.(0.73, 'Act 4 — System simplifies');
      }
    },
    {
      id: 'scene4_act5',
      sceneLabel: 'Scene 4',
      phase: 'Act 5 — One brand',
      overall: 0.97,
      sceneProgress: 0.84,
      scene4Act: 4,
      async apply(context) {
        if (context.direction > 0) {
          await playScene4ActTransition(3, 4);
        } else {
          setScene4HoldState(4);
        }

        setLayerState({
          heroOpacity: 0,
          fadeOpacity: 0,
          scene2Opacity: 0,
          scene3Opacity: 0,
          scene4Opacity: 1
        });

        originAudio()?.syncScene4?.(0.84, 'Act 5 — One brand');
      }
    },
    {
      id: 'scene4_act6',
      sceneLabel: 'Scene 4',
      phase: 'Act 6 — Brand resolve',
      overall: 1.0,
      sceneProgress: 0.96,
      scene4Act: 5,
      async apply(context) {
        if (context.direction > 0) {
          await playScene4ActTransition(4, 5);
        } else {
          setScene4HoldState(5);
        }

        setLayerState({
          heroOpacity: 0,
          fadeOpacity: 0,
          scene2Opacity: 0,
          scene3Opacity: 0,
          scene4Opacity: 1
        });

        originAudio()?.syncScene4?.(0.96, 'Act 6 — Brand resolve');
      }
    }
  ];

  function getPreviousScene4Act(index) {
    for (let i = index - 1; i >= 0; i -= 1) {
      if (typeof STEPS[i].scene4Act === 'number') {
        return STEPS[i].scene4Act;
      }
    }
    return null;
  }

  async function renderCurrentStep(direction = 0, previousStepIndex = null) {
    const step = STEPS[state.currentStep];
    if (!step) return;

    const context = {
      direction,
      previousStepIndex,
      previousStep: previousStepIndex != null ? STEPS[previousStepIndex] : null,
      previousScene4Act: previousStepIndex != null ? getPreviousScene4Act(previousStepIndex + 1) : null
    };

    if (step.scene4Act != null && previousStepIndex != null) {
      context.previousScene4Act = getPreviousScene4Act(state.currentStep);
    }

    await step.apply(context);

    updateDebug({
      sceneLabel: step.sceneLabel,
      phase: step.phase
    });
  }

  async function animateToStep(nextIndex) {
    if (nextIndex < 0 || nextIndex >= STEPS.length) return false;
    if (nextIndex === state.currentStep) return false;
    if (state.isAnimating) return false;

    state.isAnimating = true;

    const previousIndex = state.currentStep;
    const direction = nextIndex > previousIndex ? 1 : -1;

    state.currentStep = nextIndex;

    try {
      await renderCurrentStep(direction, previousIndex);
    } catch (error) {
      console.error('OriginMain: Step transition failed.', error);
    } finally {
      state.isAnimating = false;
    }

    return true;
  }

  function goNextStep() {
    if (state.currentStep >= STEPS.length - 1) return false;
    return animateToStep(state.currentStep + 1);
  }

  function goPrevStep() {
    if (state.currentStep <= 0) return false;
    return animateToStep(state.currentStep - 1);
  }

  function onWheel(event) {
    if (!state.isPinnedActive) return;

    if (!state.scene1Unlocked) {
      if (state.scene1Progress < 0.995) return;

      if (event.deltaY > 0) {
        state.scene1Unlocked = true;
        state.wheelCooldownUntil = Date.now() + WHEEL_COOLDOWN_MS;
        event.preventDefault();
      }
      return;
    }

    if (state.isAnimating) {
      event.preventDefault();
      return;
    }

    const now = Date.now();
    if (now < state.wheelCooldownUntil) {
      event.preventDefault();
      return;
    }

    if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;

    if (event.deltaY > 0) {
      const advanced = goNextStep();
      if (advanced) {
        state.wheelCooldownUntil = now + WHEEL_COOLDOWN_MS;
        event.preventDefault();
      }
    } else {
      const reversed = goPrevStep();
      if (reversed) {
        state.wheelCooldownUntil = now + WHEEL_COOLDOWN_MS;
        event.preventDefault();
      } else {
        state.scene1Unlocked = false;
      }
    }
  }

  function onTouchStart(event) {
    if (!state.isPinnedActive) return;
    if (!event.touches || !event.touches.length) return;
    state.touchStartY = event.touches[0].clientY;
    state.touchLocked = false;
  }

  function onTouchMove(event) {
    if (!state.isPinnedActive) return;
    if (!event.touches || !event.touches.length) return;

    const currentY = event.touches[0].clientY;
    const deltaY = state.touchStartY - currentY;

    if (Math.abs(deltaY) < TOUCH_THRESHOLD) return;

    if (!state.scene1Unlocked) {
      if (state.scene1Progress < 0.995) return;

      if (deltaY > 0) {
        state.scene1Unlocked = true;
        state.touchLocked = true;
        event.preventDefault();
      }
      return;
    }

    if (state.isAnimating) {
      event.preventDefault();
      return;
    }

    if (state.touchLocked) {
      event.preventDefault();
      return;
    }

    if (deltaY > 0) {
      const advanced = goNextStep();
      if (advanced) {
        state.touchLocked = true;
        event.preventDefault();
      }
    } else {
      const reversed = goPrevStep();
      if (reversed) {
        state.touchLocked = true;
        event.preventDefault();
      } else {
        state.scene1Unlocked = false;
      }
    }
  }

  function onTouchEnd() {
    state.touchLocked = false;
  }

  resetAllScenes();

  setLayerState({
    heroOpacity: 1,
    fadeOpacity: 0,
    scene2Opacity: 0,
    scene3Opacity: 0,
    scene4Opacity: 0
  });

  renderScene1(0);

  ScrollTrigger.create({
    trigger: scene,
    start: 'top top',
    end: '+=220%',
    scrub: 1.8,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      if (state.scene1Unlocked) return;
      renderScene1(self.progress);
    }
  });

  ScrollTrigger.create({
    trigger: scene,
    start: 'top top',
    end: '+=320%',
    pin: true,
    pinSpacing: true,
    scrub: false,
    invalidateOnRefresh: true,
    onEnter: () => {
      state.isPinnedActive = true;
      if (state.scene1Unlocked) {
        renderCurrentStep(0, null);
      } else {
        renderScene1(state.scene1Progress);
      }
    },
    onEnterBack: () => {
      state.isPinnedActive = true;
      if (state.scene1Unlocked) {
        renderCurrentStep(0, null);
      } else {
        renderScene1(state.scene1Progress);
      }
    },
    onLeave: () => {
      state.isPinnedActive = false;
    },
    onLeaveBack: () => {
      state.isPinnedActive = false;
    }
  });

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('touchend', onTouchEnd, { passive: true });

  updateDebug({
    sceneLabel: 'Scene 1',
    phase: getScene1Phase(0)
  });

  ScrollTrigger.refresh();
});