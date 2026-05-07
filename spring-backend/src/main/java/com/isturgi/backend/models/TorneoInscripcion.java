package com.isturgi.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "torneo_inscripciones")
public class TorneoInscripcion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "torneo_id")
    private Torneo torneo;

    @ManyToOne
    @JoinColumn(name = "jugador_id")
    private Jugador jugador;

    private LocalDateTime fechaInscripcion = LocalDateTime.now();
    
    private String estado = "Confirmada"; // Confirmada, Pendiente, Cancelada
}
