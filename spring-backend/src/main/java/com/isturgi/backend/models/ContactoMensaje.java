package com.isturgi.backend.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "contacto_mensajes")
public class ContactoMensaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("nombre")
    private String nombre;

    @JsonProperty("email")
    private String email;

    @JsonProperty("telefono")
    private String telefono;

    @JsonProperty("asunto")
    private String asunto;

    @JsonProperty("mensaje")
    @Column(columnDefinition = "TEXT")
    private String mensaje;

    private LocalDateTime createdAt = LocalDateTime.now();
}
