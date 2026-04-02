export function initFilm() {
  const strip = document.getElementById("film-strip");
  const frames = document.querySelectorAll(".frame");
  const filmSection = document.getElementById("film-section");
  if (!strip || !frames.length || !filmSection) return;

  let filmTween;

  function initFilmStrip() {
    if (filmTween) {
      filmTween.scrollTrigger?.kill();
      filmTween.kill();
    }
    const totalWidth = strip.scrollWidth;
    const scrollDistance = totalWidth - window.innerWidth;
    filmSection.style.height = (scrollDistance + window.innerHeight) + "px";
    filmTween = gsap.to(strip, {
      x: -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: "#film-section",
        start: "top top",
        end: "+=" + scrollDistance,
        scrub: 1,
        pin: "#film-container",
        snap: { snapTo: 1 / (frames.length - 1), duration: 0.4, ease: "power1.inOut" },
        invalidateOnRefresh: true,
        onUpdate: updateActiveFrame
      }
    });
    ScrollTrigger.refresh();
  }

  function updateActiveFrame() {
    const center = window.innerWidth / 2;
    frames.forEach(frame => {
      const rect = frame.getBoundingClientRect();
      const frameCenter = rect.left + rect.width / 2;
      frame.classList.toggle("active", Math.abs(center - frameCenter) < rect.width / 2);
    });
  }

  const frameCanvases = document.querySelectorAll(".frame-canvas");
  function resizeAllFrames() {
    frameCanvases.forEach(canvas => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
  }
  window.addEventListener("resize", resizeAllFrames);
  resizeAllFrames();

  const frameDrawers = [];
  frameCanvases.forEach((canvas, idx) => {
    const fCtx = canvas.getContext("2d");
    let angle = 0;
    const type = idx % 4;
    function drawFrame(active) {
      fCtx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2, cy = canvas.height / 2;
      angle += active ? 0.02 : 0.004;
      fCtx.save();
      fCtx.translate(cx, cy);
      fCtx.rotate(angle);
      fCtx.strokeStyle = active ? "rgba(255,230,0,0.9)" : "rgba(255,255,255,0.2)";
      fCtx.lineWidth = 1.8;
      if (type === 0) fCtx.strokeRect(-60, -60, 120, 120);
      else if (type === 1) {
        fCtx.beginPath();
        for (let i = 0; i < 3; i++) {
          let a = (i / 3) * Math.PI * 2;
          let x = Math.cos(a) * 80, y = Math.sin(a) * 80;
          i === 0 ? fCtx.moveTo(x, y) : fCtx.lineTo(x, y);
        }
        fCtx.closePath(); fCtx.stroke();
      } else if (type === 2) {
        fCtx.beginPath(); fCtx.arc(0, 0, 60, 0, Math.PI * 2); fCtx.stroke();
      } else {
        for (let i = 0; i < 6; i++) {
          fCtx.rotate(Math.PI / 3);
          fCtx.beginPath(); fCtx.moveTo(0, 0); fCtx.lineTo(0, 90); fCtx.stroke();
        }
      }
      fCtx.restore();
    }
    frameDrawers.push({ frame: canvas.closest(".frame"), draw: drawFrame });
  });

  function animateFrameArt() {
    frameDrawers.forEach(d => d.draw(d.frame.classList.contains("active")));
    requestAnimationFrame(animateFrameArt);
  }
  animateFrameArt();

  window.addEventListener("load", initFilmStrip);
  window.addEventListener("resize", () => setTimeout(initFilmStrip, 200));
}