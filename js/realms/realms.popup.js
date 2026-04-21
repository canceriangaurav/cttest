(function () {
  function createRealmsPopupController(dom, data, orbitApi, audioApi) {
    let activeRealmKey = null;

    function openRealm(key) {
      const realm = data[key];
      if (!realm || !dom.popup) return;

      activeRealmKey = key;

      dom.popupEyebrow.textContent = realm.eyebrow;
      dom.popupTitle.textContent = realm.title;
      dom.popupText.textContent = realm.description;
      dom.popupLink.textContent = `Enter ${realm.title} Realm`;
      dom.popupLink.href = realm.href;

      dom.page?.classList.add('is-popup-open');
      dom.popup.classList.add('is-open');
      dom.popup.setAttribute('aria-hidden', 'false');

      dom.nodes.forEach((node) => {
        const isActive = node.dataset.realm === key;
        node.classList.toggle('is-active', isActive);
        node.classList.toggle('is-dimmed', !isActive);
      });

      orbitApi?.setPopupOpen(true);
      audioApi?.playOpen();
    }

    function closeRealm() {
      activeRealmKey = null;

      dom.page?.classList.remove('is-popup-open');
      dom.popup?.classList.remove('is-open');
      dom.popup?.setAttribute('aria-hidden', 'true');

      dom.nodes.forEach((node) => {
        node.classList.remove('is-active', 'is-dimmed');
      });

      orbitApi?.setPopupOpen(false);
      audioApi?.playClose();
    }

    function bind() {
      dom.nodes.forEach((node) => {
        node.addEventListener('click', () => openRealm(node.dataset.realm));
      });

      dom.popupCloseButtons.forEach((button) => {
        button.addEventListener('click', closeRealm);
      });

      dom.popupLink?.addEventListener('click', () => {
        audioApi?.playCTA();
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && activeRealmKey) {
          closeRealm();
        }
      });
    }

    function isOpen() {
      return Boolean(activeRealmKey);
    }

    function getActiveRealm() {
      return activeRealmKey;
    }

    return {
      bind,
      openRealm,
      closeRealm,
      isOpen,
      getActiveRealm
    };
  }

  window.__chronotalesCreateRealmsPopupController = createRealmsPopupController;
})();