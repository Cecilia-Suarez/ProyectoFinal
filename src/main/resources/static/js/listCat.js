window.addEventListener('load', function () {
    const botonListar = document.getElementById('listCat');
    const tableDivCat = document.getElementById("divCatTabla");
    const formProd = document.getElementById('formProd');
    const formCat = document.getElementById('formCat');
    const tableDivProd = document.getElementById("divProdTabla");
    const response = document.getElementById("response");
    const formEditProd = document.getElementById('formEditProd');
    const tableDivUser = document.getElementById("divUser");
    const formCaract = document.getElementById('formCaract');
    const tableDivCaract = document.getElementById("divCaractTabla");
    const formEditCategoria = document.getElementById("formEditCategoría");

    formProd.style.display = 'none';
    formCat.style.display = 'none';
    tableDivCat.style.display = 'none';
    tableDivCaract.style.display = 'none';
    tableDivProd.style.display = 'none';
    response.style.display = 'none';
    formEditProd.style.display = 'none';
    tableDivUser.style.display = 'none';
    formCaract.style.display = "none";
    formEditCategoria.style.display = "none";

    botonListar.addEventListener('click', function () {
        tableDivCat.style.display = 'block';
        formProd.style.display = 'none';
        formCat.style.display = 'none';
        tableDivProd.style.display = 'none';
        response.style.display = 'none';
        formEditProd.style.display = 'none';
        tableDivUser.style.display = 'none';
        formCaract.style.display = "none";
        tableDivCaract.style.display = 'none';
        formEditCategoria.style.display = "none";

        //Invocamos a la API de Canhceros con el método GET nos devolverá un JSON con una colección de categorías
        const url = 'http://localhost:8080/categorias/listarTodos';
        const settings = {
            method: 'GET'
        }

        fetch(url, settings)
            .then(response => response.json())
            .then(data => {
                const table = document.getElementById("catTablaBody");
                table.innerHTML = '';

                //Recorremos la colección de categorias del JSON:
                data.forEach(categoria => {
                    //Por cada categoria armaremos una fila de la tabla:
                    let categoriaRow = table.insertRow();
                    let tr_id = 'tr_' + categoria.idCategoria;
                    categoriaRow.id = tr_id;

                    // Añadimos las celdas con los datos de la categoría
                    let idCelda = categoriaRow.insertCell();
                    idCelda.textContent = categoria.idCategoria;

                    let nombreCelda = categoriaRow.insertCell();
                    nombreCelda.textContent = categoria.nombre;

                    let descripcionCelda = categoriaRow.insertCell();
                    descripcionCelda.textContent = categoria.descripcion;

                    let imgCelda = categoriaRow.insertCell();
                    let img = document.createElement("img");
                    img.src = categoria.imagen;
                    img.style.maxWidth = '4em';
                    imgCelda.appendChild(img);

                    // Crear botones de edición y eliminar
                    const editButton = document.createElement('button');
                    editButton.textContent = 'Editar';
                    editButton.setAttribute('id', 'btn_edit_' + categoria.idCategoria);
                    editButton.setAttribute('type', 'button');
                    editButton.onclick = () => editCategoria(categoria.idCategoria);

                    const editCelda = categoriaRow.insertCell();
                    editCelda.appendChild(editButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Eliminar';
                    deleteButton.setAttribute('id', 'btn_delete_' + categoria.idCategoria);
                    deleteButton.setAttribute('type', 'button');
                    deleteButton.onclick = () => confirmDeleteCategoria(categoria);

                    const deleteCelda = categoriaRow.insertCell();
                    deleteCelda.appendChild(deleteButton);

                });
                tableDivCat.style.display = 'block';
                console.log(data);
            });

    });

});

function confirmDeleteCategoria(categoria) {
    if (confirm("¿Estás seguro de que deseas eliminar la categoría " + categoria.nombre + "?\n\nLa eliminación de dicha categoría involucra la eliminación de los productos asociados a ella.")) {

        //Obtenemos los productos que tienen la categoría a eliminar
        const urlListadoProductosPorCategoria = 'http://localhost:8080/productos/listarPorCategoria/' + categoria.idCategoria;
        
        fetch(urlListadoProductosPorCategoria)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudieron obtener los productos asociados.');
                }
                return response.json();
            })
            .then(productos => {
                if (!productos || productos.length === 0) {
                    // Si no hay productos asociados, eliminar directamente la categoría
                    return Promise.resolve();
                }

                // Eliminar cada producto asociado
                const deleteProductPromises = productos.map(producto => {
                    const urlEliminarProducto = 'http://localhost:8080/productos/' + producto.idProducto;
                    return fetch(urlEliminarProducto, { method: 'DELETE' })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('No se pudo eliminar el producto asociado: ' + producto.nombreProducto);
                            }
                        });
                });

                // Ejecutar todas las solicitudes de eliminación de productos
                return Promise.all(deleteProductPromises);
            })
            .then(() => {
                // Después de eliminar los productos (o si no hay productos), eliminar la categoría
                const urlEliminarCategoria = 'http://localhost:8080/categorias/' + categoria.idCategoria;
                return fetch(urlEliminarCategoria, { method: 'DELETE' });
            })
            .then(response => {
                if (response.ok) {
                    // Eliminar la fila de la tabla correspondiente a la categoría
                    document.getElementById('tr_' + categoria.idCategoria).remove();
                    
                    alert('La categoría ' + categoria.nombre + ' fue eliminada con éxito.');
                    
                } else {
                    alert('No se pudo eliminar la categoría ' + categoria.nombre + ' ni sus productos asociados.' );
                }
            })
            .catch(error => {
                alert('Hubo un error al intentar eliminar la categoría ' + categoria.nombre + ' y sus productos asociados: ' + error.message);
            });
    }
}

