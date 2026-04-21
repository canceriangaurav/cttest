/**
 * Chronotales Audio Controller
 * --------------------------------------------------
 * Owns:
 * - sound registry
 * - permission modal
 * - mute / unmute
 * - remembered user preference
 * - UI sound toggle button
 *
 * Scene files only trigger cues.
 */

import { createOriginAudioHero } from './origin/origin-audio-hero.js';
import { createOriginAudioScene2 } from './origin/origin-audio-scene2.js';
import { createOriginAudioScene3 } from './origin/origin-audio-scene3.js';

const STORAGE_KEY = 'chronotales_audio_preference';

/* ---------------------------------------
   AUDIO CREATION
--------------------------------------- */

function createAudio(src, volume = 1, loop = false) {
  const audio = new Audio(src);
  audio.preload = 'auto';
  audio.volume = volume;
  audio.loop = loop;
  return audio;
}

export const sounds = {
  // Ambient
  ambience: createAudio('./assets/audio/orbit_system_ambience_loop.webm', 0.008, true),

  // Hero
  constellation: createAudio('./assets/audio/constellation.webm', 0.02),
  hourglassRotation: createAudio('./assets/audio/hourglass_rotation.webm', 0.30),

  // Scene 2
  filmStripScroll: createAudio('./assets/audio/film_strip_scroll.webm', 0.10),
  teamConnection: createAudio('./assets/audio/team_connection_line_animation.webm', 0.10),
  tick: createAudio('./assets/audio/tick.webm', 0.12),

  // Scene 3
  projector: createAudio('./assets/audio/projector.webm', 0.05, true),
  chime: createAudio('./assets/audio/chime.webm', 0.22),
  finalFadeEnd: createAudio('./assets/audio/final_fade_end.webm', 0.10),

  // UI
  cardHover: createAudio('./assets/audio/card_hover.webm', 0.10),
  ctaHover: createAudio('./assets/audio/cta_hover.webm', 0.10),
  ctaClick: createAudio('./assets/audio/CTA_click.webm', 0.18)
};

