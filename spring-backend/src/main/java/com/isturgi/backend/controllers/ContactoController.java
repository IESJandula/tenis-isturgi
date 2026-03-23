package com.isturgi.backend.controllers;

import com.isturgi.backend.models.ContactoMensaje;
import com.isturgi.backend.repositories.ContactoMensajeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@RestController
@RequestMapping("/api/contacto")
@CrossOrigin(origins = "*")
public class ContactoController {

    @Autowired
    private ContactoMensajeRepository repository;

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody ContactoMensaje body) {
        if (body == null) throw new ResponseStatusException(BAD_REQUEST, "Body requerido");
        if (body.getNombre() == null || body.getNombre().isBlank()) throw new ResponseStatusException(BAD_REQUEST, "Nombre requerido");
        if (body.getEmail() == null || body.getEmail().isBlank()) throw new ResponseStatusException(BAD_REQUEST, "Email requerido");
        if (body.getAsunto() == null || body.getAsunto().isBlank()) throw new ResponseStatusException(BAD_REQUEST, "Asunto requerido");
        if (body.getMensaje() == null || body.getMensaje().isBlank()) throw new ResponseStatusException(BAD_REQUEST, "Mensaje requerido");

        ContactoMensaje saved = repository.save(body);
        return ResponseEntity.ok(ApiResponse.of(saved));
    }
}
