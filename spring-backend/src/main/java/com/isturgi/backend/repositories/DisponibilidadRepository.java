package com.isturgi.backend.repositories;
import com.isturgi.backend.models.Disponibilidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DisponibilidadRepository extends JpaRepository<Disponibilidad, Long> {
	List<Disponibilidad> findByJugador_Id(Long jugadorId);
	void deleteByJugador_Id(Long jugadorId);
	List<Disponibilidad> findByJornada_Id(Long jornadaId);
	Optional<Disponibilidad> findByJugador_IdAndJornada_Id(Long jugadorId, Long jornadaId);
	void deleteByJornadaIdIn(List<Long> jornadaIds);
	void deleteByJornada_IdIn(List<Long> jornadaIds);
}
