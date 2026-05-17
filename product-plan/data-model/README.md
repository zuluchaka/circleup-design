# CircleUp — Data Model

## Overview

CircleUp's data model is built around associations (community groups), their members, and ROSCA savings circles. The model supports multi-fund accounting, governance workflows, communication, and compliance requirements.

## Core Entities

| Entity | Description |
|--------|-------------|
| **User** | Platform user account with authentication, profile, and trust metrics |
| **Association** | Community group (diaspora association, cultural club, savings group) |
| **Membership** | User-Association relationship with role and status |
| **Circle** | ROSCA savings circle with contribution and payout configuration |
| **Participant** | User-Circle relationship with payout position and payment tracking |
| **Contribution** | Individual payment record for circle contributions |
| **Payout** | Lump sum disbursement to circle recipient |
| **Emergency Fund Intervention** | Default coverage when Emergency Fund covers missed contributions |
| **Trust Score** | AI-generated reliability metric (0-1000) with factor breakdown |
| **Payment Method** | Stored payment method via Stripe (tokenized) |
| **Transaction** | Unified financial movement audit trail |
| **Welfare Fund** | Association welfare/mutual aid fund configuration |
| **Welfare Application** | Member request for welfare benefits |
| **Event** | Community event with registration and attendance |
| **Election** | Governance election with positions and voting |
| **Proposal** | Member proposal for association decisions |
| **Vote** | Individual vote on election or proposal |
| **Notification** | User notification across channels |
| **Announcement** | Association-wide announcements |
| **Message** | Direct or group messages between members |
| **Document** | File records for association documents |
| **Audit Log** | Comprehensive activity logging for compliance |

## Relationships

```
User ──────┬──────── Membership ────────── Association
           │                                    │
           ├──────── Trust Score (1:1)          │
           │                                    │
           ├──────── Payment Method (1:N)       │
           │                                    │
           ├──────── Notification (1:N)         │
           │                                    │
           └──────── Participant ──────────── Circle
                          │                     │
                          ├── Contribution ─────┤
                          │                     │
                          └── Payout ───────────┘

Association ──┬──── Circle (1:N)
              ├──── Welfare Fund (1:N)
              ├──── Event (1:N)
              ├──── Election (1:N)
              ├──── Proposal (1:N)
              ├──── Announcement (1:N)
              └──── Document (1:N)

Circle ──┬──── Participant (1:N)
         ├──── Contribution (1:N)
         ├──── Payout (1:N)
         └──── Emergency Fund Intervention (1:N)
```

## Key Design Decisions

- **UUID Primary Keys**: All entities use UUIDv7 for globally unique, sortable identifiers
- **Soft Deletes**: `deleted_at` timestamp for data recovery and audit compliance
- **Audit Columns**: `created_at`, `updated_at` on all tables
- **JSONB Settings**: Flexible configuration storage for associations, circles
- **Stripe Integration**: All payment data tokenized via Stripe Connect
- **Trust Score AI**: ML-powered reliability assessment updated continuously
- **Emergency Fund**: 1% of contributions pooled for default protection

## TypeScript Types

See `types.ts` for the complete TypeScript interface definitions for all entities. Each section also has its own `types.ts` with more detailed, section-specific interfaces.
