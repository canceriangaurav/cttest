(function () {
  function createRealmsInputController(dom, utils, orbitApi, popupApi, audioApi) {
    const { normalizeWheelDelta, isTouchDevice } = utils;

    let touchStartX = 0;
    let touchLastX = 0;
    let hoverCooldown = false;

    function bindWheel() {
      dom.stage?.addEventListener(
        'wheel',
        (event) => {
          if (popupApi.isOpen()) return;

          const delta = normalizeWheelDelta(event);
          const sensitivity = 0.000035;

          orbitApi.setInteracting(true);
          orbitApi.addVelocity(delta * sensitivity);

          window.clearTimeout(bindWheel._timer);
          bindWheel._timer = window.setTimeout(() => {
            orbitApi.setInteracting(false);
          }, 120);

          event.preventDefault();
        },
        { passive: false }
      );
    }

    function bindTouch() {
      dom.stage?.addEventListener(
        'touchstart',
        (event) => {
          if (popupApi.isOpen()) return;
          const touch = event.touches[0];
          touchStartX = touch.clientX;
          touchLastX = touch.clientX;
          orbitApi.setInteracting(true);
        },
        { passive: true }
      );

      dom.stage?.addEventListener(
        'touchmove',
        (event) => {
          if (popupApi.isOpen()) return;
          const touch = event.touches[0];
          const deltaX = touch.clientX - touchLastX;
          touchLastX = touch.clientX;

          orbitApi.addVelocity(-deltaX * 0.00022);
          event.preventDefault();
        },
        { passive: false }
      );

      dom.stage?.addEventListener(
        'touchend',
        () => {
          orbitApi.setInteracting(false);
        },
        { passive: true }
      );
    }

    function bindHover() {
      dom.nodes.forEach((node) => {
        node.addEventListener('mouseenter', () => {
          if (isTouchDevice() || popupApi.isOpen()) return;
          if (hoverCooldown) return;

          hoverCooldown = true;
          audioApi?.playHover();

          window.setTimeout(() => {
            hoverCooldown = false;
          }, 120);
        });
      });
    }

    function bind() {
      bindWheel();
      bindTouch();
      bindHover();
    }

    return { bind };
  }

  window.__chronotalesCreateRealmsInputController = createRealmsInputController;
})();