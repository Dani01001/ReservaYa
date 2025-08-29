// --- Modal de Ver Detalles ---
function verDetalles(idReserva) {
    fetch(`/api/reservas/${idReserva}`)
        .then(response => response.json())
        .then(reserva => {
            document.getElementById("verNombre").textContent = reserva.cliente;
            document.getElementById("verEmail").textContent = reserva.email || 'N/A';
            document.getElementById("verTelefono").textContent = reserva.telefono || 'N/A';
            document.getElementById("verHora").textContent = reserva.hora;
            document.getElementById("modalVer").style.display = "block";
        })
        .catch(error => console.error("Error al obtener detalles:", error));
}

// Botón Iniciar Sesión - abrir ventana emergente centrada
document.getElementById("btnLogin").addEventListener("click", (e) => {
    e.preventDefault(); // evita que el link navegue

    const url = '../html/login_restaurantes.html'; // ruta de tu formulario de login
    const ancho = 600;
    const alto = 600;

    // calcular posición centrada
    const left = (window.innerWidth - ancho) / 2;
    const top = (window.innerHeight - alto) / 2;

    window.open(
        url,
        'LoginRestaurante',
        `width=${ancho},height=${alto},top=${top},left=${left}`
    );
});


function cerrarModalVer() {
    document.getElementById("modalVer").style.display = "none";
}

// Cerrar modal si se hace clic fuera del contenido
window.addEventListener("click", function(e) {
    const modalVer = document.getElementById("modalVer");
    if (e.target == modalVer) {
        cerrarModalVer();
    }
});

// --- Modal de Gestión de Reservas ---
const modalGestion = document.getElementById("modalGestion");
const tablaReservas = document.getElementById("tablaReservas");
const cerrarModal = document.getElementById("cerrarModalGestion");

function abrirModalGestion() {
    modalGestion.style.display = "block";

    // Limpiar la tabla (solo encabezado)
    tablaReservas.innerHTML = `
        <tr>
            <th>Cliente</th>
            <th>Hora</th>
            <th>Acciones</th>
        </tr>
    `;

    // Traer las reservas desde la base de datos
    fetch("/api/reservas") // Cambia a tu endpoint real si es diferente
        .then(response => response.json())
        .then(reservas => {
            if (reservas.length === 0) {
                const fila = document.createElement("tr");
                fila.innerHTML = `<td colspan="3" style="text-align:center;">No hay reservas hoy</td>`;
                tablaReservas.appendChild(fila);
            } else {
                reservas.forEach(reserva => {
                    const fila = document.createElement("tr");

                    fila.innerHTML = `
                        <td>${reserva.cliente}</td>
                        <td>${reserva.hora}</td>
                        <td>
                            <button class="btn-small" onclick="verDetalles(${reserva.id})">Ver</button>
                            <button class="btn-small" onclick="eliminarReserva(this)">Eliminar</button>
                        </td>
                    `;

                    tablaReservas.appendChild(fila);
                });
            }
        })
        .catch(error => console.error("Error al cargar reservas:", error));
}

// Cerrar modal de gestión
cerrarModal.onclick = () => modalGestion.style.display = "none";
window.onclick = e => { 
    if (e.target == modalGestion) modalGestion.style.display = "none"; 
};

// --- Función para eliminar reserva (opcional) ---
function eliminarReserva(btn) {
    const fila = btn.closest("tr");
    const nombreCliente = fila.querySelector("td").textContent;
    if (confirm(`¿Deseas eliminar la reserva de ${nombreCliente}?`)) {
        // Aquí puedes agregar fetch DELETE si tu API lo permite
        fila.remove();
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const btnGestionar = document.getElementById("abrirModalGestion");
    if (btnGestionar) {
        btnGestionar.addEventListener("click", abrirModalGestion);
    }
});

