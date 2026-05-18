package com.isturgi.backend.security;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void init() {
        if (FirebaseApp.getApps().isEmpty()) {
            try {
                String envValue = System.getenv("FIREBASE_SERVICE_ACCOUNT_PATH");
                InputStream serviceAccountStream = null;

                // 1. Detectar si la variable contiene el JSON directo (empieza por '{') o es una ruta
                if (envValue != null && !envValue.isBlank()) {
                    String trimmedEnv = envValue.trim();
                    if (trimmedEnv.startsWith("{")) {
                        // Es el contenido directo del JSON (Caso Coolify)
                        System.out.println("Inicializando Firebase desde el contenido JSON de la variable de entorno...");
                        serviceAccountStream = new ByteArrayInputStream(trimmedEnv.getBytes(StandardCharsets.UTF_8));
                    } else {
                        // Es una ruta de archivo (Caso Local con variable de entorno)
                        Path serviceAccountPath = Paths.get(trimmedEnv);
                        if (Files.exists(serviceAccountPath)) {
                            serviceAccountStream = new FileInputStream(serviceAccountPath.toFile());
                        }
                    }
                }

                // 2. Si no se ha cargado por entorno, buscamos los fallbacks en archivos locales (Tu casa)
                if (serviceAccountStream == null) {
                    Path configPath = Paths.get("spring-backend", "config", "firebase-service-account.json");
                    Path rootPath = Paths.get("firebase-service-account.json");
                    Path modulePath = Paths.get("spring-backend", "firebase-service-account.json");
                    Path appPath = Paths.get("/app/firebase-service-account.json");

                    Path finalPath = Files.exists(configPath) ? configPath :
                                     Files.exists(rootPath) ? rootPath :
                                     Files.exists(appPath) ? appPath : modulePath;

                    System.out.println("Buscando archivo de Firebase en: " + finalPath.toAbsolutePath());
                    if (!Files.exists(finalPath)) {
                        throw new IllegalStateException("No existe el archivo service account en ninguna ruta local.");
                    }
                    serviceAccountStream = new FileInputStream(finalPath.toFile());
                }

                // 3. Inicialización final del SDK de Google
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccountStream))
                        .build();

                FirebaseApp.initializeApp(options);
                System.out.println("¡Firebase Admin inicializado correctamente con éxito total!");

            } catch (Exception e) {
                System.err.println("ADVERTENCIA: No se pudo cargar Firebase. No se verificarán tokens de Auth: " + e.getMessage());
            }
        }
    }
}