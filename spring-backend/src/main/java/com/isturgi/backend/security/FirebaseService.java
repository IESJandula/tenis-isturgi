package com.isturgi.backend.security;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.AuthErrorCode;
import com.google.firebase.auth.UserRecord;
import org.springframework.stereotype.Service;

@Service
public class FirebaseService {

    private FirebaseAuth firebaseAuth() {
        if (FirebaseApp.getApps().isEmpty()) {
            throw new IllegalStateException("Firebase Admin no está inicializado. Revisa firebase-service-account.json o FIREBASE_SERVICE_ACCOUNT_PATH.");
        }

        return FirebaseAuth.getInstance();
    }

    /**
     * Crea un usuario en Firebase Authentication con una contraseña por defecto.
     * Si el usuario ya existe, simplemente retorna el UID existente.
     */
    public String createFirebaseUser(String email, String password, String displayName) {
        try {
            FirebaseAuth auth = firebaseAuth();

            // Intentar ver si ya existe para evitar errores
            try {
                UserRecord existingUser = auth.getUserByEmail(email);
                if (password != null && !password.isBlank()) {
                    auth.updateUser(new UserRecord.UpdateRequest(existingUser.getUid()).setPassword(password));
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

            UserRecord userRecord = auth.createUser(request);
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
            FirebaseAuth auth = firebaseAuth();
            UserRecord userRecord = auth.getUserByEmail(email);
            auth.deleteUser(userRecord.getUid());
            System.out.println("Usuario de Firebase eliminado: " + email);
            return true;
        } catch (com.google.firebase.auth.FirebaseAuthException e) {
            if (e.getAuthErrorCode() == AuthErrorCode.USER_NOT_FOUND) {
                System.out.println("Usuario no existe en Firebase, continuando: " + email);
                // No es error fatal - simplemente no existe en Firebase pero existe en BD local
            } else {
                throw new IllegalStateException("Error eliminando usuario de Firebase: " + e.getMessage(), e);
            }
            return true;
        } catch (Exception e) {
            String message = "Error eliminando usuario de Firebase: " + e.getMessage();
            System.err.println(message);
            throw new IllegalStateException(message, e);
        }
    }

    public boolean updateFirebaseUserPasswordByEmail(String email, String password) {
        try {
            FirebaseAuth auth = firebaseAuth();
            UserRecord userRecord = auth.getUserByEmail(email);
            UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(userRecord.getUid())
                    .setPassword(password);
            auth.updateUser(request);
            return true;
        } catch (Exception e) {
            String message = "Error actualizando contraseña en Firebase: " + e.getMessage();
            System.err.println(message);
            throw new IllegalStateException(message, e);
        }
    }

    public boolean updateFirebaseUserEmailByEmail(String currentEmail, String newEmail) {
        try {
            FirebaseAuth auth = firebaseAuth();
            UserRecord userRecord = auth.getUserByEmail(currentEmail);
            UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(userRecord.getUid())
                    .setEmail(newEmail)
                    .setEmailVerified(false);
            auth.updateUser(request);
            System.out.println("Email de Firebase actualizado: " + currentEmail + " -> " + newEmail);
            return true;
        } catch (Exception e) {
            String message = "Error actualizando email en Firebase: " + e.getMessage();
            System.err.println(message);
            throw new IllegalStateException(message, e);
        }
    }

    public boolean updateFirebaseUserEmailByUid(String uid, String newEmail) {
        try {
            FirebaseAuth auth = firebaseAuth();
            UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(uid)
                    .setEmail(newEmail)
                    .setEmailVerified(false);
            auth.updateUser(request);
            System.out.println("Email de Firebase actualizado por UID: " + uid + " -> " + newEmail);
            return true;
        } catch (Exception e) {
            String message = "Error actualizando email en Firebase (uid): " + e.getMessage();
            System.err.println(message);
            throw new IllegalStateException(message, e);
        }
    }
}
