// Mobile menu + year
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');
if (menuBtn) menuBtn.addEventListener('click', () => mobileNav.classList.toggle('hidden'));
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Spotlight pod kursorem
const spot = document.querySelector('.spotlight');
window.addEventListener('pointermove', (e) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  if (spot) {
    spot.style.setProperty('--mx', x + '%');
    spot.style.setProperty('--my', y + '%');
  }
});

// Scroll progress bar
const progress = document.getElementById('progress');
const onScroll = () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  if (progress) progress.style.width = scrolled + '%';
};
window.addEventListener('scroll', onScroll);
onScroll();

// Scroll reveal (IntersectionObserver)
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Tilt efekt dla kart w hero
document.querySelectorAll('[data-tilt]').forEach((card) => {
  let rAF = null; const lim = 10; // stopnie
  const onMove = (e) => {
    const rect = card.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    const rx = (my - .5) * -lim; const ry = (mx - .5) * lim;
    if (!rAF) rAF = requestAnimationFrame(() => {
      card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
      rAF = null;
    });
  };
  const reset = () => { card.style.transform = 'perspective(900px) rotateX(0) rotateY(0)'; };
  card.addEventListener('pointermove', onMove);
  card.addEventListener('pointerleave', reset);
});

// Magnetyczne przyciski (CTA)
document.querySelectorAll('.magnet').forEach((btn) => {
  let raf = null; const strength = 12;
  const move = (e) => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width/2) / (r.width/2);
    const y = (e.clientY - r.top - r.height/2) / (r.height/2);
    if (!raf) raf = requestAnimationFrame(() => {
      btn.style.transform = 'translate(' + (x*strength) + 'px, ' + (y*strength) + 'px)';
      raf = null;
    });
  };
  const reset = () => { btn.style.transform = 'translate(0,0)'; };
  btn.addEventListener('pointermove', move);
  btn.addEventListener('pointerleave', reset);
});

// FAQ toggle
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const content = btn.nextElementSibling; const icon = btn.querySelector('svg');
    if (content.style.maxHeight) { content.style.maxHeight = null; icon.classList.remove('rotate-180'); }
    else {
      document.querySelectorAll('.faq-content').forEach(c => c.style.maxHeight = null);
      document.querySelectorAll('.faq-btn svg').forEach(i => i.classList.remove('rotate-180'));
      content.style.maxHeight = content.scrollHeight + 'px'; icon.classList.add('rotate-180');
    }
  });
});

// Obsługa formularza – walidacja + mock wysyłki (podmień endpoint gdy będziesz gotów)
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (status) status.textContent = '';
    const data = new FormData(form);
    // honeypot
    if (data.get('company')) return;
    // prosta walidacja
    if (!data.get('fullname') || !data.get('email') || !data.get('topic') || !data.get('message') || !document.getElementById('consent').checked) {
      if (status) { status.textContent = 'Uzupełnij wymagane pola.'; status.className = 'text-sm text-red-400'; }
      return;
    }
    try {
      // PRZYKŁAD: wyślij do Formspree / API (podmień URL)
      // const res = await fetch('https://formspree.io/f/TWOJ_ID', { method: 'POST', body: data });
      // if (!res.ok) throw new Error('Błąd wysyłki');
      await new Promise(r => setTimeout(r, 600)); // mock
      if (status) { status.textContent = 'Dzięki! Odezwiemy się wkrótce.'; status.className = 'text-sm text-emerald-400'; }
      form.reset();
    } catch (err) {
      if (status) { status.textContent = 'Coś poszło nie tak. Spróbuj ponownie.'; status.className = 'text-sm text-red-400'; }
    }
  });
}
