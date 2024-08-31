window.addEventListener('load', function () {
    const selectCat = document.getElementById('categoria');

    //Invocamos a la API de Canhceros con el método GET nos devolverá un JSON con una colección de categorías
    const url = 'http://localhost:8080/categorias/listarTodos';
    const settings = {
        method: 'GET'
    }

    fetch(url, settings)
        .then(response => response.json())
        .then(data => {

            //Recorremos la colección de categorias del JSON
            data.forEach(categoria => {
                const optionCat = document.createElement("option");
                optionCat.value = categoria.nombre;
                optionCat.textContent = categoria.nombre;
                selectCat.appendChild(optionCat);

            });
            console.log(data);
        });

});



