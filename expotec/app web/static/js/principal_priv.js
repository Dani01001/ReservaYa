 // Modal Gestión de Reservas
    const modalGestion = document.getElementById("modalGestion");
    const abrirGestion = document.getElementById("abrirModalGestion");
    const cerrarGestion = document.getElementById("cerrarModalGestion");

    abrirGestion.onclick = () => modalGestion.style.display = "flex";
    cerrarGestion.onclick = () => modalGestion.style.display = "none";
    window.onclick = e => { 
      if(e.target === modalGestion) modalGestion.style.display = "none"; 
      if (e.target ===modalVer) modalVer.style.display = "none";
    }
    
    const modalVer = document.getElementById("modalVer");

    // datos simulados de clientes
    const clientes = {
      "Juan Pérez": { telefono: "123-456-7890", email: "juan@gmail.com", 

    }}

    function verDetalles(nombre) {
      alert("Mostrar detalles de " + nombre);
    }

    function eliminarReserva(btn) {
      if(confirm("¿Eliminar esta reserva?")) {
        btn.parentElement.parentElement.remove();
      }
    }
