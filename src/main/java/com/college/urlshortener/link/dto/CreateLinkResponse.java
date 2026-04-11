package com.college.urlshortener.link.dto;

import java.time.LocalDateTime;

public record CreateLinkResponse(
        Long id,
        String shortCode,
        String originalUrl,
        String shortUrl,
        LocalDateTime createdAt,
        LocalDateTime expiresAt
) {}
