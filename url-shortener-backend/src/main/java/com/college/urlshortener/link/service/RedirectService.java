package com.college.urlshortener.link.service;

import com.college.urlshortener.globalCounter.service.GlobalCounterService;
import com.college.urlshortener.link.model.Link;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RedirectService {

    private final ClickService clickService;
    private final LinkService linkService;
    private final GlobalCounterService globalCounterService;

    public Link redirect(String shortCode, HttpServletRequest request) {

        Link link = linkService.resolveActiveLink(shortCode);

        globalCounterService.incrementRedirect();

        String userAgent = request.getHeader("User-Agent");
        String referrer = request.getHeader("Referer");
        String ip = extractClientIp(request);

        clickService.recordClickAsync(link, ip, userAgent, referrer);

        return link;
    }

    private String extractClientIp(HttpServletRequest request) {
        String[] headers = {
                "X-Forwarded-For",
                "X-Real-IP",
                "Forwarded"
        };

        for (String header : headers) {
            String value = request.getHeader(header);
            if (value != null && !value.isBlank()) {
                return value.split(",")[0].trim();
            }
        }

        return request.getRemoteAddr();
    }
}
