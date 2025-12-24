package com.ocp.study.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

/**
 * Cấu hình CORS cho phép Angular frontend gọi API.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Configuration
public class CorsConfig {

    @Value("${app.cors.allowed-origins:http://localhost:4200}")
    private String allowedOrigins;

    @Value("${app.cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS}")
    private String allowedMethods;

    @Value("${app.cors.allowed-headers:*}")
    private String allowedHeaders;

    @Value("${app.cors.max-age:3600}")
    private long maxAge;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Cho phép origins từ config
        config.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));

        // Cho phép các HTTP methods
        config.setAllowedMethods(Arrays.asList(allowedMethods.split(",")));

        // Cho phép tất cả headers
        config.setAllowedHeaders(List.of(allowedHeaders));

        // Cho phép credentials (cookies, authorization headers)
        config.setAllowCredentials(true);

        // Cache preflight response
        config.setMaxAge(maxAge);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
