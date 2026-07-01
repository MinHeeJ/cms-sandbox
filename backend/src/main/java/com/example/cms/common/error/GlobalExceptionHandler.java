package com.example.cms.common.error;

import com.example.cms.common.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BusinessException.class)
    ResponseEntity<ApiResponse<Void>> business(BusinessException ex, HttpServletRequest request) {
        return ResponseEntity.status(ex.code().status()).body(ApiResponse.fail(ex.code().message(), new ApiResponse.ErrorBody(ex.code().name(), ex.getMessage(), request.getHeader("X-Request-Id"))));
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<Void>> validation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String detail = ex.getBindingResult().getFieldErrors().stream().findFirst().map(e -> e.getField() + ": " + e.getDefaultMessage()).orElse("입력값 오류");
        return ResponseEntity.badRequest().body(ApiResponse.fail(ErrorCode.VALIDATION_ERROR.message(), new ApiResponse.ErrorBody(ErrorCode.VALIDATION_ERROR.name(), detail, request.getHeader("X-Request-Id"))));
    }
    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiResponse<Void>> system(Exception ex, HttpServletRequest request) {
        return ResponseEntity.status(500).body(ApiResponse.fail(ErrorCode.SYSTEM_ERROR.message(), new ApiResponse.ErrorBody(ErrorCode.SYSTEM_ERROR.name(), "관리자에게 문의해 주세요.", request.getHeader("X-Request-Id"))));
    }
}
