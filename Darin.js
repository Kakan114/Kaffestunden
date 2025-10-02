// ===== Små hjälpare =====
(function () {
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // =========================
  // 1) Mobilmeny
  // =========================
  (function mobileNav() {
    const btn = $('.nav-toggle');
    const nav = $('#main-nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Stäng meny' : 'Öppna meny');
    });

    // Stäng när man klickar en länk i menyn (mobil)
    nav.addEventListener('click', (e) => {
      if (!e.target.closest('a')) return;
      document.body.classList.remove('nav-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Öppna meny');
    });

    // Stäng när vi går upp i desktop-bredd
    matchMedia('(min-width: 768px)').addEventListener('change', (ev) => {
      if (!ev.matches) return;
      document.body.classList.remove('nav-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Öppna meny');
    });
  })();

  // =========================
  // 2) Reveal + Skills
  // =========================
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // En observer som sätter .is-visible när element kommer in i bild
  const revealObserver = reduceMotion
    ? { observe(el){ el.classList.add('is-visible'); } }
    : new IntersectionObserver((entries, io) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      }, { threshold: 0.12 });

  // Applicera reveal på statiska .reveal
  $$('.reveal').forEach(el => revealObserver.observe(el));

  // Skills: fyll staplar när #skills blir synlig
  (function skillsFill() {
    const section = $('#skills');
    if (!section) return;

    const fillBars = () => {
      $$('.skill', section).forEach(item => {
        const level = Math.max(0, Math.min(Number(item.dataset.level || 0), 100));
        const fill = $('.skill-fill', item);
        if (fill) fill.style.width = level + '%';
      });
    };

    if (reduceMotion) {
      fillBars(); // kör direkt om användaren vill minska rörelser
      return;
    }

    const io = new IntersectionObserver((entries, io2) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        fillBars();
        io2.unobserve(entry.target);
      });
    });

    // Se till att sektionen observeras (lägg gärna .reveal i HTML för fade-in)
    io.observe(section);
  })();

  // =========================
  // 3) Bildspel
  // =========================
 (function slideshow() {
  const root   = $('.slideshow');
  if (!root) return;

  const slides = $$('.slide', root);
  const prev   = $('.prev', root);
  const next   = $('.next', root);
  if (!slides.length || !prev || !next) return;

  let i = 0;
  const wrap = n => (n + slides.length) % slides.length;

  function show(idx) {
    i = wrap(idx);
    slides.forEach((el, n) => el.classList.toggle('is-active', n === i));
  }

  next.addEventListener('click', () => show(i + 1));
  prev.addEventListener('click', () => show(i - 1));

  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); show(i - 1); }
  });

  show(0);
})();

  // =========================
  // 4) Projekt: hämta + render + filter/sort + reveal
  // =========================
  (function projects() {
    const grid = $('#projects-grid');
    const fIn  = $('#filterInput');
    const sSel = $('#sortSelect');
    if (!grid) return;

    let ALL = [];

    function render(list) {
      grid.innerHTML = list.map(p => `
        <article class="project-card reveal" role="listitem">
          <div class="project-media">
            <img src="${p.image || 'placeholder.jpg'}"
                 alt="${p.title ? `Projektbild: ${p.title}` : 'Projektbild'}"
                 loading="lazy">
          </div>
          <div class="project-body">
            <h3 class="project-title">${p.title || 'Projekt'}</h3>
            <div class="project-meta">${p.client ?? '—'} • ${p.year ?? '—'}</div>
            <p class="project-summary">${p.summary || ''}</p>
          </div>
          <div class="project-tags">
            ${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
        </article>
      `).join('');

      // Reveal på ny-renderade kort
      $$('.project-card.reveal', grid).forEach(el => revealObserver.observe(el));
    }

    function apply() {
      const term = (fIn?.value || '').toLowerCase();
      const sort = sSel?.value || 'year-desc';

      let list = ALL.filter(p => {
        const hay = [p.title, p.client, ...(p.tags || [])].join(' ').toLowerCase();
        return hay.includes(term);
      });

      list.sort((a, b) => {
        if (sort === 'year-asc')  return (a.year ?? 0) - (b.year ?? 0);
        if (sort === 'year-desc') return (b.year ?? 0) - (a.year ?? 0);
        if (sort === 'title-asc') return (a.title || '').localeCompare(b.title || '');
        if (sort === 'title-desc')return (b.title || '').localeCompare(a.title || '');
        return 0;
      });

      render(list);
    }

    // Litet debounce för filter-input
    let t;
    fIn && fIn.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(apply, 140);
    });
    sSel && sSel.addEventListener('change', apply);

    // Hämta data
    axios.get('Darin-projects.json')
      .then(res => { ALL = Array.isArray(res.data) ? res.data : []; apply(); })
      .catch(() => { grid.innerHTML = '<p>Kunde inte läsa in projekt just nu.</p>'; });
  })();

})();