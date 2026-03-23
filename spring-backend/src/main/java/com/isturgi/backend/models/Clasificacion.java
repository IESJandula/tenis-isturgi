package com.isturgi.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "clasificacions")
public class Clasificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "jugador_id")
    @JsonProperty("jugador")
    private Jugador jugador;

    @ManyToOne
    @JoinColumn(name = "division_id")
    @JsonProperty("division")
    private Division division;

    @JsonProperty("puntos")
    private Integer puntos = 0;

    @JsonProperty("jugados")
    private Integer jugados = 0;

    @JsonProperty("ganados")
    private Integer ganados = 0;

    @JsonProperty("perdidos")
    private Integer perdidos = 0;

    @JsonProperty("setsFavor")
    private Integer setsFavor = 0;

    @JsonProperty("setsContra")
    private Integer setsContra = 0;

    @JsonProperty("juegosFavor")
    private Integer juegosFavor = 0;

    @JsonProperty("juegosContra")
    private Integer juegosContra = 0;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
