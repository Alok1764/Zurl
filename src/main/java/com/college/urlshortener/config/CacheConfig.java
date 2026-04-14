package com.college.urlshortener.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {

        CaffeineCacheManager manager = new CaffeineCacheManager();

        Map<String, Caffeine<Object, Object>> cacheSpecs = new HashMap<>();

        cacheSpecs.put("links",
                Caffeine.newBuilder()
                        .maximumSize(10_00)
                        .expireAfterWrite(10, TimeUnit.MINUTES)
        );

        cacheSpecs.put("stats",
                Caffeine.newBuilder()
                        .maximumSize(5_000)
                        .expireAfterWrite(1, TimeUnit.MINUTES)
        );

        manager.setCaffeine(Caffeine.newBuilder());
        manager.setCacheNames(cacheSpecs.keySet());

        return manager;
    }
}
