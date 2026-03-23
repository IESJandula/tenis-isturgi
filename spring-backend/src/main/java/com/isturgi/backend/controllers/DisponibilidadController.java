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
    @GetMapping public ResponseEntity<Map<String, Object>> getAll() { return ResponseEntity.ok(ApiResponse.of(repository.findAll())); }
    @PostMapping public ResponseEntity<Map<String, Object>> create(@RequestBody Disponibilidad item) { return ResponseEntity.ok(ApiResponse.of(repository.save(item))); }
    @PutMapping("/{id}") public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Disponibilidad item) { item.setId(id); return ResponseEntity.ok(ApiResponse.of(repository.save(item))); }
}
