package com.isturgi.backend.controllers;
import com.isturgi.backend.models.Disponibilidad;
import com.isturgi.backend.models.Jornada;
import com.isturgi.backend.repositories.DisponibilidadRepository;
import com.isturgi.backend.repositories.JornadaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/disponibilidades")
public class DisponibilidadController {
    @Autowired private DisponibilidadRepository repository;
    @Autowired private JornadaRepository jornadaRepository;

    private Jornada validarJornadaAbierta(Disponibilidad item) {
        if (item == null || item.getJornada() == null || item.getJornada().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Falta la jornada");
        }

        Jornada jornada = jornadaRepository.findById(item.getJornada().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Jornada no encontrada"));

        LocalDateTime limite = jornada.getFechaLimiteDisponibilidad();
        if (Boolean.TRUE.equals(jornada.getDisponibilidadCerrada()) || (limite != null && LocalDateTime.now().isAfter(limite))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El plazo para marcar disponibilidad ha finalizado");
        }

        return jornada;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(name = "jugadorId", required = false) Long jugadorId,
            @RequestParam(name = "jornadaId", required = false) Long jornadaId) {

        List<Disponibilidad> list;
        if (jugadorId != null && jornadaId != null) {
            list = repository.findByJugador_IdAndJornada_Id(jugadorId, jornadaId)
                    .map(List::of)
                    .orElse(List.of());
        } else if (jugadorId != null) {
            list = repository.findByJugador_Id(jugadorId);
        } else if (jornadaId != null) {
            list = repository.findByJornada_Id(jornadaId);
        } else {
            list = repository.findAll();
        }

        return ResponseEntity.ok(ApiResponse.of(list));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Disponibilidad item) {
        validarJornadaAbierta(item);
        return ResponseEntity.ok(ApiResponse.of(repository.save(item)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Disponibilidad item) {
        validarJornadaAbierta(item);
        item.setId(id);
        return ResponseEntity.ok(ApiResponse.of(repository.save(item)));
    }
}