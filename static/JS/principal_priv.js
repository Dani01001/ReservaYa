document.addEventListener("DOMContentLoaded", () => {
    // --- Modal de Ver Detalles ---
    const modalVer = document.getElementById("modalVer");
    const verNombre = document.getElementById("verNombre");
    const verEmail = document.getElementById("verEmail");
    const verTelefono = document.getElementById("verTelefono");
    const verHora = document.getElementById("verHora");

    function verDetalles(idReserva) {
        fetch(`/api/reservas/${idReserva}`)
            .then(res => res.json())
            .then(reserva => {
                verNombre.textContent = reserva.cliente;
                verEmail.textContent = reserva.email || 'N/A';
                verTelefono.textContent = reserva.telefono || 'N/A';
                verHora.textContent = reserva.hora;
                modalVer.style.display = "block";
            })
            .catch(err => console.error("Error al obtener detalles:", err));
    }

    modalVer.addEventListener("click", e => {
        if (e.target === modalVer) modalVer.style.display = "none";
    });

    // --- Modal de Gestión de Reservas ---
    const modalGestion = document.getElementById("modalGestion");
    const tablaReservas = document.getElementById("tablaReservas");
    const btnCerrarGestion = document.getElementById("cerrarModalGestion");
    const btnGestionar = document.getElementById("abrirModalGestion");

    function eliminarReserva(fila) {
        const nombreCliente = fila.querySelector("td").textContent;
        if (confirm(`¿Deseas eliminar la reserva de ${nombreCliente}?`)) {
            // Aquí puedes agregar fetch DELETE si tu API lo permite
            fila.remove();
        }
    }

    function cargarReservas() {
        // Limpiar tabla
        tablaReservas.innerHTML = `
            <tr>
                <th>Cliente</th>
                <th>Hora</th>
                <th>Acciones</th>
            </tr>
        `;

        fetch("/api/reservas")
            .then(res => res.json())
            .then(reservas => {
                if (reservas.length === 0) {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `<td colspan="3" style="text-align:center;">No hay reservas hoy</td>`;
                    tablaReservas.appendChild(fila);
                    return;
                }

                reservas.forEach(reserva => {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `
                        <td>${reserva.cliente}</td>
                        <td>${reserva.hora}</td>
                        <td>
                            <button class="btn-small ver-btn">Ver</button>
                            <button class="btn-small eliminar-btn">Eliminar</button>
                        </td>
                    `;
                    tablaReservas.appendChild(fila);

                    // Asignar eventos a botones
                    fila.querySelector(".ver-btn").addEventListener("click", () => verDetalles(reserva.id));
                    fila.querySelector(".eliminar-btn").addEventListener("click", () => eliminarReserva(fila));
                });
            })
            .catch(err => console.error("Error al cargar reservas:", err));
    }

    btnGestionar?.addEventListener("click", () => {
        modalGestion.style.display = "block";
        cargarReservas();
    });

    btnCerrarGestion?.addEventListener("click", () => {
        modalGestion.style.display = "none";
    });

    window.addEventListener("click", e => {
        if (e.target === modalGestion) modalGestion.style.display = "none";
    });

    // --- Mostrar nombre de usuario en el sidebar ---
    const nombreUsuarioSpan = document.getElementById("nombreUsuario");
    const adminProfile = document.getElementById("adminProfile");

    fetch("/api/usuario")
        .then(res => {
            if (!res.ok) throw new Error("No se pudo obtener usuario");
            return res.json();
        })
        .then(data => {
            nombreUsuarioSpan.textContent = data.usuario || "Usuario";
        })
        .catch(err => {
            console.error("Error al obtener usuario:", err);
            nombreUsuarioSpan.textContent = "Usuario";
        });

    adminProfile?.addEventListener("click", async () => {
        // Llama a un endpoint que devuelva el usuario actual
        const resp = await fetch("http://localhost:8000/api/usuario/", {
            credentials: "include"
        });
        if (resp.status === 401 || resp.status === 403) {
            // No autenticado, redirige al login de restaurantes
            window.location.href = "/HTML/login_restaurantes.html";
        } else {
            // Autenticado, puedes mostrar perfil o lo que desees
            // window.location.href = "/HTML/perfil.html";
        }
    });

    // --- Botón Iniciar Sesión ---
    const btnLogin = document.getElementById("btnLogin");
    btnLogin?.addEventListener("click", e => {
        e.preventDefault();
        const url = '../html/login_restaurantes.html';
        const ancho = 600, alto = 600;
        const left = (window.innerWidth - ancho) / 2;
        const top = (window.innerHeight - alto) / 2;
        window.open(url, 'LoginRestaurante', `width=${ancho},height=${alto},top=${top},left=${left}`);
    });

    // Botón Cerrar Sesión
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");
    btnCerrarSesion?.addEventListener("click", async (e) => {
        e.preventDefault();
        // Realiza logout en Django
        await fetch("http://localhost:8000/accounts/logout/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "csrfmiddlewaretoken=" + getCookie("csrftoken"),
            credentials: "include"
        });
        // Redirige al login o página principal
        window.location.href = "/HTML/login_restaurantes.html";
    });

    // Función para obtener el CSRF token de las cookies
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + "=")) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const btnUsuario = document.getElementById("btnUsuario");
    btnUsuario?.addEventListener("click", async () => {
        // Llama a un endpoint que devuelva el usuario actual
        const resp = await fetch("http://localhost:8000/api/usuario/", {
            credentials: "include"
        });
        if (resp.status === 401 || resp.status === 403) {
            // No autenticado, redirige al login de restaurantes
            window.location.href = "/HTML/login_restaurantes.html";
        } else {
            // Autenticado, puedes mostrar perfil o lo que desees
            // window.location.href = "/HTML/perfil.html";
        }
    });
});
