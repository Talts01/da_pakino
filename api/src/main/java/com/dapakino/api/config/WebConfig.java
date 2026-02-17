package com.dapakino.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Applica a tutte le rotte
                .allowedOrigins("http://localhost:5173",
                                "http://127.0.0.1:5173",
                                "https://da-pakino.vercel.app/"
                ) // Autorizza il Frontend esplicitamente
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Autorizza tutti i metodi
                .allowedHeaders("*") // Autorizza tutti gli header
                .allowCredentials(true);
    }
}