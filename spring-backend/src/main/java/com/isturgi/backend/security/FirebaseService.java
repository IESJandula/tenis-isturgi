package com.isturgi.backend.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import org.springframework.stereotype.Service;

@Service
public class FirebaseService {

    /**
     * Crea un usuario en Firebase Authentication con una contraseña por defecto.
     * Si el usuario ya existe, simplemente retorna el UID existente.
     */
    public String createFirebaseUser(String email, String password, String displayName) {
        try {
            // Intentar ver si ya existe para evitar errores
            try {
                UserRecord existingUser = FirebaseAuth.getInstance().getUserByEmail(email);
                return existingUser.getUid();
            } catch (Exception e) {
                // No existe, procedemos a crear
            }

            UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                    .setEmail(email)
                    .setPassword(password)
                    .setDisplayName(displayName)
                    .setEmailVerified(false)
                    .setDisabled(false);

            UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);
            System.out.println("Usuario de Firebase creado exitosamente: " + userRecord.getUid());
            return userRecord.getUid();
        } catch (Exception e) {
            System.err.println("Error creando usuario en Firebase: " + e.getMessage());
            return null;
        }
    }
}
