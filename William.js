// --- Hamburgermeny ---
const btn = document.querySelector('.nav-toggle');
const nav = document.getElementById('main-nav');

if (btn && nav) {
  btn.addEventListener('click', () => {
    nav.classList.toggle('show');
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
  });


}

// --- Bildspel ---
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(n) {
  slides.forEach(slide => slide.classList.remove('active'));
  slideIndex = (n + slides.length) % slides.length;
  slides[slideIndex].classList.add('active');
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