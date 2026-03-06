/* ═══════════════════════════════════════════════════════
   WITHOUT A CLASP — Main JavaScript
   ═══════════════════════════════════════════════════════ */

/* ── NAV: Hamburger + Overlay ─────────────────────────── */
const hamburger = document.getElementById('hamburger');
const overlay   = document.getElementById('navOverlay');
const navLinks  = document.querySelectorAll('.overlay-links a');

function openMenu() {
  overlay.classList.add('open');
  hamburger.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  overlay.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

function toggleMenu() {
  overlay.classList.contains('open') ? closeMenu() : openMenu();
}

if (hamburger) hamburger.addEventListener('click', toggleMenu);

// Close on nav link click
navLinks.forEach(a => a.addEventListener('click', closeMenu));

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay.classList.contains('open')) closeMenu();
});

/* ── NAV: Scroll shadow ───────────────────────────────── */
const siteNav = document.querySelector('.site-nav');
if (siteNav) {
  window.addEventListener('scroll', () => {
    siteNav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ── ACTIVE NAV LINK ──────────────────────────────────── */
(function setActiveLink() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.overlay-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ── FADE-IN ON SCROLL ────────────────────────────────── */
const fadeEls = document.querySelectorAll('.fade-in');
if ('IntersectionObserver' in window && fadeEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => io.observe(el));
} else {
  // Fallback: show all
  fadeEls.forEach(el => el.classList.add('visible'));
}

/* ── FAQ ACCORDION ────────────────────────────────────── */
document.querySelectorAll('.faq-item__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    // Toggle clicked
    if (!isOpen) item.classList.add('open');
  });
});

/* ── CONTACT FORM ─────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate required fields
    const required = contactForm.querySelectorAll('[required]');
    let valid = true;

    required.forEach(field => {
      const group = field.closest('.form-group');
      const errorEl = group && group.querySelector('.form-error');
      const isEmpty = !field.value.trim();
      const isInvalidEmail = field.type === 'email' && field.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());

      if (isEmpty || isInvalidEmail) {
        valid = false;
        if (group) group.classList.add('has-error');
        if (errorEl && isInvalidEmail) errorEl.textContent = 'Please enter a valid email address.';
      } else {
        if (group) group.classList.remove('has-error');
      }
    });

    if (!valid) return;

    /* ── TO CONNECT TO FORMSPREE (free, no server needed): ──
       1. Go to formspree.io and create a free account
       2. Create a new form — you get an endpoint like:
          https://formspree.io/f/yourcode
       3. Replace YOUR_FORM_ID in contact.html's form action with that code
       ─────────────────────────────────────────────────── */

    const submitBtn = contactForm.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    // If a real Formspree action is set, use fetch; otherwise simulate
    const action = contactForm.getAttribute('action');
    if (action && !action.includes('YOUR_FORM_ID')) {
      const data = new FormData(contactForm);
      fetch(action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
        .then(res => {
          if (res.ok) {
            contactForm.style.display = 'none';
            if (formSuccess) formSuccess.classList.add('visible');
          } else {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            alert('Something went wrong — please try again or reach out directly.');
          }
        })
        .catch(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          alert('Something went wrong — please try again or reach out directly.');
        });
    } else {
      // Demo simulation
      setTimeout(() => {
        contactForm.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('visible');
      }, 900);
    }
  });

  // Clear error state on input
  contactForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      const group = field.closest('.form-group');
      if (group) group.classList.remove('has-error');
    });
  });
}

/* ── SMOOTH SCROLL for internal anchors ──────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
