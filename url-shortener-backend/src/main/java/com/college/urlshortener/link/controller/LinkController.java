package com.college.urlshortener.link.controller;

import com.college.urlshortener.link.dto.CreateLinkRequest;
import com.college.urlshortener.link.dto.CreateLinkResponse;
import com.college.urlshortener.link.dto.LinkStatsResponse;
import com.college.urlshortener.link.service.LinkService;
import com.college.urlshortener.link.swagger.CreateLinkDoc;
import com.college.urlshortener.link.swagger.GetStatsDoc;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/links")
@RequiredArgsConstructor
public class LinkController {

    private final LinkService linkService;

    @PostMapping
    @CreateLinkDoc
    public ResponseEntity<CreateLinkResponse> createLink(
            @Valid @RequestBody CreateLinkRequest createLinkRequest,
            HttpServletRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(linkService.createLink(createLinkRequest,request));
    }

    @GetMapping("/{shortCode}/stats")
    @GetStatsDoc
    public ResponseEntity<LinkStatsResponse> getStats(@PathVariable String shortCode) {
        return ResponseEntity.ok(linkService.getStats(shortCode));
    }
}
