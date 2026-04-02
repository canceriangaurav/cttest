body {
  margin: 0;
  background: black;
  color: white;
  font-family: 'Bebas Neue', sans-serif;
  overflow-x: hidden;
}

/* STAR BG */
#stars {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* TEXT */
.text {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: clamp(40px, 8vw, 120px);
  opacity: 0;
  background: linear-gradient(135deg,#fff,#ffdf7e);
  -webkit-background-clip: text;
  color: transparent;
  z-index: 10;
}

/* LINE */
.line {
  position: fixed;
  top: calc(50% - 70px);
  left: 50%;
  width: 60px;
  height: 2px;
  background: #ffdf7e;
  transform: translateX(-50%);
  opacity: 0;
}

/* 4 LINES */
.lines {
  position: fixed;
  top: calc(50% - 70px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 6px;
  opacity: 0;
}
.lines div {
  width: 60px;
  height: 2px;
  background: #ffdf7e;
}

/* SQUARE */
#square {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  transform: translate(-50%, -50%);
  border: 2px solid #ffdf7e;
  opacity: 0;
  z-index: 9;
}

/* GRID */
#grid {
  position: fixed;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 10px;
  padding: 10px;
  opacity: 0;
  z-index: 20;
  pointer-events: none;
}

.card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}

.card video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
}

.card span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  font-size: 26px;
  opacity: 0;
}

/* PROGRESS */
#progress {
  position: fixed;
  bottom: 20px;
  right: 20px;
  color: #ffdf7e;
}

#cinematic-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
}

#cinematic-stage {
  position: fixed;
  inset: 0;
  transform-origin: center;
  will-change: transform;
}

/* ===== PREMIUM POLISH ===== */

/* subtle glow for text */
.text {
  text-shadow:
    0 0 10px rgba(255,223,126,0.3),
    0 0 20px rgba(255,223,126,0.15);
}

/* square glow */
#square {
  box-shadow:
    0 0 20px rgba(255,223,126,0.25),
    0 0 40px rgba(255,223,126,0.1);
}

/* grid cinematic feel */
#grid {
  backdrop-filter: blur(6px);
}

/* light sweep overlay */
#lightSweep {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 5;
  background: linear-gradient(
    120deg,
    transparent 40%,
    rgba(255,255,255,0.08),
    transparent 60%
  );
  opacity: 0;
}


/* allow footer to appear after pinned section */
#cinematic-wrapper {
  height: 100vh;
}

body::after {
  content: "";
  display: block;
  height: 10vh; /* gives space to scroll into footer */
}


/* TEXT WRAPPER */
.card-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  padding: 20px;
  pointer-events: none;
}

/* TITLE */
.card-text h2 {
  font-size: clamp(20px, 2vw, 36px);
  letter-spacing: 3px;
  color: #ffffff;

  opacity: 0;
  transform: translateY(20px);
}

/* SUBTEXT */
.card-text p {
  margin-top: -15px;
  font-size: clamp(12px, 2vw, 16px);
  color: rgba(255, 255, 255, 0.7);

  opacity: 0;
  transform: translateY(20px);
}

/* subtle overlay for readability */
.card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0,0,0,0.6),
    rgba(0,0,0,0.2),
    transparent
  );
}