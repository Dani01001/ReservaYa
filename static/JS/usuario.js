document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Debes iniciar sesión.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://192.168.100.17:8000/api/reservas/", {
            headers: {
                "Authorization": "Token " + token
            }
        });
        const reservas = await response.json();

        const contenedor = document.getElementById("mis-reservas");
        reservas.forEach(reserva => {
            const item = document.createElement("div");
            item.innerHTML = `
                <p><b>Fecha:</b> ${reserva.fecha} - <b>Hora:</b> ${reserva.hora}</p>
                <p><b>Personas:</b> ${reserva.cantidad_personas}</p>
                <button onclick="editarReserva(${reserva.id})">Editar</button>
                <button onclick="eliminarReserva(${reserva.id})">Eliminar</button>
            `;
            contenedor.appendChild(item);
        });
    } catch (error) {
        console.error("Error cargando reservas:", error);
    }
});

async function eliminarReserva(id) {
    const token = localStorage.getItem("token");
    if (!confirm("¿Seguro que deseas eliminar esta reserva?")) return;

    await fetch(`http://192.168.100.17:8000/api/reservas/${id}/`, {
        method: "DELETE",
        headers: { "Authorization": "Token " + token }
    });
    location.reload();
}

function editarReserva(id) {
    window.location.href = `editar_reserva.html?id=${id}`;
}
