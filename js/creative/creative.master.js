import { CREATIVE_SCENES } from './creative.data.js';
import { getCreativeDom } from './creative.dom.js';
import { getLocalProgress, phaseAlpha, scenePhase, clamp01 } from './creative.utils.js';
import { enableCreativeDebug, updateCreativeDebug } from './creative.debug.js';

import { createScene1 } from './scenes/scene1.js';
import { createScene2 } from './scenes/scene2.js';
import { createScene3 } from './scenes/scene3.js';
import { createScene4 } from './scenes/scene4.js';
import { createScene5 } from './scenes/scene5.js';

gsap.registerPlugin(ScrollTrigger);

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

function shouldDebug() {
  const url = new URL(window.location.href);
  return url.searchParams.get('debug') === '1';
}

function setSceneOpacity(root, local, isLastScene = false) {
  if (!root) return;

  if (isLastScene) {
    gsap.set(root, { opacity: 1 });
    return;
  }

  const alpha = phaseAlpha(local);
  gsap.set(root, { opacity: alpha });
}

export function initCreativePage() {
  const dom = getCreativeDom();
  if (!dom.root) return;

  if (shouldDebug()) enableCreativeDebug(dom);

  const sceneFactories = [
    { root: dom.scene1, create: createScene1 },
    { root: dom.scene2, create: createScene2 },
    { root: dom.scene3, create: createScene3 },
    { root: dom.scene4, create: createScene4 },
    { root: dom.scene5, create: createScene5 }
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

  const nav = document.querySelector('.ct-nav') || document.querySelector('nav');

  let progress = 0;
  let raf = 0;
  let st = null;

  function resize() {
    const rect = dom.stage.getBoundingClientRect();
    modules.forEach((m) => m.resize?.(rect.width, rect.height));
    ScrollTrigger.refresh();
  }

  function createMainScrollTrigger() {
    if (st) st.kill();

    st = ScrollTrigger.create({
      trigger: dom.scroll,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progress = clamp01(self.progress);
      }
    });

    ScrollTrigger.refresh();
  }

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
      gsap.set(dom.progressBar, {
        scaleX: p,
        transformOrigin: 'left center'
      });
    }

    let activeIndex = 0;
    let activeLocal = 0;

    for (let i = 0; i < CREATIVE_SCENES.length; i += 1) {
      const s = CREATIVE_SCENES[i];
      if (p >= s.start && p <= s.end) {
        activeIndex = i;
        activeLocal = getLocalProgress(p, s.start, s.end);
        break;
      }
    }

    if (nav) {
      if (activeIndex === modules.length - 1 && activeLocal > 0.15) {
        nav.classList.add('is-hidden');
      } else {
        nav.classList.remove('is-hidden');
      }
    }

    const renderIndices = new Set([
      activeIndex,
      activeIndex - 1,
      activeIndex + 1
    ]);

    renderIndices.forEach((i) => {
      if (i < 0 || i >= modules.length) return;

      const scene = CREATIVE_SCENES[i];
      const local = getLocalProgress(p, scene.start, scene.end);
      const isLastScene = i === modules.length - 1;

      if (modules[i].root) {
        setSceneOpacity(modules[i].root, local, isLastScene);
      }

      if (modules[i].root) {
        modules[i].render(local, p, time);
      }
    });

    updateCreativeDebug(dom.debug, {
      global: p,
      scene: CREATIVE_SCENES[activeIndex].key,
      local: activeLocal,
      phase: scenePhase(activeLocal)
    });
  }

  resize();
  createMainScrollTrigger();

  window.addEventListener('resize', resize);

  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 200);

  raf = requestAnimationFrame(frame);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      if (st) st.kill();
      window.removeEventListener('resize', resize);
      modules.forEach((m) => m.destroy?.());
    }
  };
}

function bootCreative() {
  window.scrollTo(0, 0);
  initCreativePage();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', bootCreative, { once: true });
} else {
  bootCreative();
}