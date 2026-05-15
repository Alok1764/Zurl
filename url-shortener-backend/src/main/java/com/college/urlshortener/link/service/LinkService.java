package com.college.urlshortener.link.service;

import com.college.urlshortener.exceptions.HandleAnonymousUserLimitReachedException;
import com.college.urlshortener.exceptions.HandleLoginUserLimitReachedException;
import com.college.urlshortener.globalCounter.service.GlobalCounterService;
import com.college.urlshortener.link.dto.CreateLinkRequest;
import com.college.urlshortener.link.dto.CreateLinkResponse;
import com.college.urlshortener.link.dto.LinkStatsResponse;

import com.college.urlshortener.link.model.Link;
import com.college.urlshortener.link.repository.ClickRepository;
import com.college.urlshortener.link.repository.LinkRepository;
import com.college.urlshortener.user.model.User;
import com.college.urlshortener.user.repository.UserRepository;

import com.college.urlshortener.userquota.service.QuotaService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class LinkService {

    private static final String CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 6;
    private static final int MAX_RETRIES = 5;

    private final LinkRepository linkRepository;
    private final ClickRepository clickRepository;
    private final UserRepository userRepository;
    private final GlobalCounterService globalCounterService;
    private final QuotaService quotaService;
    private final SecureRandom secureRandom = new SecureRandom();


    //in future implement retires for it due to random shortcode or alias
    @Transactional
    public CreateLinkResponse createLink(CreateLinkRequest createLinkRequest, HttpServletRequest request) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isLoggedIn = auth != null && auth.isAuthenticated()
                && !(auth instanceof AnonymousAuthenticationToken);

        User user1 = null;


        if (isLoggedIn) {
            User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
            user1=user;

            if (!quotaService.tryConsumeUserLink(user.getId().toString())) {
                throw new HandleLoginUserLimitReachedException(" Daily limit reached, You have used all 20 links for today ");
            }

            if (createLinkRequest.customCode() != null && !createLinkRequest.customCode().isBlank()) {
                if (!quotaService.tryConsumeUserAlias(user.getId().toString())) {
                    throw new HandleLoginUserLimitReachedException(
                            "Daily alias limit reached, You have used all 5 alias links for today"
                    );
                }

            }
        }
        else {
            String token = (String) request.getAttribute("anon_token");
            if (token == null || !quotaService.tryConsumeAnonLink(token)) {
                throw new HandleLoginUserLimitReachedException(" Daily limit reached, Sign up free for 20 links/day");
            }

            if (createLinkRequest.customCode() != null && !createLinkRequest.customCode().isBlank()) {
                if (!quotaService.tryConsumeAnonAlias(token)) {
                    throw new HandleAnonymousUserLimitReachedException(
                            "Daily alias limit reached, Sign up free for 5 alias links/day"
                    );
                }
            }
        }

       String shortCode = resolveShortCode(createLinkRequest.customCode());

        Link link = Link.builder()
                .shortCode(shortCode)
                .originalUrl(createLinkRequest.originalUrl())
                .user(user1)
                .expiresAt(createLinkRequest.expiresAt())
                .build();

        try {
            linkRepository.save(link);
        } catch (DataIntegrityViolationException ex) {
            // Custom alias collision
            if (createLinkRequest.customCode() != null
                    && !createLinkRequest.customCode().isBlank()) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Custom code already taken"
                );
            }
            // Random collision
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to generate unique short code"
            );
        }



        globalCounterService.incrementLinks();

        return new CreateLinkResponse(
                link.getId(),
                link.getShortCode(),
                link.getOriginalUrl(),
                buildShortUrl(shortCode),
                link.getCreatedAt(),
                link.getExpiresAt()
        );
    }

    @Cacheable(value = "links", key = "#shortCode", sync = true)
    @Transactional(readOnly = true)
    public Link resolveActiveLink(String shortCode) {
        Link link = linkRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Short code not found"));

        if (!link.isActive() || (link.getExpiresAt() != null && link.getExpiresAt().isBefore(LocalDateTime.now()))) {
            throw new ResponseStatusException(HttpStatus.GONE, "Link has expired or is inactive");
        }

        return link;
    }

    @Cacheable(value = "stats", key = "#shortCode")
    @Transactional(readOnly = true)
    public LinkStatsResponse getStats(String shortCode) {
        Link link = linkRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Short code not found"));

        long total = clickRepository.countByLink(link);
        long unique = clickRepository.countDistinctIpHashByLink(link);

        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<Object[]> rawDays = clickRepository.countClicksByDay(link, thirtyDaysAgo);
        //DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        List<LinkStatsResponse.DailyCount> clicksByDay = rawDays.stream()
                .map(row -> new LinkStatsResponse.DailyCount(row[0].toString(), ((Number) row[1]).longValue()))
                .toList();

        Map<String, Long> byDevice = toStringLongMap(clickRepository.countByDevice(link));
        Map<String, Long> byCountry = toStringLongMap(clickRepository.countByCountry(link));

        List<LinkStatsResponse.ReferrerCount> topReferrers = clickRepository.topReferrers(link)
                .stream()
                .limit(10)
                .map(row -> new LinkStatsResponse.ReferrerCount((String) row[0], ((Number) row[1]).longValue()))
                .toList();

        return new LinkStatsResponse(total, unique, clicksByDay, byDevice, byCountry, topReferrers);
    }

    private String resolveShortCode(String customCode) {

        if (customCode != null && !customCode.isBlank()) {
            if (linkRepository.existsByShortCode(customCode)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Custom code already taken");
            }
            return customCode;
        }

        for (int attempt = 0; attempt < MAX_RETRIES; attempt++) {
            String candidate = generateCode();
            if (!linkRepository.existsByShortCode(candidate)) {
                return candidate;
            }
        }

        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to generate unique short code");
    }

    private String generateCode() {
        StringBuilder sb = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            sb.append(CHARSET.charAt(secureRandom.nextInt(CHARSET.length())));
        }
        return sb.toString();
    }

    private String buildShortUrl(String shortCode) {
        return "http://localhost:8080/" + shortCode;
    }

    private Map<String, Long> toStringLongMap(List<Object[]> rows) {
        Map<String, Long> result = new LinkedHashMap<>();
        for (Object[] row : rows) {
            String key = row[0] != null ? row[0].toString() : "unknown";
            result.put(key, ((Number) row[1]).longValue());
        }
        return result;
    }
}
