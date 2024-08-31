package com.example.cancheros.service;

import com.example.cancheros.entity.Producto;
import com.example.cancheros.entity.Reserva;
import com.example.cancheros.exceptions.ResourceNotFoundException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public interface IProductoService {
    void guardar (Producto producto)throws Exception;
    List<Producto> listarTodos();
    Producto buscar(Long id) throws ResourceNotFoundException ;
    void eliminar (Long id);
    void actualizar (Producto producto) throws ResourceNotFoundException;
    List<Producto> listarPorCategoria(Long idCategoria);
    List<Reserva> listarReservasPorIdProducto(Long idProducto);
    List<Producto> listarProductosDisponibles(LocalDate fecha, LocalTime hora);
}
