(function () {
    const btn = document.querySelector('.nav-toggle');
    const body = document.body;

    if (!btn) return;

    btn.addEventListener('click', () =>{
        const isOpen = body.classList.toggle('nav-open');
        btn.setAttribute('aria-expanded', isOpen);
        btn.setAttribute('aria-label', isOpen ? 'Stäng meny' : 'Öppna meny')
    });
}) ();