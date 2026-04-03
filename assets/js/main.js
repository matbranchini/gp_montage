// Mobile nav
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('show');
  });
}

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Scroll indicator — click to scroll down to gallery (clear header)
const scrollIndicator = document.querySelector('.hero-full__scroll');
if (scrollIndicator) {
  scrollIndicator.style.cursor = 'pointer';
  scrollIndicator.addEventListener('click', () => {
    const gallery = document.querySelector('.gallery-strip');
    const hdr = document.querySelector('.header');
    if (gallery) {
      // Force header visible so we can measure it
      if (hdr) hdr.classList.add('header--visible');
      const headerH = hdr ? hdr.offsetHeight + 8 : 0; // +8 breathing room
      const y = gallery.getBoundingClientRect().top + window.pageYOffset - headerH;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
}

// Header: hide on hero, show on scroll
const header = document.querySelector('.header');
if (header) {
  const onScroll = () => {
    if (window.scrollY > window.innerHeight * 0.5) {
      header.classList.add('header--visible');
    } else {
      header.classList.remove('header--visible');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Form validation + mailto to info@gpmontage.it
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const telefono = form.telefono.value.trim();
    const messaggio = form.messaggio.value.trim();
    const privacy = document.getElementById('privacy').checked;

    let valid = true;

    // Reset errors
    form.querySelectorAll('.error').forEach(el => el.textContent = '');
    statusEl.textContent = '';
    statusEl.style.color = '';

    if (!nome) {
      form.querySelector('#nome + .error').textContent = 'Inserisci il nome';
      valid = false;
    }
    if (!email || !validateEmail(email)) {
      form.querySelector('#email + .error').textContent = 'Email non valida';
      valid = false;
    }
    if (!messaggio) {
      form.querySelector('#messaggio + .error').textContent = 'Inserisci il messaggio';
      valid = false;
    }
    if (!privacy) {
      statusEl.textContent = 'Devi accettare la privacy';
      statusEl.style.color = 'var(--danger)';
      valid = false;
    }

    if (!valid) return;

    // Componi e invia email a info@gpmontage.it
    const subject = encodeURIComponent('Richiesta preventivo dal sito GP Montage');
    const body = encodeURIComponent(
      'Nome: ' + nome + '\n' +
      'Email: ' + email + '\n' +
      'Telefono: ' + (telefono || 'Non indicato') + '\n\n' +
      'Messaggio:\n' + messaggio
    );
    window.location.href = 'mailto:info@gpmontage.it?subject=' + subject + '&body=' + body;

    statusEl.textContent = 'Grazie! Si sta aprendo il tuo client email...';
    statusEl.style.color = 'var(--ok)';
  });
}

// Privacy modal — close on overlay click or Escape
const privacyModal = document.getElementById('privacy-modal');
if (privacyModal) {
  privacyModal.addEventListener('click', (e) => {
    if (e.target === privacyModal) privacyModal.classList.remove('show');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && privacyModal.classList.contains('show')) {
      privacyModal.classList.remove('show');
    }
  });
}
