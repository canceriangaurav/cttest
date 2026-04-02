export function initProjectorSound() {
  const projectorSection = document.getElementById('projector-section');
  if (!projectorSection) {
    console.warn('Projector section not found');
    return;
  }

  let humAudio = null;
  let lastScrollY = window.scrollY;
  let lastTimestamp = Date.now();
  let isInView = false;
  let scrollTimeout = null;

  const MIN_PLAYBACK_RATE = 0.8;
  const MAX_PLAYBACK_RATE = 1.2;
  const SENSITIVITY = 30;

  function getHumAudio() {
    if (!humAudio && window.ChronotalesAudio) {
      humAudio = window.ChronotalesAudio.getSoundElement('projector_hum');
      if (humAudio) {
        console.log('Projector audio element obtained');
        humAudio.loop = true;
        humAudio.volume = 0.15;
        humAudio.playbackRate = 1;
      } else {
        console.warn('projector_hum sound not found in ChronotalesAudio');
      }
    }
    return humAudio;
  }

  function updateScrollSpeed() {
    if (!humAudio) return;
    const now = Date.now();
    const deltaY = window.scrollY - lastScrollY;
    const deltaT = now - lastTimestamp;
    if (deltaT > 0) {
      const scrollSpeed = Math.abs(deltaY) / deltaT;
      let rate = Math.min(Math.max(scrollSpeed * SENSITIVITY, MIN_PLAYBACK_RATE), MAX_PLAYBACK_RATE);
      if (humAudio.readyState >= 2) {
        humAudio.playbackRate = rate;
      }
    }
    lastScrollY = window.scrollY;
    lastTimestamp = now;
  }

  function startHum() {
    if (!window.ChronotalesAudio || !window.ChronotalesAudio.isEnabled()) {
      console.log('Projector sound: audio not enabled');
      return;
    }
    const audio = getHumAudio();
    if (audio && audio.paused) {
      audio.play().then(() => {
        console.log('Projector hum started');
      }).catch(e => {
        console.warn('Projector hum play failed:', e);
      });
    }
  }

  function stopHum() {
    if (humAudio && !humAudio.paused) {
      humAudio.pause();
      humAudio.currentTime = 0;
      console.log('Projector hum stopped');
    }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isInView = entry.isIntersecting;
      if (!isInView) {
        stopHum();
      }
    });
  }, { threshold: 0.1 });
  observer.observe(projectorSection);

  window.addEventListener('scroll', () => {
    if (!isInView) return;
    updateScrollSpeed();
    startHum();

    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      stopHum();
    }, 200);
  });

  if (window.ChronotalesAudio) {
    const originalEnable = window.ChronotalesAudio.enable;
    window.ChronotalesAudio.enable = function() {
      originalEnable.apply(this);
      // No automatic start; rely on scroll
    };
  }
}