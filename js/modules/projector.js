export function initProjector() {
  const heroLines = document.querySelectorAll(".hero-line");
  const screenContentDiv = document.getElementById("screen-content");
  if (!heroLines.length || !screenContentDiv) return;

  let masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#projector-section",
      start: "top center",
      end: "bottom center",
      scrub: 1.2
    }
  });

  heroLines.forEach((line, i) => {
    let t = i * 0.15;
    masterTl.to(line, { opacity: 1, scale: 1, duration: 0.2 }, t);
    masterTl.to(line, {
      scale: 0.25, y: 150, opacity: 0, duration: 0.3,
      onStart: () => {
        screenContentDiv.innerHTML = "";
        const newLine = document.createElement("div");
        newLine.classList.add("screen-line");
        newLine.textContent = line.textContent;
        screenContentDiv.appendChild(newLine);
        gsap.fromTo(newLine, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 });
      }
    }, t + 0.1);
  });
}