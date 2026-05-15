package com.college.urlshortener.link.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDateTime;

public record CreateLinkRequest(
        @NotBlank
        @Pattern(regexp = "^https?://.+", message = "URL must start with http:// or https://")
        String originalUrl,

        String customCode,


        LocalDateTime expiresAt
) {}
