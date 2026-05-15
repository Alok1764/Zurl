package com.college.urlshortener.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;


@ConfigurationProperties(prefix = "app")
public record AppProperties(
        Limits anonymous,
        Limits authenticated
) {

    public record Limits(
            int dailyLimit,
            int aliasLimit
    ) {}
}
