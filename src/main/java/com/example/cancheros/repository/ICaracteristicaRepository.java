package com.example.cancheros.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.cancheros.entity.Caracteristica;

@Repository
public interface ICaracteristicaRepository extends JpaRepository<Caracteristica,Long> {
}
