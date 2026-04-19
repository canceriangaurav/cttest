async function injectPartial(selector, path) {
  const mount = document.querySelector(selector);
  if (!mount) return;

  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) {
    console.error(`Failed to load partial: ${path}`);
    return;
  }

  mount.innerHTML = await response.text();
}

async function loadSharedPartials() {
  await Promise.all([
    injectPartial('[data-include="nav"]', './partials/nav.html'),
    injectPartial('[data-include="footer"]', './partials/footer.html'),
    injectPartial('[data-include="floating-ui"]', './partials/floating-ui.html'),
    injectPartial('[data-include="audio-modal"]', './partials/audio-modal.html'),
    injectPartial('[data-include="enquiry-modal"]', './partials/enquiry-modal.html')
  ]);

  document.dispatchEvent(new CustomEvent('chronotales:partials-loaded'));
}

loadSharedPartials();