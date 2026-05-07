package com.isturgi.backend.repositories;

import com.isturgi.backend.models.TorneoInscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TorneoInscripcionRepository extends JpaRepository<TorneoInscripcion, Long> {
    List<TorneoInscripcion> findByTorneo_Id(Long torneoId);
    List<TorneoInscripcion> findByJugador_Id(Long jugadorId);
    boolean existsByTorneo_IdAndJugador_Id(Long torneoId, Long jugadorId);
}
