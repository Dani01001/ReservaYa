// =============================================
// ========== MANUAL DEL JS =========
// =============================================
// Archivo: script.js
// Funcionalidades: gestión de login/registro, 
// manejo de sesión, reservas popup, slider de menú
// Compatible con Django URLs
// =============================================

document.addEventListener("DOMContentLoaded", () => {
    // === Elementos clave de navegación ===
    const registroItem = document.getElementById('registroItem');   // Botón de Registro
    const loginItem = document.getElementById('loginItem');         // Botón de Login
    const userSection = document.getElementById('userSection');     // Contenedor usuario
    const userInfo = document.getElementById('userInfo');           // Texto bienvenida
    const userName = document.getElementById('userName');           // Nombre del usuario
    const btnPerfil = document.getElementById('btnPerfil');         // Botón perfil
    const btnLogout = document.getElementById('btnLogout');         // Botón logout
    const btnReservar = document.querySelector(".btn-reservar");    // Botón reservas
    const btnReservarFloat = document.querySelector(".btn-reserva-float"); // Botón flotante reservas

    // === Verificación de sesión (localStorage) ===
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
        // Usuario con sesión activa
        if (registroItem) registroItem.style.display = 'none';
        if (loginItem) loginItem.style.display = 'none';

        userSection.style.display = 'block';
        userInfo.style.display = 'inline';
        userName.textContent = username;
    } else {
        // Usuario sin sesión
        if (registroItem) registroItem.style.display = 'inline-block';
        if (loginItem) loginItem.style.display = 'inline-block';

        userSection.style.display = 'block';
        userInfo.style.display = 'none';
    }

    // === Botón Cerrar Sesión ===
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            window.location.reload();
        });
    }

    // === Botón Ir a Perfil ===
    if (btnPerfil) {
        btnPerfil.addEventListener('click', () => {
            window.location.href = "/usuario/"; // URL Django
        });
    }

    // === Botones Abrir Ventanas Emergentes (Login/Registro) ===
    if (registroItem) {
        registroItem.addEventListener('click', () => abrirVentanaEmergente('/registro/'));
    }
    if (loginItem) {
        loginItem.addEventListener('click', () => abrirVentanaEmergente('/login/'));
    }

    // === Botones Abrir Reservas ===
    if (btnReservar) {
        btnReservar.addEventListener("click", () => abrirReserva());
    }
    if (btnReservarFloat) {
        btnReservarFloat.addEventListener("click", () => abrirReserva());
    }
});

// =============================================
// ========== FUNCIONES AUXILIARES =============
// =============================================

// Abrir login o registro en ventana emergente
function abrirVentanaEmergente(url) {
    const ancho = 700;
    const alto = 850;
    const left = (window.innerWidth - ancho) / 2;
    const top = (window.innerHeight - alto) / 2;

    window.open(
        url,
        "VentanaEmergente",
        `width=${ancho},height=${alto},top=${top},left=${left}`
    );
}

// Abrir reservas en ventana emergente
function abrirReserva() {
    // Intentamos obtener restauranteId de querystring si estamos en página restaurante
    const params = new URLSearchParams(window.location.search);
    const restauranteId = params.get('restaurante') || 1; // fallback a 1 si no hay

    const width = 700;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
        `/pagina/?restaurante=${restauranteId}`,
        "ReservaYa",
        `popup=yes,width=${width},height=${height},left=${left},top=${top},
        toolbar=no,location=no,status=no,scrollbars=no,resizable=no`
    );
}

// =============================================
// ========== API DE RESERVAS ==================
// =============================================

fetch(`http:// 192.168.170.111:8000/api/reservas/`)
    .then(res => res.json())
    .then(data => {
        console.log("✅ Datos recibidos desde la API:", data);
    })
    .catch(error => {
        console.error("❌ Error al conectar con la API", error);
    });

// =============================================
// ========== SLIDER DE MENÚ ===================
// =============================================

const menu = document.getElementById("menuScroll");
const leftBtn = document.querySelector(".arrow.left");
const rightBtn = document.querySelector(".arrow.right");

let index = 0;
const cardWidth = 230;
const visibleCards = 3;
const totalCards = menu ? menu.children.length : 0;

if (rightBtn) {
    rightBtn.addEventListener("click", () => {
        if (index < totalCards - visibleCards) {
            index++;
            menu.style.transform = `translateX(-${index * cardWidth}px)`;
        }
    });
}

if (leftBtn) {
    leftBtn.addEventListener("click", () => {
        if (index > 0) {
            index--;
            menu.style.transform = `translateX(-${index * cardWidth}px)`;
        }
    });
}
