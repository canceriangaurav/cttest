/**
 * SCENE 3 AUDIO (PROJECTOR)
 */

import { sounds, playSound } from '../audio.js';

const AUDIO = {
  enabled: {
    projectorLoop: true,
    reveal: false, // OFF initially (too much)
    final: true
  },
  volume: {
    projectorLoop: 0.009,
    reveal: 0.10,
    final: 0.10
  }
};

export function createOriginAudioScene3() {
  let projectorStarted = false;
  let revealPlayed = false;
  let finalPlayed = false;

  function sync(progress) {
    // Start projector loop
    if (progress > 0.02 && !projectorStarted) {
      projectorStarted = true;

      if (AUDIO.enabled.projectorLoop) {
        sounds.projector.volume = AUDIO.volume.projectorLoop;
        sounds.projector.play().catch(() => {});
      }
    }

    // Optional reveal sound
    if (progress > 0.48 && !revealPlayed) {
      revealPlayed = true;

      if (AUDIO.enabled.reveal) {
        playSound(sounds.chime, AUDIO.volume.reveal);
      }
    }

    // Final moment
    if (progress > 0.90 && !finalPlayed) {
      finalPlayed = true;

      if (AUDIO.enabled.final) {
        playSound(sounds.finalFadeEnd, AUDIO.volume.final);
      }
    }

    // Reset
    if (progress < 0.02) {
      projectorStarted = false;
      revealPlayed = false;
      finalPlayed = false;

      sounds.projector.pause();
      sounds.projector.currentTime = 0;
    }
  }

  return { sync };
}