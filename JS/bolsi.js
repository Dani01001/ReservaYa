const btnGaleria = document.getElementById("btn-galeria");
const modal = document.getElementById("modal");
const cerrar = document.getElementById("cerrar");

// Abrir modal
btnGaleria.addEventListener("click", () => {
  modal.style.display = "block";
});

  // Cerrar modal con la X
cerrar.addEventListener("click", () => {
  modal.style.display = "none";
});

  // Cerrar modal haciendo click fuera del contenido
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});