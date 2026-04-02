// js/creative-main.js

import { initNavMap } from './nav.js';
import { initStars } from './modules/stars.js';
import { initAudio } from './modules/audio.js';
import { initCreativePage } from './pages/creative.js';

document.addEventListener('DOMContentLoaded', () => {

  // 🌌 Global environment (reuse your ecosystem)
  if (typeof initStars === "function") {
    initStars();   // background stars (nav / global)
  }

  // 🔊 Audio system (important for later immersion)
  if (typeof initAudio === "function") {
    initAudio();
  }

  // 🎬 Creative cinematic engine
  initCreativePage();

  // 🧭 Navigation map (hamburger + galaxy nav)
  if (typeof initNavMap === "function") {
    initNavMap();
  }

});