/**
 * HERO AUDIO
 * Control:
 * enabled.<name> = true/false
 * volume.<name> = 0–1
 */

import { sounds, playSound } from '../audio.js';

const AUDIO = {
  enabled: {
    constellation: true,
    hourglass: true
  },
  volume: {
    constellation: 0.01,
    hourglass: 0.30
  }
};

export function createOriginAudioHero() {
  let constellationPlayed = false;
  let hourglassPlayed = false;

  function sync(progress) {
    if (progress > 0.12 && !constellationPlayed) {
      constellationPlayed = true;

      if (AUDIO.enabled.constellation) {
        playSound(sounds.constellation, AUDIO.volume.constellation);
      }
    }

    if (progress > 0.58 && !hourglassPlayed) {
      hourglassPlayed = true;

      if (AUDIO.enabled.hourglass) {
        playSound(sounds.hourglassRotation, AUDIO.volume.hourglass);
      }
    }

    // reset when scrolling back
    if (progress < 0.08) {
      constellationPlayed = false;
      hourglassPlayed = false;
    }
  }

  return { sync };
}