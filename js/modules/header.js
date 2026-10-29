
(function (root) {
  'use strict';
  const RC = (root.RC = root.RC || {});

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
    initHamburger(header);
    initScrollShadow(header);
    initActiveLink(header);
  }

  RC.header = { init };
})(window);
