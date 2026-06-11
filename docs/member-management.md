# Member Management

This repository implements the member management feature as a Spring Boot API, React UI, and PostgreSQL runtime.

## Local Preview

Use Docker Compose for a branch preview:

```bash
docker compose up --build
```

The API is published on `http://localhost:8080`, and the React app is published on `http://localhost:5173`.

## Demo Data

The API seeds one active member in memory at startup:

- Member ID: `M-1000`
- Nickname: `river-seoul`
- Email: `river@example.com`
- Mobile: `01012341234`

The frontend stores the active member ID in `localStorage.memberId` after registration. CMS requests use demo operator headers with read, sensitive-data, status, role, restriction, and privacy permissions.

## Smoke Workflows

1. Register a member from `/register` and submit verification code `123456`.
2. Open `/account` to update profile, contact-change challenge, and notification preferences.
3. Open `/cms/members` to search by `M-1000` or the newly registered member ID.
4. Open a member detail page to change lifecycle status, replace roles, and apply or lift restrictions.
5. Submit a member privacy request from `/privacy`, then process it from `/cms/privacy`.

## Implementation Notes

The first runnable slice uses in-memory services so branch previews work without a persistence adapter. Flyway migrations define the PostgreSQL schema required for the canonical relational model and can be used when replacing the in-memory repository with JDBC/JPA persistence.
