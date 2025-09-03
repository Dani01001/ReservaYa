document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("formReserva");

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        // ⚡ Coloque aquí el token real generado por Django
        const token = "27a8d52edd23a834b68bea156801e7b37fdf6bdb";

        // Recolectar los datos del formulario
        const data = {
            nombre_cliente: document.getElementById("nombre").value,
            fecha: document.getElementById("fecha").value,
            hora: document.getElementById("hora").value,
            cantidad_personas: document.getElementById("personas").value
        };

        try {
            // Hacer la petición al backend
<<<<<<< HEAD
            const response = await fetch("http://10.149.105.102:8000/api/reservas/crear/", {
=======
            const response = await fetch("http://192.168.170.35:8000/api/reservas/crear/", {
>>>>>>> d33d47a5ee5a9c86824c811abaa5a2129376f093
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
