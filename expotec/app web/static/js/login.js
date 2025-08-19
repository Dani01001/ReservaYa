document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault(); // evita que se recargue la página

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://127.0.0.1:8000/api/usuarios/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",  // MUY IMPORTANTE para que Django guarde la sesión
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();

  if (data.success) {
    document.getElementById("mensaje").textContent = "¡Login exitoso!";
    window.location.href = "/home.html"; // redirigir a otra página
  } else {
    document.getElementById("mensaje").textContent = data.error;
  }
});