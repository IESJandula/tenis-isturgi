package com.isturgi.backend.controllers;

import com.isturgi.backend.models.Jornada;
import com.isturgi.backend.models.Partido;
import com.isturgi.backend.repositories.JornadaRepository;
import com.isturgi.backend.repositories.PartidoRepository;
import com.isturgi.backend.services.ClasificacionService;
import com.isturgi.backend.services.LeagueService;
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
public class JornadaController {

    @Autowired
    private JornadaRepository repository;

    @Autowired
    private PartidoRepository partidoRepository;

    @Autowired
    private LeagueService leagueService;

    @Autowired
    private ClasificacionService clasificacionService;

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
            List<Partido> partidos = partidoRepository.findByJornadaIdOrderByIdAsc(j.getId());
            long jugados = partidos.stream().filter(p -> "Jugado".equalsIgnoreCase(p.getEstado())).count();
            long aplazados = partidos.stream().filter(p -> "Aplazado".equalsIgnoreCase(p.getEstado())).count();
            long abiertos = partidos.size() - jugados - aplazados;
            boolean cerrada = !partidos.isEmpty() && abiertos == 0;

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", j.getId());
            item.put("Nombre", j.getNombre());
            item.put("Numero", j.getNumero());
            item.put("division", j.getDivision());
            item.put("cerrada", cerrada);
            item.put("totalPartidos", partidos.size());
            item.put("jugados", jugados);
            item.put("aplazados", aplazados);
            item.put("abiertos", abiertos);
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
        Map<String, Object> result = leagueService.programarPartidosJornada(id);
        if (result.containsKey("error")) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(ApiResponse.of(result));
    }

    @PostMapping("/{id}/close")
    public ResponseEntity<Map<String, Object>> close(@PathVariable Long id) {
        Jornada jornada = repository.findById(id).orElse(null);
        if (jornada == null) {
            return ResponseEntity.notFound().build();
        }

        List<Partido> partidos = partidoRepository.findByJornadaIdOrderByIdAsc(id);
        if (partidos.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No hay partidos en esta jornada"));
        }

        long jugados = partidos.stream().filter(p -> "Jugado".equalsIgnoreCase(p.getEstado())).count();
        long aplazados = partidos.stream().filter(p -> "Aplazado".equalsIgnoreCase(p.getEstado())).count();
        long abiertos = partidos.size() - jugados - aplazados;

        if (abiertos > 0) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "No se puede cerrar la jornada: hay partidos pendientes o solo programados",
                    "abiertos", abiertos,
                    "jugados", jugados,
                    "aplazados", aplazados,
                    "total", partidos.size()
            ));
        }

        Long divisionId = jornada.getDivision() != null ? jornada.getDivision().getId() : null;
        if (divisionId != null) {
            clasificacionService.recomputeDivision(divisionId);
        }

        Map<String, Object> nextJornada = null;
        if (divisionId != null && jornada.getNumero() != null) {
            List<Jornada> jornadasDivision = repository.findByDivisionIdOrderByNumeroAsc(divisionId);
            Jornada siguiente = jornadasDivision.stream()
                    .filter(j -> j.getNumero() != null && j.getNumero() > jornada.getNumero())
                    .findFirst()
                    .orElse(null);

            if (siguiente != null) {
                nextJornada = new LinkedHashMap<>();
                nextJornada.put("id", siguiente.getId());
                nextJornada.put("nombre", siguiente.getNombre());
                nextJornada.put("numero", siguiente.getNumero());
            }
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("message", "Jornada cerrada correctamente. Clasificacion actualizada.");
        result.put("jornadaId", jornada.getId());
        result.put("total", partidos.size());
        result.put("jugados", jugados);
        result.put("aplazados", aplazados);
        result.put("nextJornada", nextJornada);

        return ResponseEntity.ok(ApiResponse.of(result));
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
