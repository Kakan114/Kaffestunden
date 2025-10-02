// Kompetensfyllning
window.addEventListener("load", () => {
  document.querySelectorAll(".bar-fill").forEach(bar => {
    const procent = bar.getAttribute("data-kompetens");
    bar.style.width = procent; 
  });
});


let projects = [];
let filteredProjects = [];

// Hämta projekt från JSON med Axios
axios.get("Natalie.json")
  .then(response => {
    projects = response.data;
    filteredProjects = [...projects];
    renderProjects(filteredProjects);
  })
  .catch(error => console.error("Fel vid inläsning:", error));

// Rendera projekt på sidan
function renderProjects(list) {
  const container = document.getElementById("projectsContainer");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>Inga projekt hittades.</p>";
    return;
  }

  list.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("project-card");
    card.innerHTML = `
      <div class="project-title">${p.title}</div>
      <div><strong>Kund:</strong> ${p.client}</div>
      <div>${p.description}</div>
      <div><em>${p.extra}</em></div>
    `;
    container.appendChild(card);
  });
}

// Filtrering
document.getElementById("filterInput").addEventListener("input", e => {
  const search = e.target.value.toLowerCase();
  filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(search) ||
    p.client.toLowerCase().includes(search) ||
    p.description.toLowerCase().includes(search)
  );
  applySort();
});

// Sortering
document.getElementById("sortSelect").addEventListener("change", applySort);
function applySort() {
  const sortValue = document.getElementById("sortSelect").value;

  filteredProjects.sort((a, b) => {
    if (sortValue === "title-asc") return a.title.localeCompare(b.title, 'sv', { sensitivity: 'base' });
    if (sortValue === "title-desc") return b.title.localeCompare(a.title, 'sv', { sensitivity: 'base' });
    if (sortValue === "client-asc") return a.client.localeCompare(b.client, 'sv', { sensitivity: 'base' });
    if (sortValue === "client-desc") return b.client.localeCompare(a.client, 'sv', { sensitivity: 'base' });
  });

  renderProjects(filteredProjects);
}

