package com.isturgi.backend.repositories;

import com.isturgi.backend.models.Clasificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClasificacionRepository extends JpaRepository<Clasificacion, Long> {
    List<Clasificacion> findByDivisionId(Long divisionId);
}
