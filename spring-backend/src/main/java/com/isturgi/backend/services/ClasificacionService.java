package com.isturgi.backend.services;

import com.isturgi.backend.models.Clasificacion;
import com.isturgi.backend.models.Division;
import com.isturgi.backend.models.Jugador;
import com.isturgi.backend.models.Partido;
import com.isturgi.backend.repositories.ClasificacionRepository;
import com.isturgi.backend.repositories.DivisionRepository;
import com.isturgi.backend.repositories.JugadorRepository;
import com.isturgi.backend.repositories.PartidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ClasificacionService {

    private static final int PUNTOS_VICTORIA = 3;
    private static final int PUNTOS_DERROTA = 0;

    @Autowired
    private PartidoRepository partidoRepository;

    @Autowired
    private ClasificacionRepository clasificacionRepository;

    @Autowired
    private JugadorRepository jugadorRepository;

    @Autowired
    private DivisionRepository divisionRepository;

    private static class Stats {
        int puntos;
        int jugados;
        int ganados;
        int perdidos;
        int setsFavor;
        int setsContra;
        int juegosFavor;
        int juegosContra;
    }

    private static class ParsedResultado {
        int j1Sets;
        int j2Sets;
        int j1Games;
        int j2Games;
    }

    private ParsedResultado parseResultado(String resultado) {
        ParsedResultado parsed = new ParsedResultado();
        if (resultado == null || resultado.isBlank()) return parsed;

        String[] sets = resultado.split(",");
        for (String set : sets) {
            String trimmed = set.trim();
            if (trimmed.isBlank()) continue;

            String[] parts = trimmed.split("-");
            if (parts.length != 2) continue;

            try {
                int a = Integer.parseInt(parts[0].trim());
                int b = Integer.parseInt(parts[1].trim());
                parsed.j1Games += a;
                parsed.j2Games += b;
                if (a > b) parsed.j1Sets += 1;
                else if (b > a) parsed.j2Sets += 1;
            } catch (NumberFormatException ignored) {
                // skip malformed set
            }
        }
        return parsed;
    }

    public void recomputeDivision(Long divisionId) {
        if (divisionId == null) return;

        Optional<Division> divisionOpt = divisionRepository.findById(divisionId);
        if (divisionOpt.isEmpty()) return;
        Division division = divisionOpt.get();

        List<Partido> partidosJugados = partidoRepository.findByJornada_Division_IdAndEstadoIgnoreCase(divisionId, "Jugado");

        Map<Long, Stats> statsByJugadorId = new HashMap<>();

        for (Partido partido : partidosJugados) {
            if (partido.getJugador1() == null || partido.getJugador2() == null) continue;

            Long j1Id = partido.getJugador1().getId();
            Long j2Id = partido.getJugador2().getId();
            if (j1Id == null || j2Id == null) continue;

            ParsedResultado parsed;
            if (partido.getSetsFavor() != null || partido.getSetsContra() != null || partido.getJuegosFavor() != null || partido.getJuegosContra() != null) {
                parsed = new ParsedResultado();
                parsed.j1Sets = partido.getSetsFavor() != null ? partido.getSetsFavor() : 0;
                parsed.j2Sets = partido.getSetsContra() != null ? partido.getSetsContra() : 0;
                parsed.j1Games = partido.getJuegosFavor() != null ? partido.getJuegosFavor() : 0;
                parsed.j2Games = partido.getJuegosContra() != null ? partido.getJuegosContra() : 0;
            } else {
                parsed = parseResultado(partido.getResultado());
            }

            Stats s1 = statsByJugadorId.computeIfAbsent(j1Id, _k -> new Stats());
            Stats s2 = statsByJugadorId.computeIfAbsent(j2Id, _k -> new Stats());

            s1.jugados += 1;
            s2.jugados += 1;

            s1.setsFavor += parsed.j1Sets;
            s1.setsContra += parsed.j2Sets;
            s1.juegosFavor += parsed.j1Games;
            s1.juegosContra += parsed.j2Games;

            s2.setsFavor += parsed.j2Sets;
            s2.setsContra += parsed.j1Sets;
            s2.juegosFavor += parsed.j2Games;
            s2.juegosContra += parsed.j1Games;

            if (parsed.j1Sets > parsed.j2Sets) {
                s1.ganados += 1;
                s2.perdidos += 1;
                s1.puntos += PUNTOS_VICTORIA;
                s2.puntos += PUNTOS_DERROTA;
            } else if (parsed.j2Sets > parsed.j1Sets) {
                s2.ganados += 1;
                s1.perdidos += 1;
                s2.puntos += PUNTOS_VICTORIA;
                s1.puntos += PUNTOS_DERROTA;
            } else {
                // empate improbable en tenis; si pasa, no sumamos puntos
            }
        }

        for (Map.Entry<Long, Stats> entry : statsByJugadorId.entrySet()) {
            Long jugadorId = entry.getKey();
            Stats stats = entry.getValue();

            Optional<Jugador> jugadorOpt = jugadorRepository.findById(jugadorId);
            if (jugadorOpt.isEmpty()) continue;
            Jugador jugador = jugadorOpt.get();

            Clasificacion clasificacion = clasificacionRepository
                    .findByDivisionIdAndJugadorId(divisionId, jugadorId)
                    .orElseGet(Clasificacion::new);

            clasificacion.setDivision(division);
            clasificacion.setJugador(jugador);
            clasificacion.setPuntos(stats.puntos);
            clasificacion.setJugados(stats.jugados);
            clasificacion.setGanados(stats.ganados);
            clasificacion.setPerdidos(stats.perdidos);
            clasificacion.setSetsFavor(stats.setsFavor);
            clasificacion.setSetsContra(stats.setsContra);
            clasificacion.setJuegosFavor(stats.juegosFavor);
            clasificacion.setJuegosContra(stats.juegosContra);

            clasificacionRepository.save(clasificacion);
        }
    }
}
