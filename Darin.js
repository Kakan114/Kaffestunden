// ===== Små hjälpare =====
(function () {
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  // ===== 1) Mobilmeny =====
  (function mobileNav() {
    const btn = $('.nav-toggle');
    const nav = $('#main-nav');
    if (!btn || !nav) return;

    on(btn, 'click', () => {
      const open = document.body.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Stäng meny' : 'Öppna meny');
    });

    // Stäng när man klickar på en länk i menyn (mobil)
    on(nav, 'click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      document.body.classList.remove('nav-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Öppna meny');
    });

    // Om skärmen går upp till desktop – stäng mobilmenyn
    const mq = matchMedia('(min-width: 768px)');
    on(mq, 'change', (ev) => {
      if (ev.matches) {
        document.body.classList.remove('nav-open');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Öppna meny');
      }
    });
  })();

  // ===== Delad IntersectionObserver för reveal + skills =====
  const prefersReduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Triggar .is-visible och ev. callbacks per element
  function makeRevealObserver(onEnterMap = new WeakMap()) {
    if (prefersReduce) {
      $$('.reveal').forEach(el => el.classList.add('is-visible'));
      // Kör ev. onEnter direkt
      $$('.reveal').forEach(el => onEnterMap.get(el)?.());
      return { observe(){}, disconnect(){} };
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-visible');
        onEnterMap.get(el)?.();
        io.unobserve(el);
      });
    }, { threshold: 0.12 });

    return io;
  }

  // ===== 2) Bildspel =====
  (function slideshow() {
    const root = $('.slideshow');
    if (!root) return;

    const slides = $$('.slide', root);
    const dots   = $$('.dot', root);
    const prev   = $('.prev', root);
    const next   = $('.next', root);
    if (!slides.length || !prev || !next) return;

    let i = 0;
    const clamp = (n) => (n + slides.length) % slides.length;

    function update(idx) {
      i = clamp(idx);
      slides.forEach((el, n) => el.classList.toggle('is-active', n === i));
      dots.forEach((d, n) => {
        const active = n === i;
        d.classList.toggle('is-active', active);
        d.setAttribute('aria-selected', String(active));
        d.setAttribute('tabindex', active ? '0' : '-1');
      });
    }

    on(next, 'click', () => update(i + 1));
    on(prev, 'click', () => update(i - 1));
    dots.forEach((d, n) => on(d, 'click', () => update(n)));

    on(root, 'keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); update(i + 1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); update(i - 1); }
    });

    update(0);
  })();

  // ===== 3) Projekt + filter/sort + reveal =====
  (function projects() {
    const grid        = $('#projects-grid');
    const filterInput = $('#filterInput');
    const sortSelect  = $('#sortSelect');
    if (!grid) return;

    let all = [];

    // Render ett kort
    function card(p) {
      const art = document.createElement('article');
      art.className = 'project-card reveal';
      art.setAttribute('role', 'listitem');

      art.innerHTML = `
        <div class="project-media">
          <img src="${p.image || 'placeholder.jpg'}" alt="${p.title ? `Projektbild: ${p.title}` : 'Projektbild'}" loading="lazy">
        </div>
        <div class="project-body">
          <h3 class="project-title">${p.title || 'Projekt'}</h3>
          <div class="project-meta">${p.client ?? '—'} • ${p.year ?? '—'}</div>
          <p class="project-summary">${p.summary || ''}</p>
        </div>
        <div class="project-tags">
          ${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      `;
      return art;
    }

    // Rendera lista → grid + koppla reveal
    function render(list) {
      grid.innerHTML = '';
      const frag = document.createDocumentFragment();
      list.forEach((p, idx) => {
        const c = card(p);
        c.style.transitionDelay = (idx % 6) * 40 + 'ms';
        frag.appendChild(c);
      });
      grid.appendChild(frag);

      // Observer för nyinsatta kort
      $$('.project-card.reveal', grid).forEach(el => revealObserver.observe(el));
    }

    // Filter + sort
    function apply() {
      if (!all.length) return;
      const term = (filterInput && filterInput.value || '').toLowerCase();
      const sort = (sortSelect && sortSelect.value) || 'year-desc';

      let list = all.filter(p => {
        const hay = [p.title, p.client, ...(p.tags || [])].join(' ').toLowerCase();
        return hay.includes(term);
      });

      list.sort((a, b) => {
        switch (sort) {
          case 'year-asc':  return (a.year ?? 0) - (b.year ?? 0);
          case 'year-desc': return (b.year ?? 0) - (a.year ?? 0);
          case 'title-asc': return (a.title || '').localeCompare(b.title || '');
          case 'title-desc':return (b.title || '').localeCompare(a.title || '');
          default: return 0;
        }
      });

      render(list);
    }

    // Debounce för filter (snällare mot DOM)
    function debounce(fn, ms = 120) {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(null, args), ms);
      };
    }

    if (filterInput) on(filterInput, 'input', debounce(apply, 140));
    if (sortSelect)  on(sortSelect, 'change', apply);

    // Hämta JSON
    axios.get('Darin-projects.json')
      .then(res => {
        all = Array.isArray(res.data) ? res.data : [];
        apply();
      })
      .catch(err => {
        console.error('Kunde inte läsa in projekt:', err);
        grid.innerHTML = '<p>Kunde inte läsa in projekt just nu.</p>';
      });

    // Skapa revealObserver efter att grid finns
    const onEnterMap = new WeakMap();
    const revealObserver = makeRevealObserver(onEnterMap);

    // 4) Skills – koppla in när sektionen syns (återanvänd samma observer)
    const skillsSection = $('#skills');
    if (skillsSection) {
      onEnterMap.set(skillsSection, () => {
        $$('.skill', skillsSection).forEach(item => {
          const level = Math.max(0, Math.min(Number(item.dataset.level || 0), 100));
          const fill = $('.skill-fill', item);
          if (fill) fill.style.width = level + '%';
        });
      });
      // se till att #skills får .reveal om du vill ha fade-in
      if (!skillsSection.classList.contains('reveal')) skillsSection.classList.add('reveal');
      revealObserver.observe(skillsSection);
    }

    // Observera statiska reveal-element på sidan (engångs)
    $$('.reveal').forEach(el => revealObserver.observe(el));
  })();

})();