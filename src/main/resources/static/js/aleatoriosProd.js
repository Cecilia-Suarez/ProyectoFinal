window.addEventListener('load', function () {
    mostrarProductosAleatorios();
});

// Función para mostrar productos aleatorios
function mostrarProductosAleatorios() {
    const showProductos = document.getElementById('showProductos');
    const url = 'http://localhost:8080/productos/listarTodos';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const productosAleatorios = obtenerProductosAleatorios(data, 10);
            mostrarProductosEnDiv(productosAleatorios);
        })
        .catch(error => {
            console.error('Error al obtener los productos:', error);
        });
}

// Función para obtener una muestra aleatoria de productos
function obtenerProductosAleatorios(productosConCategoria, productosSinCategoria) {
    const productosAleatorios = [];

    // Agregar productos sin categoría
    if (productosSinCategoria.length > 0) {
        const indiceAleatorio = Math.floor(Math.random() * productosSinCategoria.length);
        productosAleatorios.push(productosSinCategoria.splice(indiceAleatorio, 1)[0]);
    }

    // Determinar cuántos productos aleatorios restantes necesitamos
    let cantidadRestante = 10 - productosAleatorios.length;

    // Agregar productos con categoría aleatorios
    while (cantidadRestante > 0 && productosConCategoria.length > 0) {
        const indiceAleatorio = Math.floor(Math.random() * productosConCategoria.length);
        productosAleatorios.push(productosConCategoria.splice(indiceAleatorio, 1)[0]);
        cantidadRestante--;
    }

    return productosAleatorios;
}


// Función para mostrar productos en el div
function mostrarProductosEnDiv(productos) {
    const showProductos = document.getElementById('showProductos');
    showProductos.innerHTML = '';

    if (productos.length === 0) {
        const noProductos = document.createElement('p');
        noProductos.textContent = 'No se encontraron productos.';
        showProductos.appendChild(noProductos);
        return;
    }

    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');

        const imagen = document.createElement('img');
        imagen.src = producto.imagen;
        imagen.style.maxWidth = '100%';
      
        imagen.style.objectFit = 'contain'

        const nombre = document.createElement('h2');
        nombre.textContent = producto.nombreProducto;

        const descripcionProducto = document.createElement('p');
        descripcionProducto.textContent = producto.descripcion;

        const descripcionCategoria = document.createElement('p');
        descripcionCategoria.textContent = producto.categoria ? producto.categoria.descripcion : 'Sin categoría';

        const preciotitulo = document.createElement('h2');
        preciotitulo.textContent = 'Precio por Hora (USD $$) ';

        const precio = document.createElement('p');
        precio.textContent = producto.precioHora;

        const verMasLink = document.createElement('a');
        verMasLink.textContent = 'Ver más';
        verMasLink.classList.add('ver-mas-link');
        verMasLink.href = './detailProd.html?id=' + producto.idProducto;

        if (window.isUserLoggedIn) {

            const likeFavorito = document.createElement('button');
            likeFavorito.classList.add('favorite-btn');
            const heartIcon = document.createElement('i');
            heartIcon.classList.add('heart-icon', 'fas', 'fa-heart');
            likeFavorito.appendChild(heartIcon);

            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

            // Verificar si el producto está en la lista de favoritos
            const esFavorito = favorites.some(fav => fav.idProducto === producto.idProducto);

            // Marcar visualmente el botón de favoritos si el producto está en la lista de favoritos
            if (esFavorito) {
                likeFavorito.classList.add('favorited');
            }

            productoDiv.appendChild(imagen);
            productoDiv.appendChild(nombre);
            productoDiv.appendChild(descripcionProducto);
            productoDiv.appendChild(descripcionCategoria);
            productoDiv.appendChild(preciotitulo);
            productoDiv.appendChild(precio);
            productoDiv.appendChild(likeFavorito);
            productoDiv.appendChild(verMasLink);

            showProductos.appendChild(productoDiv);

            likeFavorito.addEventListener('click', () => {
                likeFavorito.classList.toggle('favorited');

                const product = {
                    idProducto: producto.idProducto,
                    imagen: producto.imagen,
                    nombre: producto.nombreProducto,
                    descripcionProducto: producto.descripcion,
                    descripcionCategoria: producto.categoria ? producto.categoria.descripcion : 'Sin categoría',
                    preciotitulo: 'Precio por Hora (USD $$)',
                    precio: producto.categoria ? producto.precioHora : "Precio sin definir",
                };
                
                if (likeFavorito.classList.contains('favorited')) {
                    addToFavorites(product);
                } else {
                    removeFromFavorites(product.idProducto);
                }
            });
        }else{
            productoDiv.appendChild(imagen);
            productoDiv.appendChild(nombre);
            productoDiv.appendChild(descripcionProducto);
            productoDiv.appendChild(descripcionCategoria);
            productoDiv.appendChild(preciotitulo);
            productoDiv.appendChild(precio);
            productoDiv.appendChild(verMasLink);
            showProductos.appendChild(productoDiv);
        }
    });
}

function addToFavorites(product) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const exists = favorites.some(fav => fav.idProducto === product.idProducto);
    if (!exists) {
        favorites.push(product);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

function removeFromFavorites(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.idProducto !== productId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}
