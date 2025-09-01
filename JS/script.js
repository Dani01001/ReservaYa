function abrirVentanaEmergente(url) {
    const ancho = 700; // Ancho de la ventana
    const alto = 850;  // Alto de la ventana

    // Obtener dimensiones de la pantalla
    const left = (window.innerWidth - ancho) / 2;
    const top = (window.innerHeight - alto) / 2;

    // Crear la ventana emergente centrada
    window.open(url, 'VentanaEmergente', `width=${ancho},height=${alto},top=${top},left=${left}`);
}

fetch('http://127.0.0.1:5500/api/reservas/')
    .then(res => res.json())
    .then(data => {
        console.log("Datos desde la api", data);
    })
    .catch(error => {
        console.error("Error alconectar con la api", error);
    });





// Seleccionar el botón de reservar en el html de los restaurantes
const btnReservar = document.querySelector(".btn-reservar");
const btnReservarFloat = document.querySelector(".btn-reserva-float");

function abrirReserva() {
  const width = 700;
  const height = 700;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  window.open(
    "../reservas.html",
    "ReservaYa",
    `popup=yes,width=${width},height=${height},left=${left},top=${top},
    toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no`
  );
}

btnReservar.addEventListener("click", abrirReserva);
btnReservarFloat.addEventListener("click", abrirReserva);

//Configurar el menu horizontal del html de restaurantes
const menu = document.getElementById("menuScroll");
const leftBtn = document.querySelector(".arrow.left");
const rightBtn = document.querySelector(".arrow.right");

let index = 0; // posición actual
const cardWidth = 230; // ancho de cada card + margen
const visibleCards = 3;
const totalCards = menu.children.length;

rightBtn.addEventListener("click", () => {
  if (index < totalCards - visibleCards) {
    index++;
    menu.style.transform = `translateX(-${index * cardWidth}px)`;
  }
});

leftBtn.addEventListener("click", () => {
  if (index > 0) {
    index--;
    menu.style.transform = `translateX(-${index * cardWidth}px)`;
  }
});
