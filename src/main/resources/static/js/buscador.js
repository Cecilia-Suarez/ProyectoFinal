window.addEventListener('load', function () {
    const fechaBuscador = document.getElementById("fechaBuscador");
    const horaBuscador = document.getElementById("horaBuscador");
    const palabraClave = document.getElementById("keyword");

    function actualizarHorasDisponibles() {
        const currentDate = new Date();

        const selectedDate = new Date(fechaBuscador.value);
        selectedDate.setMinutes(selectedDate.getMinutes() + selectedDate.getTimezoneOffset());


        // Convertir fechas a formato YYYY-MM-DD para comparar solo la parte de la fecha
        const currentDateStr = currentDate.toLocaleDateString('en-CA').split('T')[0];
        const selectedDateStr = selectedDate.toLocaleDateString('en-CA').split('T')[0];
        const currentHour = new Date().getHours(); // Hora actual

        horaBuscador.innerHTML = ''; // Limpiar opciones existentes

        for (let hora = 9; hora <= 23; hora++) {
            const option = document.createElement("option");
            option.value = option.text = `${hora < 10 ? `0${hora}` : hora}:00`;

            // Ajustar la lógica para deshabilitar horas pasadas para la fecha actual
            if (currentDateStr === selectedDateStr && hora <= currentHour) {
                option.disabled = true;
                option.style.backgroundColor = '#b5b5b5'; // Gris para indicar deshabilitado
            }

            horaBuscador.appendChild(option);
        }
    }

    // Establecer la fecha mínima del input de fecha al día actual y actualizar las horas disponibles
    let today = new Date().toLocaleDateString('en-CA').split('T')[0];
    fechaBuscador.value = today;
    fechaBuscador.min = today;
    actualizarHorasDisponibles();

    // Evento para actualizar las horas disponibles cuando se cambia la fecha
    fechaBuscador.addEventListener('change', actualizarHorasDisponibles);

    //FUNCIONALIDAD LIMPIAR BUSQUEDA
    const clearButton = document.getElementById('clearSearch');
    const searchInputs = [fechaBuscador, horaBuscador, palabraClave, categoria, caracteristica]; // Asumiendo que quieres limpiar todos estos campos

    clearButton.addEventListener('click', function () {
        searchInputs.forEach(input => input.value = ''); // Limpiar todos los campos de búsqueda
        // Restablecer la fecha mínima del input de fecha al día actual
        fechaBuscador.value = today;
        fechaBuscador.min = today;
        actualizarHorasDisponibles(); // Asegúrate de llamar a esta función para actualizar las horas disponibles u otros elementos dependientes
    });

    //FUNCIONALIDAD BUSCAR POR PALABRA CLAVE (NOMBRES DE LOS PRODUCTOS Y CARACTERISTICAS)
    // Autocomplete
    let availableTags = [];

    //Obtengo los productos
    function obtenerProductos() {
        const url = 'http://localhost:8080/productos/listarTodos';
        const settings = {
            method: 'GET'
        };

        return fetch(url, settings)
            .then(response => response.json())
            .then(data => {
                data.forEach(producto => {
                    if (!availableTags.includes(producto.nombreProducto)) {
                        availableTags.push(producto.nombreProducto); //Agregamos el nombre de los productos al array availableTags
                    }
                });

                console.log("Productos obtenidos:", data); // Para depuración
                return data; // Retornar los productos obtenidos
            });
    }

    obtenerProductos().then(productos => {
        $("#keyword").autocomplete({
            source: availableTags, //Especifica que las opciones de autocompletado provienen del array availableTags.
        });

        //FUNCIONALIDAD: BUSCAR
        document.getElementById("buscar").addEventListener("click", async function () {
            // Obtener valores de los campos de entrada
            console.log("Esta es mi palabra clave: " + palabraClave.value);

            let categoria = document.getElementById("categoria").value;
            console.log("Esta es mi categoria: " + categoria);

            let caracteristica = document.getElementById("caracteristica").value;
            console.log("Esta es mi caracteristica: " + caracteristica);

            console.log("Este es la fecha de la reserva: " + fechaBuscador.value);

            console.log("Esta es la hora de la reserva: " + horaBuscador.value);

            // Realizar el filtrado de productos utilizando los valores obtenidos
            let resultadosFiltrados = await Promise.all(productos.map(async producto => {
                console.log("Producto:", producto); // Para depuración

                // Filtrar por palabra clave
                if (palabraClave.value && !producto.nombreProducto.includes(palabraClave.value)) {
                    return false;
                }

                // Filtrar por categoría
                if (categoria && (!producto.categoria || producto.categoria.nombre !== categoria)) {
                    return false;
                }

                // Filtrar por características
                if (caracteristica && !producto.caracteristicas.some(c => c.nombre.includes(caracteristica))) {
                    return false;
                }

                console.log("Producto:", producto);

                // Filtrado por fecha y hora
                if (fechaBuscador.value && horaBuscador.value) {
                    console.log('entre aca');
                    let productosDisponibles = await buscarProductosDisponibles(fechaBuscador.value, horaBuscador.value);

                    console.log(productosDisponibles);

                    if (productosDisponibles.length == 0) {
                        console.log("fallé acá");
                        return false;
                    }

                    let exist = productosDisponibles.some(prodDis => prodDis.idProducto === producto.idProducto);

                    console.log(exist);

                    if (!exist) {
                        return false;
                    }
                }

                return producto;
            }));

            resultadosFiltrados = resultadosFiltrados.filter(result => result !== false);

            console.log("Resultados filtrados:", resultadosFiltrados); // Para depuración

            // Mostrar los resultados filtrados
            mostrarResultados(resultadosFiltrados);
        });
    });


    //INPUT CARACTERÍSTICAS
    function obtenerCaracteristicas() {
        const selectCaracteristica = document.getElementById("caracteristica");

        const url = 'http://localhost:8080/caracteristicas/all';
        const settings = {
            method: 'GET'
        };

        fetch(url, settings)
            .then(response => response.json())
            .then(data => {
                data.forEach(caracteristica => {
                    const optionCaracteristica = document.createElement("option");
                    optionCaracteristica.value = caracteristica.nombre;
                    optionCaracteristica.textContent = caracteristica.nombre;
                    selectCaracteristica.appendChild(optionCaracteristica);
                });

                console.log("Características obtenidas:", data); // Para depuración
            });
    }

    obtenerCaracteristicas();

    function mostrarResultados(resultados) {
        //Desaparecer la sección de recomendaciones
        const recomendaciones = document.getElementById("recomendaciones")
        recomendaciones.style.display = "none";
        const productosRecomendados = document.getElementById("showProductos")
        productosRecomendados.style.display = "none";

        // Limpiar resultados anteriores
        document.getElementById("resultados").innerHTML = "";

        let contenedorTitulo = document.createElement("div");
        contenedorTitulo.className = "contenedorTituloResultados";
        let titulo = document.createElement("h1");
        titulo.textContent = "Resultados de la búsqueda";
        titulo.className = "tituloResultados";
        contenedorTitulo.appendChild(titulo);

        // Verificar si hay resultados
        if (resultados.length === 0) {
            let mensajeError = document.createElement("p");
            mensajeError.textContent = "No se encontraron resultados.";
            mensajeError.className = "mensajeErrorResultados"

            document.getElementById("resultados").appendChild(contenedorTitulo);
            document.getElementById("resultados").appendChild(mensajeError);

            recomendaciones.style.display = "block";
            productosRecomendados.style.display = "grid";
            return;
        }

        // Mostrar los resultados (cards de los productos encontrados)
        let listaResultados = document.createElement("div");
        listaResultados.className = "listaResultados";
        resultados.forEach(resultado => {

            const card = document.createElement("div");
            card.className = "cardResultados"

            const imagen = document.createElement('img');
            imagen.src = resultado.imagen;
            imagen.style.maxWidth = '100%';

            const nombre = document.createElement('h2');
            nombre.textContent = resultado.nombreProducto;

            const descripcionProducto = document.createElement('p');
            descripcionProducto.textContent = resultado.descripcion;

            const descripcionCategoria = document.createElement('p');
            descripcionCategoria.textContent = resultado.categoria ? resultado.categoria.descripcion : 'Sin categoría';

            const preciotitulo = document.createElement('h2');
            preciotitulo.textContent = 'Precio por Hora (USD $$) ';

            const precio = document.createElement('p');
            precio.textContent = resultado.precioHora;

            const verMasLink = document.createElement('a');
            verMasLink.textContent = 'Ver más';
            verMasLink.classList.add('ver-mas-link');
            verMasLink.href = './detailProd.html?id=' + resultado.idProducto;

            if (window.isUserLoggedIn) {

                const likeFavorito = document.createElement('button');
                likeFavorito.classList.add('favorite-btn');
                const heartIcon = document.createElement('i');
                heartIcon.classList.add('heart-icon', 'fas', 'fa-heart');
                likeFavorito.appendChild(heartIcon);

                card.appendChild(imagen);
                card.appendChild(nombre);
                card.appendChild(descripcionProducto);
                card.appendChild(descripcionCategoria);
                card.appendChild(preciotitulo);
                card.appendChild(precio);
                card.appendChild(likeFavorito);
                card.appendChild(verMasLink);

                listaResultados.appendChild(card);

                likeFavorito.addEventListener('click', () => {
                    likeFavorito.classList.toggle('favorited');
                    const productId = card.dataset.id;

                    if (likeFavorito.classList.contains('favorited')) {
                        addToFavorites(productId);
                    } else {
                        removeFromFavorites(productId);
                    }
                });
            } else {
                card.appendChild(imagen);
                card.appendChild(nombre);
                card.appendChild(descripcionProducto);
                card.appendChild(descripcionCategoria);
                card.appendChild(preciotitulo);
                card.appendChild(precio);
                card.appendChild(verMasLink);
                listaResultados.appendChild(card);
            }

        });
        let contenedorResultados = document.getElementById("resultados")
        contenedorResultados.appendChild(contenedorTitulo);
        contenedorResultados.appendChild(listaResultados);

    }

    const parseDate = dateString => {
        const [day, month, year] = dateString.split('/');
        return new Date(year, month - 1, day); // Mes se resta 1 porque en JavaScript los meses van de 0 a 11
    };

    async function buscarProductosDisponibles(fecha, hora) {
        const url = 'http://localhost:8080/productos/listarProductosDisponibles?fecha=' + fecha + '&hora=' + hora;
        const settings = {
            method: 'GET'
        };

        try {
            const response = await fetch(url, settings);
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }
});