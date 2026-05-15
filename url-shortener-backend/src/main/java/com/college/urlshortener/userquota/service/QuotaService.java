package com.college.urlshortener.userquota.service;

import com.college.urlshortener.config.AppProperties;
import com.college.urlshortener.userquota.response.QuotaStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuotaService {

    private final AppProperties appProperties;
    private final StringRedisTemplate redisTemplate;
    private static final Duration TTL = Duration.ofHours(24);

    // Anonymous user
    public boolean tryConsumeAnonLink(String cookieToken) {
        return tryConsume("anon:links:" + cookieToken, appProperties.anonymous().dailyLimit());
    }

    public boolean tryConsumeAnonAlias(String cookieToken) {
        return tryConsume("anon:aliases:" + cookieToken, appProperties.anonymous().aliasLimit());
    }

    public QuotaStatus getAnonStatus(String cookieToken) {
        return getStatus(
                "anon:links:" + cookieToken, appProperties.anonymous().dailyLimit(),
                "anon:aliases:" + cookieToken, appProperties.anonymous().aliasLimit()
        );
    }

    // Authenticated user
    public boolean tryConsumeUserLink(String userId) {
        return tryConsume("user:links:" + userId, appProperties.authenticated().dailyLimit());
    }

    public boolean tryConsumeUserAlias(String userId) {
        return tryConsume("user:aliases:" + userId, appProperties.authenticated().aliasLimit());
    }

    public QuotaStatus getUserStatus(String userId) {
        return getStatus(
                "user:links:" + userId, appProperties.authenticated().dailyLimit(),
                "user:aliases:" + userId, appProperties.authenticated().aliasLimit()
        );
    }


    private boolean tryConsume(String key,int limit){
        Long count =redisTemplate.opsForValue().increment(key);

        if (count == null) {
            // Redis is down — fail open (allow request)
            log.error("Redis unavailable for key: {}", key);
            return true;
        }

        if (count == 1) {
            // first use today — set TTL once
            redisTemplate.expire(key, TTL);
        }

        if (count > limit) {
            // over limit — decrement back so count stays accurate
            redisTemplate.opsForValue().decrement(key);
            return false;
        }
        return true;
    }

    private QuotaStatus getStatus(String linkKey, int linkLimit,
                                  String aliasKey, int aliasLimit) {
        String linkVal = redisTemplate.opsForValue().get(linkKey);
        String aliasVal = redisTemplate.opsForValue().get(aliasKey);

        int linksUsed = linkVal != null ? Integer.parseInt(linkVal) : 0;
        int aliasesUsed = aliasVal != null ? Integer.parseInt(aliasVal) : 0;

        return new QuotaStatus(
                linksUsed, linkLimit,
                aliasesUsed, aliasLimit
        );
    }

}
