package com.example.cms.common.error;

public class BusinessException extends RuntimeException {
    private final ErrorCode code;
    public BusinessException(ErrorCode code, String detail) { super(detail); this.code = code; }
    public ErrorCode code() { return code; }
}
