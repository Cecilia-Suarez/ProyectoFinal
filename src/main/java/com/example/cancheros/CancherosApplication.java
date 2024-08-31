package com.example.cancheros;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class CancherosApplication {
	public static void main(String[] args) {
		SpringApplication.run(CancherosApplication.class, args);
	}


	/*@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("http://localhost:8080/") // Permitir el origen específico
						.allowedMethods("*")
						.allowedHeaders("*");
			}
		};
	}*/
}