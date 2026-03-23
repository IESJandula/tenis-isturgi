package com.isturgi.backend.controllers;

import com.isturgi.backend.models.Jornada;
import com.isturgi.backend.models.Partido;
import com.isturgi.backend.repositories.JornadaRepository;
import com.isturgi.backend.repositories.PartidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Comparator;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jornadas")
@CrossOrigin(origins = "*") // Allow Vue frontend during development
public class JornadaController {

    @Autowired
    private JornadaRepository repository;

    @Autowired
    private PartidoRepository partidoRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(required = false) Long divisionId,
            @RequestParam(defaultValue = "200") int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 1000));
        Pageable pageable = PageRequest.of(0, safeLimit, Sort.by(Sort.Direction.DESC, "id"));

        List<Jornada> jornadas;
        if (divisionId != null) {
            jornadas = repository.findByDivisionIdOrderByIdDesc(divisionId, pageable);
        } else {
            jornadas = repository.findAll(pageable).getContent();
        }

        // Resumen ligero para evitar bloquear frontend al listar jornadas.
        List<Map<String, Object>> list = jornadas.stream().map(j -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", j.getId());
            item.put("Nombre", j.getNombre());
            item.put("Numero", j.getNumero());
            item.put("division", j.getDivision());
            return item;
        }).collect(Collectors.toList());
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
    public ResponseEntity<List<Jornada>> getByDivision(
            @PathVariable Long divisionId,
            @RequestParam(defaultValue = "100") int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 500));
        Pageable pageable = PageRequest.of(0, safeLimit, Sort.by(Sort.Direction.DESC, "id"));
        List<Jornada> recientes = repository.findByDivisionIdOrderByIdDesc(divisionId, pageable);

        // Si existen jornadas duplicadas por numero, nos quedamos con la mas reciente.
        Map<Integer, Jornada> porNumero = new LinkedHashMap<>();
        for (Jornada j : recientes) {
            Integer numero = j.getNumero() != null ? j.getNumero() : -1;
            porNumero.putIfAbsent(numero, j);
        }

        List<Jornada> list = new ArrayList<>(porNumero.values());
        list.sort(Comparator.comparing(Jornada::getNumero, Comparator.nullsLast(Integer::compareTo)));
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}/partidos")
    public ResponseEntity<List<Partido>> getPartidosByJornada(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        List<Partido> partidos = partidoRepository.findByJornadaIdOrderByIdAsc(id);
        return ResponseEntity.ok(partidos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
