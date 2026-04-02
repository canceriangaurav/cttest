// js/modules/audio.js
export function initAudio() {
  const soundList = {
    cta_click: 'assets/audio/CTA_click.webm',
    cta_hover: 'assets/audio/cta_hover.webm',
    card_hover: 'assets/audio/card_hover.webm',
    orbit_ambience: 'assets/audio/orbit_system_ambience_loop.webm',
    team_connection: 'assets/audio/team_connection_line_animation.webm',
    constellation: 'assets/audio/constellation.webm',
    explosion: 'assets/audio/explosion.webm',
    brand_simplified: 'assets/audio/your_brand_simplified.webm',
    closing: 'assets/audio/closing.webm',
    final_fade: 'assets/audio/final_fade_end.webm',
    film_reel: 'assets/audio/film_strip_scroll.webm',
    projector_hum: 'assets/audio/projector.webm'
  };

  const sounds = {};
  let soundEnabled = false;
  let userInteracted = false;
  let pendingPlays = [];
  let currentLoop = null;

  // Preload all sounds
  for (const [name, src] of Object.entries(soundList)) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    if (name === 'orbit_ambience') {
      audio.loop = true;
      audio.volume = 0.2;
    }
    if (name === 'projector_hum') {
      audio.loop = true;
      audio.volume = 0.15;
    }
    sounds[name] = audio;
  }

  function _playNow(name) {
    const sound = sounds[name];
    if (!sound) return false;

    let audioToPlay;
    if (name === 'orbit_ambience' || name === 'projector_hum') {
      if (name === 'orbit_ambience' && currentLoop && !currentLoop.paused) return true;
      audioToPlay = sound;
      if (name === 'orbit_ambience') currentLoop = audioToPlay;
    } else if (name === 'film_reel') {
      audioToPlay = sound;
      if (audioToPlay.loop === false) audioToPlay.loop = true;
    } else {
      audioToPlay = sound.cloneNode();
      audioToPlay.volume = 0.5;
    }

    const promise = audioToPlay.play();
    if (promise !== undefined) {
      promise.catch(e => {
        if (e.name !== 'NotAllowedError') {
          console.warn(`Audio play failed for "${name}":`, e.message);
        }
      });
    }
    return audioToPlay;
  }

  function play(name) {
    if (!soundEnabled) return;
    if (!userInteracted) {
      pendingPlays.push(name);
      return;
    }
    _playNow(name);
  }

  function unlockAudio() {
    if (userInteracted) return;
    userInteracted = true;
    while (pendingPlays.length) {
      _playNow(pendingPlays.shift());
    }
    const dummy = new Audio();
    dummy.volume = 0;
    dummy.play().catch(() => {});
  }

  function getSoundElement(name) {
    return sounds[name];
  }

  function stopLoop(name) {
    if (name === 'orbit_ambience' && currentLoop) {
      currentLoop.pause();
      currentLoop.currentTime = 0;
      currentLoop = null;
    } else if (name === 'projector_hum') {
      const hum = sounds.projector_hum;
      if (hum) {
        hum.pause();
        hum.currentTime = 0;
      }
    } else if (name === 'film_reel') {
      const reel = sounds.film_reel;
      if (reel) {
        reel.pause();
        reel.currentTime = 0;
      }
    }
  }

  function enable() {
    soundEnabled = true;
    if (!userInteracted) unlockAudio();
  }

  function disable() {
    soundEnabled = false;
    stopLoop('orbit_ambience');
    stopLoop('projector_hum');
    stopLoop('film_reel');
  }

  function toggle() {
    if (soundEnabled) disable();
    else enable();
    const btn = document.getElementById('audioToggleBtn');
    if (btn) btn.innerHTML = soundEnabled ? '🔊' : '🔇';
    localStorage.setItem('chronotales_sound_enabled', soundEnabled);
  }

  function isEnabled() {
    return soundEnabled;
  }

  window.ChronotalesAudio = {
    enable,
    disable,
    toggle,
    play,
    stopLoop,
    isEnabled,
    getSoundElement
  };

  // Create floating toggle button
  if (!document.getElementById('audioToggleBtn')) {
    const btn = document.createElement('button');
    btn.id = 'audioToggleBtn';
    btn.innerHTML = '🔇';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = '9999';
    btn.style.background = 'rgba(20,15,28,0.7)';
    btn.style.backdropFilter = 'blur(4px)';
    btn.style.border = '1px solid rgba(212,175,55,0.6)';
    btn.style.borderRadius = '50%';
    btn.style.width = '44px';
    btn.style.height = '44px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '20px';
    btn.style.color = '#ffdf7e';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.transition = 'all 0.2s';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.ChronotalesAudio.toggle();
    });
    document.body.appendChild(btn);
  }

  // ----- Persistent sound preference -----
  const storedPref = localStorage.getItem('chronotales_sound_enabled');
  const consentModal = document.getElementById('soundConsentModal');

  function closeModal() {
    if (consentModal) {
      consentModal.style.display = 'none';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }

  if (storedPref !== null) {
    // Restore previous choice
    if (storedPref === 'true') {
      enable();
      const btn = document.getElementById('audioToggleBtn');
      if (btn) btn.innerHTML = '🔊';
    } else {
      disable();
      const btn = document.getElementById('audioToggleBtn');
      if (btn) btn.innerHTML = '🔇';
    }
    closeModal(); // ensure modal is hidden
  } else if (consentModal) {
    // No stored preference: show consent modal
    consentModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;

    const enableBtn = document.getElementById('enableSoundBtn');
    const disableBtn = document.getElementById('disableSoundBtn');

    if (enableBtn) {
      enableBtn.addEventListener('click', () => {
        enable();
        closeModal();
        const btn = document.getElementById('audioToggleBtn');
        if (btn) btn.innerHTML = '🔊';
        localStorage.setItem('chronotales_sound_enabled', true);
      });
    }
    if (disableBtn) {
      disableBtn.addEventListener('click', () => {
        disable();
        closeModal();
        localStorage.setItem('chronotales_sound_enabled', false);
      });
    }
  }

  // Unlock audio on first user interaction
  const unlockEvents = ['scroll', 'click', 'touchstart', 'keydown'];
  function onFirstInteraction() {
    unlockEvents.forEach(ev => window.removeEventListener(ev, onFirstInteraction));
    unlockAudio();
  }
  unlockEvents.forEach(ev => window.addEventListener(ev, onFirstInteraction, { once: true }));
}