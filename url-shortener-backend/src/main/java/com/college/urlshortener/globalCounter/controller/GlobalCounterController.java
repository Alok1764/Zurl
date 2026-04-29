package com.college.urlshortener.globalCounter.controller;


import com.college.urlshortener.globalCounter.dto.GlobalCounterResponse;
import com.college.urlshortener.globalCounter.service.GlobalCounterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/global-counter")
@RequiredArgsConstructor
public class GlobalCounterController{

    private final GlobalCounterService globalCounterService;

    @GetMapping
    public ResponseEntity<GlobalCounterResponse> getGlobalCounter(){
        return ResponseEntity.ok(globalCounterService.getGlobalCounter());
    }






}
