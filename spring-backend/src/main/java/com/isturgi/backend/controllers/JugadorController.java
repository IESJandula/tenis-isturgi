package com.isturgi.backend.controllers;

import com.isturgi.backend.models.Jugador;
import com.isturgi.backend.repositories.ClasificacionRepository;
import com.isturgi.backend.repositories.DisponibilidadRepository;
import com.isturgi.backend.repositories.PartidoRepository;
import com.isturgi.backend.repositories.JugadorRepository;
import com.isturgi.backend.security.FirebaseService;
import com.isturgi.backend.controllers.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/api/jugadors")
public class JugadorController {

    @Autowired
    private JugadorRepository repository;

    @Autowired
    private PartidoRepository partidoRepository;

    @Autowired
    private DisponibilidadRepository disponibilidadRepository;

    @Autowired
    private ClasificacionRepository clasificacionRepository;

    @Autowired
    private FirebaseService firebaseService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        List<Jugador> list = repository.findAll();
        return ResponseEntity.ok(ApiResponse.of(list));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String identifier = firstNonBlank(body.get("identifier"), body.get("email"), body.get("usuario"), body.get("username"));
        String password = body.get("password");

        if (identifier == null || identifier.isBlank() || password == null || password.isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Debes indicar usuario y contraseña");
        }

        Optional<Jugador> jugador = findJugadorByIdentifier(identifier);
        if (jugador.isEmpty() || jugador.get().getContrasena() == null || !jugador.get().getContrasena().equals(password)) {
            throw new ResponseStatusException(UNAUTHORIZED, "Credenciales inválidas");
        }

        Jugador found = jugador.get();
        String token = createLocalAuthToken(found);
        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", found
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMe(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String authName = (auth != null) ? auth.getName() : null;

        // Si no hay auth en el SecurityContext, intentamos extraer identidad desde la cabecera Authorization
        AuthIdentity identity = extractIdentity(request, authName);
        System.out.println("[DEBUG] /api/jugadors/me - SecurityContext authName=" + authName + " extractedEmail=" + identity.email() + " firebaseUid=" + identity.firebaseUid());

        if ((identity.email() == null || identity.email().isBlank())
                && (identity.firebaseUid() == null || identity.firebaseUid().isBlank())) {
            return ResponseEntity.status(UNAUTHORIZED).body(Map.of(
                    "ok", false,
                    "error", "No autenticado"
            ));
        }

        Optional<Jugador> jugador = Optional.empty();
        if (identity.email() != null && !identity.email().isBlank()) {
            jugador = repository.findByEmailIgnoreCase(identity.email());
            if (jugador.isEmpty()) {
                jugador = repository.findByEmail(identity.email());
            }
        }
        if (jugador.isEmpty() && identity.firebaseUid() != null && !identity.firebaseUid().isBlank()) {
            jugador = repository.findByFirebaseUid(identity.firebaseUid());
        }
        if (jugador.isEmpty()) {
            jugador = repository.findByNumeroSocio(identity.firebaseUid());
        }

        if (jugador.isPresent()) {
            Jugador found = jugador.get();
            if ((found.getFirebaseUid() == null || found.getFirebaseUid().isBlank())
                    && identity.firebaseUid() != null && !identity.firebaseUid().isBlank()) {
                found.setFirebaseUid(identity.firebaseUid());
                found.setUpdatedAt(LocalDateTime.now());
                found = repository.save(found);
            }
            return ResponseEntity.ok(ApiResponse.of(found));
        } else {
            // No se encontró por email/uid
            System.out.println("[DEBUG] /api/jugadors/me - jugador no encontrado para email=" + identity.email() + " uid=" + identity.firebaseUid());
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/me")
    public ResponseEntity<Map<String, Object>> updateMe(HttpServletRequest request, @RequestBody Jugador patch) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String authName = (auth != null) ? auth.getName() : null;

        AuthIdentity identity = extractIdentity(request, authName);
        if ((identity.email() == null || identity.email().isBlank())
                && (identity.firebaseUid() == null || identity.firebaseUid().isBlank())) {
            throw new ResponseStatusException(UNAUTHORIZED, "No autenticado");
        }
        Jugador existing = resolveCurrentJugador(identity);

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

    private Jugador resolveCurrentJugador(AuthIdentity identity) {
        if (identity.email() != null && !identity.email().isBlank()) {
            Optional<Jugador> byEmail = repository.findByEmailIgnoreCase(identity.email());
            if (byEmail.isPresent()) return byEmail.get();
            byEmail = repository.findByEmail(identity.email());
            if (byEmail.isPresent()) return byEmail.get();
        }

        if (identity.firebaseUid() != null && !identity.firebaseUid().isBlank()) {
            Optional<Jugador> byUid = repository.findByFirebaseUid(identity.firebaseUid());
            if (byUid.isPresent()) return byUid.get();

            Optional<Jugador> byNumeroSocio = repository.findByNumeroSocioIgnoreCase(identity.firebaseUid());
            if (byNumeroSocio.isPresent()) return byNumeroSocio.get();
        }

        throw new ResponseStatusException(NOT_FOUND, "No se encontró un perfil de jugador vinculado a tu cuenta");
    }

    private Optional<Jugador> findJugadorByIdentifier(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            return Optional.empty();
        }

        if (identifier.contains("@")) {
            Optional<Jugador> byEmail = repository.findByEmailIgnoreCase(identifier);
            if (byEmail.isPresent()) return byEmail;
            return repository.findByEmail(identifier);
        }

        Optional<Jugador> byNumeroSocio = repository.findByNumeroSocioIgnoreCase(identifier);
        if (byNumeroSocio.isPresent()) return byNumeroSocio;

        byNumeroSocio = repository.findByNumeroSocio(identifier);
        if (byNumeroSocio.isPresent()) return byNumeroSocio;

        Optional<Jugador> byEmail = repository.findByEmailIgnoreCase(identifier);
        if (byEmail.isPresent()) return byEmail;
        return repository.findByEmail(identifier);
    }

    private String createLocalAuthToken(Jugador jugador) {
        String email = jugador.getEmail();
        String principal = (email != null && !email.isBlank())
                ? email
                : (jugador.getNumeroSocio() != null && !jugador.getNumeroSocio().isBlank()
                ? jugador.getNumeroSocio()
                : String.valueOf(jugador.getId()));

        String payload = String.format(
                "{\"email\":%s,\"user_id\":\"%s\",\"uid\":\"%s\"}",
                email != null && !email.isBlank() ? "\"" + escapeJson(email) + "\"" : "null",
                escapeJson(principal),
                escapeJson(principal)
        );

        String encodedPayload = Base64.getUrlEncoder().withoutPadding().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        return "local." + encodedPayload + ".token";
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }

    private String escapeJson(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private AuthIdentity extractIdentity(HttpServletRequest request, String fallbackEmail) {
        String email = (fallbackEmail != null && fallbackEmail.contains("@")) ? fallbackEmail : null;
        String firebaseUid = (fallbackEmail != null && fallbackEmail.contains("@")) ? null : fallbackEmail;

        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                String[] parts = token.split("\\.");
                if (parts.length >= 2) {
                    byte[] decoded = Base64.getUrlDecoder().decode(parts[1]);
                    String json = new String(decoded, StandardCharsets.UTF_8);
                    Map<?, ?> payload = new com.fasterxml.jackson.databind.ObjectMapper().readValue(json, Map.class);
                    Object tokenEmail = payload.get("email");
                    Object tokenUid = payload.get("user_id");
                    if (tokenUid == null) tokenUid = payload.get("uid");
                    if (tokenUid == null) tokenUid = payload.get("sub");
                    if (tokenEmail != null && !tokenEmail.toString().isBlank()) {
                        email = tokenEmail.toString();
                    }
                    if (tokenUid != null && !tokenUid.toString().isBlank()) {
                        firebaseUid = tokenUid.toString();
                    }
                }
            } catch (Exception ignored) {
            }
        }

        return new AuthIdentity(email, firebaseUid);
    }

