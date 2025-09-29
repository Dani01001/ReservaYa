document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formLogin");
    const mensaje = document.getElementById("mensaje");

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

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const data = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        };

        const csrftoken = getCookie('csrftoken');
        const url = "/api/usuarios/login/"; // usa relativa si el template es servido por Django

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken
                },
                body: JSON.stringify(data),
                credentials: "include"
            });

            console.log("LOGIN response status:", res.status, "content-type:", res.headers.get("content-type"));

            const ctype = (res.headers.get("content-type") || "").toLowerCase();
            let payload = null;
            if (ctype.includes("application/json")) {
                payload = await res.json();
            } else {
                // respuesta NO JSON: mostramos el texto (usualmente una página HTML de error)
                const text = await res.text();
                console.warn("Respuesta no-JSON del servidor:", text);
                mensaje.innerText = "Error: respuesta inesperada del servidor (revisa la consola / pestaña Network).";
                mensaje.style.color = "red";
                return;
            }

            if (!res.ok) {
                // mostrar error recibido del backend (si viene en payload.error o payload.message)
                const errMsg = payload.error || payload.message || JSON.stringify(payload);
                mensaje.innerText = "Error: " + errMsg;
                mensaje.style.color = "red";
                console.error("LOGIN error payload:", payload);
                return;
            }

            // LOGIN OK
            mensaje.innerText = payload.message || "Inicio de sesión exitoso";
            mensaje.style.color = "green";
            form.reset();

            if (payload.token) localStorage.setItem("token", payload.token);
            if (payload.username) localStorage.setItem("username", payload.username);

            // Intentar cerrar el popup y refrescar/opener de forma segura:
            if (window.opener) {
                // 1) Intento directo (funciona si misma-origin)
                try {
                    window.opener.location.reload();
                    // cerramos la ventana después de refrescar
                    window.close();
                    return;
                } catch (err) {
                    console.warn("No se pudo acceder a opener.location.reload() (cross-origin). Intentando postMessage...", err);
                    // 2) Fallback: enviar mensaje al opener (postMessage) para que refresque/redirija
                    try {
                        window.opener.postMessage({
                            type: "login-success",
                            redirect: payload.redirect || null,
                            admin: payload.admin || null
                        }, "*"); // puedes cambiar '*' por origen específico si lo conoces
                    } catch (err2) {
                        console.warn("postMessage falló:", err2);
                    }
                    // cerramos igualmente el popup
                    window.close();
                    return;
                }
            } else {
                // No hay opener (no es popup): respetar redirect si viene
                if (payload.redirect) {
                    window.location.href = payload.redirect;
                } else {
                    window.location.href = "principal_publi.html";
                }
            }

        } catch (error) {
            console.error("Fetch error en login:", error);
            mensaje.innerText = "Error de conexión (ver consola).";
            mensaje.style.color = "red";
        }
    });
});