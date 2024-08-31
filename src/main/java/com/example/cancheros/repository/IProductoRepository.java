package com.example.cancheros.repository;

import com.example.cancheros.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface IProductoRepository extends JpaRepository<Producto,Long> {
    //@Query("SELECT p from Producto p order by p.id desc")//selecciona los productos y los ordena por id en forma descendente
   // List<Producto> findAllProductoOrdered();
    List<Producto> findByCategoria_IdCategoria(Long idCategoria);
}
