package com.example.cancheros.repository;

import com.example.cancheros.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ICategoriaRepository extends JpaRepository<Categoria,Long> {
    //List<Categoria> findAllCategoriaOrdered();
}
