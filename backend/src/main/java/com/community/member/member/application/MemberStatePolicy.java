package com.community.member.member.application;

import com.community.member.member.domain.Member;
import com.community.member.member.domain.Restriction;
import org.springframework.stereotype.Service;

@Service
public class MemberStatePolicy {
    public void assertProfileEditable(Member member) {
        if (!Member.STATUS_ACTIVE.equals(member.getStatus())) {
            throw new IllegalStateException("현재 회원 상태에서는 프로필을 변경할 수 없습니다.");
        }
        boolean restricted = member.getRestrictions().stream()
                .filter(restriction -> "active".equals(restriction.getStatus()))
                .map(Restriction::getRestrictionType)
                .anyMatch(type -> "profile_edit".equals(type) || "full_account".equals(type));
        if (restricted) {
            throw new IllegalStateException("현재 제한 상태에서는 프로필을 변경할 수 없습니다.");
        }
    }

    public boolean canLogin(Member member) {
        return Member.STATUS_ACTIVE.equals(member.getStatus()) || Member.STATUS_DORMANT.equals(member.getStatus());
    }

    public boolean canParticipate(Member member, String action) {
        if (!Member.STATUS_ACTIVE.equals(member.getStatus())) {
            return false;
        }
        return member.getRestrictions().stream()
                .filter(restriction -> "active".equals(restriction.getStatus()))
                .map(Restriction::getRestrictionType)
                .noneMatch(type -> "full_account".equals(type) || action.equals(type));
    }
}
