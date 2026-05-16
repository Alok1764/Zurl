package com.college.urlshortener.globalCounter.swagger;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Operation(summary = "Fetch global URL counter")
@ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Global counter fetched successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error while fetching counter")
})
public @interface GlobalCounterDoc {}