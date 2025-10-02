(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');

  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const phoneEl = document.getElementById('phone');
  const msgEl = document.getElementById('message');

  const nameErr = document.getElementById('name-error');
  const emailErr = document.getElementById('email-error');
  const phoneErr = document.getElementById('phone-error');
  const msgErr = document.getElementById('message-error');

  function validateName() {
    const ok = nameEl.value.trim().length >= 2;
    nameErr.hidden = ok;
    return ok;
  }

  function validateEmail() {
    const ok = emailEl.value.includes('@');
    emailErr.hidden = ok;
    return ok;
  }

  function validatePhone() {
    const v = phoneEl.value.trim();
    const ok = v === '' || /^[0-9 +()-]{6,}$/.test(v);
    phoneErr.hidden = ok;
    return ok;
  }

  function validateMsg() {
    const ok = msgEl.value.trim().length >= 10;
    msgErr.hidden = ok;
    return ok;
  }

  // Realtidsvalidering
  nameEl.addEventListener('input', validateName);
  emailEl.addEventListener('input', validateEmail);
  phoneEl.addEventListener('input', validatePhone);
  msgEl.addEventListener('input', validateMsg);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = validateName() & validateEmail() & validatePhone() & validateMsg();
    if (!ok) return;

    form.reset();
    nameErr.hidden = emailErr.hidden = phoneErr.hidden = msgErr.hidden = true;

    if (statusEl) {
      statusEl.textContent = 'Tack, skickat!';
      statusEl.hidden = false;
      setTimeout(() => { statusEl.hidden = true; }, 3000);
    }
  });
})();

