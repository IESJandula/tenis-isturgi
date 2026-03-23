package com.isturgi.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "disponibilidades")
public class Disponibilidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "jugador_id")
    @JsonProperty("jugador")
    private Jugador jugador;

    @ManyToOne
    @JoinColumn(name = "jornada_id")
    @JsonProperty("jornada")
    private Jornada jornada;

    @JsonProperty("slots")
    @Column(columnDefinition = "JSON")
    private String slots;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
