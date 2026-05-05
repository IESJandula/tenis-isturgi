package com.isturgi.backend.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.isturgi.backend.models.*;
import com.isturgi.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class LeagueService {

    private static final List<String> DAY_ORDER = List.of("viernes", "sabado", "domingo");
    private static final List<String> HOUR_ORDER = List.of("09:00", "11:00", "16:00", "18:00");
    private static final int MAX_PISTAS_POR_FRANJA = 3;

    @Autowired
    private JugadorRepository jugadorRepository;

    @Autowired
    private DisponibilidadRepository disponibilidadRepository;

    @Autowired
    private JornadaRepository jornadaRepository;

    @Autowired
    private PartidoRepository partidoRepository;

    @Autowired
    private DivisionRepository divisionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private LocalDateTime calcularFechaLimiteDisponibilidad() {
        LocalDate today = LocalDate.now();
        int daysUntilWednesday = DayOfWeek.WEDNESDAY.getValue() - today.getDayOfWeek().getValue();
        if (daysUntilWednesday < 0) {
            daysUntilWednesday += 7;
        }

        return today.plusDays(daysUntilWednesday).atTime(23, 59, 0);
    }

    @Transactional
    public Map<String, Object> regenerarCalendarioBerger(Long divisionId) {
        Division division = divisionRepository.findById(divisionId).orElse(null);
        if (division == null) return Map.of("error", "Division no encontrada");

        List<Jornada> jornadas = jornadaRepository.findByDivisionId(divisionId);
        if (!jornadas.isEmpty()) {
            List<Long> jornadaIds = jornadas.stream().map(Jornada::getId).toList();
            disponibilidadRepository.deleteByJornadaIdIn(jornadaIds);
            partidoRepository.deleteByJornadaIdIn(jornadaIds);
            jornadaRepository.deleteByDivisionId(divisionId);
        }

        return generarCalendarioBerger(divisionId);
    }

    @Transactional
    public Map<String, Object> generarCalendarioBerger(Long divisionId) {
        Division division = divisionRepository.findById(divisionId).orElse(null);
        if (division == null) return Map.of("error", "Division no encontrada");

        long jornadasExistentes = jornadaRepository.countByDivisionId(divisionId);
        if (jornadasExistentes > 0) {
            return Map.of(
                "error", "Esta division ya tiene calendario generado.",
                "jornadasExistentes", jornadasExistentes
            );
        }

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

        int partidosCreados = 0;
        for (int j = 0; j < numJornadas; j++) {
            Jornada jornada = new Jornada();
            jornada.setNombre("Jornada " + (j + 1));
            jornada.setNumero(j + 1);
            jornada.setDivision(division);
            jornada.setFechaLimiteDisponibilidad(calcularFechaLimiteDisponibilidad().plusWeeks(j));
            jornada.setDisponibilidadCerrada(false);
            jornada = jornadaRepository.save(jornada);

            List<Partido> partidosDeJornada = new ArrayList<>();

            for (int p = 0; p < partidosPorJornada; p++) {
                Jugador j1 = lista.get(p);
                Jugador j2 = lista.get(n - 1 - p);

                if (j1 != null && j2 != null) {
                    Partido partido = new Partido();
                    partido.setJugador1(j1);
                    partido.setJugador2(j2);
                    partido.setJornada(jornada);
                    partido.setEstado("Pendiente");
                    partidosDeJornada.add(partido);
                }
            }

            if (!partidosDeJornada.isEmpty()) {
                partidoRepository.saveAll(partidosDeJornada);
                partidosCreados += partidosDeJornada.size();
            }

            // Rotación: el primero se queda fijo, el resto rota
            Jugador last = lista.remove(n - 1);
            lista.add(1, last);
        }

        return Map.of(
            "message", "Calendario generado con éxito",
            "jornadas", numJornadas,
            "partidos", partidosCreados
        );
    }

    @Transactional
    public Map<String, Object> programarPartidosJornada(Long jornadaId) {
        Jornada jornada = jornadaRepository.findById(jornadaId).orElse(null);
        if (jornada == null) {
            return Map.of("error", "Jornada no encontrada");
        }

        List<Partido> partidos = partidoRepository.findByJornadaIdOrderByIdAsc(jornadaId);
        if (partidos.isEmpty()) {
            return Map.of("error", "No hay partidos en esta jornada");
        }

        Map<Long, Set<String>> disponibilidadPorJugador = cargarDisponibilidadesDeJornada(jornadaId);
        List<Partido> partidosAProgramar = new ArrayList<>();

        for (Partido partido : partidos) {
            if (partido.getJugador1() == null || partido.getJugador2() == null) {
                continue;
            }
            if (partido.getEstado() != null && "Jugado".equalsIgnoreCase(partido.getEstado())) {
                continue;
            }
            partidosAProgramar.add(partido);
        }

        if (partidosAProgramar.isEmpty()) {
            return Map.of(
                    "message", "No hay partidos pendientes de programación",
                    "programados", 0,
                    "aplazados", 0
            );
        }

        Map<Partido, List<SlotCandidate>> candidatosPorPartido = new LinkedHashMap<>();
        for (Partido partido : partidosAProgramar) {
            Long jugador1Id = partido.getJugador1().getId();
            Long jugador2Id = partido.getJugador2().getId();
            Set<String> slotsJugador1 = disponibilidadPorJugador.getOrDefault(jugador1Id, Set.of());
            Set<String> slotsJugador2 = disponibilidadPorJugador.getOrDefault(jugador2Id, Set.of());
            candidatosPorPartido.put(partido, intersectarYOrdenarSlots(slotsJugador1, slotsJugador2));
        }

        List<Map.Entry<Partido, List<SlotCandidate>>> orden = new ArrayList<>(candidatosPorPartido.entrySet());
        orden.sort(Comparator.comparingInt(entry -> entry.getValue().size()));

        Map<String, Integer> ocupacionPorSlot = new HashMap<>();
        int programados = 0;
        int aplazados = 0;

        for (Map.Entry<Partido, List<SlotCandidate>> entry : orden) {
            Partido partido = entry.getKey();
            SlotCandidate slotElegido = null;

            for (SlotCandidate candidato : entry.getValue()) {
                int ocupacion = ocupacionPorSlot.getOrDefault(candidato.slotKey(), 0);
                if (ocupacion < MAX_PISTAS_POR_FRANJA) {
                    slotElegido = candidato;
                    break;
                }
            }

            partido.setUpdatedAt(LocalDateTime.now());

            if (slotElegido != null) {
                int pistaAsignada = ocupacionPorSlot.getOrDefault(slotElegido.slotKey(), 0) + 1;
                ocupacionPorSlot.put(slotElegido.slotKey(), pistaAsignada);

                partido.setFecha(slotElegido.fecha);
                partido.setHora(slotElegido.hora);
                partido.setPista(pistaAsignada);
                partido.setEstado("Programado");
                programados += 1;
            } else {
                partido.setFecha(null);
                partido.setHora(null);
                partido.setPista(null);
                partido.setEstado("Aplazado");
                aplazados += 1;
            }
        }

        partidoRepository.saveAll(partidosAProgramar);

        return Map.of(
                "message", "Programación completada",
                "jornadaId", jornadaId,
                "partidos", partidosAProgramar.size(),
                "programados", programados,
                "aplazados", aplazados,
                "slotsUtilizados", ocupacionPorSlot
        );
    }

    private Map<Long, Set<String>> cargarDisponibilidadesDeJornada(Long jornadaId) {
        List<Disponibilidad> disponibilidades = disponibilidadRepository.findByJornada_Id(jornadaId);
        Map<Long, Set<String>> slotsPorJugador = new HashMap<>();

        for (Disponibilidad disponibilidad : disponibilidades) {
            if (disponibilidad.getJugador() == null || disponibilidad.getJugador().getId() == null) {
                continue;
            }

            Map<String, Map<String, Boolean>> slots = parseSlots(disponibilidad.getSlots());
            Set<String> permitidos = new HashSet<>();

            for (Map.Entry<String, Map<String, Boolean>> dia : slots.entrySet()) {
                String normalizedDay = normalizarDia(dia.getKey());
                if (!DAY_ORDER.contains(normalizedDay)) {
                    continue;
                }

                Map<String, Boolean> horas = dia.getValue();
                if (horas == null) {
                    continue;
                }

                for (Map.Entry<String, Boolean> hora : horas.entrySet()) {
                    if (Boolean.TRUE.equals(hora.getValue()) && HOUR_ORDER.contains(hora.getKey())) {
                        permitidos.add(slotKey(normalizedDay, hora.getKey()));
                    }
                }
            }

            slotsPorJugador.put(disponibilidad.getJugador().getId(), permitidos);
        }

        return slotsPorJugador;
    }

    private List<SlotCandidate> intersectarYOrdenarSlots(Set<String> slotsJugador1, Set<String> slotsJugador2) {
        if (slotsJugador1.isEmpty() || slotsJugador2.isEmpty()) {
            return List.of();
        }

        List<SlotCandidate> candidatos = new ArrayList<>();
        for (String slot : slotsJugador1) {
            if (!slotsJugador2.contains(slot)) {
                continue;
            }

            String[] partes = slot.split("\\|");
            if (partes.length != 2) {
                continue;
            }

            String day = partes[0];
            String hora = partes[1];
            candidatos.add(new SlotCandidate(day, hora, fechaParaDia(day)));
        }

        candidatos.sort(Comparator
                .comparingInt((SlotCandidate slot) -> dayIndex(slot.day))
                .thenComparingInt(slot -> hourIndex(slot.hora)));

        return candidatos;
    }

    private Map<String, Map<String, Boolean>> parseSlots(String slotsJson) {
        if (slotsJson == null || slotsJson.isBlank()) {
            return Map.of();
        }

        try {
            return objectMapper.readValue(slotsJson, new TypeReference<Map<String, Map<String, Boolean>>>() {});
        } catch (Exception e) {
            try {
                // Compatibilidad con datos legacy donde el JSON se almacenó como string JSON
                // Ejemplo: "{\"sabado\":{\"16:00\":true}}"
                String decoded = objectMapper.readValue(slotsJson, String.class);
                if (decoded == null || decoded.isBlank()) {
                    return Map.of();
                }
                return objectMapper.readValue(decoded, new TypeReference<Map<String, Map<String, Boolean>>>() {});
            } catch (Exception ignored) {
                return Map.of();
            }
        }
    }

    private String fechaParaDia(String day) {
        DayOfWeek dayOfWeek;
        switch (day) {
            case "viernes" -> dayOfWeek = DayOfWeek.FRIDAY;
            case "sabado" -> dayOfWeek = DayOfWeek.SATURDAY;
            case "domingo" -> dayOfWeek = DayOfWeek.SUNDAY;
            default -> {
                return null;
            }
        }

        LocalDate today = LocalDate.now();
        int daysAhead = dayOfWeek.getValue() - today.getDayOfWeek().getValue();
        if (daysAhead <= 0) {
            daysAhead += 7;
        }

        return today.plusDays(daysAhead).format(DateTimeFormatter.ISO_LOCAL_DATE);
    }

    private String normalizarDia(String day) {
        if (day == null) {
            return "";
        }

        String normalized = Normalizer.normalize(day, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .trim()
                .toLowerCase(Locale.ROOT);

        return switch (normalized) {
            case "viernes" -> "viernes";
            case "sabado" -> "sabado";
            case "domingo" -> "domingo";
            default -> normalized;
        };
    }

    private String slotKey(String day, String hour) {
        return day + "|" + hour;
    }

    private int dayIndex(String day) {
        return DAY_ORDER.indexOf(day);
    }

    private int hourIndex(String hour) {
        return HOUR_ORDER.indexOf(hour);
    }

    private static class SlotCandidate {
        private final String day;
        private final String hora;
        private final String fecha;

        private SlotCandidate(String day, String hora, String fecha) {
            this.day = day;
            this.hora = hora;
            this.fecha = fecha;
        }

        private String slotKey() {
            return day + "|" + hora;
        }
    }
}
