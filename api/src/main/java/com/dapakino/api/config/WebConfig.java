package com.dapakino.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:5173",
                        "https://da-pakino.vercel.app" // Assicurati che sia il tuo URL Vercel esatto
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // <--- DELETE DEVE ESSERCI
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}