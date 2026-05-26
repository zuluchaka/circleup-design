# Section 14 — Platform Administration

> **Implementation status: design pending.** Spec, `types.ts`, and `data.json` exist; no React components have been built. The `console`, `kyc`, `support`, and `flags` routes currently render the generic `ScreenStub` placeholder. Captured screenshots under `screenshots/android/` are stub renders, not real designs. **Agent-OS should not implement this section directly** — primary screens need to be designed first (spec → component → sample-data wiring → screenshots). Because this section is operator-only behind the `staff` role gate and touches every other section's data read-only, designing it well requires a dense desktop-style layout that the rest of the app's components don't yet provide. The data shape and integration contracts in this file are authoritative and safe to rely on.

## Overview

Operator-only console for the company running the CircleUp platform. Manages user accounts across all associations, AML/KYC review queues, regulatory reporting (FINMA / FADP / GDPR), support tickets, dispute resolution, system health, and feature flags. Lives behind the `staff` role gate and is not visible to regular members.

## Screens

| Slug | Purpose |
| --- | --- |
| `console` | Operator home with KPIs and queue counts. |
| `kyc` | KYC review queue with risk-scored applicants. |
| `support` | Customer support tickets with SLA timers. |
| `flags` | Feature flag console with cohort targeting. |

## UI Requirements

- **Console** uses a denser layout than member-facing screens. KPI strip (Active users, ARR, KYC backlog, Disputes open, Uptime %) at top.
- **KYC queue** lists applicants with risk score chip, country, and recommended action. Tap → detail with documents and decision buttons.
- **Support** tickets show subject, priority, owner, SLA countdown. Filter chip strip.
- **Flags** list flags with state, cohort, rollout %. Read-only for support; toggleable for engineering.

## Data Shape

`Operator KPIs`, `KycApplicant`, `SupportTicket`, `FeatureFlag`. See `data.json` and `types.ts`.

## Integration

- Sources data from every other section (read-only).
- Decisions update **Section 2** member status and **Section 9** reporting.
- Disputes can pause specific actions in **Sections 3, 4** (frozen circle, blocked disbursement).
