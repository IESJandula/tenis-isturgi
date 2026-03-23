package com.isturgi.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

import java.util.List;

@Data
@Entity
@Table(name = "jornadas")
public class Jornada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("Nombre")
    private String nombre;

    @JsonProperty("Numero")
    private Integer numero;

    @ManyToOne
    @JoinColumn(name = "division_id")
    @JsonProperty("division")
    private Division division;

    @OneToMany(mappedBy = "jornada", fetch = FetchType.EAGER)
    @JsonProperty("partidos")
    private List<Partido> partidos;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
