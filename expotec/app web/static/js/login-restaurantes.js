const form = document.getElementById("login-form");
const errorMessage = document.getElementById("errorMsg");

form.addEventListener("submit", function(e) {
    e.preventDefault();
    
    let usuario = document.getElementById("username").value;
    let contraseña = document.getElementById("password").value;

     if(usuario === "admin" && contraseña === "1234") {
        alert("Login exitoso");
    } else {
        errorMessage.textContent = "Usuario o contraseña incorrectos";
    }
});