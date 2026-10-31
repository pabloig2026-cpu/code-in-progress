
(function (root) {
  'use strict';
  const RC = (root.RC = root.RC || {});
  const THEMES = Object.freeze({ DARK: 'dark', LIGHT: 'light' });
  const THEME_ASSETS = Object.freeze({
    [THEMES.DARK]: Object.freeze({
      color: '#0b0b0c',
      logo: 'assets/logo/logo-rolling-blanco.png',
    }),
    [THEMES.LIGHT]: Object.freeze({
      color: '#f4f4f5',
      logo: 'assets/logo/logo-rolling-negro.png',
    }),
  });

  function getNextTheme(theme) {
    return theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
  }

  function initTheme(header) {
    const toggle = header.querySelector('[data-theme-toggle]');
    if (!toggle) return;

    const rootElement = document.documentElement;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    const logos = document.querySelectorAll('.brand img, .footer-brand img');
    const savedTheme = THEME_ASSETS[rootElement.dataset.theme]
      ? rootElement.dataset.theme
      : THEMES.DARK;
    let transitionTimer = null;

    function applyTheme(theme, persist = false) {
      const isLight = theme === THEMES.LIGHT;
      const assets = THEME_ASSETS[theme];
      rootElement.dataset.theme = theme;
      rootElement.style.colorScheme = theme;
      toggle.setAttribute('aria-checked', String(isLight));
      toggle.setAttribute('aria-label', `Cambiar a modo ${isLight ? 'oscuro' : 'claro'}`);
      if (themeColor) themeColor.content = assets.color;
      logos.forEach((logo) => {
        logo.src = assets.logo;
      });

      if (persist) {
        try {
          root.localStorage.setItem('rc-theme', theme);
        } catch (error) {
          console.warn('No se pudo guardar el tema seleccionado.', error);
        }
      }
    }

    applyTheme(savedTheme);
    toggle.addEventListener('click', () => {
      const nextTheme = getNextTheme(rootElement.dataset.theme);
      const reduceMotion = root.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduceMotion) {
        root.clearTimeout(transitionTimer);
        document.body.classList.add('theme-transitioning');
        transitionTimer = root.setTimeout(
          () => document.body.classList.remove('theme-transitioning'),
          350
        );
      }
      applyTheme(nextTheme, true);
    });
  }

  function initHamburger(header) {
    const menu = header.querySelector('#menu');
    const toggle = header.querySelector('#menu-toggle');
    if (!menu || !toggle || !root.bootstrap) return;

    const setOpen = (open) => {
      toggle.classList.toggle('is-active', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    };
    let pendingTarget = null;
    menu.addEventListener('show.bs.offcanvas', () => setOpen(true));
    menu.addEventListener('hide.bs.offcanvas', () => setOpen(false));
    menu.addEventListener('hidden.bs.offcanvas', () => {
      const target = pendingTarget;
      pendingTarget = null;
      if (!target) return;
      setTimeout(() => target.scrollIntoView({ behavior: RC.utils.prefersReducedMotion() ? 'auto' : 'smooth' }), 0);
    });

    menu.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || !menu.classList.contains('show')) return;
      event.preventDefault();
      pendingTarget = document.querySelector(link.getAttribute('href'));
      root.bootstrap.Offcanvas.getOrCreateInstance(menu).hide();
    });
  }

  function initScrollShadow(header) {
    const update = () => header.classList.toggle('is-scrolled', root.scrollY > 8);
    update();
    root.addEventListener('scroll', update, { passive: true });
  }

  function initActiveLink(header) {
    const links = [...header.querySelectorAll('.nav-link[href^="#"]')];
    const sections = links
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in root)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            const active = link.getAttribute('href') === `#${entry.target.id}`;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((section) => observer.observe(section));
  }

  function init() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    initTheme(header);
    initHamburger(header);
    initScrollShadow(header);
    initActiveLink(header);
  }

  RC.header = { init };
})(window);
