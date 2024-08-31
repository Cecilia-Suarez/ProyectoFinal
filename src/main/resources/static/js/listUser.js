window.addEventListener('load', function () {
    const botonListarUser = document.getElementById("listUser");
    const tableDivUser = document.getElementById("divUser");
    const formProd = document.getElementById('formProd');
    const formCat = document.getElementById('formCat');
    const tableDivProd = document.getElementById("divProdTabla");
    const tableDivCat = document.getElementById("divCatTabla");
    const response = document.getElementById("response");
    const formEditProd = document.getElementById('formEditProd');
    const tableDivCaract = document.getElementById("divCaractTabla");
    const formCaract = document.getElementById('formCaract');
    const formEditCategoría = document.getElementById("formEditCategoría");
    

    formProd.style.display = 'none';
    formCat.style.display = 'none';
    tableDivProd.style.display = 'none';
    tableDivCat.style.display = 'none';
    response.style.display = 'none';
    formEditProd.style.display = 'none';
    tableDivUser.style.display = 'none';
    tableDivCaract.style.display = 'none';
    formCaract.style.display = 'none';
    formEditCategoría.style.display = "none";

    botonListarUser.addEventListener("click", function () {
        tableDivProd.style.display = 'none';
        formProd.style.display = 'none';
        formCat.style.display = 'none';
        tableDivCat.style.display = 'none';
        response.style.display = 'none';
        formEditProd.style.display = "none";
        tableDivUser.style.display = 'none';
        tableDivCaract.style.display = 'none';
        formCaract.style.display = 'none';
        formEditCategoría.style.display = "none";

        const url = 'http://localhost:8080/user/listarTodos';
        const settings = {
            method: 'GET'
        };

        fetch(url, settings)
            .then(response => response.json())
            .then(data => {
                const table = document.getElementById('userTablaBody');
                table.innerHTML = '';

                console.log(data);

                data.forEach(user => {
                    const userRow = table.insertRow();
                    userRow.id = 'tr_' + user.id;

                    const nombreCelda = userRow.insertCell();
                    nombreCelda.textContent = user.nombre;

                    const apellidoCelda = userRow.insertCell();
                    apellidoCelda.textContent = user.apellido;

                    const emailCelda = userRow.insertCell();
                    emailCelda.textContent = user.email;

                    //Creando toggle role
                    const contenedorToogle = document.createElement("div");
                    contenedorToogle.classList.add("toggle-container");

                    const status = document.createElement("p");
                    status.id = "status" + user.id;

                    const inputToogle = document.createElement("input");
                    inputToogle.classList.add("toggle-input");
                    inputToogle.id = "admin-toggle" + user.id;
                    inputToogle.setAttribute('type', "checkbox");
                    if (user.usuarioRole == "ADMIN") {
                        inputToogle.checked = true;
                        status.textContent = 'Modo Administrador: Activado';
                    } else {
                        inputToogle.checked = false;
                        status.textContent = 'Modo Administrador: Desactivado';
                    }

                    const labelToogle = document.createElement("label");
                    labelToogle.htmlFor = "admin-toggle";
                    labelToogle.classList.add("toggle-label");

                    inputToogle.onclick = () => updateUserRole(user, inputToogle.checked);

                    contenedorToogle.appendChild(inputToogle);
                    contenedorToogle.appendChild(labelToogle);

                    const toggleCelda = userRow.insertCell();
                    toggleCelda.appendChild(contenedorToogle);
                    toggleCelda.appendChild(status);

                });

                tableDivUser.style.display = 'block';
                tableDivUser.style.width = '100%';
            });

    });


    function updateUserRole(user, isChecked) {
        user.usuarioRole = isChecked ? "ADMIN" : "USER";

        const url = 'http://localhost:8080/user/update';
        const settings = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        };

        fetch(url, settings)
            .then(response => response.json())
            .then(updatedUser => {
                const status = document.getElementById('status' + user.id);
                if (user.usuarioRole == "ADMIN") {
                    status.textContent = 'Modo Administrador: Activado';
                } else {
                    status.textContent = 'Modo Administrador: Desactivado';
                }
            });
    }

})