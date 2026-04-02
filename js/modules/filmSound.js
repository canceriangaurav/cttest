export function initFilmSound() {
  const filmSection = document.getElementById('film-section');
  if (!filmSection) {
    console.warn('Film section not found');
    return;
  }

  let filmAudio = null;
  let lastScrollY = window.scrollY;
  let lastTimestamp = Date.now();
  let isInView = false;
  let scrollTimeout = null;

  const MIN_PLAYBACK_RATE = 0.5;
  const MAX_PLAYBACK_RATE = 2.0;
  const SENSITIVITY = 50;

  function getFilmAudio() {
    if (!filmAudio && window.ChronotalesAudio) {
      filmAudio = window.ChronotalesAudio.getSoundElement('film_reel');
      if (filmAudio) {
        console.log('Film audio element obtained');
        filmAudio.loop = true;
        filmAudio.volume = 0.35;
        filmAudio.playbackRate = 1;
      } else {
        console.warn('film_reel sound not found in ChronotalesAudio');
      }
    }
    return filmAudio;
  }

  function updateScrollSpeed() {
    if (!filmAudio) return;
    const now = Date.now();
    const deltaY = window.scrollY - lastScrollY;
    const deltaT = now - lastTimestamp;
    if (deltaT > 0) {
      const scrollSpeed = Math.abs(deltaY) / deltaT;
      let rate = Math.min(Math.max(scrollSpeed * SENSITIVITY, MIN_PLAYBACK_RATE), MAX_PLAYBACK_RATE);
      if (filmAudio.readyState >= 2) {
        filmAudio.playbackRate = rate;
      }
    }
    lastScrollY = window.scrollY;
    lastTimestamp = now;
  }

  function startReelSound() {
    if (!window.ChronotalesAudio || !window.ChronotalesAudio.isEnabled()) {
      console.log('Film sound: audio not enabled');
      return;
    }
    const audio = getFilmAudio();
    if (audio && audio.paused) {
      audio.play().then(() => {
        console.log('Film reel started');
      }).catch(e => {
        console.warn('Film reel play failed:', e);
      });
    }
  }

  function stopReelSound() {
    if (filmAudio && !filmAudio.paused) {
      filmAudio.pause();
      filmAudio.currentTime = 0;
      console.log('Film reel stopped');
    }
  }

  // Intersection Observer to know when section is visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isInView = entry.isIntersecting;
      if (!isInView) {
        // If not in view, stop the sound immediately
        stopReelSound();
      }
      // We don't start sound here; it will start on scroll
    });
  }, { threshold: 0.1 });
  observer.observe(filmSection);

  // Scroll event: update pitch and ensure sound plays while scrolling
  window.addEventListener('scroll', () => {
    if (!isInView) return;
    updateScrollSpeed();
    startReelSound();

    // Stop after scrolling stops
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      stopReelSound();
    }, 200);
  });

  // If audio gets enabled while section is in view, we may need to start on next scroll
  if (window.ChronotalesAudio) {
    const originalEnable = window.ChronotalesAudio.enable;
    window.ChronotalesAudio.enable = function() {
      originalEnable.apply(this);
      // No automatic start; rely on scroll
    };
  }
}