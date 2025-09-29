(function () {
  // Hämta alla slides och knappar
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let index = 0;

  function setActive(newIndex) {
    index = (newIndex + slides.length) % slides.length; // wrap 0..n-1
    slides.forEach((el, i) => el.classList.toggle('is-active', i === index));
  }

  function next() { setActive(index + 1); }
  function prev() { setActive(index - 1); }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  // Init
  setActive(0);
})();


axios.get('denis.json')
  .then(response => {
    const projects = response.data;
    const grid = document.getElementById('projects-grid');

    projects.forEach(p => {
      grid.innerHTML += `
        <article class="project-card">
          <img src="${p.image}" alt="${p.title}" loading="lazy">
          <h3>${p.title}</h3>
          <p>Kund: ${p.client}</p>
          <p>${p.summary}</p>
        </article>
      `;
    });
  })
  .catch(err => console.error('Kunde inte ladda denis.json', err));

// --- Enkel mobilmeny ---
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});
