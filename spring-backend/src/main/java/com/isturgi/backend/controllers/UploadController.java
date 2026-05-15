package com.isturgi.backend.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
public class UploadController {

    @PostMapping(value = "/uploads", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<java.util.Map<String, Object>> upload(@RequestPart("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Archivo vacío"));
        }

        try {
            java.io.File uploadsDir = new java.io.File("uploads");
            if (!uploadsDir.exists()) uploadsDir.mkdirs();

            String original = file.getOriginalFilename();
            String ext = "";
            if (original != null && original.contains(".")) {
                ext = original.substring(original.lastIndexOf('.'));
            }
            String filename = "upload_" + System.currentTimeMillis() + ext;
            java.io.File out = new java.io.File(uploadsDir, filename);
            try (java.io.InputStream in = file.getInputStream(); java.io.OutputStream os = new java.io.FileOutputStream(out)) {
                byte[] buffer = new byte[8192];
                int len;
                while ((len = in.read(buffer)) != -1) os.write(buffer, 0, len);
            }

            String urlPath = "/uploads/" + filename;
            return ResponseEntity.ok(ApiResponse.of(java.util.Map.of("url", urlPath, "filename", filename, "uploadedAt", LocalDateTime.now().toString())));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(java.util.Map.of("error", "No se pudo guardar el archivo: " + e.getMessage()));
        }
    }
}
