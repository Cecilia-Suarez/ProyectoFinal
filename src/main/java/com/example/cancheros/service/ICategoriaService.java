package com.example.cancheros.service;

import com.example.cancheros.entity.Categoria;
import com.example.cancheros.entity.Producto;
import com.example.cancheros.exceptions.ResourceNotFoundException;

import java.util.List;

public interface ICategoriaService {
    void guardar (Categoria categoria) throws Exception;
    List<Categoria> listarTodos();
    Categoria buscar(Long id) throws ResourceNotFoundException;
    void eliminar (Long id);
    void actualizar (Categoria categoria) throws ResourceNotFoundException;

}
