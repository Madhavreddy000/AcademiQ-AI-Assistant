package com.university.academicassistant.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI academicAssistantOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("University Academic AI Assistant API")
                        .description("REST API and Streaming SSE Server for Grounded University Academic Guidance with RAG (Spring AI, MySQL 8, Qdrant)")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("University Academic Technology Division")
                                .email("academiq-support@university.edu"))
                        .license(new License().name("Proprietary").url("https://university.edu")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components().addSecuritySchemes("Bearer Authentication",
                        new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter your Bearer JWT token to authenticate operations.")));
    }
}
