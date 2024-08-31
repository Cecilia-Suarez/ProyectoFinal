package com.example.cancheros.service.impl;

import java.util.List;
import java.util.Optional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.cancheros.entity.Categoria;
import com.example.cancheros.exceptions.ResourceNotFoundException;
import com.example.cancheros.repository.ICategoriaRepository;
import com.example.cancheros.service.ICategoriaService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class CategoriaServiceImpl implements ICategoriaService {

    private ICategoriaRepository repository;

    private static final Logger LOGGER = Logger.getLogger(CategoriaServiceImpl.class);

    @Autowired
    ObjectMapper mapper;

    @Autowired
    public CategoriaServiceImpl(ICategoriaRepository repository) {
        this.repository = repository;
    }

    @Override
    public void guardar(Categoria categoria) throws Exception{
        try {
            repository.save(categoria);
            LOGGER.info("Categoría guardado con éxito.");
        } catch (Exception e) {
            LOGGER.error(e);
            throw new Exception(e);
        }
    }

    @Override
    public List<Categoria> listarTodos() {
        LOGGER.info("Listando todas las categorías.");
        List<Categoria> categorias = repository.findAll();
        return categorias;
    }

    @Override
    public Categoria buscar (Long id) throws ResourceNotFoundException {
        LOGGER.info("Buscando categoria con el ID: " + id);
        Optional<Categoria> categoria = repository.findById(id);
        if (!categoria.isPresent()){
            throw new ResourceNotFoundException("No existe la categoria solicitado: " + id);
        }
        LOGGER.info("Categoria encontrado.");
        return mapper.convertValue(categoria, Categoria.class);
    }

    @Override
    public void eliminar(Long id) {
        LOGGER.info("Eliminando categoria: " + id);
        try {
            if (buscar(id) == null){
                throw new Exception("No existe la categoria que intenta eliminar: " + id);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        repository.deleteById(id);
        LOGGER.info("Categoria eliminada con éxito: " + id);
    }

    @Override
    public void actualizar(Categoria categoria) throws ResourceNotFoundException {
        LOGGER.info("Actualizando la categoria con id: " + categoria.getIdCategoria());
        if (buscar(categoria.getIdCategoria()) == null){
            throw new ResourceNotFoundException("No existe la categoria que intenta actualizar: " + categoria.getIdCategoria());
        }
        repository.save(categoria);
        LOGGER.info("La categoria fue actualizada con exito");
    }

}
