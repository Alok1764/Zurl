package com.college.urlshortener.auth.controller;

import com.college.urlshortener.auth.dto.AuthResponse;
import com.college.urlshortener.auth.dto.LoginRequest;
import com.college.urlshortener.auth.dto.RefreshTokenRequest;
import com.college.urlshortener.auth.dto.RegisterRequest;
import com.college.urlshortener.auth.service.AuthService;
import com.college.urlshortener.auth.swagger.LoginDoc;
import com.college.urlshortener.auth.swagger.LogoutDoc;
import com.college.urlshortener.auth.swagger.RegisterDoc;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @RegisterDoc
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    @LoginDoc
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refresh(request));
    }

    @PostMapping("/logout")
    @LogoutDoc
    public ResponseEntity<Void> logout(@AuthenticationPrincipal UserDetails userDetails) {
        authService.logout(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
