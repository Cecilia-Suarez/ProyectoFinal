window.addEventListener('load', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idProducto = urlParams.get('id');

    //Sección detalle del producto
    const nombreProducto = document.getElementById("nombreProducto");
    const descripcionProducto = document.getElementById("descripcionProductoYCategoria");
    const caracteristicasProducto = document.getElementById("caracteristicas");
    const imagenProducto = document.getElementById("imagenProducto");
    const precioProducto = document.getElementById("precioProducto");
    const nombreCategoria = document.getElementById("nombreCategoria");
    const imgCategoria = document.getElementById("imgCategoria");

    //Sección detalle de la reserva
    const fechaReserva = document.getElementById("fechaReserva");
    const horaReserva = document.getElementById("horaReserva");
    const respuestaReserva = document.getElementById("respuestaReservas")
    const buttonEditarFecha = document.getElementById("buttonEditarFecha");
    const buttonEditarHora = document.getElementById("buttonEditarHora");

    //Botón confirmar reserva
    const botonConfirmarReserva = document.getElementById("buttonConfirmarReserva")

    //Le damos href a los botones de editar
    buttonEditarFecha.href = "/detailProd.html?id=" + idProducto
    buttonEditarHora.href = "/detailProd.html?id=" + idProducto


    //Obtenemos los datos del producto en cuestión
    const url = 'http://localhost:8080/productos/' + idProducto;
    const settings = {
        method: 'GET'
    };

    fetch(url, settings)
        .then(response => response.json())
        .then(producto => {
            nombreProducto.textContent = producto.nombreProducto;

            if (producto.categoria) {
                descripcionProducto.textContent = producto.descripcion + " " + producto.categoria.descripcion;
                imgCategoria.src = producto.categoria.imagen;
                nombreCategoria.textContent = producto.categoria.nombre;
            } else {
                descripcionProducto.textContent = producto.descripcion;
                imgCategoria.style.display = "none";
                nombreCategoria.textContent = "Sin categoría"
            }

            if (producto.caracteristicas.length > 0) {
                producto.caracteristicas.forEach(caracteristica => {
                    const containerCaracteristica = document.createElement("div");
                    containerCaracteristica.style.width = "100%"
                    const imgCaracteristica = document.createElement("img");
                    const nombreCaracteristica = document.createElement("p");

                    imgCaracteristica.src = caracteristica.imagen;
                    nombreCaracteristica.textContent = caracteristica.nombre;

                    containerCaracteristica.appendChild(imgCaracteristica);
                    containerCaracteristica.appendChild(nombreCaracteristica);

                    caracteristicasProducto.appendChild(containerCaracteristica)
                });
            } else if (producto.caracteristicas.length <= 0) {
                const sinCaracteristicas = document.createElement("span");
                sinCaracteristicas.textContent = "Sin características"
                caracteristicasProducto.appendChild(sinCaracteristicas)
            }

            imagenProducto.src = producto.imagen;

            precioProducto.textContent = "Precio por hora: U$S " + producto.precioHora;
        })


    //Obtenemos la fecha y hora seleccionada en el detalle del producto, las cuales estan guardadas en el localStorage (desarrollado en detailProd.js, líneas 169-170)
    const fechaGuardada = localStorage.getItem("fechaSeleccionada");
    const horaGuardada = localStorage.getItem("horaSeleccionada");

    //Le damos un formato a la fecha:
    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    //LLenamos los campos fecha y hora seleccionada para que se muestren en los span de detalle de la reserva.
    fechaReserva.textContent = formatDate(fechaGuardada);
    console.log(formatDate(fechaGuardada));

    horaReserva.textContent = horaGuardada;
    console.log(horaGuardada);


    //Funcionalidad para realizar la reserva
    botonConfirmarReserva.addEventListener('click', async () => {
        try {
            // Obtenemos el id del usuario y lo guardamos en la variable idUsuarioObtenido
            const urlUser = 'http://localhost:8080/user/detail';
            const settingsUser = {
                method: 'GET'
            };

            const responseUser = await fetch(urlUser, settingsUser);
            const dataUser = await responseUser.json();
            const idUsuarioObtenido = dataUser.id;
            console.log(dataUser);

            // Armado del body para guardar una reserva
            const formData = {
                producto: {
                    idProducto: parseInt(idProducto)
                },
                usuario: {
                    id: idUsuarioObtenido
                },
                fecha: formatDate(fechaGuardada),
                hora: horaGuardada,
                // El teléfono e indicaciones se agregan después de verificar si están presentes
            }

            // Agregar el teléfono a formData si está presente
            const inputTelefono = document.getElementById("inputTelefono");
            if (inputTelefono && inputTelefono.value) {
                formData.telefono = inputTelefono.value;
            }
            // Agregar las indicaciones a formData si están presentes
            const inputIndicaciones = document.getElementById("inputIndicaciones");
            if (inputIndicaciones && inputIndicaciones.value) {
                formData.indicaciones = inputIndicaciones.value;
            }

            console.log(formData);

            const url = 'http://localhost:8080/reservas/new';
            const settings = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            };
            console.log(JSON.stringify(formData));
            const responseReserva = await fetch(url, settings);
            if (responseReserva.status == 200) {
                const data = await responseReserva.json();
                botonConfirmarReserva.style.display = "none";
                buttonEditarHora.style.display = "none";
                buttonEditarFecha.style.display = "none";
                const containerReservaExistosa = document.createElement("div");
                const divIcon = document.createElement("div");
                const reservaExitosa = document.createElement("h3");
                reservaExitosa.className = "mensajeReservaExitosa"

                divIcon.className = "material-symbols-outlined";
                divIcon.textContent = "task_alt";

                reservaExitosa.textContent = "¡Reserva realizada con éxito!"

                containerReservaExistosa.appendChild(divIcon);
                containerReservaExistosa.appendChild(reservaExitosa);

                respuestaReservas.appendChild(containerReservaExistosa);
                console.log("Reserva realizada:" + data);
            } else {
                const data = await responseReserva.json();
                throw new Error(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    });

})