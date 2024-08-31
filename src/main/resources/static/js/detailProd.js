window.addEventListener('load', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idProducto = urlParams.get('id');
    const divDetail = document.getElementById("detail");
    const divDescripcionYCard = document.getElementById("descripcionYcard");
    const divTitulo = document.getElementById("titulo");
    const divCaracteristicas = document.getElementById("caracteristicas");

    const url = 'http://localhost:8080/productos/' + idProducto;
    const settings = {
        method: 'GET'
    };

    fetch(url, settings)
        .then(response => response.json())
        .then(producto => {
            // Crear elementos para mostrar la información del producto
            let nombreProducto = document.createElement("h1");
            nombreProducto.textContent = producto.nombreProducto;
            divTitulo.appendChild(nombreProducto);

            let descripcionDiv = document.createElement("div");

            let productoDiv = document.createElement("div");
            productoDiv.classList.add('seccionProducto');
            let descripcionProducto = document.createElement('p');

            let descripcionCategoria = document.createElement('p');

            if (producto.categoria) {
                descripcionProducto.textContent = producto.descripcion;
                descripcionCategoria.textContent = producto.categoria.descripcion;
            } else {
                descripcionProducto.textContent = producto.descripcion;
                descripcionCategoria.style.display = 'none';
            }

            productoDiv.appendChild(descripcionProducto);

            descripcionDiv.appendChild(productoDiv);
            descripcionDiv.appendChild(descripcionCategoria);
            descripcionDiv.classList.add('descripciones')
            descripcionDiv.style.fontWeight = 600;
            descripcionDiv.style.display = 'flex';
            divDescripcionYCard.appendChild(descripcionDiv);

            let divCard = document.createElement("div");
            divCard.classList.add('divCard');

            let verificaHorario = document.createElement("p");
            verificaHorario.textContent = 'Verifica el horario disponible en el día que deseas realizar la reserva';
            verificaHorario.style.fontWeight = 600;
            verificaHorario.style.textAlign = 'center';

            let precio = document.createElement("p");
            precio.textContent = '$ ' + producto.precioHora + ' USD Por Hora';
            precio.style.fontWeight = 600;

            let divHorarios = document.createElement("div");
            divHorarios.classList.add('divHorarios');
            let tituloHorarios = document.createElement("p");
            tituloHorarios.textContent = 'Horarios:';
            tituloHorarios.style.fontWeight = 600;

            // Crear y configurar el input de fecha
            let inputFecha = document.createElement("input");
            inputFecha.type = "date";
            inputFecha.name = "fecha";
            inputFecha.id = "fecha";

            // Establecer la fecha mínima del input de fecha al día actual
            let today = new Date().toLocaleDateString('en-CA');
            console.log(today);
            inputFecha.value = today;
            inputFecha.min = today;

            // Crear y configurar el select de hora
            let selectHora = document.createElement("select");
            selectHora.name = "hora";
            selectHora.id = "hora";

            // Función para actualizar las horas disponibles según la fecha seleccionada
            function actualizarHorasDisponibles(idProducto) {
                //Listamos las reservas relacionadas al producto
                const urlReservas = 'http://localhost:8080/productos/listarReservas/' + idProducto;
                const settingsReservas = {
                    method: 'GET'
                };

                fetch(urlReservas, settingsReservas)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error: ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log(data);
                        actualizarSelectHoras(data);
                    })

            }

            function actualizarSelectHoras(reservas) {
                const inputFecha = document.getElementById("fecha");
                const selectHora = document.getElementById("hora");
            
                inputFecha.addEventListener("change", function () {
                    const fechaSeleccionada = inputFecha.value;
                    selectHora.innerHTML = ""; // Limpiamos el select de horas
            
                    const currentDate = new Date();  // Fecha actual
                    const currentHour = currentDate.getHours();  // Hora actual
            
                    // Rellenamos el select de horas (suponiendo un horario de 9:00 a 23:00)
                    for (let hora = 9; hora <= 23; hora++) {
                        const option = document.createElement("option");
                        if (hora < 10) {
                            option.value = `0${hora}:00`;
                            option.text = `0${hora}:00`;
                        } else {
                            option.value = `${hora}:00`;
                            option.text = `${hora}:00`;
                        }
            
                        // Verificamos si la hora está ocupada o si es una hora pasada del día actual
                        const horaOcupada = reservas.some(reserva =>
                            reserva.fecha === formatDate(fechaSeleccionada) &&
                            parseInt(reserva.hora.split(':')[0]) === hora
                        );
            
                        if (horaOcupada) {  
                            option.disabled = true;
                            option.style.backgroundColor = '#FF6666'; // Rojo para ocupado
                        } else if (fechaSeleccionada === today && hora <= currentHour){
                            option.disabled = true;
                            option.style.backgroundColor = 	'#b5b5b5'; // Gris para las horas que son menores a la hora actual 
                        }
                        else {
                            option.style.backgroundColor = '#CCFFCC'; // Verde claro para disponible
                        }
            
                        selectHora.appendChild(option);
                    }
                });
            
                // Disparar el evento change para inicializar el select de horas con la fecha por defecto
                inputFecha.dispatchEvent(new Event('change'));
            }
            

            // Llamar a la función para inicializar las horas disponibles
            actualizarHorasDisponibles(idProducto);

            let buttonReserva = document.createElement('button');
            buttonReserva.classList.add('buttonReserva');
            buttonReserva.textContent = 'Reserva aquí';

            //Evento al botón de reserva aqui y guardado del rango horario y fechas en el localStorage.
            buttonReserva.addEventListener('click', () => {
                //Al hacer click en el botón dirige hacia la pagina de reservas relacionado al producto
                window.location.href = 'reservas.html?id=' + idProducto;

                let fechaSeleccionada = inputFecha.value;
                let horaSeleccionada = selectHora.value;

                //Guardamos la fecha y hora seleccionada en el localStorage
                localStorage.setItem("fechaSeleccionada", fechaSeleccionada)
                localStorage.setItem("horaSeleccionada", horaSeleccionada)

                console.log(`Fecha seleccionada: ${fechaSeleccionada}`);
                console.log(`Hora seleccionada: ${horaSeleccionada}`);
            });

            divHorarios.appendChild(tituloHorarios);
            divHorarios.appendChild(inputFecha);
            divHorarios.appendChild(selectHora);
            divCard.appendChild(verificaHorario);
            divCard.appendChild(precio);
            divCard.appendChild(divHorarios);
            divCard.appendChild(buttonReserva);

            divDescripcionYCard.appendChild(divCard);

            producto.caracteristicas.forEach(caracteristica => {
                const caracteristicaUnicaDiv = document.createElement('div');
                caracteristicaUnicaDiv.classList.add('caracteristica');

                let imagenCaracteristica = document.createElement("img");
                imagenCaracteristica.src = caracteristica.imagen;
                imagenCaracteristica.alt = caracteristica.nombre;

                let nombreCaracteristica = document.createElement("h4");
                nombreCaracteristica.classList.add('nombreCaracteristica');
                nombreCaracteristica.textContent = caracteristica.nombre;

                caracteristicaUnicaDiv.appendChild(nombreCaracteristica);
                caracteristicaUnicaDiv.appendChild(imagenCaracteristica);

                divCaracteristicas.appendChild(caracteristicaUnicaDiv);
            });

            let img = document.createElement('img');
            img.classList.add('imgProd');
            img.src = producto.imagen;
            img.style.height = '100%';
            divDetail.appendChild(img);
        });
});

//Le damos un formato a la fecha:
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}



