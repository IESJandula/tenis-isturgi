package com.isturgi.backend.controllers;

import com.isturgi.backend.models.Torneo;
import com.isturgi.backend.models.Jugador;
import com.isturgi.backend.models.TorneoInscripcion;
import com.isturgi.backend.repositories.TorneoRepository;
import com.isturgi.backend.repositories.JugadorRepository;
import com.isturgi.backend.repositories.TorneoInscripcionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.List;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/api/torneo-inscripciones")
public class TorneoInscripcionController {
    @Autowired private TorneoInscripcionRepository repository;
    @Autowired private TorneoRepository torneoRepository;
    @Autowired private JugadorRepository jugadorRepository;

    @GetMapping("/todo")
    public ResponseEntity<Map<String, Object>> getAll() {
        return ResponseEntity.ok(ApiResponse.of(repository.findAll()));
    }

    @GetMapping("/torneo/{torneoId}")
    public ResponseEntity<Map<String, Object>> getByTorneo(@PathVariable Long torneoId) {
        return ResponseEntity.ok(ApiResponse.of(repository.findByTorneo_Id(torneoId)));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> inscribir(@RequestBody Map<String, Long> payload) {
        Long torneoId = payload.get("torneoId");
        Long jugadorId = payload.get("jugadorId");

        if (torneoId == null || jugadorId == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Faltan IDs");
        }

        if (repository.existsByTorneo_IdAndJugador_Id(torneoId, jugadorId)) {
            throw new ResponseStatusException(CONFLICT, "Ya estás inscrito en este torneo");
        }

        Torneo torneo = torneoRepository.findById(torneoId).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Torneo no encontrado"));
        Jugador jugador = jugadorRepository.findById(jugadorId).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Jugador no encontrado"));

        TorneoInscripcion inscripcion = new TorneoInscripcion();
        inscripcion.setTorneo(torneo);
        inscripcion.setJugador(jugador);

        return ResponseEntity.ok(ApiResponse.of(repository.save(inscripcion)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
