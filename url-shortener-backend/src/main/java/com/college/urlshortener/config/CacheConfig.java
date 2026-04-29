package com.college.urlshortener.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {

        CaffeineCacheManager manager = new CaffeineCacheManager();

        manager.registerCustomCache("links",
                Caffeine.newBuilder()
                        .initialCapacity(1000)
                        .maximumSize(10_000)
                        .expireAfterWrite(10, TimeUnit.MINUTES)
                        .build()
        );

        manager.registerCustomCache("stats",
                Caffeine.newBuilder()
                        .initialCapacity(100)
                        .maximumSize(300)
                        .expireAfterWrite(5, TimeUnit.MINUTES)
                        .build()
        );

        manager.registerCustomCache("globalCount",
                Caffeine.newBuilder()
                        .maximumSize(1)
                        .expireAfterWrite(45, TimeUnit.SECONDS)
                        .build()
        );

        return manager;
    }
}
