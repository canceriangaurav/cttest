/**
 * originTransitions.js
 * ------------------------------------------------------------
 * Owns ALL cross-scene transitions and debug progress updates
 *
 * Timing model:
 * - 0%   -> 35% overall = Scene 1
 * - 35%  -> 50% overall = Scene 1 -> Scene 2 fade transition only
 * - 50%+ overall        = Scene 2 begins
 * - TV reveal starts only after 50%
 */

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

export function initOriginTransitions({ heroModule, scene2Module, updateDebug }) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const { scene: scene1, hero, scrollTimeline } = heroModule;
  const { scene: scene2, revealTimeline, updateActsFromProgress } = scene2Module;

  // -----------------------------------
  // SCENE 1 INTERNAL PROGRESSION
  // -----------------------------------

  ScrollTrigger.create({
    trigger: scene1,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
    animation: scrollTimeline,
    onUpdate: (self) => {
      const progress = clamp01(self.progress);

      let phase = 'Scene 1 hold';
      if (progress >= 0.18 && progress < 0.60) {
        phase = 'Scene 1 release';
      } else if (progress >= 0.60) {
        phase = 'Scene 1 pre-handoff';
      }

      if (typeof updateDebug === 'function') {
        updateDebug({
          overall: progress * 0.35,
          sceneLabel: 'Scene 1',
          sceneProgress: progress,
          phase
        });
      }
    }
  });

  // -----------------------------------
  // HANDOFF: 35% -> 50%
  // FADE ONLY. NO TV REVEAL HERE.
  // -----------------------------------

  const handoff = gsap.timeline({
    paused: true
  });

  handoff.to(hero, {
    opacity: 0,
    ease: 'none',
    duration: 1
  }, 0);

  ScrollTrigger.create({
    trigger: scene1,
    start: 'bottom 65%',
    end: 'bottom top',
    scrub: 1,
    animation: handoff,
    onUpdate: (self) => {
      const progress = clamp01(self.progress);

      if (typeof updateDebug === 'function') {
        updateDebug({
          overall: 0.35 + progress * 0.15,
          sceneLabel: 'Scene 1-2',
          sceneProgress: progress,
          phase: 'Transition fade'
        });
      }
    }
  });

  // -----------------------------------
  // SCENE 2
  // 50%+ overall
  // First reveal TV, then acts
  // -----------------------------------

  ScrollTrigger.create({
    trigger: scene2,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
    onUpdate: (self) => {
      const progress = clamp01(self.progress);

      // 0.00 -> 0.12 : TV reveal only
      const revealWindow = 0.12;
      const revealProgress = clamp01(progress / revealWindow);
      revealTimeline.progress(revealProgress);

      let phase = 'TV reveal';

      // Acts start only after reveal is complete
      if (progress > revealWindow) {
        const actsProgress = clamp01((progress - revealWindow) / (1 - revealWindow));
        updateActsFromProgress(actsProgress);

        phase = 'TV settle';
        if (actsProgress >= 0.18 && actsProgress < 0.42) {
          phase = 'Act 1-2';
        } else if (actsProgress >= 0.42 && actsProgress < 0.66) {
          phase = 'Act 3-4';
        } else if (actsProgress >= 0.66) {
          phase = 'Act 5-6';
        }
      }

      if (typeof updateDebug === 'function') {
        updateDebug({
          overall: 0.5 + progress * 0.5,
          sceneLabel: 'Scene 2',
          sceneProgress: progress,
          phase
        });
      }
    }
  });

  if (typeof updateDebug === 'function') {
    updateDebug({
      overall: 0,
      sceneLabel: 'Scene 1',
      sceneProgress: 0,
      phase: 'Intro'
    });
  }
}