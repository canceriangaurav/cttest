export function initStars() {
  const starCanvas = document.getElementById("stars");
  if (!starCanvas) return;

  let ctx = starCanvas.getContext("2d");
  let width, height, stars = [];

  function initStarsCanvas() {
    width = starCanvas.width = window.innerWidth;
    height = starCanvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < 160; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6,
        s: Math.random() * 0.2 + 0.1
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,245,200,0.2)";
      ctx.fill();
      star.y += star.s;
      if (star.y > height) star.y = 0;
    });
    requestAnimationFrame(drawStars);
  }

  window.addEventListener("resize", initStarsCanvas);
  initStarsCanvas();
  drawStars();
}