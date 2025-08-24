const form = document.getElementById("formRegistro");

form.addEventListener("submit", function(e) {
    e.preventDefault(); // evita que el formulario recargue la página

    const formData = new FormData(form);
    const data = {
        username: formData.get("username"),
        password: formData.get("password"),
        email: formData.get("email"),
        telefono: formData.get("telefono"),
        direccion: formData.get("direccion")
    };

    fetch("http://192.168.100.250:8000/api/usuarios/registrar/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(respuesta => {
        if (respuesta.message) {
            alert("Usuario registrado con éxito");
        } else if (respuesta.error) {
            alert("Error: " + respuesta.error);
        }
    })
    .catch(error => console.error("Error:", error));
});