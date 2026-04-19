
export function enableAboutDebug(dom) {
  if (!dom.debug) return;
  dom.debug.removeAttribute('hidden');
}

export function updateAboutDebug(el, data) {
  if (!el || el.hasAttribute('hidden')) return;
  el.innerHTML = `
    <strong>overall:</strong> ${data.global.toFixed(3)}<br>
    <strong>scene:</strong> ${data.scene}<br>
    <strong>local:</strong> ${data.local.toFixed(3)}<br>
    <strong>phase:</strong> ${data.phase}
  `;
}
