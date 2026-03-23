const fs = require('fs');
const path = require('path');

const modelsPath = path.join(__dirname, 'spring-backend/src/main/java/com/isturgi/backend/models');

const entities = [
  {
    name: 'Jugador.java',
    content: `package com.isturgi.backend.models;

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
`
  },
  {
    name: 'Division.java',
    content: `package com.isturgi.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "divisiones")
public class Division {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("Nombre")
    private String nombre;

    @ManyToOne
    @JoinColumn(name = "temporada_id")
    @JsonProperty("temporada")
    private Temporada temporada;

    @JsonIgnore
    @OneToMany(mappedBy = "division")
    private List<Jugador> jugadores;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
`
  },
  {
    name: 'Temporada.java',
    content: `package com.isturgi.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "temporadas")
public class Temporada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("Nombre")
    private String nombre;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
`
  },
  {
    name: 'Jornada.java',
    content: `package com.isturgi.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

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

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
`
  },
  {
    name: 'Noticia.java',
    content: `package com.isturgi.backend.models;

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

    @JsonProperty("Contenido")
    @Column(columnDefinition = "TEXT")
    private String contenido;

    @JsonProperty("FechaPublicacion")
    private String fechaPublicacion;

    @JsonProperty("Imagen")
    private String imagen; // URL of the image

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
`
  },
  {
    name: 'Torneo.java',
    content: `package com.isturgi.backend.models;

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

    @JsonProperty("Cartel")
    private String cartel; // URL of the image

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
`
  }
];

entities.forEach(entity => {
  fs.writeFileSync(path.join(modelsPath, entity.name), entity.content);
});

console.log('Entities created successfully!');
