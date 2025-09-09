const form = document.getElementById("login-form");
const errorMessage = document.getElementById("errorMsg");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const usuarioInput = document.getElementById("username").value.trim();
    const contraseñaInput = document.getElementById("password").value.trim();

    // Validar que no estén vacíos
    if (!usuarioInput || !contraseñaInput) {
        errorMessage.textContent = "Por favor ingresa usuario y contraseña";
        return;
    }

    // Enviar datos al backend mediante POST (formato x-www-form-urlencoded)
    const data = `login=${encodeURIComponent(usuarioInput)}&password=${encodeURIComponent(contraseñaInput)}`;

    fetch("http://localhost:8000/accounts/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: data,
        credentials: "include" // Importante para manejo de sesión
    })
    .then(response => {
        if (response.redirected) {
            // Login exitoso, redirigir
            window.location.href = response.url;
        } else {
            return response.text();
        }
    })
    .then(text => {
        if (text) {
            if (text.includes("Por favor introduzca un nombre de usuario y una contraseña correctos") ||
                text.includes("Please enter a correct username and password")) {
                errorMessage.textContent = "Usuario o contraseña incorrectos";
            } else {
                errorMessage.textContent = "Error al iniciar sesión";
            }
        }
    })
    .catch(error => {
        console.error("Error al conectar con el backend:", error);
        errorMessage.textContent = "No se pudo verificar sus datos";
    });
});
