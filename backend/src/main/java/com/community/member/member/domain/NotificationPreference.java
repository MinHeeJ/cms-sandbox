package com.community.member.member.domain;

import java.time.Instant;

public class NotificationPreference {
    private final String preferenceId;
    private final String memberId;
    private boolean serviceNoticesEnabled;
    private boolean marketingEmailEnabled;
    private boolean marketingSmsEnabled;
    private boolean communityDigestEnabled;
    private Instant updatedAt;

    public NotificationPreference(String preferenceId, String memberId, Instant now) {
        this.preferenceId = preferenceId;
        this.memberId = memberId;
        this.serviceNoticesEnabled = true;
        this.communityDigestEnabled = true;
        this.updatedAt = now;
    }

    public void update(boolean marketingEmailEnabled, boolean marketingSmsEnabled, boolean communityDigestEnabled, Instant now) {
        this.serviceNoticesEnabled = true;
        this.marketingEmailEnabled = marketingEmailEnabled;
        this.marketingSmsEnabled = marketingSmsEnabled;
        this.communityDigestEnabled = communityDigestEnabled;
        this.updatedAt = now;
    }

    public String getPreferenceId() {
        return preferenceId;
    }

    public String getMemberId() {
        return memberId;
    }

    public boolean isServiceNoticesEnabled() {
        return serviceNoticesEnabled;
    }

    public boolean isMarketingEmailEnabled() {
        return marketingEmailEnabled;
    }

    public boolean isMarketingSmsEnabled() {
        return marketingSmsEnabled;
    }

    public boolean isCommunityDigestEnabled() {
        return communityDigestEnabled;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
