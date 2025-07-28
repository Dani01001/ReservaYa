function abrirVentanaEmergente(url) {
    const ancho = 800; // Ancho de la ventana
    const alto = 900;  // Alto de la ventana

    // Obtener dimensiones de la pantalla
    const left = (window.innerWidth - ancho) / 2;
    const top = (window.innerHeight - alto) / 2;

    // Crear la ventana emergente centrada
    window.open(url, 'VentanaEmergente', `width=${ancho},height=${alto},top=${top},left=${left}`);
}

fetch('http://120.0.0.1:8000/api/reservas/')
    .then(res => res.json())
    .then(data => console.log(data))
