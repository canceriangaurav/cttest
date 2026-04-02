export function initHero() {
  const canvasSeq = document.getElementById("sequence");
  if (!canvasSeq) return;

  const seqCtx = canvasSeq.getContext("2d");
  const frameCount = 26;
  const images = new Array(frameCount);
  const sequenceObj = { frame: 0 };

  const DRAW_GOLDEN_LINE = true;
  const LINE_WIDTH = 3;
  const LINE_COLOR = "#ffdf7e";
  const PULSE_ANIMATION = true;
  const MOBILE_LINE_PERCENT = 0.6;
  const DESKTOP_LINE_PERCENT = 1.0;

  // Loading overlay
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'hero-loading';
  loadingDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    color: #ffdf7e;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', sans-serif;
    font-size: 1.2rem;
    z-index: 1000;
    backdrop-filter: blur(4px);
  `;
  loadingDiv.innerHTML = 'Loading experience...';
  document.body.appendChild(loadingDiv);

  function hideOverlay() {
    if (loadingDiv && loadingDiv.parentNode) loadingDiv.remove();
  }

  const firstImg = new Image();
  firstImg.onload = () => {
    images[0] = firstImg;
    hideOverlay();
    renderSequence();
    loadRemainingImages();
  };
  firstImg.onerror = () => {
    console.error('Failed to load first hourglass image');
    hideOverlay();
  };
  firstImg.src = 'assets/images/hourglass/hourglass_00001.webp';

  function loadRemainingImages() {
    for (let i = 1; i < frameCount; i++) {
      const img = new Image();
      img.onload = () => {
        images[i] = img;
        renderSequence();
      };
      img.src = `assets/images/hourglass/hourglass_${String(i+1).padStart(5,'0')}.webp`;
    }
  }

  function renderSequence() {
    const img = images[sequenceObj.frame];
    if (!img || !img.width) return;

    seqCtx.clearRect(0, 0, canvasSeq.width, canvasSeq.height);
    const isMobile = window.innerWidth < 768;
    const maxWidth  = isMobile ? 0.7 : 0.5;
    const maxHeight = isMobile ? 0.5 : 0.5;
    const targetWidth  = canvasSeq.width  * maxWidth;
    const targetHeight = canvasSeq.height * maxHeight;
    const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
    const imgWidth  = img.width  * scale;
    const imgHeight = img.height * scale;
    const x = (canvasSeq.width  - imgWidth)  / 2;
    const y = (canvasSeq.height - imgHeight) / 2;

    seqCtx.globalCompositeOperation = "lighter";
    seqCtx.drawImage(img, x, y, imgWidth, imgHeight);
    seqCtx.globalCompositeOperation = "source-over";

    if (DRAW_GOLDEN_LINE) {
      seqCtx.save();
      seqCtx.shadowBlur = PULSE_ANIMATION ? (6 + Math.sin(Date.now() * 0.005) * 3) : 8;
      seqCtx.shadowColor = LINE_COLOR;
      seqCtx.strokeStyle = LINE_COLOR;
      seqCtx.lineWidth = LINE_WIDTH;

      const linePercent = isMobile ? MOBILE_LINE_PERCENT : DESKTOP_LINE_PERCENT;
      const lineWidthPx = imgWidth * linePercent;
      const startX = x + (imgWidth - lineWidthPx) / 2;
      seqCtx.beginPath();
      seqCtx.moveTo(startX, y);
      seqCtx.lineTo(startX + lineWidthPx, y);
      seqCtx.stroke();
      seqCtx.restore();
    }
  }

  gsap.to(sequenceObj, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      trigger: "#hero-wrapper",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2
    },
    onUpdate: renderSequence
  });

  ScrollTrigger.create({
    trigger: "#hero-wrapper",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: self => {
      let p = self.progress;
      let opacity = p > 0.85 ? Math.pow((p - 0.85) / 0.15, 2) : 0;
      const fadeOverlay = document.getElementById("fadeOverlay");
      if (fadeOverlay) fadeOverlay.style.opacity = opacity;
    }
  });

  function resizeHero() {
    canvasSeq.width = window.innerWidth;
    canvasSeq.height = window.innerHeight;
    renderSequence();
  }
  window.addEventListener("resize", resizeHero);
  resizeHero();
}