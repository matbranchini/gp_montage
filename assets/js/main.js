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

// Competenze: toggle project thumbnails on click/tap
document.querySelectorAll('.facade-type').forEach(function(ft){
  ft.addEventListener('click',function(e){
    if(e.target.closest('.facade-type__thumb')) return; // let link work
    e.preventDefault();
    e.stopPropagation();
    var wasActive = ft.classList.contains('facade-type--active');
    document.querySelectorAll('.facade-type--active').forEach(function(el){el.classList.remove('facade-type--active');});
    if(!wasActive) ft.classList.add('facade-type--active');
  });
});

// Carousel touch pause (mobile)
document.querySelectorAll('.logo-carousel__track').forEach(function(track){
  track.addEventListener('touchstart',function(){track.style.animationPlayState='paused';},{passive:true});
  track.addEventListener('touchend',function(){track.style.animationPlayState='running';},{passive:true});
});

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

// Form validation + mailto to info@gpmontage.ch
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

    // Componi e invia email a info@gpmontage.ch
    const subject = encodeURIComponent('Richiesta preventivo dal sito GP Montage');
    const body = encodeURIComponent(
      'Nome: ' + nome + '\n' +
      'Email: ' + email + '\n' +
      'Telefono: ' + (telefono || 'Non indicato') + '\n\n' +
      'Messaggio:\n' + messaggio
    );
    window.location.href = 'mailto:info@gpmontage.ch?subject=' + subject + '&body=' + body;

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

// Equipment lightbox
const equipLightbox = document.getElementById('equip-lightbox');
if (equipLightbox) {
  const lbImg = equipLightbox.querySelector('.equip-lightbox__img');
  const lbCaption = equipLightbox.querySelector('.equip-lightbox__caption');
  const lbPrev = equipLightbox.querySelector('.equip-lightbox__prev');
  const lbNext = equipLightbox.querySelector('.equip-lightbox__next');
  const lbClose = equipLightbox.querySelector('.equip-lightbox__close');
  const lbContent = equipLightbox.querySelector('.equip-lightbox__content');
  let currentImages = [];
  let currentIndex = 0;
  let justOpened = false;

  function showImage(index) {
    currentIndex = index;
    lbImg.src = currentImages[index];
    lbPrev.classList.toggle('hidden', index === 0);
    lbNext.classList.toggle('hidden', index === currentImages.length - 1);
  }

  document.querySelectorAll('.equip-card--clickable').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        currentImages = JSON.parse(card.dataset.images);
      } catch { return; }
      if (!currentImages.length) return;
      lbCaption.textContent = card.dataset.label || '';
      const imgBg = card.dataset.imgbg || 'transparent';
      lbImg.style.background = imgBg;
      showImage(0);
      justOpened = true;
      equipLightbox.classList.add('show');
      document.body.style.overflow = 'hidden';
      setTimeout(() => { justOpened = false; }, 300);
    });
  });

  function closeLightbox() {
    equipLightbox.classList.remove('show');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  lbClose.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
  equipLightbox.addEventListener('click', (e) => {
    if (justOpened) return;
    // Only close if clicking the overlay itself, not the content
    if (e.target === equipLightbox) closeLightbox();
  });
  // Prevent clicks on content from bubbling to overlay
  if (lbContent) lbContent.addEventListener('click', (e) => { e.stopPropagation(); });
  lbPrev.addEventListener('click', (e) => { e.stopPropagation(); if (currentIndex > 0) showImage(currentIndex - 1); });
  lbNext.addEventListener('click', (e) => { e.stopPropagation(); if (currentIndex < currentImages.length - 1) showImage(currentIndex + 1); });

  document.addEventListener('keydown', (e) => {
    if (!equipLightbox.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && currentIndex > 0) showImage(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < currentImages.length - 1) showImage(currentIndex + 1);
  });
}

// Certification lightbox
const certLightbox = document.getElementById('cert-lightbox');
if (certLightbox) {
  const cImg = certLightbox.querySelector('.equip-lightbox__img');
  const cCaption = certLightbox.querySelector('.equip-lightbox__caption');
  const cClose = certLightbox.querySelector('.equip-lightbox__close');
  const cContent = certLightbox.querySelector('.equip-lightbox__content');
  let certJustOpened = false;

  document.querySelectorAll('.cert-card--clickable').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const src = card.dataset.certImg;
      if (!src) return;
      cImg.src = src;
      cCaption.textContent = card.dataset.certLabel || '';
      certJustOpened = true;
      certLightbox.classList.add('show');
      document.body.style.overflow = 'hidden';
      setTimeout(() => { certJustOpened = false; }, 300);
    });
  });

  function closeCert() {
    certLightbox.classList.remove('show');
    document.body.style.overflow = '';
    cImg.src = '';
  }

  cClose.addEventListener('click', (e) => { e.stopPropagation(); closeCert(); });
  certLightbox.addEventListener('click', (e) => {
    if (certJustOpened) return;
    if (e.target === certLightbox) closeCert();
  });
  if (cContent) cContent.addEventListener('click', (e) => { e.stopPropagation(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certLightbox.classList.contains('show')) closeCert();
  });
}
