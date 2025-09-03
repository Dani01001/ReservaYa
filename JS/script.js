//inicio de las funcionalidades de desaparicion de login y registro y mas cosas
document.addEventListener("DOMContentLoaded", () => {
    const registroBtn = document.getElementById('registro');
    const loginBtn = document.getElementById('iniciar_sesion');
    const userSection = document.getElementById('userSection');
    const userName = document.getElementById('userName');
    const userInfo = document.getElementById('userInfo');
    const btnPerfil = document.getElementById('btnPerfil');
    const btnLogout = document.getElementById('btnLogout');
    const registroItem = document.getElementById('registroItem');
    const loginItem = document.getElementById('loginItem');

    if (token && username) {
        if (registroItem) registroItem.style.display = 'none';
        if (loginItem) loginItem.style.display = 'none';
    
        userSection.style.display = 'block';
        userInfo.style.display = 'inline';
        userName.textContent = username;
    } else {
        if (registroItem) registroItem.style.display = 'inline-block';
        if (loginItem) loginItem.style.display = 'inline-block';
    
        userSection.style.display = 'block';
        userInfo.style.display = 'none';
    }

    // Revisar si hay sesión guardada en localStorage
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
        // Usuario logueado
        if(registroBtn) registroBtn.parentElement.style.display = 'none';
        if(loginBtn) loginBtn.parentElement.style.display = 'none';

        userSection.style.display = 'block';
        userInfo.style.display = 'inline';
        userName.textContent = username;
    } else {
        // Usuario no logueado
        if(registroBtn) registroBtn.parentElement.style.display = 'block';
        if(loginBtn) loginBtn.parentElement.style.display = 'block';

        userSection.style.display = 'block';
        userInfo.style.display = 'none';
    }

    // Botón cerrar sesión
    if(btnLogout){
        btnLogout.addEventListener('click', function(){
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            window.location.reload();
        });
    }

    // Botón ir a perfil
    if(btnPerfil){
        btnPerfil.addEventListener('click', function(){
            window.location.href = "usuario.html";
        });
    }
});
//fin



function abrirVentanaEmergente(url) {
    const ancho = 700; // Ancho de la ventana
    const alto = 850;  // Alto de la ventana

    // Obtener dimensiones de la pantalla
    const left = (window.innerWidth - ancho) / 2;
    const top = (window.innerHeight - alto) / 2;

    // Crear la ventana emergente centrada
    window.open(url, 'VentanaEmergente', `width=${ancho},height=${alto},top=${top},left=${left}`);
}


fetch('http://192.168.0.9:5500/api/reservas/')
    .then(res => res.json())
    .then(data => {
        console.log("Datos desde la api", data);
    })
    .catch(error => {
        console.error("Error al conectar con la api", error);
    });
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
