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
    @PutMapping("/{id}") public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Partido item) { item.setId(id); return ResponseEntity.ok(ApiResponse.of(repository.save(item))); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) { repository.deleteById(id); return ResponseEntity.ok().build(); }
}
