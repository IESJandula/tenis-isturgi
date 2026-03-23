package com.isturgi.backend.services;

import com.isturgi.backend.models.*;
import com.isturgi.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class LeagueService {

    @Autowired
    private JugadorRepository jugadorRepository;

    @Autowired
    private JornadaRepository jornadaRepository;

    @Autowired
    private PartidoRepository partidoRepository;

    @Autowired
    private DivisionRepository divisionRepository;

    @Transactional
    public Map<String, Object> generarCalendarioBerger(Long divisionId) {
        Division division = divisionRepository.findById(divisionId).orElse(null);
        if (division == null) return Map.of("error", "Division no encontrada");

        List<Jugador> jugadores = jugadorRepository.findByDivisionId(divisionId);
        if (jugadores.size() < 2) return Map.of("error", "No hay suficientes jugadores");

        // Algoritmo Berger (Round Robin)
        int n = jugadores.size();
        boolean bye = false;
        if (n % 2 != 0) {
            n++;
            bye = true;
        }

        int numJornadas = n - 1;
        int partidosPorJornada = n / 2;

        List<Jugador> lista = new ArrayList<>(jugadores);
        if (bye) lista.add(null); // Representa jornada de descanso

        for (int j = 0; j < numJornadas; j++) {
            Jornada jornada = new Jornada();
            jornada.setNombre("Jornada " + (j + 1));
            jornada.setNumero(j + 1);
            jornada.setDivision(division);
            jornada = jornadaRepository.save(jornada);

            for (int p = 0; p < partidosPorJornada; p++) {
                Jugador j1 = lista.get(p);
                Jugador j2 = lista.get(n - 1 - p);

                if (j1 != null && j2 != null) {
                    Partido partido = new Partido();
                    partido.setJugador1(j1);
                    partido.setJugador2(j2);
                    partido.setJornada(jornada);
                    partido.setEstado("Pendiente");
                    partidoRepository.save(partido);
                }
            }

            // Rotación: el primero se queda fijo, el resto rota
            Jugador last = lista.remove(n - 1);
            lista.add(1, last);
        }

        return Map.of(
            "message", "Calendario generado con éxito",
            "jornadas", numJornadas,
            "partidos", (numJornadas * (n / 2))
        );
    }
}
