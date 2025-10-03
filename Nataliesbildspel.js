const images = [
  "Bönor.jpeg",
  "Bryggkaffe.jpeg",
  "kaffe3.jpg",
  "kaffe4.jpg"
];

let currentIndex = 0;

const slideshow = document.getElementById("slideshow");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function showImage(index) {
  currentIndex = index;
  slideshow.src = images[currentIndex];
}

nextBtn.addEventListener("click", () => {
  showImage((currentIndex + 1) % images.length);
});

prevBtn.addEventListener("click", () => {
  showImage((currentIndex - 1 + images.length) % images.length);
});

