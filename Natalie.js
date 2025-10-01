// Körs när sidan laddas
window.addEventListener("load", () => {
  document.querySelectorAll(".bar-fill").forEach(bar => {
    const procent = bar.getAttribute("data-kompetens");
    bar.style.width = procent; // triggar CSS transition
  });
});
