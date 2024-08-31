let imagenActual;
window.addEventListener('load', function () {
    const botonListar = document.getElementById('listProd');
    const tableDivProd = document.getElementById("divProdTabla");
    const formProd = document.getElementById('formProd');
    const formCat = document.getElementById('formCat');
    const tableDivCat = document.getElementById('divCatTabla');
    const response = document.getElementById('response');
    const formEditProd = document.getElementById('formEditProd');
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

    botonListar.addEventListener('click', function () {
        tableDivProd.style.display = 'block';
        formProd.style.display = 'none';
        formCat.style.display = 'none';
        tableDivCat.style.display = 'none';
        response.style.display = 'none';
        formEditProd.style.display = "none";
        formCaract.style.display = "none";
        tableDivCaract.style.display = 'none';
        formEditCategoría.style.display = "none";

        const url = 'http://localhost:8080/productos/listarTodos';
        const settings = {
            method: 'GET'
        };

        fetch(url, settings)
            .then(response => response.json())
            .then(data => {
                const table = document.getElementById('prodTablaBody');
                table.innerHTML = '';

                data.forEach(producto => {
                    const productoRow = table.insertRow();
                    productoRow.id = 'tr_' + producto.idProducto;

                    const idCelda = productoRow.insertCell();
                    idCelda.textContent = producto.idProducto;

                    const nombreCelda = productoRow.insertCell();
                    nombreCelda.textContent = producto.nombreProducto;

                    // Inserta una nueva celda en la fila del producto
                    const descripcionCelda = productoRow.insertCell();

                    // Crea un div para contener el texto y aplicar los estilos
                    const descripcionDiv = document.createElement('div');

                    // Establece el contenido del div basado en la presencia de la categoría
                    if (producto.categoria) {
                        descripcionDiv.textContent = producto.descripcion + " " + producto.categoria.descripcion;
                    } else {
                        descripcionDiv.textContent = producto.descripcion;
                    }

                    // Aplica los estilos necesarios al div
                    descripcionDiv.style.maxHeight = '20px';  // Altura inicial truncada
                    descripcionDiv.style.overflow = 'hidden'; // Oculta el texto excedente
                    descripcionDiv.style.cursor = 'pointer';  // Cambia el cursor para indicar que es clicable
                    descripcionDiv.style.display = 'block';   // Asegura que el div se comporte como un bloque
                    descripcionDiv.style.transition = 'max-height 0.3s ease'; // Transición suave para expandir

                    // Ajusta estilos para manejar expansión y contracción
                    descripcionDiv.onclick = function () {
                        if (descripcionDiv.style.maxHeight === '20px') {
                            descripcionDiv.style.maxHeight = descripcionDiv.scrollHeight + 'px'; // Expande el texto completo
                            descripcionDiv.style.whiteSpace = 'normal'; // Permite saltos de línea al expandir
                        } else {
                            descripcionDiv.style.maxHeight = '20px'; // Contrae el texto a la altura inicial
                            
                        }
                    };

                    // Añade el div dentro de la celda
                    descripcionCelda.appendChild(descripcionDiv);



                    const precioCelda = productoRow.insertCell();
                    precioCelda.textContent = producto.precioHora;

                    const categoriaCelda = productoRow.insertCell();
                    categoriaCelda.textContent = producto.categoria ? producto.categoria.nombre : 'Sin categoría';

                    const caracteristicaCelda = productoRow.insertCell();
                    caracteristicaCelda.textContent = producto.caracteristicas.map(caracteristica => caracteristica.nombre).join(', ');

                    // Crear botones de edición y eliminar
                    const editButton = document.createElement('button');
                    editButton.textContent = 'Editar';
                    editButton.setAttribute('id', 'btn_edit_' + producto.idProducto);
                    editButton.setAttribute('type', 'button');
                    editButton.onclick = () => editProduct(producto.idProducto);

                    const editCelda = productoRow.insertCell();
                    editCelda.appendChild(editButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Eliminar';
                    deleteButton.setAttribute('id', 'btn_delete_' + producto.idProducto);
                    deleteButton.setAttribute('type', 'button');
                    deleteButton.onclick = () => confirmDelete(producto.idProducto);

                    const deleteCelda = productoRow.insertCell();
                    deleteCelda.appendChild(deleteButton);
                });

                tableDivProd.style.display = 'block';
                tableDivProd.style.width = '100%';
            });
    });
});

function confirmDelete(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        const url = 'http://localhost:8080/productos/' + id;
        const settings = {
            method: 'DELETE'
        };

        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    document.getElementById('tr_' + id).remove();
                } else {
                    alert('No se pudo eliminar el producto.');
                }
            });
    }
}

