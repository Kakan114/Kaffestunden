(function () {

  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let index = 0;

  function setActive(newIndex) {
    index = (newIndex + slides.length) % slides.length; 
    slides.forEach((el, i) => el.classList.toggle('is-active', i === index));
  }

  function next() { setActive(index + 1); }
  function prev() { setActive(index - 1); }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  
  setActive(0);
})();


axios.get('denis.json')
  .then(response => {
    const projects = response.data;
    const grid = document.getElementById('projects-grid');

    projects.forEach(p => {
      grid.innerHTML += `
        <article class="project-card">
          <img src="${p.image}" alt="${p.title}">
          <h3>${p.title}</h3>
          <p>Kund: ${p.client}</p>
          <p>${p.summary}</p>
        </article>
      `;
    });
  })
  .catch(err => console.error('Kunde inte ladda denis.json', err));

  const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});
