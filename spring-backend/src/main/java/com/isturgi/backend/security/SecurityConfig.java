package com.isturgi.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private FirebaseTokenFilter firebaseTokenFilter;

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:4173}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Preflight CORS
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Lectura pública para calendario y ligas; la escritura queda protegida por rol.
                .requestMatchers(HttpMethod.GET, "/api/jornadas/**", "/api/partidos/**", "/api/clasificacions/**", "/api/divisions/**", "/api/temporadas/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/jugadors/me").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/jornadas/*/schedule", "/api/jornadas/*/close", "/api/divisions/*/generar-calendario", "/api/divisions/*/regenerar-calendario", "/api/partidos/*/resultado", "/api/partidos/*/resultado-provisional", "/api/partidos/*/resultado-confirmar").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/jornadas", "/api/jornadas/**", "/api/partidos/**", "/api/clasificacions/**", "/api/divisions/**", "/api/temporadas/**", "/api/jugadors/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/jornadas/**", "/api/partidos/**", "/api/clasificacions/**", "/api/divisions/**", "/api/temporadas/**", "/api/jugadors/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/jornadas/**", "/api/partidos/**", "/api/clasificacions/**", "/api/divisions/**", "/api/temporadas/**", "/api/jugadors/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/disponibilidades/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/disponibilidades/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/disponibilidades/**").authenticated()
                .anyRequest().permitAll()
            )
            .addFilterBefore(firebaseTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();

        // Si se usan patrones con '*', usamos allowedOriginPatterns.
        if (origins.stream().anyMatch(o -> o.contains("*"))) {
            configuration.setAllowedOriginPatterns(origins);
        } else {
            configuration.setAllowedOrigins(origins);
        }

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
