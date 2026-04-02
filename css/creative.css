/* =========================
   ROOT SYSTEM (DESIGN TOKENS)
========================= */
:root {
  --bg: #000;
  --text: #fff;
  --accent: #ffe600;

  --space-sm: 12px;
  --space-md: 20px;
  --space-lg: 40px;
  --space-xl: 80px;

  --max-width: 1100px;
}

/* =========================
   BASE
========================= */
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

/* cinematic background */
#creative-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: 0.3;
}

/* =========================
   SCENES
========================= */
.scene {
  position: fixed;
  inset: 0;

  opacity: 0;
  visibility: hidden;
  pointer-events: none;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: var(--space-lg) var(--space-md);
  box-sizing: border-box;

  z-index: 1;
}

.scene.active {
  opacity: 1;
  visibility: visible;
  pointer-events: all;
  z-index: 5;
}

/* depth layer */
.scene::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.85));
  z-index: -1;
}

/* =========================
   TYPOGRAPHY SYSTEM
========================= */
h1, h2 {
  font-family: 'Bebas Neue', sans-serif;
  letter-spacing: 2px;
  margin: 0;
}

h1 {
  font-size: clamp(42px, 12vw, 140px);
  line-height: 1.05;
}

h2 {
  font-size: clamp(28px, 8vw, 80px);
}

p {
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.7;
}

/* =========================
   SCENE 1 — ENTRY
========================= */
#scene-1 {
  text-align: center;
}

.entry-line {
  margin-bottom: var(--space-sm);
}

.highlight {
  color: var(--accent);
}

/* =========================
   SCENE 2 — PHILOSOPHY
========================= */
#scene-2 {
  flex-direction: column;
  text-align: center;
  gap: var(--space-lg);
}

.philo-text {
  max-width: 600px;
}

.morph-blob {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,230,0,0.4), transparent);
  filter: blur(50px);
}

/* =========================
   SCENE 3 — CAPABILITIES
========================= */
#scene-3 {
  flex-direction: column;
  gap: var(--space-lg);
}

.cap-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
  max-width: 500px;
}

.cap-card {
  padding: var(--space-md);
  border: 1px solid rgba(255, 255, 255, 0.9);
  font-size: 18px;
  text-align: left;
  letter-spacing: 1px;
}

/* =========================
   SCENE 4 — PROCESS
========================= */
#scene-4 {
  flex-direction: column;
  gap: var(--space-md);
  text-align: center;
}

.process-line {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 20px;
  letter-spacing: 2px;
}

/* =========================
   SCENE 5 — WORK
========================= */
#scene-5 {
  flex-direction: column;
  gap: var(--space-md);
}

.work-item {
  width: 100%;
  max-width: 500px;
  padding: var(--space-md);
  border: 1px solid rgba(255,255,255,0.1);
}

/* =========================
   SCENE 6 — CTA
========================= */
#scene-6 {
  flex-direction: column;
  text-align: center;
  gap: var(--space-md);
}

.cta-row {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 300px;
  gap: 10px;
}

.cta-row a {
  padding: 12px;
  border: 1px solid var(--accent);
  color: var(--accent);
  text-decoration: none;
  text-align: center;
}

/* =========================
   SCENE 7 — EXPLORE
========================= */
#scene-7 {
  flex-direction: column;
  gap: var(--space-lg);
  text-align: center;
}

.explore-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
  max-width: 400px;
}

.explore-card {
  padding: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  font-size: 18px;
  letter-spacing: 2px;
}

/* =========================
   SCENE 8 — FOOTER
========================= */
#scene-8 {
  text-align: center;
}

.footer-line {
  font-size: clamp(32px, 10vw, 80px);
}

.footer-divider {
  width: 60px;
  height: 1px;
  background: var(--accent);
  margin: 20px auto;
}

/* =========================
   TABLET (>=768px)
========================= */
@media (min-width: 768px) {

  .cap-grid {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .cap-card {
    width: 45%;
  }

  .process-line {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .explore-grid {
    flex-direction: row;
    justify-content: center;
  }

  .explore-card {
    width: 150px;
  }

  .cta-row {
    flex-direction: row;
    justify-content: center;
  }
}

/* =========================
   DESKTOP (>=1024px)
========================= */
@media (min-width: 1024px) {

  .cap-card {
    width: 30%;
  }

  .explore-card {
    width: 180px;
  }

  p {
    font-size: 16px;
  }
}