import { ABOUT_SCENES } from './about.data.js';
import { getAboutDom } from './about.dom.js';
import { getLocalProgress, phaseAlpha, scenePhase, clamp01 } from './about.utils.js';
import { enableAboutDebug, updateAboutDebug } from './about.debug.js';

import { createScene1 } from './scenes/scene1Misunderstanding.js';
import { createScene2 } from './scenes/scene2Rejection.js';
import { createScene3 } from './scenes/scene3System.js';
import { createScene4 } from './scenes/scene4Flow.js';
import { createScene5 } from './scenes/scene5Philosophy.js';
import { createScene6 } from './scenes/scene6Difference.js';
import { createScene7 } from './scenes/scene7Human.js';
import { createScene8 } from './scenes/scene8Experience.js';
import { createScene9 } from './scenes/scene9FilterCta.js';

gsap.registerPlugin(ScrollTrigger);

function shouldDebug() {
  const url = new URL(window.location.href);
  return url.searchParams.get('debug') === '1';
}

function setSceneOpacity(root, local) {
  if (!root) return;
  const alpha = phaseAlpha(local);
  gsap.set(root, { opacity: alpha });
}

export function initAboutPage() {
  const dom = getAboutDom();
  if (!dom.root) return;

  if (shouldDebug()) enableAboutDebug(dom);

  const sceneFactories = [
    { root: dom.scene1, create: createScene1 },
    { root: dom.scene2, create: createScene2 },
    { root: dom.scene3, create: createScene3 },
    { root: dom.scene4, create: createScene4 },
    { root: dom.scene5, create: createScene5 },
    { root: dom.scene6, create: createScene6 },
    { root: dom.scene7, create: createScene7 },
    { root: dom.scene8, create: createScene8 },
    { root: dom.scene9, create: createScene9 }
  ];

  const modules = sceneFactories.map((item) => {
    if (!item.root) {
      return {
        root: null,
        render: () => {},
        resize: () => {},
        destroy: () => {}
      };
    }
    return item.create(item.root);
  });

  let progress = 0;
  let raf = 0;

  function resize() {
    const rect = dom.stage.getBoundingClientRect();
    modules.forEach((m) => m.resize?.(rect.width, rect.height));
  }

  const st = ScrollTrigger.create({
    trigger: dom.scroll,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      progress = clamp01(self.progress);
    }
  });

  if (progress === 0) {
    modules.forEach((m, i) => {
      if (!m.root) return;
      m.root.style.opacity = i === 0 ? '1' : '0';
    });
  }

  const TARGET_FPS = window.innerWidth < 768 ? 24 : 30;
  const FRAME_INTERVAL = 1000 / TARGET_FPS;
  let lastFrameTime = 0;

  function frame(time) {
    raf = requestAnimationFrame(frame);

    if (time - lastFrameTime < FRAME_INTERVAL) return;
    lastFrameTime = time;

    const p = progress;

    if (dom.progressBar) {
      gsap.set(dom.progressBar, { scaleX: p, transformOrigin: 'left center' });
    }

    let activeIndex = 0;
    let activeLocal = 0;

    for (let i = 0; i < ABOUT_SCENES.length; i++) {
      const s = ABOUT_SCENES[i];
      if (p >= s.start && p <= s.end) {
        activeIndex = i;
        activeLocal = getLocalProgress(p, s.start, s.end);
        break;
      }
    }

    const renderIndices = new Set([
      activeIndex,
      activeIndex - 1,
      activeIndex + 1
    ]);

    renderIndices.forEach((i) => {
      if (i < 0 || i >= modules.length) return;

      const scene = ABOUT_SCENES[i];
      const local = getLocalProgress(p, scene.start, scene.end);

      if (modules[i].root) {
        setSceneOpacity(modules[i].root, local);
      }

      if (modules[i].root && local > 0.001 && local < 0.999) {
        modules[i].render(local, p, time);
      }
    });

    updateAboutDebug(dom.debug, {
      global: p,
      scene: ABOUT_SCENES[activeIndex].key,
      local: activeLocal,
      phase: scenePhase(activeLocal)
    });
  }

  resize();
  window.addEventListener('resize', resize);
  raf = requestAnimationFrame(frame);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      st.kill();
      window.removeEventListener('resize', resize);
      modules.forEach((m) => m.destroy?.());
    }
  };
}

function bootAbout() {
  initAboutPage();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', bootAbout, { once: true });
} else {
  bootAbout();
}