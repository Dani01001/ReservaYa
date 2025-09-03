function abrirVentanaEmergente(url) {
    const ancho = 700; // Ancho de la ventana
    const alto = 850;  // Alto de la ventana

    // Obtener dimensiones de la pantalla
    const left = (window.innerWidth - ancho) / 2;
    const top = (window.innerHeight - alto) / 2;

    // Crear la ventana emergente centrada
    window.open(url, 'VentanaEmergente', `width=${ancho},height=${alto},top=${top},left=${left}`);
}

<<<<<<< HEAD
// ======== API FETCH DE RESERVAS ==========
=======
<<<<<<< HEAD
fetch('http://10.149.105.102:5500/api/reservas/')
=======
>>>>>>> 2f682412d70ac04c56c2213b6127ef4474a4f363
fetch('http://192.168.170.35:5500/api/reservas/')
>>>>>>> d33d47a5ee5a9c86824c811abaa5a2129376f093
    .then(res => res.json())
    .then(data => {
        console.log("Datos desde la api", data);
    })
    .catch(error => {
        console.error("Error al conectar con la api", error);
    });


// ========= RESERVAR MESA =========
const btnReservar = document.querySelector(".btn-reservar");
const btnReservarFloat = document.querySelector(".btn-reserva-float");

// ⚡ Aquí definís el ID del restaurante correspondiente a este HTML
// Ejemplo: bolsi.html corresponde al restaurante con ID 1
const RESTAURANTE_ID = 1;

function abrirReserva() {
  const width = 700;
  const height = 700;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  // Pasamos el restaurante_id por querystring
  window.open(
    `../reservas.html?restaurante=${RESTAURANTE_ID}`,
    "ReservaYa",
    `popup=yes,width=${width},height=${height},left=${left},top=${top},
    toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no`
  );
}

btnReservar.addEventListener("click", abrirReserva);
btnReservarFloat.addEventListener("click", abrirReserva);


// ========= SLIDER DE MENÚ =========
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
