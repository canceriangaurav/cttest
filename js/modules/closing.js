export function initClosing() {
  "use strict";

  // ----- 1. Story‑driven particles (rising) -----
  const canvas = document.getElementById("closing-particles");
  if (canvas) {
    let ctx = canvas.getContext("2d");
    let width, height, particles = [];

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function initParticles() {
      particles = [];
      for (let i = 0; i < 120; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.2,
          vy: - (Math.random() * 0.3 + 0.1),
        });
      }
    }
    initParticles();

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) p.y = height + 10;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 120, ${0.1 + Math.random() * 0.1})`;
        ctx.fill();
      }
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  // ----- 2. Cinematic Headline Transition -----
  const part1 = document.getElementById("headline-part1");
  const part2 = document.getElementById("headline-part2");
  if (part1 && part2) {
    setTimeout(() => {
      part1.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      part1.style.opacity = "0";
      part1.style.transform = "translateY(-20px)";
    }, 1800);
    setTimeout(() => {
      part2.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      part2.style.opacity = "1";
      part2.style.transform = "translateY(0)";
      if (window.ChronotalesAudio && window.ChronotalesAudio.isEnabled()) {
        window.ChronotalesAudio.play('brand_simplified');
      }
    }, 2200);
  }

  // ----- 3. Staggered Benefit Cards -----
  const cards = document.querySelectorAll(".benefit-card");
  cards.forEach((card, idx) => {
    card.style.transitionDelay = `${0.2 + idx * 0.1}s`;
    card.addEventListener('mouseenter', () => {
      if (window.ChronotalesAudio && window.ChronotalesAudio.isEnabled()) {
        window.ChronotalesAudio.play('card_hover');
      }
    });
  });

  // ----- 4. Intersection Observer for Reveal -----
  const closingSection = document.querySelector(".closing-section");
  if (closingSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
            if (window.ChronotalesAudio && window.ChronotalesAudio.isEnabled()) {
              window.ChronotalesAudio.play('closing');
              window.ChronotalesAudio.play('team_connection');
            }
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(closingSection);
  }

  // ----- 5. CTA button hover and click (modal trigger) -----
  const ctaButton = document.querySelector(".cta-button");
  const modal = document.getElementById("contactModal");
  if (ctaButton && modal) {
    ctaButton.addEventListener('mouseenter', () => {
      if (window.ChronotalesAudio && window.ChronotalesAudio.isEnabled()) {
        window.ChronotalesAudio.play('cta_hover');
      }
    });
    ctaButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.ChronotalesAudio && window.ChronotalesAudio.isEnabled()) {
        window.ChronotalesAudio.play('cta_click');
      }
      modal.style.display = 'flex';
    });
  }

  // ----- 6. Modal close handlers -----
  const closeBtn = document.querySelector('.close-modal');
  function closeModal() {
    if (modal) modal.style.display = 'none';
  }
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // ----- 7. Subtle Parallax Depth -----
  const container = document.querySelector(".closing-container");
  if (container) {
    document.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      container.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // ----- 8. Magnetic CTA -----
  const cta = document.querySelector(".cta-button");
  if (cta) {
    document.addEventListener("mousemove", (e) => {
      const rect = cta.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        cta.style.transform = `translate(${dx * 0.1}px, ${dy * 0.1}px)`;
      } else {
        cta.style.transform = "translate(0,0)";
      }
    });
  }

  // ----- 9. Final Climax: Darkening Overlay after 6 seconds -----
  setTimeout(() => {
    if (closingSection) {
      closingSection.classList.add("end-phase");
      if (window.ChronotalesAudio && window.ChronotalesAudio.isEnabled()) {
        window.ChronotalesAudio.play('final_fade');
      }
    }
  }, 6000);
}