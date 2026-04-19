export function initOriginScene5() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.warn('OriginScene5: Browser environment not available.');
    return null;
  }

  if (typeof gsap === 'undefined') {
    console.warn('OriginScene5: GSAP not available.');
    return null;
  }

  const layer = document.getElementById('origin-scene-5-layer');
  const scene = document.getElementById('originScene5');
  const kicker = document.getElementById('originScene5Kicker');
  const headline = document.getElementById('originScene5Headline');
  const stats = document.getElementById('originScene5Stats');
  const follow = document.getElementById('originScene5Follow');

  const required = { layer, scene, kicker, headline, stats, follow };
  const missing = Object.entries(required)
    .filter(([, el]) => !el)
    .map(([key]) => key);

  if (missing.length) {
    console.warn(`OriginScene5: Missing required DOM elements: ${missing.join(', ')}`);
    return null;
  }

  const ACTS = [
    {
      kicker: 'WHEN EVERYTHING ALIGNS...',
      headline: 'LESS MANAGING.',
      follow: 'One conversation. One direction. No chasing.'
    },
    {
      kicker: 'WHEN EVERYTHING ALIGNS...',
      headline: 'ONE BRAND EVERYWHERE.',
      follow: 'Every touchpoint speaks the same language.'
    },
    {
      kicker: 'WHEN EVERYTHING ALIGNS...',
      headline: 'CLARITY IN EVERY MOVE.',
      follow: 'Aligned decisions before execution.'
    },
    {
      kicker: 'WHEN EVERYTHING ALIGNS...',
      headline: 'SCALE WITHOUT BREAKING.',
      follow: 'Your brand stays coherent as it expands.'
    }
  ];

  let lastProgress = -1;
  let activeAct = -1;
  let proofVisible = false;

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function setAct(index) {
    const safeIndex = Math.max(0, Math.min(ACTS.length - 1, index));
    if (safeIndex === activeAct) return;

    activeAct = safeIndex;
    const act = ACTS[safeIndex];

    kicker.textContent = act.kicker;
    headline.textContent = act.headline;
    follow.textContent = act.follow;
  }

  function showProof() {
    if (proofVisible) return;
    proofVisible = true;
    scene.classList.add('is-proof');
  }

  function hideProof() {
    if (!proofVisible) return;
    proofVisible = false;
    scene.classList.remove('is-proof');
  }

  function reset() {
    activeAct = -1;
    lastProgress = -1;
    proofVisible = false;

    scene.classList.remove('is-proof');
    gsap.set(layer, { opacity: 0 });

    setAct(0);
  }

  function update(progress) {
    const p = clamp01(progress);
    if (p === lastProgress) return;
    lastProgress = p;

    gsap.set(layer, { opacity: 1 });

    if (p < 0.18) {
      hideProof();
      setAct(0);
    } else if (p < 0.36) {
      hideProof();
      setAct(1);
    } else if (p < 0.54) {
      hideProof();
      setAct(2);
    } else if (p < 0.72) {
      hideProof();
      setAct(3);
    } else if (p < 0.84) {
      hideProof();
      kicker.textContent = 'WHEN EVERYTHING ALIGNS...';
      headline.textContent = 'ONE BRAIN. ONE BRAND. ZERO CHAOS.';
      follow.textContent = 'Coherent. Boundless. One.';
    } else {
      showProof();
      kicker.textContent = 'ONE BRAIN. ONE BRAND. ZERO CHAOS.';
      follow.textContent = 'Coherent. Boundless. One.';
    }
  }

  reset();

  return {
    layer,
    scene,
    update,
    reset
  };
}