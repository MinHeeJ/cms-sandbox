package com.community.member.admin.application;

import com.community.member.admin.authorization.AdminPermission;
import com.community.member.member.api.MemberDtos;
import com.community.member.member.domain.ContactPoint;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class SensitiveDataMaskingService {
    public boolean canViewSensitive(Set<AdminPermission> permissions) {
        return permissions.contains(AdminPermission.SENSITIVE_DATA_READ);
    }

    public MemberDtos.ContactPointResponse toContactResponse(ContactPoint contact, Set<AdminPermission> permissions) {
        String displayValue = canViewSensitive(permissions) ? contact.getValue() : contact.getMaskedValue();
        return MemberDtos.toContact(contact, displayValue);
    }
}
