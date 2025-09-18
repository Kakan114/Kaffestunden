// Minimal lightbox utan bibliotek
(function () {
  const links = document.querySelectorAll('.album-link');
  if (!links.length) return;

  // skapa overlay en gång
  const overlay = document.createElement('div');
  overlay.className = 'lb-overlay';
  overlay.innerHTML = `
    <div class="lb-dialog" role="dialog" aria-modal="true" aria-label="Stor bild">
      <button class="lb-close" aria-label="Stäng">×</button>
      <img class="lb-image" alt="">
      <p class="lb-caption"></p>
    </div>
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector('.lb-image');
  const capEl = overlay.querySelector('.lb-caption');
  const closeBtn = overlay.querySelector('.lb-close');

  function open(src, caption) {
    imgEl.src = src;
    capEl.textContent = caption || '';
    overlay.classList.add('is-open');
    closeBtn.focus();
  }
  function close() {
    overlay.classList.remove('is-open');
    imgEl.src = '';
  }

  links.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const fig = a.closest('figure');
      const caption = fig?.querySelector('figcaption')?.textContent || '';
      open(a.getAttribute('href'), caption);
    });
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.classList.contains('lb-close')) close();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
  });
})();