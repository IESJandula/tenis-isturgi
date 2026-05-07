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
                if (password != null && !password.isBlank()) {
                    FirebaseAuth.getInstance().updateUser(new UserRecord.UpdateRequest(existingUser.getUid()).setPassword(password));
                }
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
            String message = "Error creando usuario en Firebase: " + e.getMessage();
            System.err.println(message);
            throw new IllegalStateException(message, e);
        }
    }

    public boolean deleteFirebaseUserByEmail(String email) {
        try {
            UserRecord userRecord = FirebaseAuth.getInstance().getUserByEmail(email);
            FirebaseAuth.getInstance().deleteUser(userRecord.getUid());
            return true;
        } catch (Exception e) {
            String message = "Error eliminando usuario de Firebase: " + e.getMessage();
            System.err.println(message);
            throw new IllegalStateException(message, e);
        }
    }

    public boolean updateFirebaseUserPasswordByEmail(String email, String password) {
        try {
            UserRecord userRecord = FirebaseAuth.getInstance().getUserByEmail(email);
            UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(userRecord.getUid())
                    .setPassword(password);
            FirebaseAuth.getInstance().updateUser(request);
            return true;
        } catch (Exception e) {
            String message = "Error actualizando contraseña en Firebase: " + e.getMessage();
            System.err.println(message);
            throw new IllegalStateException(message, e);
        }
    }
}
