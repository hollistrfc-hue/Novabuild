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

  /* ─── Hero Parallax ─── */
  // Subtle background drift on scroll — Apple-style depth cue.
  // Only runs on the home page hero; no-ops silently on other pages.
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.style.willChange = 'transform';
    function updateParallax() {
      heroBg.style.transform = 'translateY(' + (window.scrollY * 0.18) + 'px)';
    }
    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax(); // set initial position
  }

  /* ─── Scroll-Triggered Animations ─── */
  // Watches .fade-up (fade + rise), .fade-in (fade only), .reveal-scale (scale + fade).
  // threshold 0.12 = triggers slightly before fully in view, matching Apple's feel.
  // Elements are unobserved after becoming visible — they never re-animate.
  const animEls = document.querySelectorAll('.fade-up, .fade-in, .reveal-scale');

  if (animEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -32px 0px'
    });

    animEls.forEach(el => observer.observe(el));
  }

  /* ─── Form Handling ─── */
  document.querySelectorAll('form[data-nova-form]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn         = form.querySelector('[type="submit"]');
      const formWrapper = form.closest('.form-wrapper');
      const successEl   = form.closest('[data-form-wrap]')?.querySelector('.form-success');
      const originalText = btn.textContent;

      btn.textContent   = 'Sending…';
      btn.disabled      = true;
      btn.style.opacity = '0.75';

      try {
        await fetch('/', {
          method:  'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body:    new URLSearchParams(new FormData(form)).toString()
        });

        if (formWrapper && successEl) {
          formWrapper.style.display  = 'none';
          successEl.style.display    = 'block';
          successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch {
        btn.textContent   = originalText;
        btn.disabled      = false;
        btn.style.opacity = '1';
      }
    });
  });

})();
