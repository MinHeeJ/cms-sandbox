package com.example.cms.common.response;

import java.time.Instant;

public record ApiResponse<T>(boolean success, String message, T data, ErrorBody error, Instant timestamp) {
    public static <T> ApiResponse<T> ok(String message, T data) { return new ApiResponse<>(true, message, data, null, Instant.now()); }
    public static <T> ApiResponse<T> fail(String message, ErrorBody error) { return new ApiResponse<>(false, message, null, error, Instant.now()); }
    public record ErrorBody(String code, String detail, String requestId) {}
}
