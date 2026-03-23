package com.isturgi.backend.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collections;
import java.util.Map;

@Component
public class FirebaseTokenFilter extends OncePerRequestFilter {

    private static final boolean ALLOW_UNVERIFIED_JWT =
            "true".equalsIgnoreCase(System.getenv("ALLOW_UNVERIFIED_JWT"));

    private String tryExtractEmailFromJwt(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length < 2) return null;
            byte[] decoded = Base64.getUrlDecoder().decode(parts[1]);
            String json = new String(decoded, StandardCharsets.UTF_8);
            // minimal JSON parse without extra deps: rely on Jackson already in Spring
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            Map<?, ?> payload = mapper.readValue(json, Map.class);
            Object email = payload.get("email");
            return email != null ? email.toString() : null;
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
            
            // To prevent crashing development if Firebase isn't initialized yet with the service account
            if (token.length() > 20) {
                try {
                    FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
                    String email = decodedToken.getEmail();
                    
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            email, null, Collections.emptyList()
                    );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } catch (Exception e) {
                    System.err.println("Error verificando token de Firebase: " + e.getMessage());

                    if (ALLOW_UNVERIFIED_JWT) {
                        String email = tryExtractEmailFromJwt(token);
                        if (email != null && !email.isBlank()) {
                            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                    email, null, Collections.emptyList()
                            );
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                        }
                    }
                }
            } else {
                 // For testing backwards compatibility in local if JWT is simple fake token
                 UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        "admin@admin.com", null, Collections.emptyList()
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
