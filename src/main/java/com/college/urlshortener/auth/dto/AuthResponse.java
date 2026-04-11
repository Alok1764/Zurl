package com.college.urlshortener.auth.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        long expiresIn
) {}
