const addFileBtn = document.getElementById('addFileBtn');
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('file-name');

    addFileBtn.addEventListener('click', () => {
      fileInput.click(); // Abre el selector de archivos
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = `Archivo seleccionado: ${fileInput.files[0].name}`;
      } else {
        fileNameDisplay.textContent = 'Ningún archivo seleccionado';
      }
    });