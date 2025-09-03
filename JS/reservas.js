document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("formReserva");
    const params = new URLSearchParams(window.location.search);
    const restauranteId = params.get("restaurante");
    console.log("ID del restaurante:", restauranteId);

    if (!restauranteId) {
        alert("❌ No se pudo determinar el restaurante. Intente nuevamente.");
        return;
    }

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        // ⚡ Coloque aquí el token real generado por Django(pendiente obtener el token)
        const token = "27a8d52edd23a834b68bea156801e7b37fdf6bdb";

        // Recolectar los datos del formulario
        const data = {
            nombre_cliente: document.getElementById("nombre").value,
            fecha: document.getElementById("fecha").value,
            hora: document.getElementById("hora").value,
            cantidad_personas: document.getElementById("personas").value,
            restaurante: restauranteId  // ← Esto es lo que faltaba
        };

        try {
            // Hacer la petición al backend
<<<<<<< HEAD
            const response = await fetch("http://10.149.105.102:8000/api/reservas/crear/", {
=======
            const response = await fetch("http://192.168.170.35:8000/api/reservas/crear/", {
>>>>>>> 05e4341667d64b336494eab0925a0124583bfa34
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + token
                },
                body: JSON.stringify(data)
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
