(function () {
  function getRealmsDOM() {
    return {
      page: document.querySelector('.page-realms'),
      stage: document.getElementById('realmsStage'),
      orbit: document.getElementById('realmsOrbit'),
      core: document.getElementById('realmsCore'),
      nodes: Array.from(document.querySelectorAll('.realm-node')),
      hint: document.getElementById('realmsHint'),
      popup: document.getElementById('realmPopup'),
      popupEyebrow: document.getElementById('realmPopupEyebrow'),
      popupTitle: document.getElementById('realmPopupTitle'),
      popupText: document.getElementById('realmPopupText'),
      popupLink: document.getElementById('realmPopupLink'),
      popupCloseButtons: Array.from(document.querySelectorAll('[data-popup-close]'))
    };
  }

  window.__chronotalesGetRealmsDOM = getRealmsDOM;
})();