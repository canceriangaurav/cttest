export function initProjectorScene() {
  const layer = document.getElementById('origin-scene-3-layer');
  const scene = document.getElementById('projectorScene');
  const projector = document.getElementById('projectorImage');
  const screenGlow = document.getElementById('projectorScreenGlow');
  const dustContainer = document.getElementById('projectorDust');
  const beam = document.getElementById('projectorBeam');
  const acts = Array.from(document.querySelectorAll('.projector-act'));

  if (!layer || !scene || !projector || !screenGlow || !beam || !acts.length) {
    console.warn('ProjectorScene: Missing required DOM elements.');
    return null;
  }

  /* ---------------------------------------
     DUST SYSTEM
  --------------------------------------- */

  function createDustParticles(container, count = 40) {
    if (!container) return;

    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span');

      const size = Math.random() * 3 + 1.2; // increased size
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

  const isMobile = window.innerWidth < 768;
  createDustParticles(dustContainer, isMobile ? 28 : 70);

  /* ---------------------------------------
     ACT SYSTEM
  --------------------------------------- */

  let currentAct = -1;

  function setAct(index) {
    acts.forEach((act, i) => {
      if (i === index) {
        act.classList.add('is-active');
        gsap.to(act, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.65,
          ease: 'power2.out',
          overwrite: true
        });
      } else {
        act.classList.remove('is-active');
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

    currentAct = index;
  }

  /* ---------------------------------------
     REVEAL
  --------------------------------------- */

  function updateReveal(progress) {
    const p = Math.max(0, Math.min(1, progress));

    gsap.set(layer, { opacity: p });

    gsap.set(projector, {
      opacity: 0.82 + (p * 0.18),
      scale: 0.96 + (p * 0.04),
      x: -20 + (p * 20)
    });

    gsap.set(screenGlow, {
      opacity: 0.45 + (p * 0.45),
      scale: 0.94 + (p * 0.08)
    });

    // Beam reveal
    gsap.set(beam, {
      opacity: 0.12 + (p * 0.6),
      scaleX: 0.98 + (p * 0.02)
    });

    // Dust reveal
    if (dustContainer) {
      gsap.set(dustContainer, {
        opacity: p * 1.1
      });
    }
  }

  /* ---------------------------------------
     ACTS
  --------------------------------------- */

  function updateActs(progress) {
    const p = Math.max(0, Math.min(1, progress));

    let index = 0;
    if (p >= 0.34) index = 1;
    if (p >= 0.48) index = 2;
    if (p >= 0.60) index = 3;
    if (p >= 0.74) index = 4;
    if (p >= 0.84) index = 5;

    if (index !== currentAct) {
      setAct(index);
    }

    // subtle projector breathing
    gsap.set(projector, {
      scale: 1 + (p * 0.015),
      x: p * 6,
      filter: `brightness(${0.98 + (p * 0.04)}) drop-shadow(0 0 ${20 + (p * 8)}px rgba(244,211,106,0.06))`
    });

    // screen glow intensifies
    gsap.set(screenGlow, {
      opacity: 0.86 + (p * 0.12),
      scale: 0.99 + (p * 0.03)
    });

    // beam intensifies slightly
    gsap.set(beam, {
      opacity: 0.45 + (p * 0.25),
      scaleX: 1 + (p * 0.02)
    });

    // dust gets stronger in acts
    if (dustContainer) {
      gsap.set(dustContainer, {
        opacity: 0.8 + (p * 0.4)
      });
    }
  }

  /* ---------------------------------------
     INITIAL STATE
  --------------------------------------- */

  gsap.set(layer, { opacity: 0 });

  gsap.set(projector, {
    opacity: 0.82,
    scale: 0.96,
    x: -20
  });

  gsap.set(screenGlow, {
    opacity: 0.45,
    scale: 0.94
  });

  gsap.set(beam, {
    opacity: 0
  });

  if (dustContainer) {
    gsap.set(dustContainer, { opacity: 0 });
  }

  // start beam flicker animation
  beam.classList.add('is-active');

  setAct(0);

  return {
    layer,
    scene,
    updateReveal,
    updateActs
  };
}