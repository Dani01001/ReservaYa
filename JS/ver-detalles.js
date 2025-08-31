// --- Modal de Ver Detalles ---
function verDetalles(idReserva) {
    fetch(`/api/reservas/${idReserva}`)
        .then(response => response.json())
        .then(reserva => {
            // Rellenar campos del modal
            document.getElementById("verNombre").textContent = reserva.cliente;
            document.getElementById("verEmail").textContent = reserva.email || 'N/A';
            document.getElementById("verTelefono").textContent = reserva.telefono || 'N/A';
            document.getElementById("verHora").textContent = reserva.hora;

            // Mostrar modal
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
    tablaReservas.innerHTML = `
        <tr>
            <th>Cliente</th>
            <th>Hora</th>
            <th>Acciones</th>
        </tr>
    `;

    fetch("/api/reservas")
        .then(response => response.json())
        .then(reservas => {
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
        })
        .catch(error => console.error("Error al cargar reservas:", error));
}

// Cerrar modal de gestión
cerrarModal.onclick = () => modalGestion.style.display = "none";
window.onclick = e => { if (e.target == modalGestion) modalGestion.style.display = "none"; };
