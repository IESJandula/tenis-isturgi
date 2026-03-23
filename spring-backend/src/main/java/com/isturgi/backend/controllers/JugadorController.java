package com.isturgi.backend.controllers;

import com.isturgi.backend.models.Jugador;
import com.isturgi.backend.repositories.JugadorRepository;
import com.isturgi.backend.security.FirebaseService;
import com.isturgi.backend.controllers.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/api/jugadors")
@CrossOrigin(origins = "*") // Allow Vue frontend during development
public class JugadorController {

    @Autowired
    private JugadorRepository repository;

    @Autowired
    private FirebaseService firebaseService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        List<Jugador> list = repository.findAll();
        return ResponseEntity.ok(ApiResponse.of(list));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMe() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null || auth.getName().isBlank() || "anonymousUser".equals(auth.getName())) {
            return ResponseEntity.status(401).body(Map.of(
                    "ok", false,
                    "error", "No autenticado"
            ));
        }

        String email = auth.getName();
        Optional<Jugador> jugador = repository.findByEmail(email);
        if (jugador.isPresent()) {
            return ResponseEntity.ok(ApiResponse.of(jugador.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/me")
    public ResponseEntity<Map<String, Object>> updateMe(@RequestBody Jugador patch) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null || auth.getName().isBlank() || "anonymousUser".equals(auth.getName())) {
            throw new ResponseStatusException(UNAUTHORIZED, "No autenticado");
        }

        String email = auth.getName();
        Jugador existing = repository.findByEmail(email).orElseThrow(() -> new ResponseStatusException(NOT_FOUND));

        if (patch.getNombre() != null) existing.setNombre(patch.getNombre());
        if (patch.getApellidos() != null) existing.setApellidos(patch.getApellidos());
        if (patch.getTelefono() != null) existing.setTelefono(patch.getTelefono());
        if (patch.getFoto() != null) existing.setFoto(patch.getFoto());
        if (patch.getFechaNacimiento() != null) existing.setFechaNacimiento(patch.getFechaNacimiento());

        // email y firebaseUid no se modifican desde /me

        existing.setUpdatedAt(LocalDateTime.now());
        Jugador updated = repository.save(existing);
        return ResponseEntity.ok(ApiResponse.of(updated));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        return repository.findById(id)
                .map(item -> ResponseEntity.ok(ApiResponse.of(item)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Jugador item) {
        System.out.println("Recibida petición de creación de Jugador: " + item.getNombre() + " (" + item.getEmail() + ")");
        
        // 1. Crear usuario en Firebase si tiene email
        if (item.getEmail() != null && !item.getEmail().isEmpty()) {
            System.out.println("Intentando crear usuario en Firebase para: " + item.getEmail());
            String displayName = (item.getNombre() != null ? item.getNombre() : "") + 
                                (item.getApellidos() != null ? " " + item.getApellidos() : "");
            
            String uid = firebaseService.createFirebaseUser(item.getEmail(), "123456", displayName);
            if (uid != null) {
                System.out.println("Vinvulando Firebase UID: " + uid);
                item.setFirebaseUid(uid);
            } else {
                System.err.println("FRACASO: No se pudo obtener el UID de Firebase para " + item.getEmail());
            }
        } else {
            System.out.println("Omitiendo creación en Firebase: Email no proporcionado.");
        }
        
        // 2. Guardar en DB local
        Jugador saved = repository.save(item);
        return ResponseEntity.ok(ApiResponse.of(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Jugador item) {
        Jugador existing = repository.findById(id).orElse(null);
        if (existing == null) return ResponseEntity.notFound().build();

        if (item.getNombre() != null) existing.setNombre(item.getNombre());
        if (item.getApellidos() != null) existing.setApellidos(item.getApellidos());
        if (item.getTelefono() != null) existing.setTelefono(item.getTelefono());
        if (item.getEmail() != null) existing.setEmail(item.getEmail());
        if (item.getFoto() != null) existing.setFoto(item.getFoto());
        if (item.getFirebaseUid() != null) existing.setFirebaseUid(item.getFirebaseUid());
        if (item.getDivision() != null) existing.setDivision(item.getDivision());
        if (item.getNumeroSocio() != null) existing.setNumeroSocio(item.getNumeroSocio());
        if (item.getNivel() != null) existing.setNivel(item.getNivel());
        if (item.getCategoria() != null) existing.setCategoria(item.getCategoria());
        if (item.getFechaNacimiento() != null) existing.setFechaNacimiento(item.getFechaNacimiento());
        if (item.getPuntos() != null) existing.setPuntos(item.getPuntos());

        existing.setUpdatedAt(LocalDateTime.now());
        Jugador updated = repository.save(existing);
        return ResponseEntity.ok(ApiResponse.of(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
