package com.isturgi.backend.controllers;
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

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Partido existing = repository.findById(id).orElse(null);
        if (existing == null) return ResponseEntity.notFound().build();

        Object nestedData = payload.get("data");
        Map<String, Object> data = payload;
        if (nestedData instanceof Map) {
            data = (Map<String, Object>) nestedData;
        }

        if (data.containsKey("resultado")) {
            existing.setResultado((String) data.get("resultado"));
        }
        if (data.containsKey("estado")) {
            existing.setEstado((String) data.get("estado"));
        }
        if (data.containsKey("fecha")) {
            existing.setFecha((String) data.get("fecha"));
        }
        if (data.containsKey("hora")) {
            existing.setHora((String) data.get("hora"));
        }
        if (data.containsKey("pista") && data.get("pista") != null) {
            Object pista = data.get("pista");
            if (pista instanceof Number) {
                existing.setPista(((Number) pista).intValue());
            }
        }

        Partido updated = repository.save(existing);
        return ResponseEntity.ok(ApiResponse.of(updated));
    }

    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) { repository.deleteById(id); return ResponseEntity.ok().build(); }
}