// ---- Código de Sucursales  ----
document.addEventListener('DOMContentLoaded', () => {
  const SUCURSAL_API_URL = '/api/sucursales'; // <- ajustá si es otra ruta

  const btnAgregarSucursal = document.getElementById('btnAgregarSucursal');
  const modalSucursal = document.getElementById('modalSucursal');
  const cerrarModalSucursal = document.getElementById('cerrarModalSucursal');
  const formSucursal = document.getElementById('formSucursal');
  const btnCancelarSucursal = document.getElementById('cancelarSucursal');
  const btnGeocode = document.getElementById('btnGeocode');
  const geoStatus = document.getElementById('geoStatus');
  const mapContainer = document.getElementById('mapSucursal');

  let mapInstance = null;
  let marker = null;

  // abrir modal
  btnAgregarSucursal?.addEventListener('click', () => {
    formSucursal?.reset();
    document.getElementById('sucursalLat').value = '';
    document.getElementById('sucursalLng').value = '';
    if (geoStatus) { geoStatus.textContent = ''; geoStatus.style.color = '#666'; }
    if (mapContainer) mapContainer.style.display = 'none';
    if (modalSucursal) modalSucursal.style.display = 'block';
  });

  // cerrar modal con X
  cerrarModalSucursal?.addEventListener('click', () => {
    if (modalSucursal) modalSucursal.style.display = 'none';
  });

  // cancelar
  btnCancelarSucursal?.addEventListener('click', () => {
    if (modalSucursal) modalSucursal.style.display = 'none';
  });

  // cerrar al click fuera
  window.addEventListener('click', (e) => {
    if (e.target === modalSucursal) modalSucursal.style.display = 'none';
  });

  // geocoding con Nominatim
  btnGeocode?.addEventListener('click', async () => {
    const direccionEl = document.getElementById('sucursalDireccion');
    if (!direccionEl) return;
    const direccion = direccionEl.value.trim();
    if (!direccion) {
      if (geoStatus) { geoStatus.style.color = 'red'; geoStatus.textContent = 'Ingrese una dirección antes de buscar.'; }
      return;
    }

    if (geoStatus) { geoStatus.style.color = '#666'; geoStatus.textContent = 'Buscando...'; }

    try {
      const query = encodeURIComponent(direccion);
      const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&addressdetails=0`;
      const res = await fetch(url, { headers: { 'Accept-Language': 'es' } });
      const results = await res.json();

      if (!results || results.length === 0) {
        if (geoStatus) { geoStatus.style.color = 'red'; geoStatus.textContent = 'No se encontró la dirección.'; }
        return;
      }

      const place = results[0];
      const lat = place.lat;
      const lng = place.lon;

      const latInput = document.getElementById('sucursalLat');
      const lngInput = document.getElementById('sucursalLng');
      if (latInput) latInput.value = lat;
      if (lngInput) lngInput.value = lng;

      if (geoStatus) { geoStatus.style.color = 'green'; geoStatus.textContent = `Encontrado: lat ${lat}, lng ${lng}`; }

      if (typeof L !== 'undefined' && mapContainer) {
        showMapAndMarker(lat, lng);
      } else if (mapContainer) {
        mapContainer.style.display = 'none';
      }
    } catch (err) {
      console.error('Error geocoding:', err);
      if (geoStatus) { geoStatus.style.color = 'red'; geoStatus.textContent = 'Error al buscar la dirección.'; }
    }
  });

  // submit: POST a la API
  formSucursal?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('sucursalNombre')?.value.trim() || '';
    const direccion = document.getElementById('sucursalDireccion')?.value.trim() || '';
    const telefono = document.getElementById('sucursalTelefono')?.value.trim() || '';
    const lat = document.getElementById('sucursalLat')?.value.trim() || '';
    const lng = document.getElementById('sucursalLng')?.value.trim() || '';

    if (!nombre || !direccion) {
      alert('Nombre y dirección son obligatorios.');
      return;
    }

    const payload = { nombre, direccion, telefono: telefono || null, lat: lat || null, lng: lng || null };

    try {
      const res = await fetch(SUCURSAL_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status}: ${text}`);
      }

      const nuevaSucursal = await res.json();
      // actualizar UI aquí si querés (ej: renderizar lista)
      alert('Sucursal guardada correctamente.');
      if (modalSucursal) modalSucursal.style.display = 'none';
    } catch (err) {
      console.error('Error guardando sucursal:', err);
      alert('No se pudo guardar la sucursal. Revisa la consola.');
    }
  });

  // función opcional para mostrar mapa con Leaflet
  function showMapAndMarker(lat, lng) {
    if (!mapContainer) return;
    mapContainer.style.display = 'block';

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (!mapInstance) {
      mapInstance = L.map('mapSucursal', { attributionControl: false }).setView([latNum, lngNum], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapInstance);
      marker = L.marker([latNum, lngNum], { draggable: true }).addTo(mapInstance);
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        const latInput = document.getElementById('sucursalLat');
        const lngInput = document.getElementById('sucursalLng');
        if (latInput) latInput.value = pos.lat;
        if (lngInput) lngInput.value = pos.lng;
        if (geoStatus) { geoStatus.style.color = '#666'; geoStatus.textContent = `Marker movido: lat ${pos.lat.toFixed(6)}, lng ${pos.lng.toFixed(6)}`; }
      });
    } else {
      mapInstance.setView([latNum, lngNum], 15);
      marker.setLatLng([latNum, lngNum]);
    }
  }
});
// ---- fin Sucursales ----

document.getElementById("adminProfile").addEventListener("click", function() {
    // Redirige al panel de administración
    window.location.href = "panel_admin.html";
});