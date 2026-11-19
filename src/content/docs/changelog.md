---
title: Changelog
description: Kinglet release notes, generated from GitHub Releases.
---

Every release is published on [GitHub Releases](https://github.com/rushlightlab/kinglet/releases).
This page is regenerated from those releases during the site build.

## v0.3.0: Small. Light. King.

**2026-11-19** · [GitHub release](https://github.com/rushlightlab/kinglet/releases/tag/v0.3.0) · latest

Small. Light. King. — the first tagged release of Kinglet: a tiny self-hostable log platform in one container.

#### Added

- HTTP ingestion for NDJSON and JSON batches, including level, service, env, fields, and timestamp normalization.
- Live tail over SSE with follow mode, SQLite FTS5 substring search, filter grammar, and a histogram with drag-to-zoom.
- Monitors and alerts for instant matches, rate spikes, and silence, with webhook, Discord, and Slack channels, cooldowns, count-monitor auto-resolve, and test notifications.
- Better Auth email/password accounts with admin/member/viewer roles, per-project memberships, and project-scoped `kl_` API keys.
- Multi-project isolation, project member management, scoped key management, saved searches, shareable permalinks, and keyboard navigation.
- Retention, per-project event caps, local database caps, ingest/query limits, and admin diagnostics.
- Docker Compose deployment, a production-only non-root image with a healthcheck, a Caddy TLS sample, and Litestream-friendly storage.

#### Changed

- Storage is one libSQL client for local SQLite or hosted Turso, with Drizzle ORM migrations.
- The production image is built from a production-only dependency tree and no longer carries dev tooling or source.
- Browser sessions use a short signed cookie cache; mutations revalidate against the database.
- Legacy `tok_` tokens remain available and can be disabled with `KINGLET_DISABLE_LEGACY_TOKENS=1`.

#### Security

- CSRF protection for cookie-authenticated mutations.
- SSRF-safe webhook delivery with DNS pinning and private-range blocking.
- API-key offboarding when a user is demoted or deleted, plus strict key scope validation.
- Session revocation on role changes and account deletion.
- Histogram, query, ingest, and SSE resource limits.
- Security headers, non-root containers, hardened CI, and pinned GitHub Actions.

#### Images

`ghcr.io/rushlightlab/kinglet:0.3.0` · `:0.3` · `:latest`

**Docs:** https://kinglet.rushlightlab.com

**Full commit history:** https://github.com/rushlightlab/kinglet/commits/v0.3.0
