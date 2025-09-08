document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("formReserva");

    // Obtener el ID del restaurante desde los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const restauranteId = params.get("restaurante"); // Asegúrate que la URL tenga ?restaurante=ID
    console.log("ID del restaurante:", restauranteId);

    // Función para obtener el CSRF token desde las cookies
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

    const csrftoken = getCookie("csrftoken");

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        if (!restauranteId) {
            alert("❌ No se ha especificado un restaurante.");
            return;
        }

        // Recolectar los datos del formulario
        const data = {
            nombre_cliente: document.getElementById("nombre").value,
            fecha: document.getElementById("fecha").value,
            hora: document.getElementById("hora").value,
            cantidad_personas: document.getElementById("personas").value,
            restaurante: restauranteId
        };

        try {
            const response = await fetch("http://192.168.170.96:8000/api/reservas/crear/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken
                },
                body: JSON.stringify(data),
                credentials: "include" // ⚡ importante para enviar cookies de sesión
            });

            if (response.ok) {
                const reservaInfo = await response.json();
                console.log("Reserva creada:", reservaInfo); 
                alert(`✅ Reserva creada con éxito.\nUsuario: ${reservaInfo.usuario.username}\nRestaurante: ${reservaInfo.restaurante.nombre}`);
                form.reset();
            } else {
                const errorData = await response.json();
                console.error("Error al crear reserva:", errorData);
                alert("❌ No se pudo crear la reserva.\n" + (errorData.error || "Revise los datos ingresados."));
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("⚠️ Error al conectar con el servidor.");
        }
    });
});
