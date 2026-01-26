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

// Form validation + optional mailto fallback
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const messaggio = form.messaggio.value.trim();
    const privacy = document.getElementById('privacy').checked;

    let valid = true;

    // Reset errors
    form.querySelectorAll('.error').forEach(el => el.textContent = '');

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
      valid = false;
    } else {
      statusEl.textContent = '';
    }

    if (!valid) return;

    // Try Netlify default submit first
    try {
      const formData = new FormData(form);
      const resp = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });
      statusEl.textContent = 'Grazie! Richiesta inviata con successo.';
      form.reset();
      return;
    } catch (err) {
      console.warn('Netlify submit fallito, uso mailto fallback', err);
    }

    // Fallback: email via mailto (apre client email dell'utente)
    const subject = encodeURIComponent('Richiesta dal sito GP Montage');
    const body = encodeURIComponent(
      `Nome: ${nome}
Email: ${email}
Telefono: ${form.telefono.value}

Messaggio:
${messaggio}`
    );
    window.location.href = `mailto:info@gpmontage.it?subject=${subject}&body=${body}`;
    statusEl.textContent = 'Grazie! Stiamo preparando l’email...';
  });
}
