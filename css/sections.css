/* ========== HERO SECTION ========== */
#hero-wrapper { height: 220vh; }
#hero { position: sticky; top: 0; height: 100vh; overflow: hidden; }
#sequence { position: fixed; width: 100%; height: 100%; z-index: 10; }
#glassOverlay {
  position: absolute; inset: 0; z-index: 12; pointer-events: none;
  background: linear-gradient(120deg, rgba(255,255,255,0.06), transparent 40%),
              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), transparent 60%);
  mix-blend-mode: soft-light;
}
#fadeOverlay { position: absolute; inset: 0; background: #000; opacity: 1; z-index: 30; }
.headline {
  position: absolute; left: 50%; transform: translate(-50%, -50%);
  font-size: clamp(60px, 8vw, 160px); text-align: center;
  font-family: 'Bebas Neue', sans-serif;
}
#topText { top: 42%; z-index: 25; color: #fff; }
#bottomText { top: 58%; z-index: 2; color: #ffe600; }
#ghostText { top: 58%; z-index: 15; color: #ffe600; opacity: 0.2; }

/* ========== FILM SECTION ========== */
#film-section { height: 300vh; background: #000; position: relative; z-index: 5; }
#film-container { position: sticky; top: 0; height: 100vh; display: flex; align-items: center; overflow: hidden; }
#film-strip { display: flex; padding: 0 40vw; position: relative; }
#film-strip::before, #film-strip::after {
  content: ""; position: absolute; left: 0; width: 100%; height: 14px;
  background: repeating-linear-gradient(90deg, #000 0, #000 12px, #1a1a1a 12px, #1a1a1a 26px);
}
#film-strip::before { top: calc(50% - 230px); }
#film-strip::after { top: calc(50% + 230px - 14px); }
.frame {
  min-width: 320px; height: 440px;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(to bottom, #151515, #0d0d0d);
  border-left: 1px solid rgba(255,255,255,0.05);
  opacity: 0.08; transform: scale(0.85);
  transition: all 0.4s ease;
  position: relative; overflow: hidden;
}
.frame:first-child { border-left: none; }
.frame.active { opacity: 1; transform: scale(1); box-shadow: 0 0 80px rgba(0,0,0,0.8); }
.frame-text { color: #fff; font-size: 32px; text-align: center; opacity: 0; transform: translateY(30px); transition: all 0.4s ease; font-weight: 500; }
.frame.active .frame-text { opacity: 1; transform: translateY(0); }
.frame-canvas { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.6; }
.frame.active .frame-canvas { opacity: 1; }

/* ========== PROJECTOR SECTION ========== */
#projector-section { height: 500vh; background: #000; position: relative; z-index: 50; }
#screen-wrap { position: sticky; top: 0; height: 100vh; display: flex; align-items: center; justify-content: center; }
#floating-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
.hero-line {
  position: absolute; font-size: clamp(60px, 8vw, 140px); color: #fff;
  opacity: 0; transform: scale(1.2); font-family: 'Bebas Neue', sans-serif;
}
.hero-line.brand { font-size: clamp(80px, 10vw, 160px); }
#projection-screen {
  width: min(700px, 80vw); height: min(420px, 300vh);
  background: transparent; border-radius: 6px;
  box-shadow: 0 0 80px rgba(255,255,255,0.25), 0 0 160px rgba(255,255,255,0.15);
  overflow: hidden; position: relative;
}
#projection-screen::after {
  content: ""; position: absolute; inset: 0;
  background: rgba(0,0,0,0.04); animation: flicker 0.12s infinite alternate;
}
#screen-content { position: relative; text-align: center; display: flex; align-items: center; justify-content: center; height: 100%; }
.screen-line { font-size: clamp(22px, 2vw, 32px); color: #ffffff; margin: 8px 0; opacity: 0; transform: translateY(10px); font-weight: 500; }

/* ========== TRANSFORM SECTION ========== */
.ct-transform {
  position: relative;
  background: radial-gradient(circle at 30% 20%, #0a070c, #020103);
  font-family: 'Inter', sans-serif;
  color: #fff;
  overflow-x: hidden;
}
.ct-transform::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 30%, rgba(255,255,240,0.03), transparent 50%),
              radial-gradient(circle at 85% 70%, rgba(212,175,55,0.08), transparent 60%);
  pointer-events: none;
  z-index: 0;
}
.ct-scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, #d4af37, #ffea80);
  z-index: 9999;
  box-shadow: 0 0 6px rgba(255,215,0,0.6);
}
.ct-scroll-space {
  height: 500vh;
  position: relative;
  z-index: 2;
}
.ct-story {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  will-change: transform;
  background: transparent;
}
#ctCanvas {
  width: min(80vw, 520px);
  aspect-ratio: 1 / 1;
  border-radius: 42px;
  background: rgba(10,8,15,0.55);
  backdrop-filter: blur(12px);
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08);
  transition: opacity 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
}
.ct-text {
  margin-top: 2rem;
  font-size: clamp(20px, 2.8vw, 38px);
  font-weight: 600;
  letter-spacing: -0.01em;
  text-align: center;
  background: linear-gradient(135deg, #fff5e0, #ffdd99);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  transition: all 0.25s ease;
  min-height: 90px;
  padding: 0 1rem;
}
.ct-buttons {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
  align-items: center;
  width: 85%;
  max-width: 780px;
  opacity: 0;
  visibility: hidden;
  z-index: 20;
  pointer-events: auto;
  animation: floatContainer 3s ease-in-out infinite;
}
.ct-btn {
  background: rgba(20,15,28,0.75);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(212,175,55,0.55);
  color: #ffdf7e;
  padding: 10px 24px;
  border-radius: 60px;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
.ct-btn:hover {
  background: #ffd966;
  color: #0a050f;
  transform: scale(1.05);
  border-color: #ffea9e;
}
.ct-hint {
  display: none;
}

/* Constellation container */
.constellation {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 900px;
  height: auto;
  min-height: 500px;
  pointer-events: none;
  z-index: 25;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.6s ease, visibility 0s 0.6s;
}
.constellation.visible {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.6s ease, visibility 0s 0s;
}
.center-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: rgba(20,15,28,0.85);
  backdrop-filter: blur(12px);
  border-radius: 50%;
  border: 2px solid rgba(212,175,55,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.4rem;
  font-weight: 400;
  letter-spacing: 2px;
  color: #ffdf7e;
  text-align: center;
  line-height: 1.2;
  box-shadow: 0 0 30px rgba(212,175,55,0.4);
  z-index: 10;
  pointer-events: none;
  white-space: pre-line;
  padding: 0 0.5rem;
}
.constellation .ct-btn {
  position: absolute;
  transform: translate(-50%, -50%);
  background: rgba(20,15,28,0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212,175,55,0.7);
  color: #ffdf7e;
  padding: 0.6rem 1.2rem;
  border-radius: 60px;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.25s;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  white-space: nowrap;
  pointer-events: auto;
  animation: floatButton 3s ease-in-out infinite;
  animation-delay: calc(var(--i, 0) * 0.1s);
}
.constellation .ct-btn:hover {
  background: #ffd966;
  color: #0a050f;
  transform: translate(-50%, -50%) scale(1.08);
  border-color: #ffea9e;
}
#constellation-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

/* ========== CLOSING SECTION ========== */
.closing-section {
  position: relative;
  background: radial-gradient(circle at 20% 30%, #0a070c, #0a070c 60%, #020103);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1.5rem;
  overflow: hidden;
  z-index: 10;
}
.closing-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
.closing-container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  width: 100%;
  text-align: center;
  transition: transform 0.1s ease-out;
}
.headline-reveal { margin-bottom: 1.5rem; }
.closing-headline {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(48px, 10vw, 100px);
  font-weight: 400;
  letter-spacing: 2px;
  line-height: 1.2;
  margin: 0;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s cubic-bezier(0.2,0.9,0.4,1.1), transform 0.6s cubic-bezier(0.2,0.9,0.4,1.1);
}
.closing-headline:first-child { color: #fff; }
.closing-headline:last-child { color: #ffdf7e; text-shadow: 0 0 10px rgba(255,223,126,0.5); }
.in-view .closing-headline:first-child { opacity: 1; transform: translateY(0); transition-delay: 0.2s; }
.in-view .closing-headline:last-child { opacity: 1; transform: translateY(0); transition-delay: 0.5s; }
.micro-story {
  font-size: 1rem;
  color: rgba(255,255,255,0.7);
  letter-spacing: 1px;
  margin: 1rem 0 3rem;
  opacity: 0;
  transform: translateY(15px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  transition-delay: 0.8s;
}
.in-view .micro-story { opacity: 1; transform: translateY(0); }
.benefits-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 4rem;
}
.benefit-card {
  background: rgba(20,15,28,0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(212,175,55,0.3);
  border-radius: 24px;
  padding: 1.5rem;
  width: 200px;
  transition: all 0.4s cubic-bezier(0.2,0.9,0.4,1.1);
  opacity: 0;
  transform: translateY(30px);
}
.in-view .benefit-card {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.benefits-grid:hover .benefit-card { opacity: 0.3; filter: blur(2px); transition: all 0.3s ease; }
.benefit-card:hover { opacity: 1 !important; filter: blur(0) !important; transform: translateY(-10px) scale(1.05); }
.benefit-icon { font-size: 2.5rem; margin-bottom: 1rem; }
.benefit-card h3 { font-size: 1.2rem; margin-bottom: 0.5rem; color: #ffdf7e; }
.benefit-card p { font-size: 0.85rem; color: #ccc; line-height: 1.4; }
.team-showcase {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 4rem;
}
.team-member {
  text-align: center;
  width: 180px;
  opacity: 0;
  transform: translateX(-30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.team-member.right { transform: translateX(30px); }
.in-view .team-member { opacity: 1; transform: translateX(0); }
.in-view .team-member.left { transition-delay: 0.2s; }
.in-view .team-member.right { transition-delay: 0.4s; }
.member-avatar {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #ffdf7e, #b8860b);
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(212,175,55,0.5);
  transition: transform 0.3s ease;
}
.member-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.team-member h4 { color: #ffdf7e; }
.team-member p { color: rgba(255,255,255,0.8); }
.team-member .member-tag { color: #ffdf7e; background: rgba(0,0,0,0.4); display: inline-block; padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.7rem; }
.team-connection {
  position: relative;
  width: 100px;
  height: 2px;
  background: rgba(212,175,55,0.5);
  overflow: hidden;
}
.team-connection::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, #ffdf7e, transparent);
  animation: flowLine 2s linear infinite;
}
.orbit-system {
  position: relative;
  width: 320px;
  height: 320px;
  margin: 2rem auto;
}
.orbit-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  background: #ffdf7e;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 15px gold;
  z-index: 2;
  animation: pulseCore 2s ease-in-out infinite;
}
.orbit-ring {
  position: relative;
  width: 100%;
  height: 100%;
  animation: rotate 20s linear infinite;
}
.orbit-item {
  position: absolute;
  width: 100px;
  text-align: center;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(212,175,55,0.4);
  border-radius: 40px;
  padding: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: default;
}
.orbit-item:hover {
  border-color: #ffdf7e;
  transform: scale(1.1);
  background: rgba(212,175,55,0.2);
  color: #fff;
}
.orbit-item:nth-child(1) { top: 0%; left: 50%; transform: translate(-50%, -50%); }
.orbit-item:nth-child(2) { top: 50%; right: 0%; transform: translate(50%, -50%); }
.orbit-item:nth-child(3) { bottom: 0%; left: 50%; transform: translate(-50%, 50%); }
.orbit-item:nth-child(4) { top: 50%; left: 0%; transform: translate(-50%, -50%); }
.pre-cta {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.8);
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
  transition-delay: 0.9s;
}
.in-view .pre-cta { opacity: 1; transform: translateY(0); }
.contact-info {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.6);
  letter-spacing: 0.5px;
}
.closing-section::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, transparent 30%, rgba(0,0,0,0.6) 100%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 1.5s ease;
  z-index: 5;
}
.closing-section.end-phase::after { opacity: 0.5; }

/* ========== CREATIVE FOOTER ========== */
.creative-footer {
  position: relative;
  z-index: 20;
  background: linear-gradient(0deg, rgba(2,1,3,0.95) 0%, rgba(10,7,12,0.8) 100%);
  backdrop-filter: blur(4px);
  border-top: 1px solid rgba(212,175,55,0.3);
  padding: 3rem 1.5rem;
  text-align: center;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-logo {
  margin-bottom: 2rem;
}

.footer-logo-img {
  max-width: 180px;
  height: auto;
  display: inline-block;
  filter: drop-shadow(0 0 6px rgba(212,175,55,0.3));
  transition: transform 0.3s ease;
}
.footer-logo-img:hover {
  transform: scale(1.02);
}

.logo-underline {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #ffdf7e, transparent);
  margin: 0.5rem auto 0;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(20,15,28,0.6);
  border-radius: 50%;
  border: 1px solid rgba(212,175,55,0.6);
  color: #ffdf7e;
  font-size: 1.4rem;
  transition: all 0.3s;
  text-decoration: none;
}
.social-icon:hover {
  transform: translateY(-4px);
  background: rgba(212,175,55,0.2);
  border-color: #ffdf7e;
  box-shadow: 0 0 12px rgba(212,175,55,0.8);
  color: #fff;
}

.copyright {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
  letter-spacing: 0.5px;
}
.copyright .tagline {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: rgba(255,223,126,0.7);
}