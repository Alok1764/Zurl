package com.college.urlshortener.globalCounter.dto;

import lombok.Builder;

@Builder
public record GlobalCounterResponse(
        Long totalRedirects,
        Long totalLinksCreated) {
}
