document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formLogin");
    const mensaje = document.getElementById("mensaje");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const data = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        };
        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';'); 
                for (let cookie of cookies) {
                    cookie = cookie.trim();
                    if (cookie.startsWith(name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
        const csrftoken = getCookie('csrftoken');

        fetch(`/api/usuarios/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken
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

                // 🔥 Si el backend manda un redirect, respetarlo
                if (respuesta.redirect) {
                    window.location.href = respuesta.redirect;
                    return;
                }

                // ✅ NUEVO: cerrar modal en lugar de redirigir
                const modal = document.getElementById("loginModal");
                if (modal) {
                    modal.style.display = "none"; // Oculta el modal
                    location.reload(); // Recarga la página para mostrar el estado logueado
                } else {
                    // fallback si no hay modal (comportamiento anterior)
                    window.location.href = "principal_publi.html";
                }
            }
        })
        .catch(error => {
            mensaje.innerText = "Error de conexión";
            mensaje.style.color = "red";
            console.error(error);
        });
    }); // cierre del addEventListener del form
}); // cierre del DOMContentLoaded
