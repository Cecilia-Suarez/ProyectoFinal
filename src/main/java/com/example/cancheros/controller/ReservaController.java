package com.example.cancheros.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cancheros.entity.Reserva;
import com.example.cancheros.service.impl.ProductoServiceImpl;
import com.example.cancheros.service.impl.ReservaServiceImpl;
import com.example.cancheros.service.impl.UsuarioServiceImpl;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/reservas")
public class ReservaController {

    ReservaServiceImpl reservaService;
    UsuarioServiceImpl usuarioService;
    ProductoServiceImpl productoService;

    @Autowired
    public ReservaController(ReservaServiceImpl reservaService, UsuarioServiceImpl usuarioService, ProductoServiceImpl productoService) {
        this.reservaService = reservaService;
        this.usuarioService = usuarioService;
        this.productoService = productoService;
    }

    @PostMapping("/new")
    public ResponseEntity<?> guardar(@RequestBody Reserva reserva) {
        try {
            reservaService.guardar(reserva);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar la reserva: " + e.getMessage());
        }
    }

    @GetMapping("/listarReservas/{idUsuario}")
    public List<Reserva> obtenerReservasPorUsuario(@PathVariable Long idUsuario) {
        return reservaService.listarReservasPorUsuario(idUsuario);
    }
}
