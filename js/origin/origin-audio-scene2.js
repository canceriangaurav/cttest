/**
 * SCENE 2 AUDIO
 */

import { sounds, playSound } from '../audio.js';

const AUDIO = {
  enabled: {
    reveal: true,
    connection: true,
    filmStripScroll: true,
    tick: false // OFF by default (too noisy)
  },
  volume: {
    reveal: 0.015,
    connection: 0.24,
    tick: 0.12
  }
};

export function createOriginAudioScene2() {
  let revealPlayed = false;
  let connectionPlayed = false;
  let tickPlayed = false;

  function sync(progress) {
    // Reveal
    if (progress > 0.05 && !revealPlayed) {
      revealPlayed = true;

      if (AUDIO.enabled.reveal) {
        playSound(sounds.filmStripScroll, AUDIO.volume.reveal);
      }
    }

    // Connection moment
    if (progress > 0.56 && !connectionPlayed) {
      connectionPlayed = true;

      if (AUDIO.enabled.connection) {
        playSound(sounds.teamConnection, AUDIO.volume.connection);
      }
    }

    // Optional tick
    if (progress > 0.82 && !tickPlayed) {
      tickPlayed = true;

      if (AUDIO.enabled.tick) {
        playSound(sounds.tick, AUDIO.volume.tick);
      }
    }

    // Reset
    if (progress < 0.03) {
      revealPlayed = false;
      connectionPlayed = false;
      tickPlayed = false;
    }
  }

  return { sync };
}