function editCategoria(id) {
    const url = 'http://localhost:8080/categorias/' + id;
    const settings = {
        method: 'GET'
    };

    fetch(url, settings)
        .then(response => response.json())
        .then(data => {
            console.log('Datos de la categoría:', data); // Verificar los datos recibidos

            // Rellenar los campos del formulario con los datos del producto
            console.log('Nombre la categoría:', data.nombre);
            document.getElementById('nombreCategoriaEdit').value = data.nombre;
            document.getElementById('descripcionCategoriaEdit').value = data.descripcion;

            if (data.imagen) {
                // Mostrar la imagen que ya tiene la categoría
                let imagen = document.getElementById("imagenPreviewCategoriaEdit")
                imagenActual = data.imagen;
                imagen.src = imagenActual;
                imagen.style.width = "200px";
                imagen.style.height = "auto";
                imagen.style.margin = "5px";
                imagen.style.display = 'block'
            }

            // Mostrar el formulario de edición y ocultar la tabla de categorías
            formEditCategoría.style.display = 'block';
            const tableDivCat = document.getElementById("divCatTabla");
            tableDivCat.style.display = 'none';

            const buttonActualizar = document.getElementById("btnActualizarCategoría");
            const buttonCancelar = document.getElementById("btnCancelarCategoría");
            // Asignar funciones a los botones de Actualizar y Cancelar
            buttonActualizar.onclick = function () {
                updateCategoria(id);
            };

            buttonCancelar.onclick = function () {
                formEditCategoría.reset(); // Reiniciar el formulario
                formEditCategoría.style.display = 'none'; // Ocultar el formulario
                formEditCategoría.style.display = 'block'; // Mostrar la tabla de categoría
                buttonActualizar.style.display = 'none'; // Ocultar botón de Actualizar
                buttonCancelar.style.display = 'none'; // Ocultar botón de Cancelar
            };

            // Mostrar los botones
            buttonActualizar.style.display = 'inline-block';
            buttonCancelar.style.display = 'inline-block';

            //Refrescar la imagen en tiempo real
            const imagenEditInputCat = document.getElementById('imagenCategoriaEdit');
            const imagenPreviewEditCat = document.getElementById('imagenPreviewCategoriaEdit');
            imagenEditInputCat.addEventListener('change', function () {
                const file = imagenEditInputCat.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        imagenActual = e.target.result;
                        imagenPreviewEditCat.src = imagenActual;
                        imagenPreviewEditCat.style.width = "200px";
                        imagenPreviewEditCat.style.height = "auto";
                    };
                    reader.readAsDataURL(file);
                }

            })
        })
        .catch(error => {
            console.error('Error al obtener los datos de la categoría:', error);
        });
}

function updateCategoria(idCategoria) {
    const url = 'http://localhost:8080/categorias/update';

    const tableDivCat = document.getElementById("divCatTabla");
    const nombre = document.querySelector('#nombreCategoriaEdit').value;
    const imagenInput = document.querySelector('#imagenCategoriaEdit');
    const descripcion = document.querySelector('#descripcionCategoriaEdit').value;


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
        const data = {
            idCategoria: idCategoria,
            nombre: nombre,
            imagen: base64Image,
            descripcion: descripcion
        };

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al actualizar la categoría');
                }
                alert('Categoría actualizado exitosamente');
                formEditCategoría.style.display = 'none';
                tableDivCat.style.display = 'block';
                document.getElementById('catTabla').click();
            })
            .catch(error => {
                console.error('Error al actualizar la categoría:', error);
            });
    }
}