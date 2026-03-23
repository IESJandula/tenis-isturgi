package com.isturgi.backend.controllers;

import com.isturgi.backend.models.Jugador;
import com.isturgi.backend.repositories.JugadorRepository;
import com.isturgi.backend.security.FirebaseService;
import com.isturgi.backend.controllers.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Jugador> jugador = repository.findByEmail(email);
        if (jugador.isPresent()) {
            return ResponseEntity.ok(ApiResponse.of(jugador.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
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
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        item.setId(id);
        Jugador updated = repository.save(item);
        return ResponseEntity.ok(ApiResponse.of(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}