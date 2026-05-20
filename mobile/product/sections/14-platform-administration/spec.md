# Section 14 — Platform Administration

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
