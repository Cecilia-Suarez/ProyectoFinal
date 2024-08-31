document.addEventListener('DOMContentLoaded', () => {
    const listaFavoritos = document.getElementById('listaFavoritos');
    const favoritos = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favoritos.length === 0) {
        const noFavoritos = document.createElement('p');
        noFavoritos.textContent = 'No tienes productos favoritos.';
        listaFavoritos.appendChild(noFavoritos);
        return;
    }

    favoritos.forEach(producto => {
        const productoDivFav = document.createElement('div');
        productoDivFav.classList.add('producto');

        const imagen = document.createElement('img');
        imagen.src = producto.imagen;
        imagen.style.maxWidth = '100%';

        const nombre = document.createElement('h2');
        nombre.textContent = producto.nombre;

        const descripcionProducto = document.createElement('p');
        descripcionProducto.textContent = producto.descripcionProducto;

        const descripcionCategoria = document.createElement('p');
        descripcionCategoria.textContent = producto.descripcionCategoria;

        const preciotitulo = document.createElement('h2');
        preciotitulo.textContent = producto.preciotitulo;

        const precio = document.createElement('p');
        precio.textContent = producto.precio;

        const verMasLink = document.createElement('a');
        verMasLink.textContent = 'Ver más';
        verMasLink.classList.add('ver-mas-link');
        verMasLink.href = './detailProd.html?id=' + producto.idProducto;

        // Crear botón de eliminar favorito
        const eliminarBtn = document.createElement('button');
        eliminarBtn.classList.add('eliminar-btn');
        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fas', 'fa-trash');
        eliminarBtn.appendChild(trashIcon);

        eliminarBtn.addEventListener('click', () => {
            removeFromFavorites(producto.idProducto);
            productoDivFav.remove();
            if (listaFavoritos.children.length === 0) {
                const noFavoritos = document.createElement('p');
                noFavoritos.textContent = 'No tienes productos favoritos.';
                listaFavoritos.appendChild(noFavoritos);
            }
        });

        productoDivFav.appendChild(imagen);
        productoDivFav.appendChild(nombre);
        productoDivFav.appendChild(descripcionProducto);
        productoDivFav.appendChild(descripcionCategoria);
        productoDivFav.appendChild(preciotitulo);
        productoDivFav.appendChild(precio);
        productoDivFav.appendChild(verMasLink);
        productoDivFav.appendChild(eliminarBtn);

        listaFavoritos.appendChild(productoDivFav);
    });
});

function removeFromFavorites(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.idProducto !== productId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

