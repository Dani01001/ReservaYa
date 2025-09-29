document.addEventListener("DOMContentLoaded", () => {
    // === Obtener cookie CSRF ===
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

    const csrfToken = getCookie("csrftoken");
    const form = document.getElementById("formReserva");
    const mensaje = document.getElementById("mensaje-reserva");

    // Extraer restaurante_id desde querystring (?restaurante=1)
    const params = new URLSearchParams(window.location.search);
    const restauranteId = params.get("restaurante");
    console.log("ID del restaurante:", restauranteId);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const fecha = document.getElementById("fecha").value;
        const hora = document.getElementById("hora").value;
        const duracion = document.getElementById("duracion").value;
        const personas = document.getElementById("personas").value;

        // Construir payload
        const payload = {
            nombre_cliente: nombre,
            fecha: fecha,
            hora: hora,
            duracion_horas: parseInt(duracion),
            cantidad_personas: parseInt(personas),
            restaurante: restauranteId,
        };

        try {
            // Obtener token (si existe en localStorage)
            const token = localStorage.getItem("token");

            const response = await fetch(`/api/reservas/crear_reserva/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                    ...(token ? { "Authorization": `Token ${token}` } : {}),
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const reservaInfo = await response.json();
                console.log("Reserva creada:", reservaInfo);

                mensaje.innerText = `✅ Reserva creada con éxito. Mesa asignada: ${reservaInfo.mesa_asignada}`;
                mensaje.style.color = "green";
                form.reset();
            } else {
                const errorData = await response.json();
                console.error("Error al crear reserva:", errorData);
                mensaje.innerText = "❌ No se pudo crear la reserva: " + (errorData.error || "Revise los datos.");
                mensaje.style.color = "red";
            }
        } catch (err) {
            console.error("Error en la conexión:", err);
            mensaje.innerText = "⚠️ Error de conexión con el servidor.";
            mensaje.style.color = "red";
        }
    });
});
