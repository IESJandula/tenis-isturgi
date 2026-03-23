const fs = require('fs');
const path = require('path');

const modelsPath = path.join(__dirname, 'spring-backend/src/main/java/com/isturgi/backend/models');
const reposPath = path.join(__dirname, 'spring-backend/src/main/java/com/isturgi/backend/repositories');
const controllersPath = path.join(__dirname, 'spring-backend/src/main/java/com/isturgi/backend/controllers');

const entity1 = \`package com.isturgi.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("jornada")
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
\`;

const entity2 = \`package com.isturgi.backend.models;

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
\`;

fs.writeFileSync(path.join(modelsPath, 'Partido.java'), entity1);
fs.writeFileSync(path.join(modelsPath, 'Disponibilidad.java'), entity2);

const rep1 = \`package com.isturgi.backend.repositories;
import com.isturgi.backend.models.Partido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PartidoRepository extends JpaRepository<Partido, Long> {
}
\`;
const rep2 = \`package com.isturgi.backend.repositories;
import com.isturgi.backend.models.Disponibilidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DisponibilidadRepository extends JpaRepository<Disponibilidad, Long> {
}
\`;

fs.writeFileSync(path.join(reposPath, 'PartidoRepository.java'), rep1);
fs.writeFileSync(path.join(reposPath, 'DisponibilidadRepository.java'), rep2);

const ctrl1 = \`package com.isturgi.backend.controllers;
import com.isturgi.backend.models.Partido;
import com.isturgi.backend.repositories.PartidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/partidos")
@CrossOrigin(origins = "*")
public class PartidoController {
    @Autowired private PartidoRepository repository;
    @GetMapping public ResponseEntity<Map<String, Object>> getAll() { return ResponseEntity.ok(ApiResponse.of(repository.findAll())); }
    @PostMapping public ResponseEntity<Map<String, Object>> create(@RequestBody Partido item) { return ResponseEntity.ok(ApiResponse.of(repository.save(item))); }
    @PutMapping("/{id}") public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Partido item) { item.setId(id); return ResponseEntity.ok(ApiResponse.of(repository.save(item))); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) { repository.deleteById(id); return ResponseEntity.ok().build(); }
}
\`;

const ctrl2 = \`package com.isturgi.backend.controllers;
import com.isturgi.backend.models.Disponibilidad;
import com.isturgi.backend.repositories.DisponibilidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/disponibilidades")
@CrossOrigin(origins = "*")
public class DisponibilidadController {
    @Autowired private DisponibilidadRepository repository;
    @GetMapping public ResponseEntity<Map<String, Object>> getAll() { return ResponseEntity.ok(ApiResponse.of(repository.findAll())); }
    @PostMapping public ResponseEntity<Map<String, Object>> create(@RequestBody Disponibilidad item) { return ResponseEntity.ok(ApiResponse.of(repository.save(item))); }
    @PutMapping("/{id}") public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Disponibilidad item) { item.setId(id); return ResponseEntity.ok(ApiResponse.of(repository.save(item))); }
}
\`;

fs.writeFileSync(path.join(controllersPath, 'PartidoController.java'), ctrl1);
fs.writeFileSync(path.join(controllersPath, 'DisponibilidadController.java'), ctrl2);

console.log('Missed entities added');
