
// Hämta alla element med scroll-element
const scrollElements = document.querySelectorAll(".scroll-element");

function checkScroll() {
  const triggerBottom = window.innerHeight * 0.85;

  scrollElements.forEach(el => {
    const top = el.getBoundingClientRect().top; //Veta vart elementet är i skärmen

    if(top < triggerBottom) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });
}

window.addEventListener("scroll", checkScroll);
window.addEventListener("load", checkScroll); // säkerställ initial trigger

