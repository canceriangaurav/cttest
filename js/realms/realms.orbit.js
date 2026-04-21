(function () {
  function createRealmsOrbitController(dom, utils) {
    const { clamp } = utils;

    const state = {
      angle: 0,
      velocity: 0,
      autoSpeed: 0.0022,
      damping: 0.94,
      isPopupOpen: false,
      isInteracting: false,
      rafId: null,
      lastTime: 0,
      centerX: 0,
      centerY: 0,
      radiusX: 0,
      radiusY: 0
    };

    const baseOffsets = {
      creative: 0,
      digital: Math.PI / 2,
      strategy: Math.PI,
      physical: Math.PI * 1.5
    };

    function measure() {
      if (!dom.orbit) return;

      const rect = dom.orbit.getBoundingClientRect();
      state.centerX = rect.width / 2;
      state.centerY = rect.height / 2;

      const isMobile = window.innerWidth < 768;
      state.radiusX = rect.width * (isMobile ? 0.32 : 0.38);
      state.radiusY = rect.height * (isMobile ? 0.26 : 0.30);
    }

    function renderNode(node) {
      const key = node.dataset.realm;
      const nodeAngle = state.angle + baseOffsets[key];

      const x = state.centerX + state.radiusX * Math.cos(nodeAngle);
      const y = state.centerY + state.radiusY * Math.sin(nodeAngle);

     const depth = (Math.sin(nodeAngle) + 1) / 2;

// stronger front/back difference
const scale = 0.80 + depth * 0.30;
const opacity = 0.42 + depth * 0.58;
const zIndex = 2 + Math.round(depth * 20);

// optional glow/shadow strength by depth
const blur = 0.6 + depth * 0.5;

     node.style.left = `${x}px`;
node.style.top = `${y}px`;
node.style.transform = `translate(-50%, -50%) scale(${scale})`;
node.style.opacity = String(clamp(opacity, 0.3, 1));
node.style.zIndex = String(zIndex);
node.style.filter = `brightness(${0.82 + depth * 0.26}) saturate(${0.9 + depth * 0.22})`;

      node.classList.toggle('is-front', depth > 0.56);
      node.classList.toggle('is-back', depth < 0.44);
    }

    function render() {
      dom.nodes.forEach(renderNode);
    }

    function tick(timestamp) {
      if (!state.lastTime) state.lastTime = timestamp;
      const delta = Math.min((timestamp - state.lastTime) / 16.6667, 2);
      state.lastTime = timestamp;

      if (!state.isPopupOpen) {
        state.angle += state.autoSpeed * delta;
        state.angle += state.velocity * delta;
        state.velocity *= Math.pow(state.damping, delta);

        if (Math.abs(state.velocity) < 0.00001) {
          state.velocity = 0;
        }
      }

      render();
      state.rafId = window.requestAnimationFrame(tick);
    }

    function start() {
      measure();
      render();

      if (state.rafId) {
        window.cancelAnimationFrame(state.rafId);
      }

      state.lastTime = 0;
      state.rafId = window.requestAnimationFrame(tick);
    }

    function stop() {
      if (state.rafId) {
        window.cancelAnimationFrame(state.rafId);
        state.rafId = null;
      }
    }

    function addVelocity(amount) {
      if (state.isPopupOpen) return;
      state.velocity += amount;
    }

    function setInteracting(isInteracting) {
      state.isInteracting = isInteracting;
      dom.page?.classList.toggle('is-user-interacting', isInteracting);
    }

    function setPopupOpen(isOpen) {
      state.isPopupOpen = isOpen;
      if (isOpen) state.velocity = 0;
    }

    return {
      start,
      stop,
      measure,
      render,
      addVelocity,
      setInteracting,
      setPopupOpen
    };
  }

  window.__chronotalesCreateRealmsOrbitController = createRealmsOrbitController;
})();