package com.college.urlshortener.userquota.swagger;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Operation(summary = "Get user or anonymous quota status")
@ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Quota status fetched successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access (invalid authentication context)"),
        @ApiResponse(responseCode = "500", description = "Internal server error while fetching quota status")
})
public @interface QuotaStatusDoc {}