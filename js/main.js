// js/main.js
import { initNavMap } from './nav.js';           // ✅ corrected path (was './js/nav.js')
import { initStars } from './modules/stars.js';
import { initHero } from './modules/hero.js';
import { initFilm } from './modules/film.js';
import { initProjector } from './modules/projector.js';
import { initTransform } from './modules/transform.js';
import { initClosing } from './modules/closing.js';
import { initAudio } from './modules/audio.js';
import { initFilmSound } from './modules/filmSound.js';
import { initProjectorSound } from './modules/projectorSound.js';
import { initBackToTop } from './modules/backtotop.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavMap();                                 // ✅ called early

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.error('GSAP or ScrollTrigger not loaded');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  initStars();
  initHero();
  initFilm();
  initProjector();
  initTransform();
  initClosing();
  initAudio();
  initFilmSound();       // must run after initAudio (global object ready)
  initProjectorSound();  // must run after initAudio
  initBackToTop();

  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) yearSpan.innerText = new Date().getFullYear();
});