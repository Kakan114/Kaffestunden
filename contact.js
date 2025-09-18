// Enkel kontakt: validera & öppna mailklienten med förifyllt innehåll
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');
  const emailTo = 'kaffestunden@example.com'; // ← BYT till er riktiga adress

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = '';

    const nameEl = form.querySelector('#name');
    const emailEl = form.querySelector('#email');
    const msgEl = form.querySelector('#message');

    // enkel validering
    let ok = true;
    clearErrors();

    if (!nameEl.value.trim()) { setError(nameEl, 'Ange ditt namn'); ok = false; }
    if (!emailEl.value.trim() || !emailEl.checkValidity()) { setError(emailEl, 'Ange en giltig e-post'); ok = false; }
    if (!msgEl.value.trim()) {
  setError(msgEl, 'Skriv ett meddelande');
  ok = false;
} else if (msgEl.value.trim().length < 10) {
  setError(msgEl, 'Meddelandet måste vara minst 10 tecken långt');
  ok = false;
}

msgEl.addEventListener('input', () => {
  if (msgEl.value.trim().length < 10) {
    setError(msgEl, 'Meddelandet måste vara minst 10 tecken långt');
  } else {
    clearErrors();
  }
});

    if (!ok) return;

    const subject = `Kontakt från ${nameEl.value.trim()}`;
    const body =
`Namn: ${nameEl.value.trim()}
E-post: ${emailEl.value.trim()}

Meddelande:
${msgEl.value.trim()}`;

    // öppna användarens e-postklient
    const mailto = `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;

    // valfri feedback i UI:t
    status.textContent = 'Öppnar ditt e-postprogram… Om inget händer, maila oss direkt.';
    form.reset();
  });

  function setError(input, msg) {
    const box = input.closest('.field');
    const small = box?.querySelector('.error');
    if (small) small.textContent = msg;
    input.setAttribute('aria-invalid', 'true');
  }

  function clearErrors() {
    form.querySelectorAll('.error').forEach(el => el.textContent = '');
    form.querySelectorAll('[aria-invalid="true"]').forEach(el => el.removeAttribute('aria-invalid'));
  }
})();