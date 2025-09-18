// --- Hamburgermeny ---
const btn = document.querySelector('.nav-toggle');
const nav = document.getElementById('main-nav');

if (btn && nav) {
  btn.addEventListener('click', () => {
    nav.classList.toggle('show');
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
  });

  // Stäng menyn när man klickar en länk på mobil
  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && window.matchMedia('(max-width: 768px)').matches) {
      nav.classList.remove('show');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}




let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
showSlide(slideIndex);

function changeSlide(n) {
  slides[slideIndex].classList.remove('active');
  slideIndex += n;
  if (slideIndex >= slides.length) slideIndex = 0;
  if (slideIndex < 0) slideIndex = slides.length - 1;
  slides[slideIndex].classList.add('active');
}


