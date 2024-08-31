package com.example.cancheros.entity;

import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table( name = "Caracteristica")

public class Caracteristica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCaracteristica;

    @Column(name = "Nombre", nullable = false)
    private String nombre;

    @Lob //Anotacion para campos grandes (hasta 4GB)
    @Column(name = "Imagen", nullable = false, columnDefinition = "LONGTEXT")
    private String imagen;
}
