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

    // Enviar datos al backend mediante POST
    fetch("/api/login", { // Cambia a tu endpoint real de login
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario: usuarioInput,
            contraseña: contraseñaInput
        })
    })
    .then(response => response.json())
    .then(data => {
    if (data.exito) {
        // Login exitoso
        errorMessage.textContent = "";
        // Redirigir a la página que desees
        window.location.href = "..\templates\html\principal_priv.html"; 
    } else {
        errorMessage.textContent = "Usuario o contraseña incorrectos";
    }
})
    .catch(error => {
        console.error("Error al conectar con la base de datos:", error);
        errorMessage.textContent = "No se pudo verificar sus datos";
    });
});
