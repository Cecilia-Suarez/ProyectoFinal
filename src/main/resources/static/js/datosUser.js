window.addEventListener('load', function () {
    const nombreUser = document.getElementById("nombreUser")
    const apellidoUser = document.getElementById("apellidoUser")
    const emailUser = document.getElementById("emailUser")
    const avatar = document.getElementById("avatar")

    const url = 'http://localhost:8080/user/detail';
    const settings = {
        method: 'GET'
    }

    fetch(url, settings)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data && typeof data === 'object' && !Array.isArray(data)) {
                if ('nombre' in data && 'apellido' in data) {
                    let avatarText = data.nombre.charAt(0) + data.apellido.charAt(0);
                    avatar.textContent = avatarText;
                    nombreCompletoUser.textContent = data.nombre + " " + data.apellido;
                }
            }
            nombreUser.textContent = data.nombre;
            apellidoUser.textContent = data.apellido;
            emailUser.textContent = data.email;
        })
})





































