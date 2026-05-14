package com.isturgi.backend.security;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void init() {
        if (FirebaseApp.getApps().isEmpty()) {
            try {
                // Configurable sin commitear el JSON al repo:
                // - FIREBASE_SERVICE_ACCOUNT_PATH=C:\ruta\service-account.json
                // - o fallback: ./config/firebase-service-account.json
                String envPath = System.getenv("FIREBASE_SERVICE_ACCOUNT_PATH");
                Path serviceAccountPath;
                if (envPath != null && !envPath.isBlank()) {
                    serviceAccountPath = Paths.get(envPath);
                } else {
                    Path configPath = Paths.get("spring-backend", "config", "firebase-service-account.json");
                    Path rootPath = Paths.get("firebase-service-account.json");
                    Path modulePath = Paths.get("spring-backend", "firebase-service-account.json");
                    serviceAccountPath = Files.exists(configPath) ? configPath : Files.exists(rootPath) ? rootPath : modulePath;
                }

                if (!Files.exists(serviceAccountPath)) {
                    throw new IllegalStateException("No existe el service account en: " + serviceAccountPath.toAbsolutePath());
                }

                FileInputStream serviceAccount = new FileInputStream("firebase-service-account.json");                
                
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                FirebaseApp.initializeApp(options);
                System.out.println("Firebase Admin inicializado correctamente.");
            } catch (Exception e) {
                System.err.println("ADVERTENCIA: No se pudo cargar firebase-service-account.json. Firebase no verificará tokens de Auth: " + e.getMessage());
            }
        }
    }
}
