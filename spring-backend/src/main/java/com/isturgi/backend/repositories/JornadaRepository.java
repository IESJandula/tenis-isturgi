package com.isturgi.backend.repositories;

import com.isturgi.backend.models.Jornada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface JornadaRepository extends JpaRepository<Jornada, Long> {
    List<Jornada> findByDivisionId(Long divisionId);
    List<Jornada> findByDivisionIdOrderByIdDesc(Long divisionId, Pageable pageable);
    List<Jornada> findByDivisionIdOrderByNumeroAsc(Long divisionId);
    long countByDivisionId(Long divisionId);
    void deleteByDivisionId(Long divisionId);
}
