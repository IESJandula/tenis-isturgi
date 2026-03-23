package com.isturgi.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "noticias")
public class Noticia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("Titulo")
    private String titulo;

    @JsonProperty("Descripcion")
    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @JsonProperty("Resumen")
    @Column(columnDefinition = "TEXT")
    private String resumen;

    @JsonProperty("Fecha")
    private String fecha;

    @JsonProperty("Imagen")
    private String imagen; // URL of the image

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
