window.addEventListener('load', function () {
    const buttonAddProduct = document.getElementById('addProd');
    const formProd = document.getElementById('formProd');
    const formCat = document.getElementById('formCat');
    let radioCat = document.getElementById('radioCat');
    let checkCaracteristica = document.getElementById("checkboxCaract");
    const tableDivProd = document.getElementById("divProdTabla");
    const tableDivCat = document.getElementById("divCatTabla");
    const response = document.getElementById("response");
    const formEditProd = document.getElementById('formEditProd');
    const imagenInput = document.getElementById('imagen');
    const imagenPreview = document.getElementById('imagenPreview');
    const formCaract = document.getElementById('formCaract');
    const tableDivCaract = document.getElementById("divCaractTabla");
    const formEditCategoría = document.getElementById("formEditCategoría");
    

    formProd.style.display = 'none';
    formCat.style.display = 'none';
    tableDivProd.style.display = 'none';
    tableDivCat.style.display = 'none';
    response.style.display = 'none';
    formEditProd.style.display = 'none';
    formCaract.style.display = "none";
    tableDivCaract.style.display = 'none';
    formEditCategoría.style.display = "none";

    buttonAddProduct.addEventListener('click', function () {
        formProd.style.display = 'block';
        formCat.style.display = 'none';
        tableDivProd.style.display = 'none';
        tableDivCat.style.display = 'none';
        response.style.display = 'none';
        formEditProd.style.display = 'none';
        formCaract.style.display = "none";
        tableDivCaract.style.display = 'none';
        formEditCategoría.style.display = "none";

        radioCat.innerHTML = '<h4>Categoría</h4>'
        checkCaracteristica.innerHTML = '<h4>Características</h4>'


        const botonesSubmit = document.querySelectorAll('form button[type="submit"]');
        botonesSubmit.forEach(boton => {
            boton.style.display = 'inline-block';
        });

        //Obtener las categorias desde la API
        const url = 'http://localhost:8080/categorias/listarTodos';
        const settings = {
            method: 'GET'
        }

        fetch(url, settings)
            .then(response => response.json())
            .then(data => {
                //Recorremos la colección de categorias del JSON:
                data.forEach(categoria => {
                    //Por cada categoría crea un radio
                    let radioLabel = document.createElement("label");
                    let radioInput = document.createElement("input");
                    radioInput.type = "radio";
                    radioInput.value = categoria.idCategoria;
                    radioInput.name = "tipo";
                    radioLabel.appendChild(radioInput);
                    radioLabel.style.marginRight = "10px";
                    radioLabel.appendChild(document.createTextNode(categoria.nombre));
                    radioCat.appendChild(radioLabel);
                });

                console.log(data);
            });


        //Obtener las caracteristicas desde la API
        const urlCaract = 'http://localhost:8080/caracteristicas/all';
        const settingsCaract = {
            method: 'GET'
        }
        fetch(urlCaract, settingsCaract)
            .then(response => response.json())
            .then(data => {
                //Recorremos la colección de caracteristicas del JSON:
                data.forEach(caracteristica => {
                    //Por cada caracteristica crea un radio
                    let checkLabelCaract = document.createElement("label");
                    let checkInputCaract = document.createElement("input");
                    checkInputCaract.type = "checkbox";
                    checkInputCaract.value = caracteristica.idCaracteristica;
                    checkInputCaract.name = "caract";
                    checkLabelCaract.appendChild(checkInputCaract);
                    checkLabelCaract.style.marginRight = "10px";
                    checkLabelCaract.appendChild(document.createTextNode(caracteristica.nombre));
                    checkCaracteristica.appendChild(checkLabelCaract);
                });
            });

    });


    // Actualizar la vista previa de la imagen en tiempo real
    imagenInput.addEventListener('change', function () {
        const file = imagenInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagenPreview.src = e.target.result;
                imagenPreview.style.width = "200px";
                imagenPreview.style.height = "auto";
            };
            reader.readAsDataURL(file);
        }
    });

    //Ante un submit del formulario se ejecutará la siguiente función
    formProd.addEventListener('submit', function (event) {
        event.preventDefault();
        //Creamos un JSON que tendrá los datos del nuevo producto
        const formData = {
            nombreProducto: document.querySelector('#nombreProd').value,
            imagen: document.querySelector('#imagen').files[0],
            descripcion: document.querySelector("#descripcionProd").value,
            precioHora: parseFloat(document.querySelector('#precio').value)
        }

        //Obtener la categoria seleccionada (en el caso de que exista)
        const categoriaSeleccionada = document.querySelector('input[name="tipo"]:checked');
        if (categoriaSeleccionada) {
            formData.categoria = {
                idCategoria: parseInt(categoriaSeleccionada.value)
            };
        }

        //Obtener la categoria seleccionada (en el caso de que exista)
        const checkboxesSeleccionados = document.querySelectorAll('input[name="caract"]:checked');
        // Crear una lista de características seleccionadas
        const caracteristicasSeleccionadas = Array.from(checkboxesSeleccionados).map(checkbox => ({
            idCaracteristica: parseInt(checkbox.value)
        }));
        formData.caracteristicas = caracteristicasSeleccionadas;

        // Convertir imagen a base64
        if (formData.imagen) {
            const reader = new FileReader();
            reader.readAsDataURL(formData.imagen);
            reader.onload = function () {
                const base64Image = reader.result;
                formData.imagen = base64Image;
                console.log(formData);
                //Invocación a la API
                enviarDatos(formData);
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        }
        formProd.reset()
    })

});


function enviarDatos(formData) {
    const url = 'http://localhost:8080/productos/new';
    const settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    };

    fetch(url, settings)
        .then(response => {
            if (response.status == 200) {
                return response.json();
            } else {
                return response.json().then(data => {
                    throw new Error(data.message);
                });
            }
        })
        .then(data => {
            let successAlert = '<p> Producto agregado correctamente. </p>';
            console.log(successAlert);
            document.querySelector('#response').innerHTML = successAlert;
            document.querySelector('#response').style.display = 'block';
            console.log(data);

        })
        .catch(error => {
            let errorAlert = '<p> Error al agregar el producto: ya existe un producto con ese nombre.</p>';
            document.querySelector('#response').innerHTML = errorAlert;
            document.querySelector('#response').style.display = "block";
            console.log(error);
        });
}

