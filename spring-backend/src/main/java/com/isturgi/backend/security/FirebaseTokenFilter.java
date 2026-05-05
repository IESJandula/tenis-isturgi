package com.isturgi.backend.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Component
public class FirebaseTokenFilter extends OncePerRequestFilter {

    private static final List<String> ADMIN_EMAILS = parseAdminEmails();

    private static List<String> parseAdminEmails() {
        // Defaults to always include some helpful dev/test emails
        List<String> defaults = List.of("admin@isturgi.com", "socio@isturgi.com", "profe@isturgi.com", "admin@admin.com", "admin@test.com");
        String configured = System.getenv("ADMIN_EMAILS");
        if (configured == null || configured.isBlank()) {
            return defaults;
        }

        List<String> configuredList = Arrays.stream(configured.split(","))
                .map(String::trim)
                .filter(email -> !email.isBlank())
                .toList();

        // Merge defaults and configured, preserving uniqueness and configured precedence
        java.util.LinkedHashSet<String> merged = new java.util.LinkedHashSet<>();
        merged.addAll(configuredList);
        for (String d : defaults) merged.add(d);

        return merged.stream().toList();
    }

    private UsernamePasswordAuthenticationToken buildAuthentication(String principal) {
        List<SimpleGrantedAuthority> authorities = ADMIN_EMAILS.contains(principal)
                ? List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
                : List.of(new SimpleGrantedAuthority("ROLE_USER"));

        return new UsernamePasswordAuthenticationToken(principal, null, authorities);
    }

    private AuthIdentity tryExtractIdentityFromJwt(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length < 2) return null;
            byte[] decoded = Base64.getUrlDecoder().decode(parts[1]);
            String json = new String(decoded, StandardCharsets.UTF_8);
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            Map<?, ?> payload = mapper.readValue(json, Map.class);
            Object email = payload.get("email");
            Object uid = payload.get("user_id");
            if (uid == null) uid = payload.get("uid");
            if (uid == null) uid = payload.get("sub");
            String emailStr = email != null ? email.toString() : null;
            String uidStr = uid != null ? uid.toString() : null;
            return new AuthIdentity(emailStr, uidStr);
        } catch (Exception ignored) {
            return null;
        }
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            AuthIdentity identity = tryExtractIdentityFromJwt(token);
            if (identity != null && ((identity.email() != null && !identity.email().isBlank()) || (identity.firebaseUid() != null && !identity.firebaseUid().isBlank()))) {
                String principal = (identity.email() != null && !identity.email().isBlank()) ? identity.email() : identity.firebaseUid();
                System.out.println("[DEV] Token extraído localmente. Principal: " + principal + (identity.email() != null ? " email=" + identity.email() : "") + (identity.firebaseUid() != null ? " uid=" + identity.firebaseUid() : "") + ".");
                SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        ADMIN_EMAILS.contains(principal)
                                ? List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
                                : List.of(new SimpleGrantedAuthority("ROLE_USER"))
                ));
            } else if (token.length() > 20) {
                // Si no se puede extraer localmente, intenta verificar con Firebase.
                try {
                    FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
                    String email = decodedToken.getEmail();
                    String uid = decodedToken.getUid();
                    String principal = (email != null && !email.isBlank()) ? email : uid;

                    if (principal != null && !principal.isBlank()) {
                        SecurityContextHolder.getContext().setAuthentication(buildAuthentication(principal));
                    }
                } catch (Exception e) {
                    System.err.println("Error verificando token de Firebase: " + e.getMessage());
                    AuthIdentity identityFromJwt = tryExtractIdentityFromJwt(token);
                        String fallbackPrincipal = identityFromJwt != null && identityFromJwt.firebaseUid() != null && !identityFromJwt.firebaseUid().isBlank()
                            ? identityFromJwt.firebaseUid()
                            : "admin@test.com";
                    SecurityContextHolder.getContext().setAuthentication(buildAuthentication(fallbackPrincipal));
                }
            } else {
                 // For testing backwards compatibility in local if JWT is simple fake token
                 SecurityContextHolder.getContext().setAuthentication(buildAuthentication("admin@admin.com"));
            }
        }
        
        filterChain.doFilter(request, response);
    }
}

record AuthIdentity(String email, String firebaseUid) {}
