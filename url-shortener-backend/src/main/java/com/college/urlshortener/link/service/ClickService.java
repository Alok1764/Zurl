package com.college.urlshortener.link.service;

import com.college.urlshortener.link.model.Click;
import com.college.urlshortener.link.model.Link;
import com.college.urlshortener.link.repository.ClickRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClickService {

    private final ClickRepository clickRepository;

    @Async("clickExecutor")
    @Transactional
    public void recordClickAsync(Link link, String ipAddress, String userAgent, String referrer) {
        try {
            Click click = Click.builder()
                    .link(link)
                    .ipHash(hashIp(ipAddress))
                    .deviceType(parseDeviceType(userAgent))
                    .browser(parseBrowser(userAgent))
                    .referrer(referrer)
                    .country(null)
                    .build();

            clickRepository.save(click);
        } catch (Exception e) {
            log.error("Failed to record click for link {}: {}", link.getId(), e.getMessage());
        }
    }

    private String hashIp(String ip) {
        if (ip == null || ip.isBlank()) {
            return null;
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(ip.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            return null;
        }
    }

    private String parseDeviceType(String userAgent) {
        if (userAgent == null) return "desktop";

        String ua = userAgent.toLowerCase();

        return switch (ua) {
            case String s when s.contains("ipad")
                    || (s.contains("android") && !s.contains("mobi")) -> "tablet";

            case String s when s.contains("mobi")
                    || s.contains("iphone") -> "mobile";

            default -> "desktop";
        };
    }

    private String parseBrowser(String userAgent) {
        if (userAgent == null) return "Other";

        String ua = userAgent.toLowerCase();

        return switch (ua) {
            case String s when s.contains("edg") -> "Edge";
            case String s when s.contains("opr") || s.contains("opera") -> "Opera";
            case String s when s.contains("chrome") -> "Chrome";
            case String s when s.contains("safari") -> "Safari";
            case String s when s.contains("firefox") -> "Firefox";
            default -> "Other";
        };
    }
}
