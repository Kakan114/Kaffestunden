// Lägg in alla dina bilder här
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

// Funktion för att visa en bild
function showImage(index) {
  currentIndex = index;
  slideshow.src = images[currentIndex];
}

// När du trycker på "framåt"
nextBtn.addEventListener("click", () => {
  showImage((currentIndex + 1) % images.length);
});

// När du trycker på "bakåt"
prevBtn.addEventListener("click", () => {
  showImage((currentIndex - 1 + images.length) % images.length);
});

