// js/pages/creative.js
export function initCreativePage() {

  initCosmicBg();

  const scenes = document.querySelectorAll(".scene");
  let current = 0;
  let isAnimating = false;

  function showScene(index) {
    if (index < 0 || index >= scenes.length || isAnimating) return;

    isAnimating = true;

    const currentScene = scenes[current];
    const nextScene = scenes[index];

    const tl = gsap.timeline({
      onComplete: () => {
        current = index;
        isAnimating = false;
      }
    });

    tl.to(currentScene, {
      opacity: 0,
      duration: 0.6
    });

    tl.set(currentScene, { className: "scene" });
    tl.set(nextScene, { className: "scene active", opacity: 0 });

    tl.to(nextScene, {
      opacity: 1,
      duration: 0.8
    });

    animateScene(index);
  }

  function animateScene(i) {

    switch(i) {

      case 0:
        gsap.from(".entry-line", {
          y: 100,
          opacity: 0,
          stagger: 0.3,
          duration: 1.2
        });
        break;

      case 1:
        gsap.from("#scene-2 h2, #scene-2 p", {
          y: 60,
          opacity: 0,
          stagger: 0.2
        });

        gsap.to(".morph-blob", {
          scale: 1.6,
          rotation: 360,
          duration: 12,
          repeat: -1,
          ease: "none"
        });
        break;

      case 2:
        gsap.from(".cap-card", {
          opacity: 0,
          y: 60,
          stagger: 0.2
        });
        break;

      case 3:
        gsap.from(".process-line span", {
          opacity: 0,
          y: 40,
          stagger: 0.2
        });
        break;

      case 4:
        gsap.from(".work-item", {
          opacity: 0,
          scale: 0.9,
          stagger: 0.3
        });
        break;

      case 5:
        gsap.from("#scene-6 h2, #scene-6 p, .cta-row a", {
          opacity: 0,
          y: 50,
          stagger: 0.2
        });
        break;

      case 6:
        gsap.from(".explore-card", {
          opacity: 0,
          scale: 0.7,
          stagger: 0.2,
          ease: "back.out(1.7)"
        });
        break;

      case 7:
        gsap.to(".footer-wrap", {
          opacity: 1,
          duration: 1.5
        });
        break;
    }
  }

  // SCROLL CONTROL
  window.addEventListener("wheel", (e) => {
    if (e.deltaY > 0) showScene(current + 1);
    else showScene(current - 1);
  });

  // TOUCH
  let startY = 0;

  window.addEventListener("touchstart", e => {
    startY = e.touches[0].clientY;
  });

  window.addEventListener("touchend", e => {
    let endY = e.changedTouches[0].clientY;

    if (startY - endY > 50) showScene(current + 1);
    if (endY - startY > 50) showScene(current - 1);
  });

  // NAV
  document.querySelectorAll(".explore-card").forEach(card => {
    card.addEventListener("click", () => {
      window.location.href = card.dataset.link;
    });
  });

  scenes[0].classList.add("active");
  animateScene(0);
}

/* =========================
   COSMIC BACKGROUND
========================= */
function initCosmicBg() {
  const canvas = document.getElementById("creative-bg");
  const ctx = canvas.getContext("2d");

  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

    particles = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2,
      speed: Math.random() * 0.3
    }));
  }

  resize();
  window.addEventListener("resize", resize);

  function animate() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach(p => {
      p.y += p.speed;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.69)";
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}