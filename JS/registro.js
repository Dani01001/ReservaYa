document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("formRegistro");
    const mensaje = document.getElementById("mensaje");

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const data = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
            password2: document.getElementById("password2").value,
            email: document.getElementById("email").value,
            telefono: document.getElementById("telefono").value,
        };

<<<<<<< HEAD
        fetch("http://10.149.105.102:8000/api/usuarios/registro/", {
=======
        fetch("http://192.168.170.35:8000/api/usuarios/registro/", {
>>>>>>> d33d47a5ee5a9c86824c811abaa5a2129376f093
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(respuesta => {
            // Limpiar errores anteriores
            document.querySelectorAll(".error").forEach(el => el.innerText = "");
            mensaje.innerText = "";
        
            if (respuesta.error) {
                let errorMsg = respuesta.error;
            
                // Colocar mensajes en el lugar correcto
                if (errorMsg.includes("Usuario")) {
                    document.getElementById("username-error").innerText = errorMsg;
                } else if (errorMsg.includes("Email")) {
                    document.getElementById("email-error").innerText = errorMsg;
                } else if (errorMsg.includes("contraseña") || errorMsg.includes("Contraseña")) {
                    document.getElementById("password-error").innerText = errorMsg;
                    document.getElementById("password2-error").innerText = errorMsg;
                } else {
                    mensaje.innerText = "Error: " + errorMsg; // fallback
                    mensaje.style.color = "red";
                }
            
            } else {
                mensaje.innerText = respuesta.message;
                mensaje.style.color = "green";
                form.reset();
                // Cerrar ventana emergente y actualizar página principal
                if (window.opener) {  // verifica si se abrió como popup
                    window.opener.location.reload(); // recarga la página principal para reflejar login
                    window.close(); // cierra esta ventana emergente
                } else {
                    window.location.href = "index.html"; // fallback si no es popup
                }
            }
        })

        .catch(error => {
            mensaje.innerText = "Error de conexión";
            mensaje.style.color = "red";
            console.error(error);
        });
    });
});