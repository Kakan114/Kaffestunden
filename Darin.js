
// Mobilmeny: öppna/stäng, uppdatera aria
(function () {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.setAttribute('aria-label', isOpen ? 'Stäng meny' : 'Öppna meny');
  });

  // Stäng menyn när man klickar en länk (mobil)
  nav.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    document.body.classList.remove('nav-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Öppna meny');
  });

  // Säkerställ att mobilmenyn stängs när man går upp i desktopbredd
  const mq = window.matchMedia('(min-width: 768px)');
  mq.addEventListener('change', (ev) => {
    if (ev.matches) {
      document.body.classList.remove('nav-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Öppna meny');
    }
  });
})();

// ===== Bildspel (manuell stege) =====
(function () {
  const slides = Array.from(document.querySelectorAll('.slideshow .slide'));
  const prevBtn = document.querySelector('.slideshow .prev');
  const nextBtn = document.querySelector('.slideshow .next');
  const dots = Array.from(document.querySelectorAll('.slideshow .dot'));
  if (!slides.length || !prevBtn || !nextBtn) return;

  let index = 0;

  function show(i) {
    // wrap runt
    index = (i + slides.length) % slides.length;

    // uppdatera slides
    slides.forEach((el, n) => el.classList.toggle('is-active', n === index));

    // uppdatera dots (om de finns)
    if (dots.length) {
      dots.forEach((d, n) => {
        const active = n === index;
        d.classList.toggle('is-active', active);
        d.setAttribute('aria-selected', String(active));
        d.setAttribute('tabindex', active ? '0' : '-1');
      });
    }
  }

  function next() { show(index + 1); }
  function prev() { show(index - 1); }

  // knappar
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  // dots (valfritt)
  if (dots.length) {
    dots.forEach((d, n) => d.addEventListener('click', () => show(n)));
  }

  // tangentbordsstöd (vänster/höger piltangent)
  document.querySelector('.slideshow').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
  });

  // init
  show(0);
})();


// ===== Projekt: hämtning + render + filter/sort (i ett sammanhållet scope) =====
(function () {
  const grid = document.getElementById('projects-grid');
  const filterInput = document.getElementById('filterInput');
  const sortSelect = document.getElementById('sortSelect');
  if (!grid) return;

  let allProjects = [];

  // Hämta data (matcha EXAKT filnamnet på din JSON)
  axios.get('Darin-projects.json')
    .then(res => {
      allProjects = Array.isArray(res.data) ? res.data : [];
      renderProjects(allProjects);
    })
    .catch(err => {
      console.error('Kunde inte läsa in projekt:', err);
      grid.innerHTML = '<p>Kunde inte läsa in projekt just nu.</p>';
    });

  function renderProject(p) {
    const card = document.createElement('article');
    card.className = 'project-card reveal';
    card.setAttribute('role', 'listitem');

    const media = document.createElement('div');
    media.className = 'project-media';
    const img = document.createElement('img');
    img.src = p.image || 'placeholder.jpg';
    img.alt = p.title ? `Projektbild: ${p.title}` : 'Projektbild';
    img.loading = 'lazy';
    media.appendChild(img);

    const body = document.createElement('div');
    body.className = 'project-body';

    const h3 = document.createElement('h3');
    h3.className = 'project-title';
    h3.textContent = p.title || 'Projekt';

    const meta = document.createElement('div');
    meta.className = 'project-meta';
    const client = p.client ?? '—';
    const year = p.year ?? '—';
    meta.textContent = `${client} • ${year}`;

    const summary = document.createElement('p');
    summary.className = 'project-summary';
    summary.textContent = p.summary || '';

    body.appendChild(h3);
    body.appendChild(meta);
    body.appendChild(summary);

    const tags = document.createElement('div');
    tags.className = 'project-tags';
    (p.tags || []).forEach(t => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      tags.appendChild(span);
    });

    card.appendChild(media);
    card.appendChild(body);
    card.appendChild(tags);
    return card;
  }

  // ===== Skillbars: animera när sektionen blir synlig =====
(function () {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  const items = Array.from(skillsSection.querySelectorAll('.skill'));

  function animate() {
    // valfritt: klass om du vill styla något globalt
    document.body.classList.add('skills-animate');

    // sätt bredden på varje stapel
    items.forEach(item => {
      const level = Number(item.dataset.level || 0); // ex: 85 (inte "85%")
      const fill = item.querySelector('.skill-fill');
      if (fill) fill.style.width = Math.max(0, Math.min(level, 100)) + '%';
      // alternativ (CSS-variabel): fill.style.setProperty('--level', level + '%');
    });
  }

  // Trigga när sektionen syns
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate();
          io.disconnect(); // kör en gång
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -20% 0px' });
    io.observe(skillsSection);

    // Om sektionen redan är i bild vid load — kör ändå
    const r = skillsSection.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) animate();
  } else {
    // Fallback för äldre browsers
    window.addEventListener('load', () => setTimeout(animate, 300));
  }
})();

  function renderProjects(list) {
  grid.innerHTML = '';
  const frag = document.createDocumentFragment();

  list.forEach((item, idx) => {
    const card = renderProject(item);
    // valfritt: liten “stagger” så korten kommer in mjukt i ordning
    card.style.transitionDelay = (idx % 6) * 40 + 'ms';
    frag.appendChild(card);
  });

  grid.appendChild(frag);

  // NYTT: observera nyinsatta kort
  setupRevealForNewCards();
}
function setupRevealForNewCards() {
  const cards = grid.querySelectorAll('.project-card.reveal');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce) {
    cards.forEach(c => c.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  cards.forEach(c => io.observe(c));
}

  function applyFilterSort() {
    if (!allProjects.length) return;

    const term = (filterInput?.value || '').toLowerCase();
    const sort = (sortSelect?.value || 'year-desc');

    // Filtrera
    let filtered = allProjects.filter(p => {
      const haystack = [p.title, p.client, ...(p.tags || [])].join(' ').toLowerCase();
      return haystack.includes(term);
    });

    // Sortera
    filtered.sort((a, b) => {
      switch (sort) {
        case 'year-asc':  return (a.year ?? 0) - (b.year ?? 0);
        case 'year-desc': return (b.year ?? 0) - (a.year ?? 0);
        case 'title-asc': return (a.title || '').localeCompare(b.title || '');
        case 'title-desc': return (b.title || '').localeCompare(a.title || '');
        default: return 0;
      }
    });

    renderProjects(filtered);
  }

  // Koppla events när kontroller finns i DOM
  if (filterInput) filterInput.addEventListener('input', applyFilterSort);
  if (sortSelect)  sortSelect.addEventListener('change', applyFilterSort);
})();

// ===== Scroll-reveal för statiska .reveal-element i DOM =====
(function () {
  const items = Array.from(document.querySelectorAll('.reveal'));
  if (!items.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => io.observe(el));
})();