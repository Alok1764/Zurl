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
@Operation(summary = "Create a short link")
@ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Short link created"),
        @ApiResponse(responseCode = "409", description = "Custom code already taken"),
        @ApiResponse(responseCode = "422", description = "Invalid URL format"),
        @ApiResponse(responseCode = "400", description = "Validation failed")
})
@SecurityRequirement(name = "bearerAuth")
public @interface CreateLinkDoc {}
