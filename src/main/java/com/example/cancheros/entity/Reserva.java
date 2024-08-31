package com.example.cancheros.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "reserva")

public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idReserva;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    @Column(name = "Fecha")
    private LocalDate fecha;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    @Column(name = "Hora")
    private LocalTime hora;

    @Column(name = "Telefono", nullable = true)
    private Long telefono;

    public Long getTelefono() {
        return this.telefono;
    }

    public void setTelefono(Long telefono) {
        this.telefono = telefono;
    }

    @Column(name = "Indicaciones", nullable = true)
    private String indicaciones;

    public String getIndicaciones() {
        return this.indicaciones;
    }

    public String setIndicaciones() {
        return this.indicaciones;
    }

    //Muchas reservas tienen un producto.
    @ManyToOne
    @JoinColumn(name = "idProducto")
    private Producto producto;

    //Muchas reservas tienen un usuario.
    @ManyToOne
    @JoinColumn(name = "idUsuario")
    private MyUser usuario;

}
