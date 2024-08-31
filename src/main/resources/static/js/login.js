window.addEventListener('load', function () {
    document.getElementById("loginButton").addEventListener("click", function () {
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;

        if (email.trim() === "" || password.trim() === "") {
            alert("Por favor, ingresa un correo y contraseña.");
        } else {
            let form = document.getElementById("loginForm");
            let formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: formData
            }).then(response => {
                if (document.referrer.includes("detailProd.html") && !response.url.includes("error")) {
                    const idProducto = document.referrer.split('?')[1];
                    window.location.href = "reservas.html?" + idProducto;
                } else if (!response.url.includes("error")) {
                    window.location.href = "index.html";
                } else {
                    document.getElementById('error').innerText = 'Correo o contraseña inválido. Intenta nuevamente.';
                }
            })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Hubo un error al intentar iniciar sesión. Por favor, intenta nuevamente.');
                });
        }
    });

    //Función para que aparezca el mensaje de que es obligatorio loguearse antes de realizar la reserva
    if (document.referrer.includes("detailProd.html")) {
        document.getElementById("logueoObligatorioReserva").style.display = "block";
    }
});
