export function initProjectorScene() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.warn('ProjectorScene: Browser environment not available.');
    return null;
  }

  if (typeof gsap === 'undefined') {
    console.warn('ProjectorScene: GSAP not available.');
    return null;
  }

  const layer = document.getElementById('origin-scene-3-layer');
  const scene = document.getElementById('projectorScene');
  const projector = document.getElementById('projectorImage');
  const screenGlow = document.getElementById('projectorScreenGlow');
  const dustContainer = document.getElementById('projectorDust');
  const beam = document.getElementById('projectorBeam');
  const acts = Array.from(document.querySelectorAll('.projector-act'));

  const required = {
    layer,
    scene,
    projector,
    screenGlow,
    beam
  };

  const missing = Object.entries(required)
    .filter(([, el]) => !el)
    .map(([key]) => key);

  if (missing.length || !acts.length) {
    console.warn(
      `ProjectorScene: Missing required DOM elements${
        missing.length ? `: ${missing.join(', ')}` : ''
      }${!acts.length ? `${missing.length ? '; ' : ': '}acts` : ''}.`
    );
    return null;
  }

  let destroyed = false;
  let currentAct = -1;
  let lastRevealProgress = -1;
  let lastActsProgress = -1;
  let dustCount = 0;

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function lerp(a, b, t) {
    return a + ((b - a) * t);
  }

  function progressToActIndex(progress) {
    const p = clamp01(progress);

    let index = 0;
    if (p >= 0.34) index = 1;
    if (p >= 0.48) index = 2;
    if (p >= 0.60) index = 3;
    if (p >= 0.74) index = 4;
    if (p >= 0.84) index = 5;

    return Math.max(0, Math.min(acts.length - 1, index));
  }

  function createDustParticles(container, count = 40) {
    if (!container || destroyed) return;

    container.innerHTML = '';
    dustCount = count;

    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement('span');

      const size = Math.random() * 3 + 1.2;
      const duration = Math.random() * 6 + 6;
      const delay = Math.random() * 6;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const driftX = (Math.random() - 0.5) * 80;

      particle.style.setProperty('--driftX', `${driftX}px`);
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x}%`;
      particle.style.top = `${y}%`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;

      container.appendChild(particle);
    }
  }

  function syncDustCount() {
    if (!dustContainer || destroyed) return;

    const isMobile = window.innerWidth < 768;
    const targetCount = isMobile ? 28 : 70;

    if (targetCount !== dustCount) {
      createDustParticles(dustContainer, targetCount);
    }
  }

  function setAct(index, options = {}) {
    if (destroyed) return;

    const safeIndex = Math.max(0, Math.min(acts.length - 1, index));
    const { immediate = false } = options;

    if (safeIndex === currentAct && !immediate) return;
    currentAct = safeIndex;

    acts.forEach((act, i) => {
      act.classList.toggle('is-active', i === safeIndex);
      gsap.killTweensOf(act);

      if (i === safeIndex) {
        if (immediate) {
          gsap.set(act, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)'
          });
        } else {
          gsap.to(act, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.65,
            ease: 'power2.out',
            overwrite: true
          });
        }
      } else if (immediate) {
        gsap.set(act, {
          opacity: 0,
          y: -16,
          scale: 0.985,
          filter: 'blur(8px)'
        });
      } else {
        gsap.to(act, {
          opacity: 0,
          y: -16,
          scale: 0.985,
          filter: 'blur(8px)',
          duration: 0.38,
          ease: 'power2.out',
          overwrite: true
        });
      }
    });
  }

  function updateReveal(progress) {
    if (destroyed) return;

    const p = clamp01(progress);
    if (p === lastRevealProgress) return;
    lastRevealProgress = p;

    gsap.set(layer, { opacity: p });

    gsap.set(projector, {
      opacity: lerp(0.82, 1, p),
      scale: lerp(0.96, 1, p),
      x: lerp(-20, 0, p)
    });

    gsap.set(screenGlow, {
      opacity: lerp(0.45, 0.90, p),
      scale: lerp(0.94, 1.02, p)
    });

    gsap.set(beam, {
      opacity: lerp(0.12, 0.72, p),
      scaleX: lerp(0.98, 1, p)
    });

    if (dustContainer) {
      gsap.set(dustContainer, {
        opacity: Math.min(1, p * 1.1)
      });
    }
  }

  function updateActs(progress) {
    if (destroyed) return;

    const p = clamp01(progress);
    if (p === lastActsProgress) return;
    lastActsProgress = p;

    const index = progressToActIndex(p);
    setAct(index);

    gsap.set(projector, {
      scale: 1 + (p * 0.015),
      x: p * 6,
      filter: `brightness(${0.98 + (p * 0.04)}) drop-shadow(0 0 ${20 + (p * 8)}px rgba(244,211,106,0.06))`
    });

    gsap.set(screenGlow, {
      opacity: 0.86 + (p * 0.12),
      scale: 0.99 + (p * 0.03)
    });

    gsap.set(beam, {
      opacity: 0.45 + (p * 0.25),
      scaleX: 1 + (p * 0.02)
    });

    if (dustContainer) {
      gsap.set(dustContainer, {
        opacity: Math.min(1, 0.8 + (p * 0.2))
      });
    }
  }

  function setBaseState() {
    gsap.killTweensOf([layer, projector, screenGlow, beam, ...acts]);

    gsap.set(layer, { opacity: 0 });

    gsap.set(projector, {
      opacity: 0.82,
      scale: 0.96,
      x: -20,
      filter: 'brightness(0.98) drop-shadow(0 0 20px rgba(244,211,106,0.06))'
    });

    gsap.set(screenGlow, {
      opacity: 0.45,
      scale: 0.94
    });

    gsap.set(beam, {
      opacity: 0,
      scaleX: 0.98
    });

    if (dustContainer) {
      gsap.set(dustContainer, { opacity: 0 });
    }

    acts.forEach((act, index) => {
      gsap.set(act, {
        opacity: index === 0 ? 1 : 0,
        y: index === 0 ? 0 : -16,
        scale: index === 0 ? 1 : 0.985,
        filter: index === 0 ? 'blur(0px)' : 'blur(8px)'
      });
      act.classList.toggle('is-active', index === 0);
    });

    currentAct = 0;
    lastRevealProgress = 0;
    lastActsProgress = 0;

    beam.classList.add('is-active');
  }

  function reset() {
    if (destroyed) return;
    syncDustCount();
    setBaseState();
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;

    gsap.killTweensOf([layer, projector, screenGlow, beam, ...acts]);

    if (beam) {
      beam.classList.remove('is-active');
    }

    window.removeEventListener('resize', syncDustCount);
  }

  syncDustCount();
  setBaseState();
  window.addEventListener('resize', syncDustCount);

  return {
    layer,
    scene,
    acts,
    updateReveal,
    updateActs,
    setAct,
    reset,
    destroy
  };
}