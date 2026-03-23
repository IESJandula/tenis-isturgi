package com.isturgi.backend.controllers;

import com.isturgi.backend.models.Torneo;
import com.isturgi.backend.repositories.TorneoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/torneos")
@CrossOrigin(origins = "*") // Allow Vue frontend during development
public class TorneoController {

    @Autowired
    private TorneoRepository repository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        List<Torneo> list = repository.findAll();
        return ResponseEntity.ok(ApiResponse.of(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        return repository.findById(id)
                .map(item -> ResponseEntity.ok(ApiResponse.of(item)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Torneo item) {
        // En Strapi, Vue envía { data: { Nombre: "..." } } 
        // Para simplificar, asumimos que aquí adaptaremos Vue a enviar el JSON directo o extraemos "data"
        Torneo saved = repository.save(item);
        return ResponseEntity.ok(ApiResponse.of(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Torneo item) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        item.setId(id);
        Torneo updated = repository.save(item);
        return ResponseEntity.ok(ApiResponse.of(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
