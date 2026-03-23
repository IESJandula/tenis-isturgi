package com.isturgi.backend.repositories;

import com.isturgi.backend.models.Jornada;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JornadaRepository extends JpaRepository<Jornada, Long> {
    List<Jornada> findByDivisionId(Long divisionId);
}
