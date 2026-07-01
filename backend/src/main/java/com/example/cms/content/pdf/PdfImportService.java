package com.example.cms.content.pdf;

import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class PdfImportService {
    public Map<String, Object> inspect(String fileName, long size) {
        if (fileName == null || !fileName.toLowerCase().endsWith(".pdf")) return Map.of("supported", false, "reason", "PDF 파일만 변환 대상입니다.");
        if (size <= 0) return Map.of("supported", false, "reason", "빈 PDF는 처리할 수 없습니다.");
        if (size > 50_000_000L) return Map.of("supported", false, "reason", "대용량 PDF는 운영 승인 후 처리합니다.");
        return Map.of("supported", true, "reason", "텍스트, 이미지, 링크 추출 가능 범위에서 처리합니다.");
    }
}
