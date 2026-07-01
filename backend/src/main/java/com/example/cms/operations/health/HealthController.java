package com.example.cms.operations.health;

import com.example.cms.common.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HealthController {
    private final HealthService service;
    public HealthController(HealthService service) { this.service = service; }
    @GetMapping("/api/health") public ApiResponse<Map<String,Object>> health() { return ApiResponse.ok("서비스가 정상 응답했습니다.", service.check()); }
}
