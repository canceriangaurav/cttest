// js/nav.js
export function initNavMap() {
  console.log('initNavMap called');

  const breadcrumb = document.getElementById("breadcrumb");
  const navMap = document.getElementById("nav-map");
  const galaxyCanvas = document.getElementById("galaxy-canvas");

  if (!breadcrumb || !navMap) {
    console.error('Breadcrumb or navMap element not found');
    return;
  }
  if (!galaxyCanvas) {
    console.error('Galaxy canvas not found');
    return;
  }

  if (typeof gsap === 'undefined') {
    console.error('GSAP not loaded');
    return;
  }

  // ===============================
  // 🌌 GALAXY BACKGROUND (Canvas 2D)
  // ===============================
  let ctx = galaxyCanvas.getContext("2d");
  let width, height;
  let particles = [];
  let stars = [];
  let targetOffsetX = 0, targetOffsetY = 0;
  let currentOffsetX = 0, currentOffsetY = 0;

  function resizeCanvas() {
    width = galaxyCanvas.width = window.innerWidth;
    height = galaxyCanvas.height = window.innerHeight;
    initParticles();
    initStars();
    // Removed positionPlanets() call – CSS handles positions
  }

  function initParticles() {
    particles = [];
    const particleCount = 800;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.pow(Math.random(), 1.5) * Math.min(width, height) * 0.45;
      particles.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        angle: angle,
        radius: radius,
        speed: 0.002 + Math.random() * 0.003,
        size: 1 + Math.random() * 2,
        brightness: 0.3 + Math.random() * 0.7
      });
    }
  }

  function initStars() {
    stars = [];
    const starCount = 800;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5,
        alpha: 0.2 + Math.random() * 0.8,
        twinkleSpeed: 0.005 + Math.random() * 0.02,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
  }

  function drawGalaxy() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#03010a');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const centerX = width/2 + currentOffsetX;
    const centerY = height/2 + currentOffsetY;

    const radGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.min(width, height)*0.3);
    radGrad.addColorStop(0, 'rgba(255,200,100,0.2)');
    radGrad.addColorStop(0.5, 'rgba(100,50,20,0.1)');
    radGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => {
      p.angle += p.speed;
      const x = centerX + Math.cos(p.angle) * p.radius;
      const y = centerY + Math.sin(p.angle) * p.radius;
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255, 215, 120, ${p.brightness * 0.7})`;
      ctx.fill();
    });

    stars.forEach(s => {
      const twinkle = 0.5 + 0.5 * Math.sin(Date.now() * s.twinkleSpeed + s.twinklePhase);
      ctx.beginPath();
      ctx.arc(s.x + currentOffsetX * 0.2, s.y + currentOffsetY * 0.2, s.radius, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255, 240, 200, ${s.alpha * twinkle})`;
      ctx.fill();
    });

    requestAnimationFrame(drawGalaxy);
  }

  function onMouseMove(e) {
    const x = e.clientX / width;
    const y = e.clientY / height;
    targetOffsetX = (x - 0.5) * 40;
    targetOffsetY = (y - 0.5) * 40;
  }

  function animateParallax() {
    currentOffsetX += (targetOffsetX - currentOffsetX) * 0.05;
    currentOffsetY += (targetOffsetY - currentOffsetY) * 0.05;
    requestAnimationFrame(animateParallax);
  }

  // ===============================
  // 🌊 FLOATING ANIMATION
  // ===============================
  let floatingAnimations = [];

  function startFloating() {
    floatingAnimations.forEach(anim => anim.kill());
    floatingAnimations = [];

    const planets = document.querySelectorAll('.orbit-container .map-node');
    planets.forEach((planet, index) => {
      const yOffset = 8 + Math.random() * 6;
      const duration = 2 + Math.random() * 1.5;
      const delay = index * 0.2;
      const anim = gsap.to(planet, {
        y: -yOffset,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: delay,
        modifiers: {
          y: gsap.utils.unitize(y => y)
        }
      });
      floatingAnimations.push(anim);
    });
  }

  function stopFloating() {
    floatingAnimations.forEach(anim => anim.kill());
    floatingAnimations = [];
    const planets = document.querySelectorAll('.orbit-container .map-node');
    planets.forEach(planet => {
      gsap.set(planet, { y: 0 });
    });
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
  });
  window.addEventListener('mousemove', onMouseMove);

  resizeCanvas();
  animateParallax();
  drawGalaxy();

  // ===============================
  // 🎬 OPEN / CLOSE MAP (with hamburger toggle)
  // ===============================
  function openMap() {
    navMap.classList.add("active");
    breadcrumb.classList.add("open");

    // 🧠 STOP CINEMATIC SCROLL
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.getAll().forEach(st => st.disable());
    }

    document.body.classList.add("nav-open");

    if (window.ChronotalesAudio && window.ChronotalesAudio.isEnabled()) {
      window.ChronotalesAudio.play("projector_hum");
      if (typeof ChronotalesAudio !== "undefined") {
        ChronotalesAudio.stopLoop("orbit_ambience");
        ChronotalesAudio.stopLoop("projector_hum");
        ChronotalesAudio.stopLoop("film_reel");
      }
    }

    gsap.set(navMap, { opacity: 1 });

    gsap.to(".map-title", { opacity: 0.6, y: 0, duration: 1 });

    const centralLogo = document.querySelector('.central-logo');
    if (centralLogo) {
      gsap.fromTo(centralLogo,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'backOut(0.6)' }
      );
    }

    gsap.set(".orbit-container .map-node", { scale: 0.8, opacity: 0 });

    gsap.to(".orbit-container .map-node", {
      scale: 1,
      opacity: 1,
      stagger: 0.2,
      duration: 0.8,
      ease: "back.out(1.7)",
      onComplete: startFloating
    });
  }

  function closeMap() {
    breadcrumb.classList.remove("open");

    stopFloating();

    gsap.to(".orbit-container .map-node", {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      stagger: 0.1,
      onComplete: () => {
        gsap.to(navMap, {
          opacity: 0,
          duration: 0.4,
          onComplete: () => {
            navMap.classList.remove("active");

            // 🧠 RESUME CINEMATIC SCROLL
            if (typeof ScrollTrigger !== "undefined") {
              ScrollTrigger.getAll().forEach(st => st.enable());
              ScrollTrigger.refresh();
            }

            document.body.classList.remove("nav-open");
          }
        });
      }
    });
  }

  breadcrumb.addEventListener("click", () => {
    if (navMap.classList.contains("active")) {
      closeMap();
    } else {
      openMap();
    }
  });

  navMap.addEventListener("click", (e) => {
    if (e.target === navMap) closeMap();
  });

  // ===============================
  // 🚀 CINEMATIC ZOOM ON NODES
  // ===============================
  document.querySelectorAll('.orbit-container .map-node').forEach(node => {
    node.addEventListener("mouseenter", () => {
      if (window.ChronotalesAudio && window.ChronotalesAudio.isEnabled()) {
        window.ChronotalesAudio.play("cta_hover");
      }
    });
    node.addEventListener("click", (e) => {
      e.stopPropagation();
      const link = node.dataset.link;
      if (window.ChronotalesAudio && window.ChronotalesAudio.isEnabled()) {
        window.ChronotalesAudio.play("cta_click");
      }
      const rect = node.getBoundingClientRect();
      const zoom = document.createElement("div");
      zoom.className = "zoom-overlay";
      document.body.appendChild(zoom);
      gsap.set(zoom, { opacity: 1 });
      gsap.fromTo(zoom,
        {
          clipPath: `circle(0% at ${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px)`
        },
        {
          clipPath: "circle(150% at 50% 50%)",
          duration: 1,
          ease: "power3.inOut",
          onComplete: () => {
            window.location.href = link;
          }
        }
      );
    });
  });
}