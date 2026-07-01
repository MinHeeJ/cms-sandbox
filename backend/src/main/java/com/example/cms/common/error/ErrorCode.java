package com.example.cms.common.error;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "입력값을 확인해 주세요."),
    FORBIDDEN(HttpStatus.FORBIDDEN, "접근 권한이 없습니다."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "요청한 대상을 찾을 수 없습니다."),
    CONFLICT(HttpStatus.CONFLICT, "현재 상태에서 처리할 수 없습니다."),
    SYSTEM_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "처리 중 오류가 발생했습니다.");
    private final HttpStatus status;
    private final String message;
    ErrorCode(HttpStatus status, String message) { this.status = status; this.message = message; }
    public HttpStatus status() { return status; }
    public String message() { return message; }
}
