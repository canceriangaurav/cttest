function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const toggle = () => {
    btn.classList.toggle('is-visible', window.scrollY > 400);
  };

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
}

function initFooter() {
  const footer = document.getElementById('ctFooter');
  if (!footer) return;

  const yearNode = footer.querySelector('[data-year]');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }
}

function initCommonButtons() {
  const buttons = document.querySelectorAll('[data-scroll-target]');

  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const targetSelector = button.getAttribute('data-scroll-target');
      if (!targetSelector) return;

      const target = document.querySelector(targetSelector);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
}

function initRevealOnScroll() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  items.forEach((item) => observer.observe(item));
}

function initOriginPostScenesState() {
  const cta = document.getElementById('ctCta');
  if (!cta) return;

  const updateState = () => {
    const rect = cta.getBoundingClientRect();
    const triggerPoint = window.innerHeight * 0.78;
    const isPostScenes = rect.top <= triggerPoint;

    document.body.classList.toggle('origin-post-scenes', isPostScenes);
  };

  window.addEventListener('scroll', updateState, { passive: true });
  window.addEventListener('resize', updateState);
  updateState();
}


function initSiteUI() {
  initFooter();
  initBackToTop();
  initCommonButtons();
  initRevealOnScroll();
  initOriginPostScenesState();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSiteUI);
} else {
  initSiteUI();
}