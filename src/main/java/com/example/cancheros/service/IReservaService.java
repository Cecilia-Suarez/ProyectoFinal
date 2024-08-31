package com.example.cancheros.service;

import com.example.cancheros.entity.Reserva;
import com.example.cancheros.exceptions.InternalServerErrorException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface IReservaService {
    ResponseEntity<Reserva> guardar(@RequestBody Reserva reserva) throws InternalServerErrorException;

    List<Reserva> listarTodos();

    Reserva buscar(Long id);

    void eliminar(Long id);

    void actualizar(Reserva reserva);

    List<Reserva> listarReservasPorUsuario(Long idUsuario);
}

