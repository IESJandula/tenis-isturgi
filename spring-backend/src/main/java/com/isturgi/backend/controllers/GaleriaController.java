package com.isturgi.backend.controllers;

import com.isturgi.backend.models.Galeria;
import com.isturgi.backend.repositories.GaleriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/galeria")
public class GaleriaController {

    @Autowired
    private GaleriaRepository repository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        List<Galeria> list = repository.findAll();
        return ResponseEntity.ok(ApiResponse.of(list));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Galeria item) {
        Galeria saved = repository.save(item);
        return ResponseEntity.ok(ApiResponse.of(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Galeria item) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        item.setId(id);
        Galeria updated = repository.save(item);
        return ResponseEntity.ok(ApiResponse.of(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
