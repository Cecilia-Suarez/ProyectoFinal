package com.example.cancheros.entity;

import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
@Table( name = "Categoria")

public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCategoria;

    @Column(name = "Nombre", nullable = false)
    private  String nombre ;

    @Column(name = "Descripcion", nullable = false)
    private  String descripcion;

    @Lob //Anotacion para campos grandes (hasta 4GB)
    @Column(name = "Imagen", nullable = false, columnDefinition = "LONGTEXT")
    private String imagen;

}
