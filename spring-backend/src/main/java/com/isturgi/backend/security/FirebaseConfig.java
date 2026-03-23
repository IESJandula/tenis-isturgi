package com.isturgi.backend.security;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void init() {
        if (FirebaseApp.getApps().isEmpty()) {
            try {
                // El usuario debe colocar su clave JSON de service account en esta ruta o usar variables de entorno
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
