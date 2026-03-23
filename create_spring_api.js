const fs = require('fs');
const path = require('path');

const reposPath = path.join(__dirname, 'spring-backend/src/main/java/com/isturgi/backend/repositories');
const controllersPath = path.join(__dirname, 'spring-backend/src/main/java/com/isturgi/backend/controllers');

const entities = ['Jugador', 'Division', 'Temporada', 'Jornada', 'Noticia', 'Torneo'];

// Create Repositories
entities.forEach(entity => {
  const content = `package com.isturgi.backend.repositories;

import com.isturgi.backend.models.${entity};
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ${entity}Repository extends JpaRepository<${entity}, Long> {
}
`;
  fs.writeFileSync(path.join(reposPath, entity + 'Repository.java'), content);
});

// Create Basic Response Wrapper
const responseWrapper = `package com.isturgi.backend.controllers;

import java.util.HashMap;
import java.util.Map;

public class ApiResponse {
    public static Map<String, Object> of(Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", data);
        return response;
    }
}
`;
fs.writeFileSync(path.join(controllersPath, 'ApiResponse.java'), responseWrapper);

// Create Controllers
entities.forEach(entity => {
  const lowerName = entity.toLowerCase() + 's'; // "/api/jugadors", "/api/noticias", "/api/torneos"
  const content = `package com.isturgi.backend.controllers;

import com.isturgi.backend.models.${entity};
import com.isturgi.backend.repositories.${entity}Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/${lowerName}")
@CrossOrigin(origins = "*") // Allow Vue frontend during development
public class ${entity}Controller {

    @Autowired
    private ${entity}Repository repository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        List<${entity}> list = repository.findAll();
        return ResponseEntity.ok(ApiResponse.of(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        return repository.findById(id)
                .map(item -> ResponseEntity.ok(ApiResponse.of(item)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody ${entity} item) {
        // En Strapi, Vue envía { data: { Nombre: "..." } } 
        // Para simplificar, asumimos que aquí adaptaremos Vue a enviar el JSON directo o extraemos "data"
        ${entity} saved = repository.save(item);
        return ResponseEntity.ok(ApiResponse.of(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody ${entity} item) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        item.setId(id);
        ${entity} updated = repository.save(item);
        return ResponseEntity.ok(ApiResponse.of(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
`;
  fs.writeFileSync(path.join(controllersPath, entity + 'Controller.java'), content);
});

console.log('Repositories and Controllers created successfully!');
