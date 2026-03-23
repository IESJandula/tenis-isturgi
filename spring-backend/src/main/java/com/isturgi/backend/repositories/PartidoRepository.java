package com.isturgi.backend.repositories;
import com.isturgi.backend.models.Partido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PartidoRepository extends JpaRepository<Partido, Long> {
	List<Partido> findByJugador1_IdOrJugador2_Id(Long jugador1Id, Long jugador2Id);

	List<Partido> findByJornada_Id(Long jornadaId);

	List<Partido> findByJornada_IdOrderByIdAsc(Long jornadaId);

	// Alias compatibles con llamadas existentes en servicios/controladores
	List<Partido> findByJornadaIdOrderByIdAsc(Long jornadaId);

	void deleteByJornada_IdIn(List<Long> jornadaIds);

	// Alias compatible con llamadas existentes en servicios/controladores
	void deleteByJornadaIdIn(List<Long> jornadaIds);

	List<Partido> findByJornada_Division_IdAndEstadoIgnoreCase(Long divisionId, String estado);
}
