package com.college.urlshortener.link.service;

import com.college.urlshortener.globalCounter.service.GlobalCounterService;
import com.college.urlshortener.link.dto.CreateLinkRequest;
import com.college.urlshortener.link.dto.CreateLinkResponse;
import com.college.urlshortener.link.dto.LinkStatsResponse;
import com.college.urlshortener.link.model.Click;
import com.college.urlshortener.link.model.Link;
import com.college.urlshortener.link.repository.ClickRepository;
import com.college.urlshortener.link.repository.LinkRepository;
import com.college.urlshortener.user.model.User;
import com.college.urlshortener.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    private final SecureRandom secureRandom = new SecureRandom();


    @Transactional
    public CreateLinkResponse createLink(CreateLinkRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String shortCode = resolveShortCode(request.customCode());


        Link link = Link.builder()
                .shortCode(shortCode)
                .originalUrl(request.originalUrl())
                .user(user)
                .expiresAt(request.expiresAt())
                .build();

        linkRepository.save(link);

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
