package com.example.cancheros.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.cancheros.entity.MyUser;
import com.example.cancheros.entity.Reserva;



import java.time.LocalDate;
import java.time.LocalTime;


public interface IReservaRepository extends JpaRepository<Reserva, Long> {
    @Query("SELECT r FROM Reserva r WHERE r.fecha = :fecha AND r.hora = :hora")
    List<Reserva> buscarReservasPorFechaYHora(@Param("fecha") LocalDate fecha, @Param("hora") LocalTime hora);
    List<Reserva> findByUsuario(MyUser usuario);
    List<Reserva> findByUsuarioId(Long idUsuario);

}

