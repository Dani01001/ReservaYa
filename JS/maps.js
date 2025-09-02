let map;
let service;
let selectedPlace = null;

// Inicializar mapa
function initMap() {
    const center = { lat: -25.2637, lng: -57.5759 }; // Coordenadas de Paraguay
    map = new google.maps.Map(document.getElementById("map"), {
        center: center,
        zoom: 13,
    });

    const input = document.getElementById("place-input");
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
            alert("No se encontró la ubicación");
            return;
        }
        selectedPlace = place;
        map.panTo(place.geometry.location);
        map.setZoom(15);

        new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name
        });
    });
}

// Agregar sucursal
document.getElementById("add-branch").addEventListener("click", () => {
    if (!selectedPlace) {
        alert("Selecciona un restaurante primero");
        return;
    }

    const branchList = document.getElementById("branch-list");
    const li = document.createElement("li");
    li.textContent = `${selectedPlace.name} - ${selectedPlace.formatted_address || ''}`;
    branchList.appendChild(li);

    // Limpiar selección
    document.getElementById("place-input").value = "";
    selectedPlace = null;
});

window.initMap = initMap;
