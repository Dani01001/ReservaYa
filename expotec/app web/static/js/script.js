function abrirVentanaEmergente(url) {
    const ancho = 700; // Ancho de la ventana
    const alto = 550;  // Alto de la ventana

    // Obtener dimensiones de la pantalla
    const left = (window.innerWidth - ancho) / 2;
    const top = (window.innerHeight - alto) / 2;

    // Crear la ventana emergente centrada
    window.open(url, 'VentanaEmergente', `width=${ancho},height=${alto},top=${top},left=${left}`);
}

fetch('http://120.0.0.1:8000/api/reservas/')
    .then(res => res.json())
    .then(data => {
        console.log("Datos desde la api", data);
    })
    .catch(error => {
        console.error("Error alconectar con la api", error);
    });
