package com.community.member.member.domain;

import java.time.Instant;

public class MemberProfile {
    private final String profileId;
    private final String memberId;
    private String nickname;
    private String normalizedNickname;
    private String avatarAssetRef;
    private String bio;
    private String communityGrade;
    private String profileVisibility;
    private Instant updatedAt;

    public MemberProfile(String profileId, String memberId, String nickname, String normalizedNickname, Instant updatedAt) {
        this.profileId = profileId;
        this.memberId = memberId;
        this.nickname = nickname;
        this.normalizedNickname = normalizedNickname;
        this.communityGrade = "new_member";
        this.profileVisibility = "public";
        this.updatedAt = updatedAt;
    }

    public void update(String nickname, String normalizedNickname, String avatarAssetRef, String bio, String profileVisibility, Instant now) {
        if (nickname != null && !nickname.isBlank()) {
            this.nickname = nickname.trim();
            this.normalizedNickname = normalizedNickname;
        }
        this.avatarAssetRef = avatarAssetRef;
        this.bio = bio;
        if (profileVisibility != null && !profileVisibility.isBlank()) {
            this.profileVisibility = profileVisibility;
        }
        this.updatedAt = now;
    }

    public String getProfileId() {
        return profileId;
    }

    public String getMemberId() {
        return memberId;
    }

    public String getNickname() {
        return nickname;
    }

    public String getNormalizedNickname() {
        return normalizedNickname;
    }

    public String getAvatarAssetRef() {
        return avatarAssetRef;
    }

    public String getBio() {
        return bio;
    }

    public String getCommunityGrade() {
        return communityGrade;
    }

    public String getProfileVisibility() {
        return profileVisibility;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
