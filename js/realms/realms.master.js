(function () {
  function bootRealmsPage() {
    if (window.__chronotalesRealmsBooted) return;

    const getDOM = window.__chronotalesGetRealmsDOM;
    const data = window.__chronotalesRealmsData;
    const utils = window.__chronotalesRealmsUtils;
    const createOrbit = window.__chronotalesCreateRealmsOrbitController;
    const createPopup = window.__chronotalesCreateRealmsPopupController;
    const createInput = window.__chronotalesCreateRealmsInputController;
    const audioApi = window.__chronotalesRealmsAudio;

    if (
      typeof getDOM !== 'function' ||
      !data ||
      !utils ||
      typeof createOrbit !== 'function' ||
      typeof createPopup !== 'function' ||
      typeof createInput !== 'function'
    ) {
      return;
    }

    const dom = getDOM();
    if (!dom.page || !dom.stage || !dom.orbit || !dom.nodes.length) {
      return;
    }

    window.__chronotalesRealmsBooted = true;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    if (utils.isTouchDevice()) {
      dom.page.classList.add('is-touch');
    }

    const orbitApi = createOrbit(dom, utils);
    const popupApi = createPopup(dom, data, orbitApi, audioApi);
    const inputApi = createInput(dom, utils, orbitApi, popupApi, audioApi);

    popupApi.bind();
    inputApi.bind();
    orbitApi.start();

    audioApi?.startAmbience();

    const handleResize = utils.debounce(() => {
      orbitApi.measure();
      orbitApi.render();
    }, 120);

    window.addEventListener('resize', handleResize);
  }

  if (document.readyState === 'complete') {
    bootRealmsPage();
  } else {
    window.addEventListener('load', bootRealmsPage, { once: true });
  }

  document.addEventListener('chronotales:partials-loaded', bootRealmsPage);
})();