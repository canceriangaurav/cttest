(function () {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(start, end, alpha) {
    return start + (end - start) * alpha;
  }

  function isTouchDevice() {
    return window.matchMedia('(pointer: coarse)').matches;
  }

  function normalizeWheelDelta(event) {
    const absX = Math.abs(event.deltaX);
    const absY = Math.abs(event.deltaY);

    if (absX > absY) return event.deltaX;
    return event.deltaY;
  }

  function debounce(fn, delay) {
    let timer = null;
    return function debounced(...args) {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn.apply(this, args), delay);
    };
  }

  window.__chronotalesRealmsUtils = {
    clamp,
    lerp,
    isTouchDevice,
    normalizeWheelDelta,
    debounce
  };
})();