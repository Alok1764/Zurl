package com.college.urlshortener.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;


@ConfigurationProperties(prefix = "jwt")
public record JwtConfig(
        String secret,
        String accessTokenExpiry,
        String refreshTokenExpiry
) {}