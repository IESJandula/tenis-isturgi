package com.isturgi.backend.controllers;
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

    @PostMapping public ResponseEntity<Map<String, Object>> create(@RequestBody Disponibilidad item) { return ResponseEntity.ok(ApiResponse.of(repository.save(item))); }
    @PutMapping("/{id}") public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Disponibilidad item) { item.setId(id); return ResponseEntity.ok(ApiResponse.of(repository.save(item))); }
}
