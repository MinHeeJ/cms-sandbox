package com.example.cms.attachment;
import com.example.cms.common.error.*;import org.springframework.stereotype.Service;import java.util.Set;
@Service
public class AttachmentValidationService {
 private static final Set<String> ALLOWED=Set.of("pdf","md","txt","png","jpg","jpeg","csv","xlsx");
 public void validate(String name,long size,String mime){ if(name==null||name.contains(".."))throw new BusinessException(ErrorCode.VALIDATION_ERROR,"파일명이 올바르지 않습니다."); if(size<=0)throw new BusinessException(ErrorCode.VALIDATION_ERROR,"빈 파일은 업로드할 수 없습니다."); if(size>10_485_760L)throw new BusinessException(ErrorCode.VALIDATION_ERROR,"파일 크기는 10MB 이하여야 합니다."); String ext=name.substring(name.lastIndexOf('.')+1).toLowerCase(); if(!ALLOWED.contains(ext))throw new BusinessException(ErrorCode.VALIDATION_ERROR,"허용되지 않는 확장자입니다."); }
}
