package com.college.urlshortener.link.controller;

import com.college.urlshortener.globalCounter.service.GlobalCounterService;
import com.college.urlshortener.link.model.Link;
import com.college.urlshortener.link.service.ClickService;
import com.college.urlshortener.link.service.LinkService;
import com.college.urlshortener.link.service.RedirectService;
import com.college.urlshortener.link.swagger.RedirectDoc;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequiredArgsConstructor
public class RedirectController {

    private final LinkService linkService;
    private final ClickService clickService;
    private final GlobalCounterService globalCounterService;
    private final RedirectService redirectService;

    @GetMapping("/{shortCode}")
    @RedirectDoc
    public ResponseEntity<Void> redirect(
            @PathVariable String shortCode,
            HttpServletRequest request
    ) {
        Link link=redirectService.redirect(shortCode,request);

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(link.getOriginalUrl()));
        return ResponseEntity.status(HttpStatus.FOUND).headers(headers).build();
    }

}
