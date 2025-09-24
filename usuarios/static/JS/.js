const modal = document.getElementById("modalFoto");
const btnAbrir = document.getElementById("abrirModal");
const spanCerrar = modal.querySelector(".cerrar");
const cancelarModal = document.getElementById("cancelarModal");

const inputModal = document.getElementById('perfilInputModal');
const previewModal = document.getElementById('perfilPreviewModal');
const borrarModal = document.getElementById('borrarImagenModal');

const coloresAleatorios = ["e63946","f1faee","a8dadc","457b9d","1d3557","ffb703","fb8500"];

// Abrir modal
btnAbrir.onclick = () => modal.style.display = "block";
// Cerrar modal
spanCerrar.onclick = cancelarModal.onclick = () => modal.style.display = "none";
window.onclick = e => { if(e.target == modal) modal.style.display = "none"; }

// Preview al seleccionar archivo
inputModal.addEventListener('change', function() {
    const file = this.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = e => previewModal.src = e.target.result;
        reader.readAsDataURL(file);
    }
});

// Borrar imagen -> asignar mismo color que principal_publi
borrarModal.addEventListener('click', function() {
    inputModal.value = '';
    previewModal.src = 'https://ui-avatars.com/api/?name={{ user.username|urlencode }}&background={{ user.avatar_color }}&color=FFFFFF&size=140';
});


// Guardar cambios: se asigna al input real del formulario principal y cierra modal
document.getElementById('guardarModal').addEventListener('click', function() {
    const inputPrincipal = document.getElementById('perfilInput');
    const previewPrincipal = document.getElementById('perfilPreview');
    const borrarInput = document.getElementById('borrarImagenInput');

    if(inputModal.files[0]){
        inputPrincipal.files = inputModal.files;
        borrarInput.value = '0';
    } else if(previewModal.src.includes('ui-avatars.com')) {
        inputPrincipal.value = '';
        borrarInput.value = '1';
    }
    previewPrincipal.src = previewModal.src;
    modal.style.display = "none";
});