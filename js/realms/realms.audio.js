(function () {
  function getAudio() {
    return window.__chronotalesAudio || null;
  }

  function play(name, volume = null) {
    const audio = getAudio();
    if (!audio) return;

    try {
      audio.play(name, volume);
    } catch (err) {
      console.warn('[realms.audio] play failed:', name, err);
    }
  }

  function startAmbience() {
    const audio = getAudio();
    if (!audio) return;

    try {
      audio.setScene('Scene 1'); // safe non-conflicting scene
      audio.play('ambience');
    } catch (err) {
      console.warn('[realms.audio] ambience failed', err);
    }
  }

  function playHover() {
    play('cardHover');
  }

  function playOpen() {
    play('chime');
  }

  function playClose() {
    play('tick');
  }

  function playCTA() {
    play('ctaClick');
  }

  window.__chronotalesRealmsAudio = {
    startAmbience,
    playHover,
    playOpen,
    playClose,
    playCTA
  };
})();