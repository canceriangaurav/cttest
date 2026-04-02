// js/about-main.js
import { initNavMap } from './nav.js';
import { initStars } from './modules/stars.js';
import { initAudio } from './modules/audio.js';
import { initAbout } from './about.js';

document.addEventListener('DOMContentLoaded', () => {
  initStars();
  initAudio();          // shows consent modal and sets up audio
  initAbout();          // runs the narrative logic
  initNavMap();         // sets up the interactive map and breadcrumb
});