package com.community.member.member.persistence;

import com.community.member.member.domain.ConsentRecord;
import com.community.member.member.domain.ContactPoint;
import com.community.member.member.domain.Member;
import com.community.member.member.domain.MemberCredential;
import com.community.member.member.domain.MemberProfile;
import com.community.member.member.domain.NotificationPreference;
import com.community.member.member.domain.RoleAssignment;
import com.community.member.member.domain.VerificationAttempt;
import com.community.member.privacy.domain.PrivacyRequest;
import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.Normalizer;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Stream;
import org.springframework.stereotype.Repository;

@Repository
public class MemberRepository {
    private final Map<String, Member> members = new ConcurrentHashMap<>();
    private final Map<String, PendingRegistration> pendingRegistrations = new ConcurrentHashMap<>();
    private final Map<String, VerificationAttempt> verificationAttempts = new ConcurrentHashMap<>();
    private final Map<String, PrivacyRequest> privacyRequests = new ConcurrentHashMap<>();
    private final AtomicLong memberSequence = new AtomicLong(1000);
    private final AtomicLong privacySequence = new AtomicLong(2200);

    @PostConstruct
    void seed() {
        if (!members.isEmpty()) {
            return;
        }
        Instant now = Instant.now();
        Member member = new Member("M-1000", "pub-demo-member", "seed", now.minusSeconds(86400 * 10));
        member.setProfile(new MemberProfile("P-1000", member.getMemberId(), "river-seoul", normalizeNickname("river-seoul"), now.minusSeconds(3600)));
        member.setCredential(new MemberCredential("C-1000", member.getMemberId(), hash("demo-password"), now.minusSeconds(86400 * 10)));
        member.setNotificationPreference(new NotificationPreference("NP-1000", member.getMemberId(), now.minusSeconds(86400)));
        ContactPoint email = new ContactPoint("CP-1000", member.getMemberId(), "email", "river@example.com", contactHash("email", "river@example.com"), maskEmail("river@example.com"));
        email.verify(now.minusSeconds(86400 * 10));
        ContactPoint mobile = new ContactPoint("CP-1001", member.getMemberId(), "mobile", "01012341234", contactHash("mobile", "01012341234"), maskMobile("01012341234"));
        mobile.verify(now.minusSeconds(86400 * 10));
        member.getContacts().add(email);
        member.getContacts().add(mobile);
        member.getConsents().add(new ConsentRecord("CR-1000", member.getMemberId(), "terms", "2026-01", true, true, now.minusSeconds(86400 * 10), "registration", null));
        member.getConsents().add(new ConsentRecord("CR-1001", member.getMemberId(), "privacy", "2026-01", true, true, now.minusSeconds(86400 * 10), "registration", null));
        member.getConsents().add(new ConsentRecord("CR-1002", member.getMemberId(), "age", "2026-01", true, true, now.minusSeconds(86400 * 10), "registration", null));
        member.getRoles().add(new RoleAssignment("RA-1000", member.getMemberId(), "member", "community", "system", "initial registration", now.minusSeconds(86400 * 10), null, null, null));
        member.activate(now.minusSeconds(86400 * 10));
        members.put(member.getMemberId(), member);
    }

    public String nextMemberId() {
        return "M-" + memberSequence.incrementAndGet();
    }

    public String nextPrivacyRequestId() {
        return "PR-" + privacySequence.incrementAndGet();
    }

    public Optional<Member> findById(String memberId) {
        return Optional.ofNullable(members.get(memberId));
    }

    public Optional<Member> firstMember() {
        return members.values().stream().findFirst();
    }

    public synchronized Member save(Member member) {
        members.put(member.getMemberId(), member);
        return member;
    }

    public synchronized PendingRegistration savePending(PendingRegistration pendingRegistration) {
        pendingRegistrations.put(pendingRegistration.registrationId(), pendingRegistration);
        verificationAttempts.put(pendingRegistration.verificationAttempt().getVerificationAttemptId(), pendingRegistration.verificationAttempt());
        return pendingRegistration;
    }

    public Optional<PendingRegistration> findPending(String registrationId) {
        return Optional.ofNullable(pendingRegistrations.get(registrationId));
    }

    public void removePending(String registrationId) {
        pendingRegistrations.remove(registrationId);
    }

    public VerificationAttempt saveVerification(VerificationAttempt verificationAttempt) {
        verificationAttempts.put(verificationAttempt.getVerificationAttemptId(), verificationAttempt);
        return verificationAttempt;
    }

    public Optional<VerificationAttempt> findVerification(String id) {
        return Optional.ofNullable(verificationAttempts.get(id));
    }

    public boolean nicknameExists(String normalizedNickname, String exceptMemberId) {
        return members.values().stream()
                .filter(member -> exceptMemberId == null || !exceptMemberId.equals(member.getMemberId()))
                .map(Member::getProfile)
                .anyMatch(profile -> profile != null && profile.getNormalizedNickname().equals(normalizedNickname));
    }

    public boolean contactExists(String type, String contactHash, String exceptMemberId) {
        return members.values().stream()
                .filter(member -> exceptMemberId == null || !exceptMemberId.equals(member.getMemberId()))
                .flatMap(member -> member.getContacts().stream())
                .anyMatch(contact -> type.equals(contact.getType())
                        && contactHash.equals(contact.getValueHash())
                        && "verified".equals(contact.getVerificationStatus()));
    }

