document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const phoneError = document.getElementById('phone-error');
  const messageError = document.getElementById('message-error');
  const statusMessage = document.getElementById('form-status');

  // Valideringsfunktioner
  function checkName() {
    if (nameInput.value.trim().length >= 2) {
      nameError.hidden = true;
      return true;
    } else {
      nameError.hidden = false;
      return false;
    }
  }

  function checkEmail() {
    if (emailInput.value.includes('@')) {
      emailError.hidden = true;
      return true;
    } else {
      emailError.hidden = false;
      return false;
    }
  }

  function checkPhone () {
    if (phoneInput.value.trim().length > 9) {
      phoneError.hidden = true;
      return true;
    } else {
      phoneError.hidden = false;
      return false;
    }
  }

  function checkMessage() {
    if (messageInput.value.trim().length >= 10) {
      messageError.hidden = true;
      return true;
    } else {
      messageError.hidden = false;
      return false;
    }
  }

  // Realtidsvalidering
  nameInput.addEventListener('input', checkName);
  emailInput.addEventListener('input', checkEmail);
phoneInput.addEventListener('input', () => {
  phoneInput.value = phoneInput.value.replace(/\D/g, ''); 
});  messageInput.addEventListener('input', checkMessage);


form.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const isNameOk = checkName();
    const isEmailOk = checkEmail();
    const isPhoneOk = checkPhone();
    const isMessageOk = checkMessage();

    if (isNameOk && isEmailOk && isPhoneOk && isMessageOk) {
      form.reset(); 
      statusMessage.textContent = 'Tack, skickat!';
      statusMessage.hidden = false;
      setTimeout(() => statusMessage.hidden = true, 3000);
    }
  });
});