    private record AuthIdentity(String email, String firebaseUid) {}

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
            if (item.getContrasena() == null || item.getContrasena().isBlank()) {
                throw new ResponseStatusException(BAD_REQUEST, "Debes indicar una contraseña para poder crear el usuario en Firebase");
            }

            System.out.println("Intentando crear usuario en Firebase para: " + item.getEmail());
            String displayName = (item.getNombre() != null ? item.getNombre() : "") + 
                                (item.getApellidos() != null ? " " + item.getApellidos() : "");
            
            String uid = firebaseService.createFirebaseUser(item.getEmail(), item.getContrasena(), displayName);
            if (uid != null && !uid.isBlank()) {
                System.out.println("Vinculando Firebase UID: " + uid);
                item.setFirebaseUid(uid);
            } else {
                System.out.println("Firebase no disponible; el jugador se guardará solo en la base local.");
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

        if (item.getContrasena() != null && !item.getContrasena().isBlank()) {
            String emailForFirebase = item.getEmail() != null && !item.getEmail().isBlank()
                    ? item.getEmail()
                    : existing.getEmail();
            if (emailForFirebase != null && !emailForFirebase.isBlank()) {
                firebaseService.updateFirebaseUserPasswordByEmail(emailForFirebase, item.getContrasena());
            }
        }

        if (item.getNombre() != null) existing.setNombre(item.getNombre());
        if (item.getApellidos() != null) existing.setApellidos(item.getApellidos());
        if (item.getTelefono() != null) existing.setTelefono(item.getTelefono());
        if (item.getEmail() != null) existing.setEmail(item.getEmail());
        if (item.getContrasena() != null) existing.setContrasena(item.getContrasena());
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
    @Transactional
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        Jugador existing = repository.findById(id).orElse(null);
        if (existing == null) return ResponseEntity.notFound().build();

        if (existing.getEmail() != null && !existing.getEmail().isBlank()) {
            firebaseService.deleteFirebaseUserByEmail(existing.getEmail());
        }

        partidoRepository.deleteByJugador1_IdOrJugador2_IdOrGanador_Id(id, id, id);
        disponibilidadRepository.deleteByJugador_Id(id);
        clasificacionRepository.deleteByJugador_Id(id);
        repository.deleteById(id);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}