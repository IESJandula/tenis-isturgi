package com.isturgi.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration; // Importante
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration; // Importante
import org.springframework.context.annotation.Import;

@SpringBootApplication(exclude = { 
    SecurityAutoConfiguration.class, 
    UserDetailsServiceAutoConfiguration.class 
})
@Import(SecurityConfig.class)
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
