package com.isturgi.backend.controllers;
import com.isturgi.backend.models.Partido;
import com.isturgi.backend.dto.PartidoResultadoRequest;
import com.isturgi.backend.repositories.PartidoRepository;
import com.isturgi.backend.services.ClasificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/api/partidos")
@CrossOrigin(origins = "*")
public class PartidoController {
    @Autowired private PartidoRepository repository;
    @Autowired private ClasificacionService clasificacionService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(name = "jugadorId", required = false) Long jugadorId) {
        if (jugadorId != null) {
            return ResponseEntity.ok(ApiResponse.of(repository.findByJugador1_IdOrJugador2_Id(jugadorId, jugadorId)));
        }
        return ResponseEntity.ok(ApiResponse.of(repository.findAll()));
    }
    @PostMapping public ResponseEntity<Map<String, Object>> create(@RequestBody Partido item) { return ResponseEntity.ok(ApiResponse.of(repository.save(item))); }

    @PutMapping("/{id}/resultado")
    public ResponseEntity<Map<String, Object>> guardarResultado(@PathVariable Long id, @RequestBody PartidoResultadoRequest body) {
        Partido partido = repository.findById(id).orElseThrow(() -> new ResponseStatusException(NOT_FOUND));

        if (body == null || body.getResultado() == null || body.getResultado().isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Falta 'resultado'");
        }

        String resultado = body.getResultado().trim();
        ResultadoParsed parsed = ResultadoParsed.from(resultado);

        partido.setResultado(resultado);
        partido.setEstado("Jugado");
        partido.setSetsFavor(parsed.j1Sets);
        partido.setSetsContra(parsed.j2Sets);
        partido.setJuegosFavor(parsed.j1Games);
        partido.setJuegosContra(parsed.j2Games);

        if (partido.getJugador1() != null && partido.getJugador2() != null) {
            if (parsed.j1Sets > parsed.j2Sets) partido.setGanador(partido.getJugador1());
            else if (parsed.j2Sets > parsed.j1Sets) partido.setGanador(partido.getJugador2());
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null && !auth.getName().isBlank() && !"anonymousUser".equals(auth.getName())) {
            partido.setJugadorQueGuardo(auth.getName());
        }

        partido.setUpdatedAt(LocalDateTime.now());

        Partido saved = repository.save(partido);

        if (saved.getJornada() != null && saved.getJornada().getDivision() != null && saved.getJornada().getDivision().getId() != null) {
            clasificacionService.recomputeDivision(saved.getJornada().getDivision().getId());
        }

        return ResponseEntity.ok(ApiResponse.of(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Partido patch) {
        Partido existing = repository.findById(id).orElseThrow(() -> new ResponseStatusException(NOT_FOUND));

        if (patch.getJugador1() != null) existing.setJugador1(patch.getJugador1());
        if (patch.getJugador2() != null) existing.setJugador2(patch.getJugador2());
        if (patch.getGanador() != null) existing.setGanador(patch.getGanador());
        if (patch.getJornada() != null) existing.setJornada(patch.getJornada());

        if (patch.getFecha() != null) existing.setFecha(patch.getFecha());
        if (patch.getHora() != null) existing.setHora(patch.getHora());
        if (patch.getPista() != null) existing.setPista(patch.getPista());
        if (patch.getEstado() != null) existing.setEstado(patch.getEstado());
        if (patch.getResultado() != null) existing.setResultado(patch.getResultado());
        if (patch.getSetsFavor() != null) existing.setSetsFavor(patch.getSetsFavor());
        if (patch.getSetsContra() != null) existing.setSetsContra(patch.getSetsContra());
        if (patch.getJuegosFavor() != null) existing.setJuegosFavor(patch.getJuegosFavor());
        if (patch.getJuegosContra() != null) existing.setJuegosContra(patch.getJuegosContra());
        if (patch.getJugadorQueGuardo() != null) existing.setJugadorQueGuardo(patch.getJugadorQueGuardo());

        existing.setUpdatedAt(LocalDateTime.now());
        Partido updated = repository.save(existing);
        return ResponseEntity.ok(ApiResponse.of(updated));
    }

    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) { repository.deleteById(id); return ResponseEntity.ok().build(); }

    private static class ResultadoParsed {
        final int j1Sets;
        final int j2Sets;
        final int j1Games;
        final int j2Games;

        private ResultadoParsed(int j1Sets, int j2Sets, int j1Games, int j2Games) {
            this.j1Sets = j1Sets;
            this.j2Sets = j2Sets;
            this.j1Games = j1Games;
            this.j2Games = j2Games;
        }

        static ResultadoParsed from(String resultado) {
            int j1Sets = 0;
            int j2Sets = 0;
            int j1Games = 0;
            int j2Games = 0;

            if (resultado == null) return new ResultadoParsed(0, 0, 0, 0);
            String[] sets = resultado.split(",");
            for (String set : sets) {
                String trimmed = set.trim();
                if (trimmed.isBlank()) continue;
                String[] parts = trimmed.split("-");
                if (parts.length != 2) continue;
                try {
                    int a = Integer.parseInt(parts[0].trim());
                    int b = Integer.parseInt(parts[1].trim());
                    j1Games += a;
                    j2Games += b;
                    if (a > b) j1Sets += 1;
                    else if (b > a) j2Sets += 1;
                } catch (NumberFormatException ignored) {
                    // ignore malformed
                }
            }

            return new ResultadoParsed(j1Sets, j2Sets, j1Games, j2Games);
        }
    }
}
