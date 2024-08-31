window.addEventListener('load', function () {
    const buttonAddCaract = document.getElementById('addCaract');
    const formProd = document.getElementById('formProd');
    const formCat = document.getElementById('formCat');
    const formCaract = document.getElementById('formCaract');
    const tableDivProd = document.getElementById("divProdTabla");
    const tableDivCat = document.getElementById("divCatTabla");
    const tableDivCaract = document.getElementById("divCaractTabla");
    const formEditProd = document.getElementById('formEditProd');
    const tableDivUser = document.getElementById("divUser");
    const formEditCategoría = document.getElementById("formEditCategoría");

    const response = document.getElementById("response");

    formProd.style.display = 'none';
    formCat.style.display = 'none';
    tableDivProd.style.display = 'none';
    tableDivCat.style.display = 'none';
    response.style.display = 'none';
    formEditProd.style.display = 'none';
    tableDivUser.style.display = 'none';
    formCaract.style.display = 'none';
    formEditCategoría.style.display = "none";


    buttonAddCaract.addEventListener('click', function () {
        formProd.style.display = 'none';
        formCat.style.display = 'none';
        formCaract.style.display = 'block';
        tableDivProd.style.display = 'none';
        tableDivCat.style.display = 'none';
        tableDivUser.style.display = 'none';
        response.style.display = 'none';
        formEditProd.style.display = 'none';
        tableDivCaract.style.display = 'none';
        formEditCategoría.style.display = "none";
    });

    //Ante un submit del formulario se ejecutará la siguiente funcion
    formCaract.addEventListener('submit', function (event) {
        event.preventDefault();

        //Creamos un JSON que tendrá los datos de la nueva categoría
        const formData = {
            nombre: document.querySelector('#nombreCaract').value,
            imagen: document.querySelector('#imagenCaract').files[0]
        }

        // Convertir imagen a base64
        if (formData.imagen) {
            const reader = new FileReader();
            reader.readAsDataURL(formData.imagen);
            reader.onload = function () {
                const base64Image = reader.result;
                formData.imagen = base64Image;
                console.log(formData);
                //Invocación a la API
                enviarDatosCaract(formData);
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        }
    });
});

function enviarDatosCaract(formData) {
    const url = "http://localhost:8080/caracteristicas/new";
    const settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    }
    fetch(url, settings)
        .then(response => {
            if (response.status == 200) {
                return response.json()
            } else {
                throw new Error('Error al agregar la caracteristica.');
            }
        })
        .then(data => {
            let successAlert = '<p>Caracteristicas agregada correctamente</p>'
            document.querySelector('#response').innerHTML = successAlert;
            document.querySelector('#response').style.display = 'block';
            console.log(data);
        })
        .catch(error => {
            let errorAlert = '<p>Error al agregar la caracteristica</p>'
            document.querySelector('#response').innerHTML = errorAlert;
            document.querySelector('#response').style.display = "block";
            console.log(error);
        })

    formCaract.reset()
};

