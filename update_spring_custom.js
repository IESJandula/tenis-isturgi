const fs = require('fs');
const path = require('path');

const bPath = path.join(__dirname, 'spring-backend/src/main/java/com/isturgi/backend');

// 1. Añadir findByDivisionId a JornadaRepository
const jRepo = path.join(bPath, 'repositories/JornadaRepository.java');
fs.writeFileSync(jRepo, \`package com.isturgi.backend.repositories;
import com.isturgi.backend.models.Jornada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JornadaRepository extends JpaRepository<Jornada, Long> {
    List<Jornada> findByDivisionId(Long divisionId);
}
\`);

// 2. Modificar JornadaController para incluir /api/jornadas/division/{id}/jornadas
const jCtrl = path.join(bPath, 'controllers/JornadaController.java');
let jContent = fs.readFileSync(jCtrl, 'utf-8');
const customEndpointJornada = \`
    @GetMapping("/division/{id}/jornadas")
    public ResponseEntity<java.util.List<Jornada>> getByDivision(@PathVariable Long id) {
        return ResponseEntity.ok(repository.findByDivisionId(id)); // Sin ApiResponse wrapper para compatibilidad estricta si Vue lo espera as\u00ED
    }
\`;
jContent = jContent.replace('public class JornadaController {', 'public class JornadaController {' + customEndpointJornada);
fs.writeFileSync(jCtrl, jContent);

// 3. Crear ClasificacionController
const clCtrl = path.join(bPath, 'controllers/ClasificacionController.java');
fs.writeFileSync(clCtrl, \`package com.isturgi.backend.controllers;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/clasificacions")
@CrossOrigin(origins = "*")
public class ClasificacionController {
    @GetMapping
    public ResponseEntity<Map<String, Object>> getClasificacion(
            @RequestParam(required = false, name = "filters[division][id]") Long divisionId) {
        // Por ahora devolvemos mock, ya que la l\u00F3gica de clasificaci\u00F3n requiere leer Partidos
        // Se implementar\u00E1 tras revisar Partidos.
        return ResponseEntity.ok(ApiResponse.of(Collections.emptyList()));
    }
}
\`);

// 4. Modificar JugadorController para /api/jugadors/me
const jugCtrl = path.join(bPath, 'controllers/JugadorController.java');
let jugContent = fs.readFileSync(jugCtrl, 'utf-8');
const customEndpointJugador = \`
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMe(@RequestHeader("Authorization") String token) {
        // Hasta que habilitemos Firebase Admin SDK, devolvemos el admin (ID 1) por defecto.
        // O devolvemos el error habitual si no auth.
        // Simular para el frontend:
        return repository.findById(1L)
                .map(item -> ResponseEntity.ok(ApiResponse.of(item)))
                .orElse(ResponseEntity.notFound().build());
    }
\`;
jugContent = jugContent.replace('public class JugadorController {', 'public class JugadorController {' + customEndpointJugador);
fs.writeFileSync(jugCtrl, jugContent);

console.log("Controladores Spring adaptados localmente para Vue.");
