export function initBackToTop() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  if (sessionStorage.getItem('scrollToTop') === 'true') {
    sessionStorage.removeItem('scrollToTop');
    window.scrollTo(0, 0);
    let attempts = 0;
    const interval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
        attempts++;
      }
      if (attempts > 20) clearInterval(interval);
    }, 100);
    window.addEventListener('scroll', function once() {
      if (window.scrollY !== 0) window.scrollTo(0, 0);
      window.removeEventListener('scroll', once);
    });
  }
  const backBtn = document.getElementById("backToTopBtn");
  if (backBtn) {
    backBtn.addEventListener("click", function() {
      sessionStorage.setItem('scrollToTop', 'true');
      location.reload();
    });
  }
}