function editProduct(id) {
    const url = 'http://localhost:8080/productos/' + id;
    const settings = {
        method: 'GET'
    };

    fetch(url, settings)
        .then(response => response.json())
        .then(data => {
            console.log('Datos del producto:', data); // Verificar los datos recibidos

            // Rellenar los campos del formulario con los datos del producto
            console.log('Nombre del producto:', data.nombreProducto);
            document.getElementById('nombreProdEdit').value = data.nombreProducto;
            document.getElementById('descripcionProdEdit').value = data.descripcion;
            document.getElementById('precioProdEdit').value = data.precioHora;


            let radioCatEdit = document.getElementById('radioCatEdit');
            radioCatEdit.innerHTML = '<h4>Categoría</h4>';

            let checkboxCaractEdit = document.getElementById("checkboxCaractEdit");
            checkboxCaractEdit.innerHTML = '<h4>Características</h4>';

            // Obtener las categorias desde la API
            const urlCategorias = 'http://localhost:8080/categorias/listarTodos';
            const settingsCategorias = {
                method: 'GET'
            };

            fetch(urlCategorias, settingsCategorias)
                .then(response => response.json())
                .then(categoriasData => {
                    // Recorremos la colección de categorias del JSON:
                    categoriasData.forEach(categoria => {
                        // Por cada categoría crea un radio
                        var radioLabel = document.createElement("label");
                        var radioInput = document.createElement("input");
                        radioInput.type = "radio";
                        radioInput.value = categoria.idCategoria;
                        radioInput.name = "tipo";
                        radioLabel.appendChild(radioInput);
                        radioLabel.style.marginRight = "10px";
                        radioLabel.appendChild(document.createTextNode(categoria.nombre));
                        radioCatEdit.appendChild(radioLabel);
                    });

                    // Si el producto tiene una categoría asignada, seleccionar el botón de radio correspondiente
                    const categoriaId = data.categoria ? data.categoria.idCategoria : null;
                    if (categoriaId) {
                        const categoriaCheckbox = document.querySelector(`input[name="tipo"][value="${categoriaId}"]`);
                        console.log(categoriaCheckbox)
                        if (categoriaCheckbox) {
                            categoriaCheckbox.checked = true;
                        } else {
                            console.log('No se encontró la categoría correspondiente.');
                        }
                    } else {
                        console.log('El producto no tiene categoría.');
                    }
                })
                .catch(error => {
                    console.error('Error al obtener las categorías:', error);
                });

            //Obtener todas las caracteristicas del producto
            const url = 'http://localhost:8080/caracteristicas/all';
            const settings = {
                method: 'GET'
            }

            fetch(url, settings)
                .then(response => response.json())
                .then(caracteriticas => {
                    const table = document.getElementById("caractTablaBody");
                    table.innerHTML = '';

                    caracteriticas.forEach(caracteristica => {
                        //Por cada caracteristica crea un radio
                        let checkLabelCaract = document.createElement("label");
                        let checkInputCaract = document.createElement("input");
                        checkInputCaract.type = "checkbox";
                        checkInputCaract.value = caracteristica.idCaracteristica;
                        checkInputCaract.name = "caract";

                        // Si la característica está asignada al producto, marcar la casilla de verificación
                        if (data.caracteristicas && data.caracteristicas.some(caracteristica => caracteristica.idCaracteristica === caracteristica.idCaracteristica)) {
                            checkInputCaract.checked = true;
                        }

                        checkLabelCaract.appendChild(checkInputCaract);
                        checkLabelCaract.style.marginRight = "10px";
                        checkLabelCaract.appendChild(document.createTextNode(caracteristica.nombre));
                        checkboxCaractEdit.appendChild(checkLabelCaract);
                    });

                });


            if (data.imagen) {
                // Mostrar la imagen que ya tiene el producto
                let imagen = document.getElementById("imagenPreviewEdit")
                imagenActual = data.imagen;
                imagen.src = imagenActual;
                imagen.style.width = "200px";
                imagen.style.height = "auto";
                imagen.style.margin = "5px";
                imagen.style.display = 'block'
            }

            // Mostrar el formulario de edición y ocultar la tabla de productos
            formEditProd.style.display = 'block';
            const tableDivProd = document.getElementById("divProdTabla");
            tableDivProd.style.display = 'none';

            const buttonActualizar = document.getElementById("btnActualizar");
            const buttonCancelar = document.getElementById("btnCancelar");
            // Asignar funciones a los botones de Actualizar y Cancelar
            buttonActualizar.onclick = function () {
                updateProduct(id);
            };

            buttonCancelar.onclick = function () {
                formEditProd.reset(); // Reiniciar el formulario
                formEditProd.style.display = 'none'; // Ocultar el formulario
                tableDivProd.style.display = 'block'; // Mostrar la tabla de productos
                buttonActualizar.style.display = 'none'; // Ocultar botón de Actualizar
                buttonCancelar.style.display = 'none'; // Ocultar botón de Cancelar
            };

            // Mostrar los botones
            buttonActualizar.style.display = 'inline-block';
            buttonCancelar.style.display = 'inline-block';

            //Refrescar la imagen en tiempo real
            const imagenEditInput = document.getElementById('imagenEdit');
            const imagenPreviewEdit = document.getElementById('imagenPreviewEdit');
            imagenEditInput.addEventListener('change', function () {
                const file = imagenEditInput.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        imagenActual = e.target.result;
                        imagenPreviewEdit.src = imagenActual;
                        imagenPreviewEdit.style.width = "200px";
                        imagenPreviewEdit.style.height = "auto";
                    };
                    reader.readAsDataURL(file);
                }

            })
        })
        .catch(error => {
            console.error('Error al obtener los datos del producto:', error);
        });

}

