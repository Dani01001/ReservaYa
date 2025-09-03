document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("formLogin");
    const mensaje = document.getElementById("mensaje");

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const data = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        };

        fetch("http://10.149.105.102:8000/api/usuarios/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"  // para que se guarde la sesión
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
