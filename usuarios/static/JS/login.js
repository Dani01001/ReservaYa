document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formLogin");
    const mensaje = document.getElementById("mensaje");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const data = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        };

        fetch(`/api/usuarios/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        })
        .then(res => res.json())
        .then(respuesta => {
            if (respuesta.error) {
                mensaje.innerText = "Error: " + respuesta.error;
                mensaje.style.color = "red";
            } else {
                mensaje.innerText = respuesta.message;
                mensaje.style.color = "green";
                form.reset();

                // ⚡ Guardar datos en localStorage
                if (respuesta.token) {
                    localStorage.setItem("token", respuesta.token);
                }
                if (respuesta.username) {
                    localStorage.setItem("username", respuesta.username);
                }

                // 🔥 NUEVO: si el backend manda un redirect, respetarlo
                if (respuesta.redirect) {
                    window.location.href = respuesta.redirect;
                    return; // cortamos aquí para no ejecutar el resto
                }

                // Cerrar ventana emergente y actualizar página principal
                if (window.opener) {
                    window.opener.location.reload();
                    window.close();
                } else {
                    window.location.href = "principal_publi.html"; // se mantiene tu redirección por defecto
                }
            }
        })
        .catch(error => {
            mensaje.innerText = "Error de conexión";
            mensaje.style.color = "red";
            console.error(error);
        });
    }); // 👈 cierre del addEventListener del form
}); // 👈 cierre del DOMContentLoaded