function updateProduct(id) {
    const url = 'http://localhost:8080/productos/update';

    const nombreProducto = document.querySelector('#nombreProdEdit').value;
    const imagenInput = document.querySelector('#imagenEdit');
    const descripcion = document.querySelector('#descripcionProdEdit').value;
    const precioHora = document.getElementById('precioProdEdit').value
    const tableDivProd = document.getElementById("divProdTabla");


    let base64Image = null;
    if (imagenInput.files.length > 0) {
        const reader = new FileReader();
        reader.readAsDataURL(imagenInput.files[0]);
        reader.onload = function () {
            base64Image = reader.result;
            enviarSolicitud(); // Enviar la solicitud después de convertir la imagen
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    } else {
        base64Image = imagenActual //Si no se cambia la imagen, utiliza la que ya tenía.
        enviarSolicitud(); // Enviar la solicitud inmediatamente si no hay imagen
    }

    function enviarSolicitud() {
        const categoriaSeleccionada = document.querySelector('input[name="tipo"]:checked');
        const idCategoria = categoriaSeleccionada ? parseInt(categoriaSeleccionada.value) : null;

        const checkboxesSeleccionados = document.querySelectorAll('input[name="caract"]:checked');
        // Crear una lista de características seleccionadas
        const caracteristicasSeleccionadas = Array.from(checkboxesSeleccionados).map(checkbox => ({
            idCaracteristica: parseInt(checkbox.value)
        }));

        let data = {
            idProducto: id,
            nombreProducto: nombreProducto,
            imagen: base64Image,
            descripcion: descripcion,
            precioHora: precioHora
        };

        //Si el producto tiene una categoría
        if (idCategoria) {
            data = {
                ...data,
                categoria: { idCategoria }
            };
        } else {
            data.categoria = null; // Si no hay categoría seleccionada, asignar null
        }

        //Si el producto tiene categorías seleccionadas
        if (caracteristicasSeleccionadas) {
            data = {
                ...data,
                caracteristicas: caracteristicasSeleccionadas
            }
        }

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al actualizar el producto');
                }
                alert('Producto actualizado exitosamente');
                formEditProd.style.display = 'none';
                tableDivProd.style.display = 'block';
                document.getElementById('listProd').click();
            })
            .catch(error => {
                console.error('Error al actualizar el producto:', error);
            });
    }
}
