document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formReserva");

    // Extraer restaurante_id desde querystring (?restaurante=1)
    const params = new URLSearchParams(window.location.search);
    const restauranteId = params.get("restaurante");

    console.log("ID del restaurante:", restauranteId);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const fecha = document.getElementById("fecha").value;
        const hora = document.getElementById("hora").value;
        const personas = document.getElementById("personas").value;

        // Construir payload
        const payload = {
            nombre_cliente: nombre,
            fecha: fecha,
            hora: hora,
            cantidad_personas: personas,
            restaurante: restauranteId,
        };

        try {
            // Obtener token (si existe en localStorage)
            const token = localStorage.getItem("token");

            const response = await fetch(`/api/usuarios/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Token ${token}` } : {})
                },
                credentials: "include",  // 🔑 permite enviar cookies de sesión
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const reservaInfo = await response.json();
                console.log("Reserva creada:", reservaInfo);

                alert(
                    `✅ Reserva creada con éxito.\n` +
                    `Usuario: ${reservaInfo.usuario.username}\n` +
                    `Restaurante: ${reservaInfo.restaurante.nombre}\n` +
                    `Mesa asignada: ${reservaInfo.mesa_asignada}`
                );

                form.reset();
            } else {
                const errorData = await response.json();
                console.error("Error al crear reserva:", errorData);
                alert("❌ No se pudo crear la reserva.\n" + (errorData.error || "Revise los datos ingresados."));
            }
        } catch (err) {
            console.error("Error en la conexión:", err);
            alert("⚠️ Error de conexión con el servidor.");
        }
    });
});
