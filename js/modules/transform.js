export function initTransform() {
  "use strict";

  // ========== DOM elements ==========
  const canvas = document.getElementById("ctCanvas");
  const ctx = canvas.getContext("2d");
  const textEl = document.getElementById("ctText");
  const progressBar = document.getElementById("ctScrollProgress");
  const storyPin = document.querySelector(".ct-story");
  const spacer = document.querySelector(".ct-scroll-space");

  if (!canvas || !ctx || !textEl || !progressBar || !storyPin || !spacer) {
    console.error("Transform section: missing required DOM elements");
    return;
  }

  // ========== canvas config ==========
  let W = 800, H = 800;
  function resizeCanvas() {
    const maxWidth = Math.min(window.innerWidth * 0.8, 520);
    canvas.style.width = `${maxWidth}px`;
    canvas.style.height = `${maxWidth}px`;
    canvas.width = W;
    canvas.height = H;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // ========== particle systems ==========
  let bgParticles = [];
  let explosionParticles = [];
  let explosionActive = false;

  function initBgParticles() {
    bgParticles = [];
    for (let i = 0; i < 180; i++) {
      bgParticles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 2 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
      });
    }
  }
  initBgParticles();

  function drawBgParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    for (let p of bgParticles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 210, 80, 0.85)";
      ctx.fill();
    }
  }

  function drawDot(pulse = false) {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    let radius = 32;
    if (pulse) radius *= 1 + Math.sin(Date.now() * 0.005) * 0.18;
    ctx.shadowBlur = 28;
    ctx.shadowColor = "#ffdf80";
    ctx.beginPath();
    ctx.arc(W/2, H/2, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffdd77";
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function drawHourglass() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    const cx = W/2, cy = H/2;
    ctx.strokeStyle = "#ffdb6e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx-80, cy-120);
    ctx.lineTo(cx+80, cy-120);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx-80, cy+120);
    ctx.lineTo(cx+80, cy+120);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx-80, cy-120);
    ctx.lineTo(cx+80, cy-120);
    ctx.lineTo(cx, cy-20);
    ctx.fillStyle = "rgba(255,210,80,0.12)";
    ctx.fill();
  }

  function drawGrid() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    const startX = W/2 - 110;
    const startY = H/2 - 110;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        ctx.beginPath();
        ctx.arc(startX + i * 74, startY + j * 74, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#ffdd88";
        ctx.fill();
        ctx.shadowBlur = 8;
      }
    }
    ctx.shadowBlur = 0;
  }

  // ========== explosion effect ==========
  function startExplosion() {
    if (explosionActive) return;
    explosionActive = true;
    explosionParticles = [];
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 6;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      explosionParticles.push({
        x: W/2, y: H/2,
        vx: vx, vy: vy,
        r: 3 + Math.random() * 4,
        life: 1,
        decay: 0.02 + Math.random() * 0.03
      });
    }

    function drawExplosion() {
      if (!explosionActive || !ctx) return;
      ctx.clearRect(0, 0, W, H);
      let allDead = true;
      for (let p of explosionParticles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life > 0) {
          allDead = false;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 220, 100, ${p.life * 0.9})`;
          ctx.fill();
        }
      }
      if (allDead) {
        explosionActive = false;
        explosionParticles = [];
        gsap.killTweensOf(canvas);
        gsap.to(canvas, { opacity: 0, duration: 0.55, ease: "power2.out" });
        showConstellation();
        // Play explosion sound
        if (window.ChronotalesAudio && window.ChronotalesAudio.isEnabled()) {
          window.ChronotalesAudio.play('explosion');
        }
      } else {
        requestAnimationFrame(drawExplosion);
      }
    }
    drawExplosion();
  }

  // ========== constellation creation ==========
  let constellationContainer = null;
  let constellationLines = null;

  const serviceLabels = ["Logo", "Website", "Videos", "Content", "Marketing", "Motion Graphics", "VFX", "Events", "Collaterals", "Training", "Etc"];

  function buildConstellation() {
    if (constellationContainer) constellationContainer.remove();

    const container = document.createElement("div");
    container.className = "constellation";
    container.id = "constellation";
    container.style.position = "absolute";
    container.style.top = "50%";
    container.style.left = "50%";
    container.style.transform = "translate(-50%, -50%)";
    container.style.width = "100%";
    container.style.maxWidth = "900px";
    container.style.height = "auto";
    container.style.minHeight = "500px";
    container.style.pointerEvents = "none";
    container.style.zIndex = "25";
    container.style.opacity = "0";
    container.style.visibility = "hidden";
    container.style.transition = "opacity 0.6s ease, visibility 0s 0.6s";

    const isMobile = window.innerWidth < 768;

    // Center element
    const center = document.createElement("div");
    center.className = "center-logo";
    if (isMobile) {
      center.style.width = "18px";
      center.style.height = "18px";
      center.style.background = "#ffdf7e";
      center.style.borderRadius = "50%";
      center.style.boxShadow = "0 0 12px gold";
      center.style.animation = "pulseCore 2s ease-in-out infinite";
      center.style.pointerEvents = "none";
    } else {
      center.style.width = "120px";
      center.style.height = "120px";
      center.style.background = "rgba(20, 15, 28, 0.85)";
      center.style.backdropFilter = "blur(12px)";
      center.style.borderRadius = "50%";
      center.style.border = "2px solid rgba(212, 175, 55, 0.8)";
      center.style.display = "flex";
      center.style.alignItems = "center";
      center.style.justifyContent = "center";
      center.style.fontFamily = "'Bebas Neue', sans-serif";
      center.style.fontSize = "1.4rem";
      center.style.fontWeight = "400";
      center.style.letterSpacing = "2px";
      center.style.color = "#ffdf7e";
      center.style.textAlign = "center";
      center.style.lineHeight = "1.2";
      center.style.boxShadow = "0 0 30px rgba(212, 175, 55, 0.4)";
      center.style.whiteSpace = "pre-line";
      center.style.padding = "0 0.5rem";
      center.innerText = "Chronotales";
    }
    center.style.position = "absolute";
    center.style.top = "50%";
    center.style.left = "50%";
    center.style.transform = "translate(-50%, -50%)";
    container.appendChild(center);

    // SVG lines
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("id", "constellation-lines");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.pointerEvents = "none";
    container.appendChild(svg);

    // Add buttons
    if (isMobile) {
      // Mobile: ellipse layout
      const hRadius = Math.min(window.innerWidth * 0.32, 240);
      const vRadius = Math.min(window.innerHeight * 0.4, 280);
      const angleStep = (Math.PI * 2) / serviceLabels.length;
      serviceLabels.forEach((label, i) => {
        const angle = i * angleStep;
        const xPercent = 50 + (hRadius / window.innerWidth * 100) * Math.cos(angle);
        const yPercent = 50 + (vRadius / window.innerHeight * 100) * Math.sin(angle);
        const btn = document.createElement("button");
        btn.className = "ct-btn";
        btn.innerText = label;
        btn.style.position = "absolute";
        btn.style.left = `${xPercent}%`;
        btn.style.top = `${yPercent}%`;
        btn.style.transform = "translate(-50%, -50%)";
        btn.style.background = "rgba(20, 15, 28, 0.85)";
        btn.style.backdropFilter = "blur(10px)";
        btn.style.border = "1px solid rgba(212, 175, 55, 0.7)";
        btn.style.color = "#ffdf7e";
        btn.style.padding = "0.45rem 0.9rem";
        btn.style.borderRadius = "60px";
        btn.style.fontSize = "0.7rem";
        btn.style.fontWeight = "500";
        btn.style.letterSpacing = "0.5px";
        btn.style.cursor = "pointer";
        btn.style.transition = "all 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.2)";
        btn.style.fontFamily = "'Inter', sans-serif";
        btn.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
        btn.style.whiteSpace = "nowrap";
        btn.style.pointerEvents = "auto";
        btn.style.animation = "floatButton 3s ease-in-out infinite";
        btn.style.animationDelay = `${i * 0.1}s`;
        // Hover sound for each button
        btn.addEventListener('mouseenter', () => {
          if (window.ChronotalesAudio && window.ChronotalesAudio.isEnabled()) {
            window.ChronotalesAudio.play('card_hover');
          }
        });
        container.appendChild(btn);
      });
    } else {
      // Desktop: circular orbit
      const radius = Math.min(window.innerWidth * 0.28, 260);
      const angleStep = (Math.PI * 2) / serviceLabels.length;
      serviceLabels.forEach((label, i) => {
        const angle = i * angleStep;
        const xPercent = 50 + (radius / window.innerWidth * 100) * Math.cos(angle);
        const yPercent = 50 + (radius / window.innerHeight * 100) * Math.sin(angle);
        const btn = document.createElement("button");
        btn.className = "ct-btn";
        btn.innerText = label;
        btn.style.position = "absolute";
        btn.style.left = `${xPercent}%`;
        btn.style.top = `${yPercent}%`;
        btn.style.transform = "translate(-50%, -50%)";
        btn.style.background = "rgba(20, 15, 28, 0.85)";
        btn.style.backdropFilter = "blur(10px)";
        btn.style.border = "1px solid rgba(212, 175, 55, 0.7)";
        btn.style.color = "#ffdf7e";
        btn.style.padding = "0.6rem 1.2rem";
        btn.style.borderRadius = "60px";
        btn.style.fontSize = "0.85rem";
        btn.style.fontWeight = "500";
        btn.style.letterSpacing = "0.5px";
        btn.style.cursor = "pointer";
        btn.style.transition = "all 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.2)";
        btn.style.fontFamily = "'Inter', sans-serif";
        btn.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
        btn.style.whiteSpace = "nowrap";
        btn.style.pointerEvents = "auto";
        btn.style.animation = "floatButton 3s ease-in-out infinite";
        btn.style.animationDelay = `${i * 0.1}s`;
        btn.addEventListener('mouseenter', () => {
          if (window.ChronotalesAudio && window.ChronotalesAudio.isEnabled()) {
            window.ChronotalesAudio.play('card_hover');
          }
        });
        container.appendChild(btn);
      });
    }

    storyPin.appendChild(container);
    constellationContainer = container;
    constellationLines = svg;

    updateLines();

    window.addEventListener("resize", () => {
      if (constellationContainer) {
        buildConstellation(); // rebuild on resize to handle orientation
      }
    });
  }

  function updateLines() {
    if (!constellationContainer || !constellationLines) return;
    const svg = constellationLines;
    svg.innerHTML = "";

    const center = constellationContainer.querySelector(".center-logo");
    const buttons = constellationContainer.querySelectorAll(".ct-btn");
    if (!center || buttons.length === 0) return;

    const containerRect = constellationContainer.getBoundingClientRect();
    const centerRect = center.getBoundingClientRect();
    const centerX = centerRect.left + centerRect.width / 2 - containerRect.left;
    const centerY = centerRect.top + centerRect.height / 2 - containerRect.top;

    buttons.forEach(btn => {
      const btnRect = btn.getBoundingClientRect();
      const btnX = btnRect.left + btnRect.width / 2 - containerRect.left;
      const btnY = btnRect.top + btnRect.height / 2 - containerRect.top;

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", centerX);
      line.setAttribute("y1", centerY);
      line.setAttribute("x2", btnX);
      line.setAttribute("y2", btnY);
      line.setAttribute("stroke", "rgba(212, 175, 55, 0.6)");
      line.setAttribute("stroke-width", "2");
      line.setAttribute("stroke-dasharray", "4 4");
      svg.appendChild(line);
    });
  }

  function showConstellation() {
    if (!constellationContainer) return;
    constellationContainer.style.opacity = "1";
    constellationContainer.style.visibility = "visible";
    constellationContainer.style.transition = "opacity 0.6s ease, visibility 0s 0s";
    // Play constellation sound and start orbit ambience
    if (window.ChronotalesAudio && window.ChronotalesAudio.isEnabled()) {
      window.ChronotalesAudio.play('constellation');
      window.ChronotalesAudio.play('orbit_ambience');
    }
  }

  // ========== step progression ==========
  const stepTexts = [
    "EVERYTHING BEGINS…",
    "…AS AN IDEA.",
    "UNSTRUCTURED.",
    "UNTIL IT ALIGNS.",
    "STRUCTURE",
    "",
    ""
  ];

  let activeStep = -1;

  function applyStep(step) {
    if (activeStep === 6 && step !== 6) {
      explosionActive = false;
      gsap.killTweensOf(canvas);
      canvas.style.opacity = "1";
      if (constellationContainer) {
        constellationContainer.style.opacity = "0";
        constellationContainer.style.visibility = "hidden";
        // Stop ambient loop when constellation hides
        if (window.ChronotalesAudio) window.ChronotalesAudio.stopLoop();
      }
    }

    if (step === 0) { drawDot(false); textEl.innerText = stepTexts[0]; }
    else if (step === 1) { drawDot(true); textEl.innerText = stepTexts[1]; }
    else if (step === 2) { drawBgParticles(); textEl.innerText = stepTexts[2]; }
    else if (step === 3) { drawHourglass(); textEl.innerText = stepTexts[3]; }
    else if (step === 4) { drawGrid(); textEl.innerText = stepTexts[4]; }
    else if (step === 5) { drawDot(false); textEl.innerText = ""; }
    else if (step === 6) {
      textEl.innerText = "";
      if (activeStep !== 6) startExplosion();
    } else {
      if (step < 6) {
        gsap.to(canvas, { opacity: 1, duration: 0.3 });
      }
    }
    activeStep = step;
  }

  function liveDrawLoop() {
    if (activeStep === 1 && !explosionActive) drawDot(true);
    else if (activeStep === 2 && !explosionActive) drawBgParticles();
    requestAnimationFrame(liveDrawLoop);
  }
  liveDrawLoop();

  applyStep(0);
  activeStep = 0;

  // ========== ScrollTrigger ==========
  buildConstellation();

  const FADE_START_PROGRESS = 6 / 7;

  let stepTrigger = ScrollTrigger.create({
    trigger: spacer,
    start: "top top",
    end: "bottom bottom",
    pin: storyPin,
    pinSpacing: true,
    scrub: 1.2,
    onUpdate: (self) => {
      const progress = self.progress;
      progressBar.style.width = (progress * 100) + "%";

      let stepIndex;
      if (progress < 0.6) {
        stepIndex = Math.floor(progress / 0.6 * 6);
        stepIndex = Math.min(5, stepIndex);
      } else {
        stepIndex = 6;
      }

      if (stepIndex !== activeStep) applyStep(stepIndex);

      if (progress >= FADE_START_PROGRESS) {
        const fadeFactor = 1 - (progress - FADE_START_PROGRESS) / (1 - FADE_START_PROGRESS);
        gsap.set(storyPin, { opacity: fadeFactor });
      } else {
        gsap.set(storyPin, { opacity: 1 });
      }
    },
    onLeaveBack: () => {
      if (activeStep !== 0) {
        applyStep(0);
        canvas.style.opacity = "1";
        explosionActive = false;
        if (constellationContainer) {
          constellationContainer.style.opacity = "0";
          constellationContainer.style.visibility = "hidden";
          if (window.ChronotalesAudio) window.ChronotalesAudio.stopLoop();
        }
      }
      progressBar.style.width = "0%";
      gsap.set(storyPin, { opacity: 1 });
    }
  });

  gsap.set(canvas, { opacity: 1 });
  gsap.set(storyPin, { opacity: 1 });

  // ========== section fade‑in after hero ==========
  gsap.set(".ct-transform", { opacity: 0 });
  ScrollTrigger.create({
    trigger: "#hero-wrapper",
    start: "bottom bottom",
    onEnter: () => {
      gsap.to(".ct-transform", { opacity: 1, duration: 0.8, ease: "power2.out" });
    },
    once: true,
    immediateRender: false
  });

  if (window.scrollY >= document.getElementById("hero-wrapper").offsetHeight - window.innerHeight) {
    gsap.set(".ct-transform", { opacity: 1 });
  } else {
    window.addEventListener("scroll", function checkHeroPast() {
      const heroBottom = document.getElementById("hero-wrapper").getBoundingClientRect().bottom;
      if (heroBottom <= 0) {
        gsap.to(".ct-transform", { opacity: 1, duration: 0.8, ease: "power2.out" });
        window.removeEventListener("scroll", checkHeroPast);
      }
    });
  }

  // ========== resize handler ==========
  window.addEventListener("resize", () => {
    resizeCanvas();
    initBgParticles();
    if (!explosionActive) {
      if (activeStep === 2) drawBgParticles();
      else if (activeStep === 1) drawDot(true);
      else if (activeStep === 0) drawDot(false);
      else if (activeStep === 3) drawHourglass();
      else if (activeStep === 4) drawGrid();
      else if (activeStep === 5) drawDot(false);
    }
    if (constellationContainer) {
      buildConstellation();
    }
    ScrollTrigger.refresh();
  });
}