package com.isturgi.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "torneos")
public class Torneo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("Nombre")
    private String nombre;

    @JsonProperty("Edicion")
    private String edicion;

    @JsonProperty("FechaInicio")
    private String fechaInicio;

    @JsonProperty("FechaFin")
    private String fechaFin;

    @JsonProperty("Estado")
    private String estado;

    @JsonProperty("Categoria")
    private String categoria;

    @JsonProperty("Descripcion")
    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @JsonProperty("Descripcion_breve")
    @Column(columnDefinition = "TEXT")
    private String descripcionBreve;

    @JsonProperty("Cartel")
    private String cartel; // URL of the image

    @JsonProperty("Modalidad")
    private String modalidad;

    @JsonProperty("TipoParticipacion")
    private String tipoParticipacion;

    @JsonProperty("NivelRequerido")
    private String nivelRequerido;

    @JsonProperty("Participantes")
    private String participantes;

    @JsonProperty("Premios")
    private String premios;

    @JsonProperty("Patrocinador")
    private String patrocinador;

    @JsonProperty("Puntuable")
    private boolean puntuable;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
