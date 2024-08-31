package com.example.cancheros.service.impl;

import com.example.cancheros.entity.Producto;
import com.example.cancheros.entity.Reserva;
import com.example.cancheros.exceptions.ResourceNotFoundException;
import com.example.cancheros.repository.IProductoRepository;
import com.example.cancheros.repository.IReservaRepository;
import com.example.cancheros.service.IProductoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class ProductoServiceImpl implements IProductoService {
    private IProductoRepository repository;
    private IReservaRepository reservaRepository;

    private static final Logger LOGGER =  Logger.getLogger(ProductoServiceImpl.class);

    @Autowired
    ObjectMapper mapper;

    @Autowired
    public ProductoServiceImpl(IProductoRepository repository, IReservaRepository reservaRepository) {
        this.repository = repository;
        this.reservaRepository = reservaRepository;
    }

    @Override
    public void guardar(Producto producto) throws Exception {
        try {
            List<Producto> productosExistentes = repository.findAll();
            for (Producto prod : productosExistentes) {
                if (prod.getNombreProducto().equals(producto.getNombreProducto())){
                    throw new Exception("Ya existe un producto con ese nombre: " + producto.getNombreProducto());
                }
            }
            repository.save(producto);
            LOGGER.info("Producto guardado con exito.");
        } catch (Exception e) {
            LOGGER.error(e);
            throw new Exception(e);
        }
    }

    @Override
    public List<Producto> listarTodos() {
        LOGGER.info("Listando todos los productos.");
        List<Producto> productos = repository.findAll();
        return productos;
    }

    @Override
    public Producto buscar(Long id) throws ResourceNotFoundException {
        LOGGER.info("Buscando Producto con el ID: " + id);
        Optional<Producto> producto = repository.findById(id);
        if (!producto.isPresent()){
            throw new ResourceNotFoundException("No existe el producto solicitado: " + id);
        }
        LOGGER.info("Producto encontrado.");
        return mapper.convertValue(producto, Producto.class);
    }

    @Override
    public void eliminar(Long id) {
        LOGGER.info("Eliminando producto: " + id);
        try {
            if (buscar(id) == null){
                throw new Exception("No existe el producto que intenta eliminar: " + id);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        repository.deleteById(id);
        LOGGER.info("Producto eliminado con éxito: " + id);
    }

    @Override
    public void actualizar(Producto producto) throws ResourceNotFoundException {
        LOGGER.info("Actualizando el producto con id: " + producto.getIdProducto());
        Producto productoExistente = buscar(producto.getIdProducto());

        if (productoExistente == null) {
            throw new ResourceNotFoundException("No existe el producto que intenta actualizar: " + producto.getIdProducto());
        }
        repository.save(producto);
        LOGGER.info("El producto fue actualizado con exito");
    }

    @Override
    public List<Producto> listarPorCategoria(Long idCategoria){
        LOGGER.info("Buscando productos por la categoría con ID: " + idCategoria);
        List<Producto> productos = repository.findByCategoria_IdCategoria(idCategoria);
        if (productos.isEmpty()) {
            LOGGER.warn("No se encontraron productos para la categoría con ID: " + idCategoria);
        } else {
            LOGGER.info("Productos encontrados para la categoría con ID: " + idCategoria);
        }
        return productos;
    }

    @Override
    public List<Reserva> listarReservasPorIdProducto(Long idProducto) {
        //Obtenemos el producto por su id
        Optional<Producto> producto = repository.findById(idProducto);

        //Retornamos las reservas asociadas a ese producto
        mapper.convertValue(producto, Producto.class);
        return producto.get().getReservas();
    }

    @Override
    public List<Producto> listarProductosDisponibles(LocalDate fecha, LocalTime hora) {
        //Buscar todas las reservas que coincidan con la fecha y hora que buscamos
        List<Reserva> reservasCoincidientes = reservaRepository.buscarReservasPorFechaYHora(fecha, hora);

        //Extraemos los id de esos productos reservados con las fechas que coinciden
        Set<Long> idProductosReservados = reservasCoincidientes.stream()
                .map(reservation -> reservation.getProducto().getIdProducto())
                .collect(Collectors.toSet());

        // Obtener todos los productos
        List<Producto> todosLosProductos = repository.findAll();

        // Filtrar los productos que no están reservados
        return todosLosProductos.stream()
                .filter(producto -> !idProductosReservados.contains(producto.getIdProducto()))
                .collect(Collectors.toList());
    }


}
