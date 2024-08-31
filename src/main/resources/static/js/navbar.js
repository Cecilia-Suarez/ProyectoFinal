function navigateToURL() {
    let selectedValue = navbarUser.value || navbarUserResponsive.value || navbarUserResponsiveNoLogged.value;
    if (selectedValue) {
        window.location.href = selectedValue;
    }
}

window.addEventListener('load', function () {
    const nombreYCierreDeSesion = document.getElementById("nombreYCierreDeSesion");
    const contentLoginAndRegister = document.getElementById("contentLoginAndRegister");
    const adminPanel = document.getElementById("adminPanel");
    const adminPanelResponsive = document.getElementById("adminPanelResponsive");
    const avatar = document.getElementById("user-avatar");
    const nombreCompletoUser = document.getElementById("nombreCompletoUser");
    const navbarUser = document.getElementById("navbarUser");
    const navbarUserResponsive = document.getElementById("navbarUserResponsive");
    const menuIcon = document.getElementById("menuIcon");
    const navbarUserResponsiveNoLogged = document.getElementById("navbarUserResponsiveNoLogged");

    const url = 'http://localhost:8080/user/authenticated';
    const settings = {
        method: 'GET'
    };

    // Variable global para indicar si el usuario está autenticado
    window.isUserLoggedIn = false;

    fetch(url, settings)
        .then(response => response.text())
        .then(data => {
            // Manejar diferentes roles
            if (data === 'ROLE_ADMIN') {
                window.isUserLoggedIn = true;
                avatar.style.display = "block";
                nombreYCierreDeSesion.style.display = "block";
                navbarUser.style.display = "block";
                adminPanel.style.display = "block";
                adminPanelResponsive.style.display = "block";
                contentLoginAndRegister.style.display = "none";
                navbarUserResponsive.style.display = "block";
                navbarUserResponsiveNoLogged.style.display = "none";
            } else if (data === 'ROLE_USER') {
                window.isUserLoggedIn = true;
                avatar.style.display = "block";
                nombreYCierreDeSesion.style.display = "block";
                navbarUser.style.display = "block";
                adminPanel.style.display = "none";
                adminPanelResponsive.style.display = "none";
                contentLoginAndRegister.style.display = "none";
                navbarUserResponsive.style.display = "block";
                navbarUserResponsiveNoLogged.style.display = "none";
            } else {
                window.isUserLoggedIn = false;
                userLogin.style.display = "none";
                navbarUserResponsive.style.display = "none";
                adminPanel.style.display = "none";
                adminPanelResponsive.style.display = "none";
                contentLoginAndRegister.style.display = "block";
                navbarUserResponsiveNoLogged.style.display = "block";
            }
        });

    const urlDetails = 'http://localhost:8080/user/detail';
    const settingsDetails = {
        method: 'GET'
    };

    fetch(urlDetails, settingsDetails)
        .then(response => {
            // Comprobar si la respuesta es JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return response.json();
            }
        })
        .then(data => {
            if (data && typeof data === 'object' && !Array.isArray(data)) {
                if ('nombre' in data && 'apellido' in data) {
                    let avatarText = data.nombre.charAt(0) + data.apellido.charAt(0);
                    avatar.textContent = avatarText;
                    nombreCompletoUser.textContent = data.nombre + " " + data.apellido;
                }
            }
        });
});
