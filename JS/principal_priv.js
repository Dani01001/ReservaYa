// --- Modal de Ver Detalles ---
function verDetalles(idReserva) {
    fetch(`/api/reservas/${idReserva}`)
        .then(response => response.json())
        .then(reserva => {
            document.getElementById("verNombre").textContent = reserva.cliente;
            document.getElementById("verEmail").textContent = reserva.email || 'N/A';
            document.getElementById("verTelefono").textContent = reserva.telefono || 'N/A';
            document.getElementById("verHora").textContent = reserva.hora;
            document.getElementById("modalVer").style.display = "block";
        })
        .catch(error => console.error("Error al obtener detalles:", error));
}

function cerrarModalVer() {
    document.getElementById("modalVer").style.display = "none";
}

// Cerrar modal si se hace clic fuera del contenido
window.addEventListener("click", function(e) {
    const modalVer = document.getElementById("modalVer");
    if (e.target == modalVer) {
        cerrarModalVer();
    }
});

// --- Modal de Gestión de Reservas ---
const modalGestion = document.getElementById("modalGestion");
const tablaReservas = document.getElementById("tablaReservas");
const cerrarModal = document.getElementById("cerrarModalGestion");

function abrirModalGestion() {
    modalGestion.style.display = "block";

    // Limpiar la tabla (solo encabezado)
    tablaReservas.innerHTML = `
        <tr>
            <th>Cliente</th>
            <th>Hora</th>
            <th>Acciones</th>
        </tr>
    `;

    // Traer las reservas desde la base de datos
    fetch("/api/reservas") // Cambia a tu endpoint real si es diferente
        .then(response => response.json())
        .then(reservas => {
            if (reservas.length === 0) {
                const fila = document.createElement("tr");
                fila.innerHTML = `<td colspan="3" style="text-align:center;">No hay reservas hoy</td>`;
                tablaReservas.appendChild(fila);
            } else {
                reservas.forEach(reserva => {
                    const fila = document.createElement("tr");

                    fila.innerHTML = `
                        <td>${reserva.cliente}</td>
                        <td>${reserva.hora}</td>
                        <td>
                            <button class="btn-small" onclick="verDetalles(${reserva.id})">Ver</button>
                            <button class="btn-small" onclick="eliminarReserva(this)">Eliminar</button>
                        </td>
                    `;

                    tablaReservas.appendChild(fila);
                });
            }
        })
        .catch(error => console.error("Error al cargar reservas:", error));
}

// Cerrar modal de gestión
cerrarModal.onclick = () => modalGestion.style.display = "none";
window.onclick = e => { 
    if (e.target == modalGestion) modalGestion.style.display = "none"; 
};

// --- Función para eliminar reserva (opcional) ---
function eliminarReserva(btn) {
    const fila = btn.closest("tr");
    const nombreCliente = fila.querySelector("td").textContent;
    if (confirm(`¿Deseas eliminar la reserva de ${nombreCliente}?`)) {
        // Aquí puedes agregar fetch DELETE si tu API lo permite
        fila.remove();
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const btnGestionar = document.getElementById("abrirModalGestion");
    if (btnGestionar) {
        btnGestionar.addEventListener("click", abrirModalGestion);
    }
});