package com.isturgi.backend.controllers;

import com.isturgi.backend.models.Jornada;
import com.isturgi.backend.repositories.JornadaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jornadas")
@CrossOrigin(origins = "*") // Allow Vue frontend during development
public class JornadaController {

    @Autowired
    private JornadaRepository repository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        List<Jornada> list = repository.findAll();
        return ResponseEntity.ok(ApiResponse.of(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        return repository.findById(id)
                .map(item -> ResponseEntity.ok(ApiResponse.of(item)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Jornada item) {
        // En Strapi, Vue envía { data: { Nombre: "..." } } 
        // Para simplificar, asumimos que aquí adaptaremos Vue a enviar el JSON directo o extraemos "data"
        Jornada saved = repository.save(item);
        return ResponseEntity.ok(ApiResponse.of(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Jornada item) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        item.setId(id);
        Jornada updated = repository.save(item);
        return ResponseEntity.ok(ApiResponse.of(updated));
    }

    @PostMapping("/{id}/schedule")
    public ResponseEntity<Map<String, Object>> schedule(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.of(List.of("Algoritmo de horarios pronto disponible en Spring Boot...")));
    }

    @GetMapping("/division/{divisionId}/jornadas")
    public ResponseEntity<List<Jornada>> getByDivision(@PathVariable Long divisionId) {
        List<Jornada> list = repository.findByDivisionId(divisionId);
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
