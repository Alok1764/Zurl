package com.college.urlshortener.userquota.controller;

import com.college.urlshortener.userquota.response.QuotaStatus;
import com.college.urlshortener.userquota.service.QuotaService;
import com.college.urlshortener.userquota.swagger.QuotaStatusDoc;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/quota")
@RequiredArgsConstructor
public class QuotaController {

    private final QuotaService quotaService;

    @GetMapping("/status")
    @QuotaStatusDoc
    public ResponseEntity<QuotaStatus> getQuotaStatus(
            HttpServletRequest request) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isLoggedIn = auth != null && auth.isAuthenticated()
                && !(auth instanceof AnonymousAuthenticationToken);

        QuotaStatus status = isLoggedIn
                ? quotaService.getUserStatus(auth.getName())
                : quotaService.getAnonStatus(
                (String) request.getAttribute("anon_token"));

        return ResponseEntity.ok(status);
    }
}
