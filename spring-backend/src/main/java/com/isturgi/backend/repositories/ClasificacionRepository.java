package com.isturgi.backend.repositories;

import com.isturgi.backend.models.Clasificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ClasificacionRepository extends JpaRepository<Clasificacion, Long> {
    List<Clasificacion> findByDivisionId(Long divisionId);

    Optional<Clasificacion> findByDivisionIdAndJugadorId(Long divisionId, Long jugadorId);

    boolean existsByJugador_Id(Long jugadorId);

    void deleteByJugador_Id(Long jugadorId);
}
