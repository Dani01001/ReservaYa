document.addEventListener("DOMContentLoaded", () => {
    const reservasContainer = document.querySelector("#reservas .section-content");

    // Obtener cookie CSRF
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");
            for (let cookie of cookies) {
                cookie = cookie.trim();
                if (cookie.startsWith(name + "=")) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie("csrftoken");

    // Función para cargar reservas
    async function cargarReservas() {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/usuario/mis_reservas/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Token ${token}` } : {}),
                },
                credentials: "include"
            });

            if (!response.ok) throw new Error("Error al cargar reservas");

            const reservas = await response.json();
            renderReservas(reservas);

        } catch (err) {
            console.error(err);
            reservasContainer.innerHTML = `<p>Error cargando reservas.</p>`;
        }
    }

    // Función para renderizar reservas
    function renderReservas(reservas) {
        if (reservas.length === 0) {
            reservasContainer.innerHTML = `<p>No tienes reservas activas.</p>`;
            return;
        }

        reservasContainer.innerHTML = "";
        reservas.forEach(r => {
            const div = document.createElement("div");
            div.classList.add("reserva-item");
            div.innerHTML = `
                <p><strong>Restaurante:</strong> ${r.restaurante.nombre}</p>
                <p><strong>Mesa:</strong> ${r.mesa_asignada}</p>
                <p><strong>Fecha:</strong> ${r.fecha}</p>
                <p><strong>Hora:</strong> ${r.hora}</p>
                <p><strong>Personas:</strong> ${r.cantidad_personas}</p>
                <button class="btn-editar" data-id="${r.id}">Editar</button>
                <button class="btn-cancelar" data-id="${r.id}">Cancelar</button>
                <hr>
            `;
            reservasContainer.appendChild(div);
        });

        // Agregar eventos
        document.querySelectorAll(".btn-cancelar").forEach(btn => {
            btn.addEventListener("click", cancelarReserva);
        });

        document.querySelectorAll(".btn-editar").forEach(btn => {
            btn.addEventListener("click", editarReserva);
        });
    }

    // Función para cancelar reserva
    async function cancelarReserva(e) {
        const reservaId = e.target.dataset.id;
        if (!confirm("¿Seguro que deseas cancelar esta reserva?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`/api/reservas/${reservaId}/`, {
                method: "DELETE",
                headers: {
                    "X-CSRFToken": csrftoken,
                    ...(token ? { "Authorization": `Token ${token}` } : {}),
                },
                credentials: "include"
            });

            if (!response.ok) throw new Error("Error al cancelar reserva");

            alert("Reserva cancelada correctamente.");
            cargarReservas(); // refrescar lista

        } catch (err) {
            console.error(err);
            alert("No se pudo cancelar la reserva.");
        }
    }

    // Función para editar reserva
    function editarReserva(e) {
        const reservaId = e.target.dataset.id;
        const div = e.target.closest(".reserva-item");

        // Crear inputs para editar
        div.innerHTML += `
            <div class="editar-form">
                <label>Fecha: <input type="date" id="editFecha" value="${div.querySelector("p:nth-child(3)").textContent.split(": ")[1]}"></label>
                <label>Hora: <input type="time" id="editHora" value="${div.querySelector("p:nth-child(4)").textContent.split(": ")[1]}"></label>
                <label>Personas: <input type="number" id="editPersonas" min="1" max="20" value="${div.querySelector("p:nth-child(5)").textContent.split(": ")[1]}"></label>
                <button class="btn-guardar">Guardar</button>
                <button class="btn-cancelar-edicion">Cancelar</button>
            </div>
        `;

        div.querySelector(".btn-guardar").addEventListener("click", async () => {
            const nuevaFecha = div.querySelector("#editFecha").value;
            const nuevaHora = div.querySelector("#editHora").value;
            const nuevasPersonas = div.querySelector("#editPersonas").value;

            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`/api/reservas/${reservaId}/`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrftoken,
                        ...(token ? { "Authorization": `Token ${token}` } : {}),
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        fecha: nuevaFecha,
                        hora: nuevaHora,
                        cantidad_personas: nuevasPersonas
                    })
                });

                if (!response.ok) throw new Error("Error al actualizar reserva");
                alert("Reserva actualizada correctamente.");
                cargarReservas();

            } catch (err) {
                console.error(err);
                alert("No se pudo actualizar la reserva.");
            }
        });

        div.querySelector(".btn-cancelar-edicion").addEventListener("click", () => {
            cargarReservas(); // recarga para quitar inputs
        });
    }

    // Cargar reservas al inicio
    cargarReservas();
});
