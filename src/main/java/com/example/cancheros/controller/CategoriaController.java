package com.example.cancheros.controller;

import com.example.cancheros.entity.Categoria;
import com.example.cancheros.entity.Producto;
import com.example.cancheros.exceptions.ResourceNotFoundException;
import com.example.cancheros.service.impl.CategoriaServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/categorias")
public class CategoriaController {
    private CategoriaServiceImpl categoriaService;

    @Autowired
    public CategoriaController(CategoriaServiceImpl categoriaService) {
        this.categoriaService = categoriaService;
    }

    @PostMapping("/new")
    public ResponseEntity<?> guardar(@RequestBody Categoria categoria)  {
        try {
            categoriaService.guardar(categoria);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/listarTodos")
    public List<Categoria> listarTodos() {
        return categoriaService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) throws ResourceNotFoundException {
        Categoria categoria = categoriaService.buscar(id);
        return new ResponseEntity<>(categoria, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        categoriaService.eliminar(id);
        return ResponseEntity.ok(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/update")
    public ResponseEntity<?> actualizar(@RequestBody Categoria categoria) throws ResourceNotFoundException {
        categoriaService.actualizar(categoria);
        return ResponseEntity.ok(HttpStatus.OK);
    }

}
