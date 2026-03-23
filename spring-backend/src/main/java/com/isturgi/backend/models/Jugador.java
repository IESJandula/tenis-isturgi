package com.isturgi.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "jugadores")
public class Jugador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("Nombre")
    private String nombre;

    @JsonProperty("Apellidos")
    private String apellidos;

    @JsonProperty("Telefono")
    private String telefono;

    @JsonProperty("Email")
    private String email;

    @JsonProperty("Foto")
    private String foto; // URL of the photo

    @JsonProperty("Nivel")
    private String nivel; // Iniciado, Medio, Avanzado, Pro

    @JsonProperty("Categoria")
    private String categoria; // Absoluto, Juvenil, Veterano...

    @JsonProperty("FechaNacimiento")
    private String fechaNacimiento;

    @JsonProperty("NumeroSocio")
    private String numeroSocio;

    @JsonProperty("Puntos")
    private Integer puntos = 0;

    // Relación simple guardando el ID del usuario de Firebase
    @JsonProperty("firebaseUid")
    private String firebaseUid;

    @ManyToOne
    @JoinColumn(name = "division_id")
    @JsonProperty("division")
    private Division division;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
