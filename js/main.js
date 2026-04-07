/* ============================================================
   NOVABUILD — MAIN.JS
   ============================================================ */

(function () {
  'use strict';

  /* ─── Navigation ─── */
  const nav        = document.getElementById('nav');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  // Scroll: add .scrolled class
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 16);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Close mobile menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenu?.classList.contains('open')) {
      hamburger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ─── Active Nav State ─── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ─── Scroll-Triggered Fade Animations ─── */
  const animEls = document.querySelectorAll('.fade-up, .fade-in');

  if (animEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    animEls.forEach(el => observer.observe(el));
  }


})();
