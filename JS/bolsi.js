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



const btnReservar = document.querySelector(".btn-reservar");

// Abrir la página de reservas en una nueva ventana centrada en la pantalla
btnReservar.addEventListener("click", () => {
  const width = 700;
  const height = 700;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  window.open(
    "reservas.html",
    "ReservaYa",
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no`
  );
});
