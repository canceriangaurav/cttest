// js/about.js
export function initAbout() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.error('GSAP or ScrollTrigger not loaded');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const acts = document.querySelectorAll('.act');
  if (!acts.length) return;

  // Helper to create a geometry layer inside each act
  function getGeometryLayer(act) {
    let layer = act.querySelector('.act-geometry-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.classList.add('act-geometry-layer');
      layer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
      `;
      act.appendChild(layer);
    }
    return layer;
  }

  function clearGeometry(act) {
    const layer = act.querySelector('.act-geometry-layer');
    if (layer) layer.innerHTML = '';
  }

  // Geometry creators (returns GSAP timeline or null)
  const geometryCreators = [
    { // act-void: pulsating dot
      create: (act) => {
        clearGeometry(act);
        const layer = getGeometryLayer(act);
        const dot = document.createElement('div');
        dot.className = 'geo-dot';
        dot.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 60px;
          height: 60px;
          background: gold;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 30px gold;
        `;
        layer.appendChild(dot);
        gsap.to(dot, {
          scale: 1.3,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }
    },
    { // act-ignition: ring
      create: (act) => {
        clearGeometry(act);
        const layer = getGeometryLayer(act);
        const ring = document.createElement('div');
        ring.className = 'geo-ring';
        ring.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200px;
          height: 200px;
          border: 3px solid gold;
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          box-shadow: 0 0 20px gold;
          opacity: 0;
        `;
        layer.appendChild(ring);
        return gsap.to(ring, { scale: 1.2, opacity: 1, duration: 1, ease: 'backOut(0.6)' });
      }
    },
    { // act-chaos: explosive particles
      create: (act) => {
        clearGeometry(act);
        const layer = getGeometryLayer(act);
        const tl = gsap.timeline();
        for (let i = 0; i < 100; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = 200 + Math.random() * 400;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          const particle = document.createElement('div');
          particle.className = 'geo-particle';
          particle.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 6px;
            height: 6px;
            background: gold;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
          `;
          layer.appendChild(particle);
          tl.fromTo(particle,
            { x: 0, y: 0, opacity: 0, scale: 0.5 },
            { x: x, y: y, opacity: 1, scale: 1, duration: 1, ease: 'backOut(0.6)' },
            0
          );
        }
        return tl;
      }
    },
    { // act-reality: network of dots and lines
      create: (act) => {
        clearGeometry(act);
        const layer = getGeometryLayer(act);
        const center = document.createElement('div');
        center.className = 'geo-center';
        center.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 12px;
          height: 12px;
          background: gold;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 15px gold;
          opacity: 0;
        `;
        layer.appendChild(center);

        const numSatellites = 8;
        const radius = 180;
        const satellites = [];

        for (let i = 0; i < numSatellites; i++) {
          const angle = (i / numSatellites) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const sat = document.createElement('div');
          sat.className = 'geo-satellite';
          sat.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 8px;
            height: 8px;
            background: gold;
            border-radius: 50%;
            transform: translate(calc(-50% + ${x}px), calc(-50% + ${y}px));
            box-shadow: 0 0 10px gold;
            opacity: 0;
          `;
          layer.appendChild(sat);
          satellites.push(sat);
        }

        const tl = gsap.timeline();
        tl.fromTo(center, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 });
        satellites.forEach((sat, idx) => {
          tl.to(sat, { opacity: 1, duration: 0.2 }, `+=0.1`);
          const line = document.createElement('div');
          line.className = 'geo-line';
          const angle = (idx / numSatellites) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          line.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 2px;
            background: gold;
            transform-origin: 0 50%;
            transform: rotate(${angle}rad);
            opacity: 0;
            box-shadow: 0 0 6px gold;
          `;
          layer.appendChild(line);
          tl.to(line, { width: radius, opacity: 0.8, duration: 0.3 }, '<');
        });
        return tl;
      }
    },
    { // act-solution: rotating hourglasses
      create: (act) => {
        clearGeometry(act);
        const layer = getGeometryLayer(act);
        const numHourglasses = 4;
        const radius = 220;
        const hourglasses = [];

        for (let i = 0; i < numHourglasses; i++) {
          const angle = (i / numHourglasses) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const hg = document.createElement('div');
          hg.className = 'geo-hourglass';
          hg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 60px;
            height: 80px;
            transform: translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(0deg);
            opacity: 0.3;
          `;
          hg.innerHTML = `<svg width="60" height="80" viewBox="0 0 60 80">
            <path d="M10,10 L50,10 L40,40 L50,70 L10,70 L20,40 L10,10" fill="rgba(255,215,0,0.5)" stroke="gold" stroke-width="1.5"/>
          </svg>`;
          layer.appendChild(hg);
          hourglasses.push(hg);
          gsap.to(hg, {
            rotation: 360,
            duration: 12,
            repeat: -1,
            ease: 'none',
            transformOrigin: 'center center'
          });
        }
        return null;
      }
    },
    { // act-founder: halo behind image
      create: (act) => {
        clearGeometry(act);
        const layer = getGeometryLayer(act);
        const halo = document.createElement('div');
        halo.className = 'geo-halo';
        halo.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          border: 1px solid rgba(255,215,0,0.6);
          background: radial-gradient(circle, rgba(255,215,0,0.2), transparent);
          box-shadow: 0 0 40px gold;
          transform: translate(-50%, -50%) scale(0.5);
          opacity: 0;
          z-index: 0;
        `;
        layer.appendChild(halo);
        return gsap.to(halo, { scale: 1.2, opacity: 1, duration: 1.2, ease: 'backOut(0.6)' });
      }
    },
    { // act-cta: button pulse
      create: (act) => {
        const btn = act.querySelector('.cta-button');
        if (btn) {
          return gsap.fromTo(btn, { scale: 0.95, opacity: 0.8 }, { scale: 1, opacity: 1, duration: 0.6, repeat: 2, yoyo: true });
        }
        return null;
      }
    }
  ];

  // Process each act
  acts.forEach((act, idx) => {
    const config = geometryCreators[idx];
    if (!config) return;

    const contentDiv = act.querySelector('.act-content');
    if (!contentDiv) return;

    let textElements = [];

    // Special handling for act-reality (index 3) – make text lines overlap
    if (idx === 3) {
      const originalLines = Array.from(contentDiv.children).filter(el => {
        return !el.classList?.contains('act-geometry');
      });
      if (originalLines.length === 0) return;

      const overlapContainer = document.createElement('div');
      overlapContainer.className = 'overlap-text-container';
      overlapContainer.style.cssText = `
        position: relative;
        width: 100vw;
        left: 50%;
        transform: translateX(-50%);
        min-height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      originalLines.forEach((line) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'overlap-line';
        wrapper.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 800px;
          text-align: center;
          opacity: 0;
          margin: 0;
          padding: 0;
        `;
        wrapper.appendChild(line);
        overlapContainer.appendChild(wrapper);
      });

      contentDiv.innerHTML = '';
      contentDiv.appendChild(overlapContainer);
      textElements = Array.from(overlapContainer.querySelectorAll('.overlap-line'));
    } else {
      textElements = Array.from(contentDiv.children).filter(el => {
        return !el.classList?.contains('act-geometry');
      });
    }

    if (textElements.length === 0) return;

    // Initial state: act container is hidden
    gsap.set(act, { opacity: 0, scale: 0.8 });
    textElements.forEach(el => gsap.set(el, { opacity: 0 }));

    const scrollDistance = (textElements.length * 0.8 + 0.5) * window.innerHeight;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: act,
        start: 'top top',
        end: `+=${scrollDistance}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onEnter: () => {
          if (!act.dataset.geometryPlayed) {
            act.dataset.geometryPlayed = 'true';
            const geo = config.create(act);
            if (geo && geo.play) geo.play();
          }
        }
      }
    });

    // Phase 1: fade in act container (first 20%)
    tl.to(act, { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' }, 0);

    // Phase 2: text reveal
    if (idx === 3) {
      const startPhase = 0.2;
      const endPhase = 0.8;
      const phaseLength = endPhase - startPhase;
      const durationPerLine = phaseLength / textElements.length;

      textElements.forEach((el, i) => {
        const start = startPhase + i * durationPerLine;
        const mid = start + durationPerLine * 0.5;
        tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.05, ease: 'none' }, start);
        tl.to(el, { opacity: 0, duration: 0.05, ease: 'none' }, mid);
      });
    } else {
      const startReveal = 0.2;
      const endReveal = 0.8;
      const revealRange = endReveal - startReveal;
      textElements.forEach((el, i) => {
        const progressStart = startReveal + (i / textElements.length) * revealRange;
        tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.1, ease: 'none' }, progressStart);
      });
    }

    // Phase 3: fade out act container (last 20%)
    tl.to(act, { opacity: 0, scale: 0.9, duration: 0.2, ease: 'power2.in' }, 0.8);
  });

  // ===============================
  // FORM LOGIC (multi‑step form)
  // ===============================
  const formContainer = document.querySelector('.form-container');
  const steps = document.querySelectorAll('.form-step');
  let currentStep = 1;
  const totalSteps = steps.length;

  function showStep(step) {
    steps.forEach((el, i) => {
      if (i + 1 === step) el.classList.add('active');
      else el.classList.remove('active');
    });
  }

  document.querySelectorAll('.next-step').forEach(btn => {
    btn.addEventListener('click', (e) => {
      let valid = true;
      const step = currentStep;
      if (step === 1) {
        const name = document.getElementById('formName').value.trim();
        if (!name) valid = false;
      } else if (step === 2) {
        const email = document.getElementById('formEmail').value.trim();
        if (!email || !email.includes('@')) valid = false;
      } else if (step === 3) {
        const phone = document.getElementById('formPhone').value.trim();
        if (!phone) valid = false;
      } else if (step === 4) {
        const brand = document.getElementById('formBrand').value.trim();
        if (!brand) valid = false;
      } else if (step === 5) {
        const problem = document.getElementById('formProblem').value;
        if (!problem) valid = false;
      } else if (step === 6) {
        const project = document.getElementById('formProject').value;
        if (!project) valid = false;
      }
      if (valid && currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  document.querySelectorAll('.prev-step').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Problem options
  const problemOptions = document.querySelectorAll('.problem-option');
  const problemInput = document.getElementById('formProblem');
  problemOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      problemOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      problemInput.value = opt.getAttribute('data-problem');
      const nextBtn = document.querySelector('.form-step[data-step="5"] .next-step');
      if (nextBtn) {
        nextBtn.classList.remove('disabled');
        nextBtn.disabled = false;
      }
    });
  });

  // Project options
  const projectOptions = document.querySelectorAll('.project-option');
  const projectInput = document.getElementById('formProject');
  projectOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      projectOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      projectInput.value = opt.getAttribute('data-project');
      const nextBtn = document.querySelector('.form-step[data-step="6"] .next-step');
      if (nextBtn) {
        nextBtn.classList.remove('disabled');
        nextBtn.disabled = false;
      }
    });
  });

  // Final submission
  const submitBtn = document.getElementById('submitFormBtn');
  const formStatus = document.createElement('div');
  formStatus.className = 'form-status';
  const finalStep = document.querySelector('.form-step[data-step="7"]');
  if (finalStep) finalStep.appendChild(formStatus);

  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      console.log('Submit clicked');
      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const brand = document.getElementById('formBrand').value.trim();
      const problem = document.getElementById('formProblem').value;
      const project = document.getElementById('formProject').value;
      const message = document.getElementById('formMessage').value.trim();

      if (!name || !email || !phone || !brand || !problem || !project) {
        formStatus.innerText = 'Please fill all fields.';
        return;
      }

      formStatus.innerText = 'Sending...';
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('message', `Brand: ${brand}\nProblem: ${problem}\nProject: ${project}\nMessage: ${message}`);

      try {
        console.log('Fetching form.php');
        const response = await fetch('form.php', {
          method: 'POST',
          body: formData
        });
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Data:', data);
        if (data.success) {
          // Success: dissolve form, show particles, redirect
          const formDiv = document.querySelector('.form-container');
          formDiv.style.transition = 'opacity 0.6s';
          formDiv.style.opacity = '0';
          setTimeout(() => {
            const particlesContainer = document.createElement('div');
            particlesContainer.style.position = 'fixed';
            particlesContainer.style.inset = '0';
            particlesContainer.style.pointerEvents = 'none';
            particlesContainer.style.zIndex = '1000';
            document.body.appendChild(particlesContainer);
            for (let i = 0; i < 100; i++) {
              const particle = document.createElement('div');
              particle.style.position = 'absolute';
              particle.style.width = '2px';
              particle.style.height = '2px';
              particle.style.background = '#ffdf7e';
              particle.style.borderRadius = '50%';
              particle.style.left = `${Math.random() * 100}%`;
              particle.style.top = `${Math.random() * 100}%`;
              particlesContainer.appendChild(particle);
              gsap.to(particle, {
                duration: 0.8,
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
                opacity: 0,
                ease: 'power2.out'
              });
            }
            setTimeout(() => {
              particlesContainer.remove();
              window.location.href = 'thank-you.html';
            }, 800);
          }, 400);
        } else {
          formStatus.innerText = data.message || 'Error. Please try again.';
        }
      } catch (error) {
        console.error('Fetch error:', error);
        formStatus.innerText = 'Network error. Please check your connection.';
      }
    });
  }

  const ctaBtn = document.getElementById('startStoryBtn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      const formSection = document.getElementById('creativeForm');
      if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
}