export function playSound(audio, volume = null) {
  if (!audio) return;

  try {
    if (typeof volume === 'number') {
      audio.volume = volume;
    }

    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch (err) {}
}

/* ---------------------------------------
   AUDIO APP
--------------------------------------- */

function bootAudio() {
  if (window.__chronotalesAudioBooted) return;
  window.__chronotalesAudioBooted = true;

  const state = {
    allowed: false,
    enabled: false,
    unlocked: false,
    currentScene: 'Scene 1'
  };

  const heroAudio = createOriginAudioHero();
  const scene2Audio = createOriginAudioScene2();
  const scene3Audio = createOriginAudioScene3();

  function getUI() {
    const soundToggle = document.getElementById('soundToggle');
    const soundToggleIcon = soundToggle?.querySelector('.ct-sound-toggle__icon');

    const modal = document.getElementById('audioPermissionModal');
    const modalYes = document.getElementById('audioPermissionYes');
    const modalNo = document.getElementById('audioPermissionNo');

    return {
      soundToggle,
      soundToggleIcon,
      modal,
      modalYes,
      modalNo
    };
  }

  function updateToggleUI() {
    const { soundToggle, soundToggleIcon } = getUI();
    if (!soundToggle) return;

    soundToggle.setAttribute('aria-pressed', String(state.enabled));
    soundToggle.setAttribute('aria-label', state.enabled ? 'Sound on' : 'Sound off');

    if (soundToggleIcon) {
      soundToggleIcon.textContent = state.enabled ? '🔊' : '🔇';
    }
  }

  function showModal() {
    const { modal } = getUI();
    if (!modal) return;
    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
  }

  function hideModal() {
    const { modal } = getUI();
    if (!modal) return;
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
  }

  async function unlockAudio() {
    if (state.unlocked) return;

    const all = Object.values(sounds);

    await Promise.allSettled(
      all.map(async (audio) => {
        try {
          audio.muted = true;
          await audio.play();
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
        } catch (err) {}
      })
    );

    state.unlocked = true;
  }

  function stopOneShots() {
    Object.values(sounds).forEach((audio) => {
      if (!audio.loop) {
        try {
          audio.pause();
          audio.currentTime = 0;
        } catch (err) {}
      }
    });
  }

  function stopLoops() {
    try {
      sounds.ambience.pause();
      sounds.ambience.currentTime = 0;
    } catch (err) {}

    try {
      sounds.projector.pause();
      sounds.projector.currentTime = 0;
    } catch (err) {}
  }

  async function startSceneLoops() {
    if (!state.enabled || !state.allowed) return;

    try {
      if (state.currentScene === 'Scene 3') {
        await sounds.projector.play().catch(() => {});
      } else {
        sounds.projector.pause();
        sounds.projector.currentTime = 0;
      }
    } catch (err) {}

    try {
      await sounds.ambience.play().catch(() => {});
    } catch (err) {}
  }

  async function enableAudio() {
    state.allowed = true;
    state.enabled = true;
    localStorage.setItem(STORAGE_KEY, 'yes');

    updateToggleUI();
    hideModal();

    await unlockAudio();
    await startSceneLoops();
  }

  function disableAudio() {
    state.allowed = false;
    state.enabled = false;
    localStorage.setItem(STORAGE_KEY, 'no');

    updateToggleUI();
    hideModal();
    stopOneShots();
    stopLoops();
  }

  function muteAll() {
    state.enabled = false;
    updateToggleUI();
    stopOneShots();
    stopLoops();
  }

  async function unmuteAll() {
    if (!state.allowed) {
      showModal();
      return;
    }

    state.enabled = true;
    updateToggleUI();

    await unlockAudio();
    await startSceneLoops();
  }

  function bindUI() {
    const { soundToggle, modalYes, modalNo } = getUI();

    if (soundToggle && !soundToggle.dataset.audioBound) {
      soundToggle.dataset.audioBound = 'true';

      soundToggle.addEventListener('click', async () => {
        if (state.enabled) {
          muteAll();
        } else {
          await unmuteAll();
        }
      });
    }

    if (modalYes && !modalYes.dataset.audioBound) {
      modalYes.dataset.audioBound = 'true';
      modalYes.addEventListener('click', async () => {
        await enableAudio();
      });
    }

    if (modalNo && !modalNo.dataset.audioBound) {
      modalNo.dataset.audioBound = 'true';
      modalNo.addEventListener('click', () => {
        disableAudio();
      });
    }

    updateToggleUI();
  }

  function restorePreference() {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored === 'yes') {
      state.allowed = true;
      state.enabled = true;
      updateToggleUI();
      return;
    }

    if (stored === 'no') {
      state.allowed = false;
      state.enabled = false;
      updateToggleUI();
      return;
    }

    state.allowed = false;
    state.enabled = false;
    updateToggleUI();
    showModal();
  }

  restorePreference();
  bindUI();

  document.addEventListener(
    'pointerenter',
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!state.enabled) return;

      if (
        target.closest('.ct-planet') ||
        target.closest('.ct-mobile-planet') ||
        target.closest('.ct-social-asteroid') ||
        target.closest('.ct-audio-modal__button') ||
        target.closest('.realm-node')
      ) {
        playSound(sounds.cardHover);
        return;
      }

      if (target.closest('.ct-btn') || target.closest('.button')) {
        playSound(sounds.ctaHover);
      }
    },
    true
  );

  document.addEventListener(
    'click',
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!state.enabled) return;

      if (
        target.closest('.ct-planet') ||
        target.closest('.ct-mobile-planet') ||
        target.closest('.ct-social-asteroid') ||
        target.closest('.realm-node')
      ) {
        playSound(sounds.ctaClick);
        return;
      }

      if (target.closest('.ct-btn') || target.closest('.button')) {
        playSound(sounds.ctaClick);
      }
    },
    true
  );

  document.addEventListener('chronotales:partials-loaded', () => {
    bindUI();
    updateToggleUI();
  });

  window.__chronotalesAudio = {
    isEnabled() {
      return state.enabled;
    },

    setScene(sceneLabel) {
      state.currentScene = sceneLabel;
      if (!state.enabled) return;
      startSceneLoops();
    },

    syncScene1(progress, phase = '') {
      state.currentScene = 'Scene 1';
      if (!state.enabled) return;

      heroAudio.sync(progress, phase);
      startSceneLoops();
    },

    syncScene2(progress, phase = '') {
      state.currentScene = 'Scene 2';
      if (!state.enabled) return;

      scene2Audio.sync(progress, phase);
      startSceneLoops();
    },

    syncScene3(progress, phase = '') {
      state.currentScene = 'Scene 3';
      if (!state.enabled) return;

      scene3Audio.sync(progress, phase);
      startSceneLoops();
    },

    syncScene4(progress, phase = '') {
      state.currentScene = 'Scene 4';
      if (!state.enabled) return;
      startSceneLoops();
    },

    syncScene5(progress, phase = '') {
      state.currentScene = 'Scene 5';
      if (!state.enabled) return;
      startSceneLoops();
    },

    play(name, volume = null) {
      if (!state.enabled) return;
      if (!name || !sounds[name]) return;
      playSound(sounds[name], volume);
    },

    mute() {
      muteAll();
    },

    async unmute() {
      await unmuteAll();
    }
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootAudio, { once: true });
} else {
  bootAudio();
}