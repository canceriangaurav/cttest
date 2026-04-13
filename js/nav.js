document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  const toggle = document.querySelector('.ct-nav__toggle');
  const mobileMenu = document.getElementById('ct-mobile-menu');
  const mobileClose = document.querySelector('.ct-mobile-menu__close');
  const mobileMenuVideo = mobileMenu?.querySelector('.ct-mobile-menu__bg') || null;
  const mobileMenuVideoSource = mobileMenuVideo?.querySelector('source') || null;

  const transitionLayer = document.getElementById('ctPageTransition');
  const transitionVideo = transitionLayer?.querySelector('.ct-page-transition__video');

  const desktopLeft = document.querySelector('.ct-nav__desktop--left');
  const desktopRight = document.querySelector('.ct-nav__desktop--right');

  const desktopGroups = document.querySelectorAll('.ct-planet-group--has-children');
  const allDesktopGroups = document.querySelectorAll('.ct-nav__desktop .ct-planet-group');

  const mobilePlanets = document.querySelectorAll('.ct-mobile-planet--page');
  const mobileChildren = document.querySelectorAll('.ct-mobile-child');
  const mobileSocialAsteroids = document.querySelectorAll('.ct-social-asteroid');

  let mobileMenuVideoLoaded = false;

  const ensureMobileMenuVideo = () => {
    if (!mobileMenuVideo || mobileMenuVideoLoaded) return;

    const sourceSrc = mobileMenuVideoSource?.dataset.src;
    if (!sourceSrc) return;

    mobileMenuVideoSource.src = sourceSrc;
    mobileMenuVideo.load();
    mobileMenuVideoLoaded = true;
  };

  const playMobileMenuVideo = () => {
    ensureMobileMenuVideo();

    try {
      const promise = mobileMenuVideo?.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {});
      }
    } catch (e) {}
  };

  const pauseMobileMenuVideo = () => {
    try {
      mobileMenuVideo?.pause();
    } catch (e) {}
  };

  mobileMenu?.setAttribute('inert', '');

  const hideTransition = () => {
    if (!transitionLayer) return;
    transitionLayer.classList.remove('is-entering', 'is-leaving');
    transitionLayer.classList.add('is-hidden');
    body.classList.remove('is-transitioning');
  };

  const showLeaveTransition = (url) => {
    if (!url) return;

    if (!transitionLayer) {
      window.location.href = url;
      return;
    }

    body.classList.add('is-transitioning');
    body.classList.remove('nav-open');
    pauseMobileMenuVideo();

    transitionLayer.classList.remove('is-hidden', 'is-entering');
    transitionLayer.classList.add('is-leaving');

    if (transitionVideo) {
      try {
        transitionVideo.currentTime = 0;
        transitionVideo.play().catch(() => {});
      } catch (e) {}
    }

    setTimeout(() => {
      window.location.href = url;
    }, 520);
  };

  if (transitionLayer) {
    body.classList.add('is-transitioning');

    if (transitionVideo) {
      try {
        transitionVideo.currentTime = 0;
        transitionVideo.play().catch(() => {});
      } catch (e) {}
    }

    const enterTimer = setTimeout(() => {
      hideTransition();
    }, 1200);

    transitionVideo?.addEventListener('ended', () => {
      clearTimeout(enterTimer);
      hideTransition();
    });

    transitionVideo?.addEventListener('error', () => {
      clearTimeout(enterTimer);
      hideTransition();
    });
  }

  const setDesktopFocusMode = (activeGroup) => {
    [desktopLeft, desktopRight].forEach(side => side?.classList.add('is-focus-mode'));

    allDesktopGroups.forEach(group => {
      group.classList.remove('is-open');
    });

    activeGroup.classList.add('is-open');
  };

  const clearDesktopFocusMode = () => {
    [desktopLeft, desktopRight].forEach(side => side?.classList.remove('is-focus-mode'));

    allDesktopGroups.forEach(group => {
      group.classList.remove('is-open');
    });
  };

  const clearMobileFocusMode = () => {
    mobilePlanets.forEach(planet => {
      planet.classList.remove('is-dimmed', 'is-active-parent');
    });

    mobileSocialAsteroids.forEach(planet => {
      planet.classList.remove('is-dimmed');
    });

    mobileChildren.forEach(child => {
      child.classList.remove('is-open', 'is-dimmed');
    });
  };

  const setMobileFocusMode = (activePlanet, parentKey) => {
    mobilePlanets.forEach(planet => {
      if (planet === activePlanet) {
        planet.classList.add('is-active-parent');
        planet.classList.remove('is-dimmed');
      } else {
        planet.classList.remove('is-active-parent');
        planet.classList.add('is-dimmed');
      }
    });

    mobileSocialAsteroids.forEach(planet => {
      planet.classList.add('is-dimmed');
    });

    mobileChildren.forEach(child => {
      if (child.dataset.childOf === parentKey) {
        child.classList.add('is-open');
        child.classList.remove('is-dimmed');
      } else {
        child.classList.remove('is-open');
        child.classList.add('is-dimmed');
      }
    });
  };

  desktopGroups.forEach(group => {
    const trigger = group.querySelector('.ct-planet--main');
    const submenu = group.querySelector('.ct-subplanets');

    if (!trigger) return;

    let closeTimeout = null;

    const openGroup = () => {
      clearTimeout(closeTimeout);
      setDesktopFocusMode(group);
      trigger.setAttribute('aria-expanded', 'true');
    };

    const closeGroup = () => {
      closeTimeout = setTimeout(() => {
        clearDesktopFocusMode();
        trigger.setAttribute('aria-expanded', 'false');
      }, 180);
    };

    trigger.addEventListener('click', (e) => {
      if (trigger.tagName === 'BUTTON') {
        e.preventDefault();

        const alreadyOpen = group.classList.contains('is-open');

        if (alreadyOpen) {
          clearDesktopFocusMode();
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          openGroup();
        }

        return;
      }

      if (!group.classList.contains('is-open')) {
        e.preventDefault();
        openGroup();
      }
    });

    group.addEventListener('mouseenter', openGroup);
    group.addEventListener('mouseleave', closeGroup);
    submenu?.addEventListener('mouseenter', openGroup);
    submenu?.addEventListener('mouseleave', closeGroup);

    trigger.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && trigger.tagName === 'BUTTON') {
        e.preventDefault();

        const alreadyOpen = group.classList.contains('is-open');

        if (alreadyOpen) {
          clearDesktopFocusMode();
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          openGroup();
        }
      }

      if (e.key === 'Escape') {
        clearDesktopFocusMode();
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  const openMenu = () => {
    body.classList.add('nav-open');

    toggle?.setAttribute('aria-expanded', 'true');
    toggle?.setAttribute('aria-label', 'Close menu');

    mobileMenu?.setAttribute('aria-hidden', 'false');
    mobileMenu?.removeAttribute('inert');

    playMobileMenuVideo();
    mobileClose?.focus();
  };

  const closeMenu = () => {
    if (document.activeElement && mobileMenu?.contains(document.activeElement)) {
      document.activeElement.blur();
    }

    body.classList.remove('nav-open');

    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open menu');

    mobileMenu?.setAttribute('aria-hidden', 'true');
    mobileMenu?.setAttribute('inert', '');

    clearMobileFocusMode();
    pauseMobileMenuVideo();

    toggle?.focus();
  };

  toggle?.addEventListener('click', () => {
    const isOpen = body.classList.contains('nav-open');
    if (isOpen) closeMenu();
    else openMenu();
  });

  mobileClose?.addEventListener('click', closeMenu);

  mobilePlanets.forEach(planet => {
    planet.addEventListener('click', () => {
      const parentKey = planet.dataset.parent;
      const link = planet.dataset.link;
      const hasChildren = planet.classList.contains('ct-mobile-planet--has-children');
      const isAlreadyActive = planet.classList.contains('is-active-parent');

      if (hasChildren && parentKey) {
        if (isAlreadyActive) {
          clearMobileFocusMode();
        } else {
          setMobileFocusMode(planet, parentKey);
        }
        return;
      }

      if (link && link !== '#') {
        showLeaveTransition(link);
      }
    });
  });

  mobileChildren.forEach(child => {
    child.addEventListener('click', (e) => {
      const href = child.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      showLeaveTransition(href);
    });
  });

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    const isExternal = link.target === '_blank' || href?.startsWith('http') || href?.startsWith('mailto:') || href?.startsWith('tel:');

    if (!href || href === '#' || isExternal) return;

    link.addEventListener('click', (e) => {
      if (link.closest('.ct-mobile-menu')) return;
      e.preventDefault();
      showLeaveTransition(href);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && body.classList.contains('nav-open')) {
      closeMenu();
      return;
    }

    if (e.key === 'Escape') {
      clearDesktopFocusMode();
      desktopGroups.forEach(group => {
        group.querySelector('.ct-planet--main')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  document.addEventListener('click', (e) => {
    const target = e.target;

    if (!body.classList.contains('nav-open')) return;
    if (mobileMenu?.contains(target) || toggle?.contains(target)) return;

    closeMenu();
  });
});
