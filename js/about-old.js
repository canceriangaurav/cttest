// js/about-page.js
export function initAbout() {
  // ========== 1. ScrollTrigger animations for each act ==========
  const acts = document.querySelectorAll('.act');
  acts.forEach((act, index) => {
    ScrollTrigger.create({
      trigger: act,
      start: 'top 85%',
      end: 'bottom 15%',
      toggleClass: { targets: act, className: 'in-view' },
    });
  });

  // Chaos particles generation
  const chaosSection = document.querySelector('.act-chaos .particle-field');
  if (chaosSection) {
    for (let i = 0; i < 60; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      chaosSection.appendChild(particle);
    }
    ScrollTrigger.create({
      trigger: '.act-chaos',
      start: 'top 80%',
      onEnter: () => {
        gsap.to('.particle', { duration: 0.5, opacity: 0.8, stagger: 0.02 });
      },
      onLeaveBack: () => {
        gsap.to('.particle', { duration: 0.3, opacity: 0 });
      }
    });
  }

  // Glitch grid cells
  const glitchGrid = document.getElementById('glitchGrid');
  if (glitchGrid) {
    for (let i = 0; i < 36; i++) {
      const cell = document.createElement('div');
      cell.classList.add('glitch-cell');
      glitchGrid.appendChild(cell);
    }
  }

  // Geometric shapes
  const geomSection = document.querySelector('.act-formation .geometric-shapes');
  if (geomSection) {
    const shapes = ['square', 'circle', 'triangle'];
    for (let i = 0; i < 20; i++) {
      const shape = document.createElement('div');
      const type = shapes[Math.floor(Math.random() * shapes.length)];
      shape.classList.add('shape', type);
      shape.style.left = `${Math.random() * 100}%`;
      shape.style.top = `${Math.random() * 100}%`;
      shape.style.transform = `rotate(${Math.random() * 360}deg)`;
      geomSection.appendChild(shape);
    }
  }

  // ========== 2. Multi‑step Form ==========
  const formContainer = document.querySelector('.form-container');
  const steps = document.querySelectorAll('.form-step');
  let currentStep = 1;
  const totalSteps = steps.length;

  function showStep(step) {
    steps.forEach((el, i) => {
      if (i + 1 === step) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
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
        const brand = document.getElementById('formBrand').value.trim();
        if (!brand) valid = false;
      } else if (step === 3) {
        const problem = document.getElementById('formProblem').value;
        if (!problem) valid = false;
      } else if (step === 4) {
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
      const nextBtn = document.querySelector('.form-step[data-step="3"] .next-step');
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
      const nextBtn = document.querySelector('.form-step[data-step="4"] .next-step');
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
  const finalStep = document.querySelector('.form-step[data-step="5"]');
  if (finalStep) finalStep.appendChild(formStatus);

  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const name = document.getElementById('formName').value.trim();
      const brand = document.getElementById('formBrand').value.trim();
      const problem = document.getElementById('formProblem').value;
      const project = document.getElementById('formProject').value;
      const message = document.getElementById('formMessage').value.trim();

      if (!name || !brand || !problem || !project) {
        formStatus.innerText = 'Please fill all fields.';
        return;
      }

      formStatus.innerText = 'Sending...';
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', ''); // optional, you can add email step later
      formData.append('phone', '');
      formData.append('message', `Brand: ${brand}\nProblem: ${problem}\nProject: ${project}\nMessage: ${message}`);

      try {
        const response = await fetch('form.php', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (data.success) {
          // Post‑submit animation
          const formDiv = document.querySelector('.form-container');
          formDiv.style.transition = 'opacity 0.6s';
          formDiv.style.opacity = '0';
          setTimeout(() => {
            // Create particle effect
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
        formStatus.innerText = 'Network error. Please try again.';
      }
    });
  }

  // Trigger creative form when CTA button is clicked
  const startBtn = document.getElementById('startStoryBtn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      const formSection = document.getElementById('creativeForm');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ========== 3. Audio triggers for key moments ==========
  if (window.ChronotalesAudio) {
    const audioMoments = [
      { trigger: '.act-chaos', sound: 'explosion' },
      { trigger: '.act-reality', sound: 'team_connection' },
      { trigger: '.act-solution', sound: 'constellation' },
      { trigger: '.act-founder', sound: 'brand_simplified' },
      { trigger: '.act-identity', sound: 'final_fade' }
    ];
    audioMoments.forEach(moment => {
      ScrollTrigger.create({
        trigger: moment.trigger,
        start: 'top 80%',
        onEnter: () => {
          if (window.ChronotalesAudio.isEnabled()) {
            window.ChronotalesAudio.play(moment.sound);
          }
        }
      });
    });
  }
}