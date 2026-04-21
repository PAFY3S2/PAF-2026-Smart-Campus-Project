package com.campus.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity // This enables @PreAuthorize annotations in controllers
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF for educational/testing purposes with Postman/React
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // All endpoints require the user to be authenticated at a minimum
                .anyRequest().authenticated()
            )
            // Using Basic Authentication for simplicity
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    // Creating two temporary in-memory users to demonstrate role-based access
    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails studentUser = User.withDefaultPasswordEncoder()
                .username("student")
                .password("password123")
                .roles("USER")
                .build();

        UserDetails adminUser = User.withDefaultPasswordEncoder()
                .username("admin")
                .password("admin123")
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(studentUser, adminUser);
    }
}
