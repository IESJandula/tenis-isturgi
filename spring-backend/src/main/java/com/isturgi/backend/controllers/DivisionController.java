package com.isturgi.backend.controllers;

import com.isturgi.backend.models.Division;
import com.isturgi.backend.repositories.DivisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/divisions")
@CrossOrigin(origins = "*") // Allow Vue frontend during development
public class DivisionController {

    @Autowired
    private DivisionRepository repository;

    @Autowired
    private com.isturgi.backend.services.LeagueService leagueService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        List<Division> list = repository.findAll();
        return ResponseEntity.ok(ApiResponse.of(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        return repository.findById(id)
                .map(item -> ResponseEntity.ok(ApiResponse.of(item)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Division item) {
        Division saved = repository.save(item);
        return ResponseEntity.ok(ApiResponse.of(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Division item) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        item.setId(id);
        Division updated = repository.save(item);
        return ResponseEntity.ok(ApiResponse.of(updated));
    }

    @PostMapping("/{id}/generar-calendario")
    public ResponseEntity<Map<String, Object>> generarCalendario(@PathVariable Long id) {
        Map<String, Object> result = leagueService.generarCalendarioBerger(id);
        if (result.containsKey("error")) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
