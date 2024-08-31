window.addEventListener('load', function () {
    const botonListar = document.getElementById('listCaract');
    const tableDivCat = document.getElementById("divCatTabla");
    const formProd = document.getElementById('formProd');
    const formCat = document.getElementById('formCat');
    const formCaract = document.getElementById('formCaract');
    const tableDivProd = document.getElementById("divProdTabla");
    const tableDivCaract = document.getElementById("divCaractTabla");
    const formEditProd = document.getElementById('formEditProd');
    const tableDivUser = document.getElementById("divUser");
    const formEditCategoría = document.getElementById("formEditCategoría");
    

    const response = document.getElementById("response");

    formProd.style.display = 'none';
    formCat.style.display = 'none';
    formCaract.style.display = 'none';
    tableDivCat.style.display = 'none';
    tableDivProd.style.display = 'none';
    tableDivCaract.style.display = 'none';
    response.style.display = 'none';
    formEditProd.style.display = 'none';
    tableDivUser.style.display = 'none';
    formEditCategoría.style.display = "none";

    botonListar.addEventListener('click', function () {
        tableDivCat.style.display = 'none';
        tableDivCaract.style.display = 'block';
        formProd.style.display = 'none';
        formCat.style.display = 'none';
        formCaract.style.display = 'none';
        tableDivProd.style.display = 'none';
        response.style.display = 'none';
        formEditProd.style.display = 'none';
        tableDivUser.style.display = 'none';
        formEditCategoría.style.display = "none";

        //Invocamos a la API de Canhceros con el método GET nos devolverá un JSON con una colección de cate
        const url = 'http://localhost:8080/caracteristicas/all';
        const settings = {
            method: 'GET'
        }

        fetch(url, settings)
            .then(response => response.json())
            .then(data => {
                const table = document.getElementById("caractTablaBody");
                table.innerHTML = '';

                data.forEach(caracteristica => {
                    const caracteristicaRow = table.insertRow();

                    let nombreCelda = caracteristicaRow.insertCell();
                    nombreCelda.textContent = caracteristica.nombre;

                    let imgCelda = caracteristicaRow.insertCell();
                    let img = document.createElement("img");
                    img.src = caracteristica.imagen;
                    img.style.maxWidth = '4em';
                    imgCelda.appendChild(img);
                });

            });

        tableDivCaract.style.display = 'block';
    });

});






