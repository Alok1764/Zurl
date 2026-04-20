package com.college.urlshortener.link.swagger;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Operation(summary = "Get click statistics for a short link")
@ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Statistics returned"),
        @ApiResponse(responseCode = "404", description = "Short code not found")
})
@SecurityRequirement(name = "bearerAuth")
public @interface GetStatsDoc {}