    public SearchResult searchMembers(
            String memberId,
            String nickname,
            String contactHint,
            String status,
            String role,
            String verificationLevel,
            String registeredFrom,
            String registeredTo,
            String restrictionState,
            int page,
            int size
    ) {
        List<Member> filtered = filteredMembers(memberId, nickname, contactHint, status, role, verificationLevel, registeredFrom, registeredTo, restrictionState).toList();
        List<Member> items = filtered.stream()
                .skip((long) page * size)
                .limit(size)
                .toList();
        return new SearchResult(items, filtered.size());
    }

    public PrivacyRequest savePrivacyRequest(PrivacyRequest request) {
        privacyRequests.put(request.getPrivacyRequestId(), request);
        return request;
    }

    public Optional<PrivacyRequest> findPrivacyRequest(String privacyRequestId) {
        return Optional.ofNullable(privacyRequests.get(privacyRequestId));
    }

    public List<PrivacyRequest> privacyRequestsForMember(String memberId) {
        return privacyRequests.values().stream()
                .filter(request -> memberId.equals(request.getMemberId()))
                .sorted((left, right) -> right.getRequestedAt().compareTo(left.getRequestedAt()))
                .toList();
    }

    public SearchResultPrivacy searchPrivacyRequests(String requestType, String status, int page, int size) {
        List<PrivacyRequest> filtered = privacyRequests.values().stream()
                .filter(request -> requestType == null || requestType.isBlank() || requestType.equals(request.getRequestType()))
                .filter(request -> status == null || status.isBlank() || status.equals(request.getStatus()))
                .sorted((left, right) -> right.getRequestedAt().compareTo(left.getRequestedAt()))
                .toList();
        List<PrivacyRequest> items = filtered.stream()
                .skip((long) page * size)
                .limit(size)
                .toList();
        return new SearchResultPrivacy(items, filtered.size());
    }

    private Stream<Member> filteredMembers(
            String memberId,
            String nickname,
            String contactHint,
            String status,
            String role,
            String verificationLevel,
            String registeredFrom,
            String registeredTo,
            String restrictionState
    ) {
        LocalDate from = parseDate(registeredFrom);
        LocalDate to = parseDate(registeredTo);
        return members.values().stream()
                .filter(member -> memberId == null || memberId.isBlank() || member.getMemberId().equalsIgnoreCase(memberId.trim()))
                .filter(member -> nickname == null || nickname.isBlank() || member.getProfile().getNickname().toLowerCase(Locale.ROOT).contains(nickname.toLowerCase(Locale.ROOT).trim()))
                .filter(member -> contactHint == null || contactHint.isBlank() || member.getContacts().stream().anyMatch(contact -> contact.getMaskedValue().contains(contactHint.trim()) || contact.getValue().contains(contactHint.trim())))
                .filter(member -> status == null || status.isBlank() || status.equals(member.getStatus()))
                .filter(member -> role == null || role.isBlank() || member.getRoles().stream().anyMatch(assignment -> role.equals(assignment.roleKey())))
                .filter(member -> verificationLevel == null || verificationLevel.isBlank() || verificationLevel.equals(member.getVerificationLevel()))
                .filter(member -> from == null || !member.getCreatedAt().atZone(ZoneOffset.UTC).toLocalDate().isBefore(from))
                .filter(member -> to == null || !member.getCreatedAt().atZone(ZoneOffset.UTC).toLocalDate().isAfter(to))
                .filter(member -> restrictionState == null || restrictionState.isBlank() || member.getRestrictions().stream().anyMatch(restriction -> restrictionState.equals(restriction.getStatus())))
                .sorted((left, right) -> right.getCreatedAt().compareTo(left.getCreatedAt()));
    }

    private LocalDate parseDate(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return LocalDate.parse(value.trim());
        } catch (DateTimeParseException exception) {
            throw new IllegalArgumentException("날짜는 YYYY-MM-DD 형식이어야 합니다.");
        }
    }

    public static String normalizeNickname(String nickname) {
        String normalized = Normalizer.normalize(nickname == null ? "" : nickname, Normalizer.Form.NFKC);
        return normalized.toLowerCase(Locale.ROOT).replaceAll("[\\s\\p{Punct}]+", "");
    }

    public static String contactHash(String type, String value) {
        return hash(type + ":" + canonicalContact(value));
    }

    public static String canonicalContact(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT).replaceAll("[\\s-]+", "");
    }

    public static String mask(String type, String value) {
        if ("mobile".equals(type)) {
            return maskMobile(value);
        }
        return maskEmail(value);
    }

    public static String maskEmail(String email) {
        String canonical = canonicalContact(email);
        int at = canonical.indexOf('@');
        if (at <= 1) {
            return "***";
        }
        return canonical.charAt(0) + "***" + canonical.substring(at);
    }

    public static String maskMobile(String mobile) {
        String digits = canonicalContact(mobile).replaceAll("\\D", "");
        if (digits.length() < 4) {
            return "****";
        }
        return digits.substring(0, Math.min(3, digits.length())) + "-****-" + digits.substring(digits.length() - 4);
    }

    public static String hash(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is not available", exception);
        }
    }

    public static String id(String prefix) {
        return prefix + "-" + UUID.randomUUID();
    }

    public record PendingRegistration(
            String registrationId,
            String contactType,
            String contactValue,
            String nickname,
            String normalizedNickname,
            String passwordHashRef,
            List<ConsentRecord> consents,
            VerificationAttempt verificationAttempt,
            Instant createdAt
    ) {
    }

    public record SearchResult(List<Member> items, long totalElements) {
    }

    public record SearchResultPrivacy(List<PrivacyRequest> items, long totalElements) {
    }
}
