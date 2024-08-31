document.addEventListener('DOMContentLoaded', async function () {
    const listaReservas = document.getElementById('listaReservas');

    // Obtener el id del usuario (debes ajustar esto según cómo obtienes el usuario autenticado)
    const urlUser = 'http://localhost:8080/user/detail';
    const responseUser = await fetch(urlUser, { method: 'GET' });

    if (!responseUser.ok) {
        throw new Error('Error al obtener el usuario');
    }

    const dataUser = await responseUser.json();
    const idUsuario = dataUser.id;

    // Obtener el historial de reservas del usuario
    const urlReservas = `http://localhost:8080/reservas/listarReservas/${idUsuario}`;
    const responseReservas = await fetch(urlReservas, { method: 'GET' });

    if (!responseReservas.ok) {
        throw new Error('Error al obtener el historial de reservas');
    }

    const reservas = await responseReservas.json();

    if (reservas.length === 0) {
        const sinReservas = document.createElement('p');
        sinReservas.textContent = 'No hay reservas en el historial.';
        listaReservas.appendChild(sinReservas);
    } else {
        // Función para convertir fecha y hora a objeto Date
        function parseDateAndTime(fecha, hora) {
            const [day, month, year] = fecha.split('/');
            const [hours, minutes] = hora.split(':');
            return new Date(year, month - 1, day, hours, minutes);
        }

        // Ordenar las reservas por fecha, hora y luego por ID
        reservas.sort((a, b) => {
            const fechaHoraA = parseDateAndTime(a.fecha, a.hora);
            const fechaHoraB = parseDateAndTime(b.fecha, b.hora);
            if (fechaHoraA < fechaHoraB) return -1;
            if (fechaHoraA > fechaHoraB) return 1;
            return a.id - b.id;
        });

        // Crear y agregar las reservas ordenadas al DOM
        for (const reserva of reservas) {
            const reservaDiv = document.createElement('div');
            reservaDiv.className = 'reserva';

            const nombreProducto = document.createElement('h2');
            nombreProducto.textContent = reserva.producto.nombreProducto;

            const descripcionDiv = document.createElement('div');
            descripcionDiv.className = 'descripcion';
            const descripcionTitulo = document.createElement('h3');
            descripcionTitulo.textContent = 'Descripción: ';
            const descripcion = document.createElement('p');
            descripcion.textContent = reserva.producto.descripcion;
            descripcionDiv.appendChild(descripcionTitulo);
            descripcionDiv.appendChild(descripcion);

            const categoriaDiv = document.createElement('div');
            categoriaDiv.className = 'categoria';
            const categoriaTitulo = document.createElement('h3');
            categoriaTitulo.textContent = 'Categoría: ';
            const categoria = document.createElement('p');
            categoria.textContent = reserva.producto.categoria ? reserva.producto.categoria.nombre : 'Sin categoría';
            categoriaDiv.appendChild(categoriaTitulo);
            categoriaDiv.appendChild(categoria);

            const caracteristicaDiv = document.createElement('div');
            caracteristicaDiv.className = 'caracteristica';
            const caracteristicasTitulo = document.createElement('h3');
            caracteristicasTitulo.textContent = 'Características: ';
            const caracteristicas = document.createElement('p');
            caracteristicas.textContent = reserva.producto.caracteristicas.length > 0 ? reserva.producto.caracteristicas.map(c => c.nombre).join(', ') : 'Sin características';
            caracteristicaDiv.appendChild(caracteristicasTitulo);
            caracteristicaDiv.appendChild(caracteristicas);

            const precioDiv = document.createElement('div');
            precioDiv.className = 'precio';
            const precioHoraTitulo = document.createElement('h3');
            precioHoraTitulo.textContent = 'Precio por hora: ';
            const precioHora = document.createElement('p');
            precioHora.textContent = `USD $ ${reserva.producto.precioHora}`;
            precioDiv.appendChild(precioHoraTitulo);
            precioDiv.appendChild(precioHora);

            const fechaDiv = document.createElement('div');
            fechaDiv.className = 'fecha';
            const fechaReservaTitulo = document.createElement('h3');
            fechaReservaTitulo.textContent = 'Fecha de reserva: ';
            const fechaReserva = document.createElement('p');
            fechaReserva.textContent = reserva.fecha;
            fechaDiv.appendChild(fechaReservaTitulo);
            fechaDiv.appendChild(fechaReserva);

            const horaDiv = document.createElement('div');
            horaDiv.className = 'hora';
            const horaReservaTitulo = document.createElement('h3');
            horaReservaTitulo.textContent = 'Hora de reserva: ';
            const horaReserva = document.createElement('p');
            horaReserva.textContent = reserva.hora;
            horaDiv.appendChild(horaReservaTitulo);
            horaDiv.appendChild(horaReserva);

            reservaDiv.appendChild(nombreProducto);
            reservaDiv.appendChild(descripcionDiv);
            reservaDiv.appendChild(categoriaDiv);
            reservaDiv.appendChild(caracteristicaDiv);
            reservaDiv.appendChild(precioDiv);
            reservaDiv.appendChild(fechaDiv);
            reservaDiv.appendChild(horaDiv);

            // Verificar y mostrar el teléfono si existe
            if (reserva.telefono) {
                const telefonoDiv = document.createElement('div');
                telefonoDiv.className = 'telefono';
                const telefonoTitulo = document.createElement('h3');
                telefonoTitulo.textContent = 'Teléfono: ';
                const telefono = document.createElement('p');
                telefono.textContent = reserva.telefono;
                telefonoDiv.appendChild(telefonoTitulo);
                telefonoDiv.appendChild(telefono);
                reservaDiv.appendChild(telefonoDiv); // Añadir al contenedor de la reserva
            }

            // Verificar y mostrar las indicaciones si existen
            if (reserva.indicaciones) {
                const indicacionesDiv = document.createElement('div');
                indicacionesDiv.className = 'indicaciones';
                const indicacionesTitulo = document.createElement('h3');
                indicacionesTitulo.textContent = 'Indicaciones: ';
                const indicaciones = document.createElement('p');
                indicaciones.textContent = reserva.indicaciones;
                indicacionesDiv.appendChild(indicacionesTitulo);
                indicacionesDiv.appendChild(indicaciones);
                reservaDiv.appendChild(indicacionesDiv); // Añadir al contenedor de la reserva
            }

            listaReservas.appendChild(reservaDiv);

            // Obtener la imagen del producto
            const urlProducto = `http://localhost:8080/productos/${reserva.producto.idProducto}`;
            fetch(urlProducto, { method: 'GET' })
                .then(response => response.json())
                .then(producto => {
                    const imagenProducto = document.createElement('img');
                    imagenProducto.src = producto.imagen;
                    imagenProducto.style.maxWidth = '100%';
                    imagenProducto.alt = reserva.producto.nombreProducto;
                    reservaDiv.insertBefore(imagenProducto, descripcionDiv);
                })
                .catch(error => console.error('Error al obtener la imagen del producto:', error));
        }
    }
});

