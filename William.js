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