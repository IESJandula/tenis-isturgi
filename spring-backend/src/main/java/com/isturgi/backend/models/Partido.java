package com.isturgi.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "partidos")
public class Partido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "jugador1_id")
    @JsonProperty("jugador1")
    private Jugador jugador1;

    @ManyToOne
    @JoinColumn(name = "jugador2_id")
    @JsonProperty("jugador2")
    private Jugador jugador2;

    @ManyToOne
    @JoinColumn(name = "ganador_id")
    @JsonProperty("ganador")
    private Jugador ganador;

    @ManyToOne
    @JoinColumn(name = "jornada_id")
    @JsonIgnore
    private Jornada jornada;

    @JsonProperty("fecha")
    private String fecha;

    @JsonProperty("hora")
    private String hora;

    @JsonProperty("pista")
    private Integer pista;

    @JsonProperty("estado")
    private String estado;

    @JsonProperty("resultado")
    private String resultado;

    @JsonProperty("setsFavor")
    private Integer setsFavor;

    @JsonProperty("setsContra")
    private Integer setsContra;

    @JsonProperty("juegosFavor")
    private Integer juegosFavor;

    @JsonProperty("juegosContra")
    private Integer juegosContra;

    @JsonProperty("jugadorQueGuardo_id")
    private String jugadorQueGuardo;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
