package com.isturgi.backend.controllers;

import com.isturgi.backend.models.Clasificacion;
import com.isturgi.backend.repositories.ClasificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clasificacions")
public class ClasificacionController {

    @Autowired
    private ClasificacionRepository repository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(name = "filters[division][id]", required = false) Long divisionId,
            @RequestParam(name = "divisionId", required = false) Long altDivisionId) {
        
        Long id = divisionId != null ? divisionId : altDivisionId;
        
        List<Clasificacion> list;
        if (id != null) {
            list = repository.findByDivisionId(id);
        } else {
            list = repository.findAll();
        }
        
        return ResponseEntity.ok(ApiResponse.of(list));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Clasificacion item) {
        Clasificacion saved = repository.save(item);
        return ResponseEntity.ok(ApiResponse.of(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Clasificacion item) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        item.setId(id);
        Clasificacion updated = repository.save(item);
        return ResponseEntity.ok(ApiResponse.of(updated));
    }
}
