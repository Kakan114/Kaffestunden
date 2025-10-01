// --- Hamburgermeny ---
const btn = document.querySelector('.nav-toggle');
const nav = document.getElementById('main-nav');

if (btn && nav) {
  btn.addEventListener('click', () => {
    nav.classList.toggle('show');
  });

 
}

// --- Bildspel ---
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(n) {
  // Dölj alla bilder
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  // Räkna ut vilken bild som ska visas
  if (n < 0) {
    slideIndex = slides.length - 1; // om vi går bakåt från första bilden
  } else if (n >= slides.length) {
    slideIndex = 0; // om vi går förbi sista bilden
  } else {
    slideIndex = n;
  }

  // Visa den valda bilden
  slides[slideIndex].style.display = "block";
}

// Visa första bilden när sidan laddas
showSlide(slideIndex);

function changeSlide(n) {
  showSlide(slideIndex + n);
}

// --- Axios: läs in projekt från JSON ---
axios.get('William-projects.json')
  .then(response => {
    const projekt = response.data;
    const container = document.getElementById('projekt-container');

    projekt.forEach(p => {
      const div = document.createElement('div');
      div.classList.add('projekt-kort');

      div.innerHTML = `
        <img src="${p.image}" alt="${p.title}">
        <h2>${p.title}</h2>
        <p><strong>Kund:</strong> ${p.client}</p>
        <p><strong>År:</strong> ${p.year}</p>
        <p>${p.summary}</p>
        <p><strong>Taggar:</strong> ${p.tags.join(', ')}</p>
      `;

      container.appendChild(div);
    });
  })
  .catch(error => console.error("Fel vid inläsning:", error));