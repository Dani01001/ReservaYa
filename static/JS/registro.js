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
        fetch(`/api/usuarios/registro/`, {
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

                if (errorMsg.includes("Usuario")) {
                    document.getElementById("username-error").innerText = errorMsg;
                } else if (errorMsg.includes("Email")) {
                    document.getElementById("email-error").innerText = errorMsg;
                } else if (errorMsg.includes("contraseña") || errorMsg.includes("Contraseña")) {
                    document.getElementById("password-error").innerText = errorMsg;
                    document.getElementById("password2-error").innerText = errorMsg;
                } else {
                    mensaje.innerText = "Error: " + errorMsg;
                    mensaje.style.color = "red";
                }
            } else {
                // ✅ Guardar datos en localStorage (login automático)
                if (respuesta.token) {
                    localStorage.setItem("token", respuesta.token);
                }
                if (respuesta.username) {
                    localStorage.setItem("username", respuesta.username);
                }

                mensaje.innerText = respuesta.message;
                mensaje.style.color = "green";
                form.reset();

                // Redirigir después de registrarse
                if (window.opener) {
                    window.opener.location.reload();
                    window.close();
                } else {
                    window.location.href = "principal_publi.html";
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
