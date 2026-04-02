


body.nav-open {
  overflow: hidden;
}
/* ===============================
   🍔 HAMBURGER MENU
=============================== */
.hamburger {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 30px;
  height: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  z-index: 9999;
  background: transparent;
  animation: breathe 3s ease-in-out infinite;
}
@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.05); opacity: 1; }
}
.hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  background: #ffdf7e;
  transition: 0.3s ease;
  border-radius: 2px;
}

/* Hover effect (temporary X) */
.hamburger:hover span:nth-child(1) {
  transform: translateY(4px) rotate(45deg);
  width: 80%;
  transform-origin: left;
}
.hamburger:hover span:nth-child(2) {
  opacity: 0;
}
.hamburger:hover span:nth-child(3) {
  transform: translateY(-4px) rotate(-45deg);
  width: 80%;
  transform-origin: left;
}

/* When map is open, hamburger stays as X */
.hamburger.open span:nth-child(1) {
  transform: translateY(4px) rotate(45deg);
  width: 80%;
  transform-origin: left;
}
.hamburger.open span:nth-child(2) {
  opacity: 0;
}
.hamburger.open span:nth-child(3) {
  transform: translateY(-4px) rotate(-45deg);
  width: 80%;
  transform-origin: left;
}

/* ===============================
   🌌 NAV MAP
=============================== */
.nav-map {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at center, #03010a, #000);
  z-index: 999;
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
}
.nav-map.active {
  opacity: 1;
  pointer-events: auto;
}

#galaxy-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
}

.map-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Portrait box – fixed aspect ratio */
.portrait-box {
  position: relative;
  width: 90%;
  max-width: 400px;
  aspect-ratio: 9 / 16;
  background: rgba(0,0,0,0.5);
  border-radius: 32px;
  border: 1px solid rgba(255,223,126,0.3);
  box-shadow: 0 0 40px rgba(0,0,0,0.5);
  overflow: visible;
  margin: 0 auto;
  
}

/* Central logo */
.central-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  backdrop-filter: blur(8px);
  border: 2px solid #ffdf7e;
  box-shadow: 0 0 30px rgba(255,223,126,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}
.central-logo img {
  width: 80%;
  height: auto;
  filter: drop-shadow(0 0 5px gold);
}

/* Orbit container – positions planets absolutely within the portrait box */
.orbit-container {
  position: absolute;
  left: 0%;
  right: 0%;
  width: 100%;
  height: 100%;
  pointer-events: none;

}

/* Planets (buttons) */
.orbit-container .map-node {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255,223,126,0.2), rgba(0,0,0,0.8));
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,223,126,0.5);
  box-shadow: 0 0 20px rgba(255,223,126,0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  letter-spacing: 1px;
  color: #ffdf7e;
  text-shadow: 0 0 6px rgba(0,0,0,0.5);
  font-size: 10px;
  z-index: 10;
   pointer-events: auto;   /* ← ADD THIS */
  /* no left/top here – each planet gets its own */
}
/* Specific positions for each node */
.node-enter   { left: 5%; top: 45%; }
.node-about   { left: 20%; top: 30%; }
.node-domains { left: 53%; top: 30%; }
.node-creative { left: 72%; top: 45%; }


.orbit-container .map-node span {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  letter-spacing: 1px;
  color: #ffdf7e;
  text-shadow: 0 0 6px rgba(0,0,0,0.5);
  font-size: 10px;
  z-index: 2;
  
}
.orbit-container .map-node:hover {
  transform: scale(1.08);
  box-shadow: 0 0 35px rgba(255,223,126,0.6);
  border-color: #ffdf7e;
}

/* Planet ring */
.planet-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 110%;
  height: 110%;
  border: 1px solid rgba(255,223,126,0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%) rotate(0deg);
  pointer-events: none;
}
.map-node:hover .planet-ring {
  animation: spinRing 3s linear infinite;
}
@keyframes spinRing {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Node glow */
.node-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,223,126,0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}
.map-node:hover .node-glow {
  opacity: 1;
}

/* Zoom overlay */
.zoom-overlay {
  position: fixed;
  inset: 0;
  background: black;
  z-index: 2000;
  pointer-events: none;
  opacity: 0;
}

/* Prevent map nodes from being clickable when the map is closed */
.nav-map:not(.active) .map-node {
  pointer-events: none !important;
}

/* Responsive */
@media (max-width: 768px) {
  .portrait-box {
    width: 95%;
    max-width: 350px;
  }
  .central-logo {
    width: 80px;
    height: 80px;
  }
  .orbit-container .map-node {
    width: 80px;
    height: 80px;
  }
  .orbit-container .map-node span {
    font-size: 10px;
    margin-top: 12px;
  }
}
@media (max-width: 480px) {
  .portrait-box {
    width: 90%;
    max-width: 280px;
  }
  .central-logo {
    width: 70px;
    height: 70px;
  }
  .orbit-container .map-node {
    width: 70px;
    height: 70px;
  }
  .orbit-container .map-node span {
    font-size: 9px;
    margin-top: 10px;
  }
}

#nav-map {
  z-index: 99999 !important;
}

#breadcrumb {
  z-index: 100000 !important;
}