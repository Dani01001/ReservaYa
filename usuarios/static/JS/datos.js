document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('formCompletarDatos');
    const mensaje = document.getElementById('mensaje');
    const botonCerrar = document.getElementById('cerrarVentana');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = {
            nombre: form.nombre.value,
            telefono: form.telefono.value,
            direccion: form.direccion.value
        };

        fetch(`/api/usuarios/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify(data)
        })
        .then(res => {
            if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
            return res.json();
        })
        .then(data => {
            if (data.status === "ok") {
                mensaje.textContent = "✅ Datos completados correctamente.";
                botonCerrar.style.display = "inline-block";
            } else if (data.status === "ya_completado") {
                mensaje.textContent = "ℹ️ Los datos ya fueron completados.";
                botonCerrar.style.display = "inline-block";
            } else {
                mensaje.textContent = "❌ Error al guardar los datos.";
            }
        })
        .catch(err => {
            console.error(err);
            mensaje.textContent = "❌ Error de conexión con el servidor.";
        });
    });

    botonCerrar.addEventListener('click', () => {
        window.close();
    });
    
});


const botonCerrar = document.getElementById('cerrarVentana');
if (botonCerrar) {
    botonCerrar.addEventListener('click', () => window.close());
}