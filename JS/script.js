function abrirVentanaEmergente(url) {
    const ancho = 700; // Ancho de la ventana
    const alto = 850;  // Alto de la ventana

    // Obtener dimensiones de la pantalla
    const left = (window.innerWidth - ancho) / 2;
    const top = (window.innerHeight - alto) / 2;

    // Crear la ventana emergente centrada
    window.open(url, 'VentanaEmergente', `width=${ancho},height=${alto},top=${top},left=${left}`);
}

fetch('http://192.168.100.250:8000/api/reservas/')
    .then(res => res.json())
    .then(data => {
        console.log("Datos desde la api", data);
    })
    .catch(error => {
        console.error("Error alconectar con la api", error);
    });






// Seleccionar el botón de reservar en el html de los restaurantes
const btnReservar = document.querySelector(".btn-reservar");

// Abrir la página de reservas en una nueva ventana centrada en la pantalla en el html de los restaurantes
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