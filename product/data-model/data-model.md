# Data Model

## Core Entities

### User
Platform user account with authentication, profile, and trust metrics.
- Email, phone, name, profile photo
- Trust Score (0-1000 AI-generated reliability rating)
- KYC status (none → pending → basic → enhanced)
- Role (member, organizer, admin)
- Stripe customer reference for payments

### Association
Community group (diaspora association, cultural club, savings group).
- Name, description, logo
- Type (cultural, religious, professional, savings, social, family)
- Visibility (public, private, invite_only)
- Country, language, member count
- Settings (JSONB for flexible configuration)

### Membership
User-Association relationship with role and status.
- Role (member, treasurer, secretary, president, admin)
- Status (pending, active, suspended, removed)
- Membership type (regular, student, senior, honorary, family)
- Dues paid until date

### Circle
ROSCA savings circle with contribution and payout configuration.
- Name, contribution amount, frequency (weekly, bi_weekly, monthly)
- Duration, max participants, current cycle
- Status (forming, active, completed, cancelled)
- Payout method (fixed, random, bidding, trust_score)
- Emergency fund rate (default 1%)
- Financial totals (collected, disbursed, emergency fund balance)

### Participant
User-Circle relationship with payout position and payment tracking.
- Role (organizer, member)
- Payout position (order in rotation)
- Payment stats (on-time, late, missed counts)
- Total contributed, payout received status

### Contribution
Individual payment record for circle contributions.
- Cycle number, amount, due date
- Emergency fund portion, platform fee
- Status (pending, processing, completed, failed)
- Late flag, retry count
- Stripe payment intent reference

### Payout
Lump sum disbursement to circle recipient.
- Cycle number, gross/net amount, platform fee
- Status (scheduled, processing, completed, failed)
- Scheduled date, disbursed timestamp
- Stripe transfer reference

### Emergency Fund Intervention
Default coverage when Emergency Fund covers missed contributions.
- Covered amount, debt amount, debt remaining
- Status (pending, active, repaid, written_off)
- Links defaulting participant and covered contribution

### Trust Score
AI-generated reliability metric with factor breakdown.
- Score (0-1000)
- Factors: payment history (40%), verification (20%), tenure (15%), engagement (10%), network (10%), external (5%)
- Model version, calculation timestamp

### Payment Method
Stored payment method via Stripe (tokenized, no raw card data).
- Type (card, bank_account, sepa_debit)
- Display info (last four, brand, expiry)
- Default flag, status

### Transaction
Unified financial movement audit trail.
- Type (contribution, payout, dues, fee, refund, welfare)
- Direction (credit, debit)
- Amount, currency, status
- References to related entities
- Stripe charge ID

### Welfare Fund
Association welfare/mutual aid fund configuration.
- Contribution rate, benefit types
- Waiting period, claim limits

### Welfare Application
Member request for welfare benefits.
- Benefit type, amount requested, reason
- Supporting documents, status, decision

### Event
Community event with registration and attendance.
- Title, description, type
- Date/time, location, capacity
- Ticket price, registration status

### Election
Governance election with positions and voting.
- Positions, nomination period, voting period
- Voting method, eligibility criteria

### Proposal
Member proposal for association decisions.
- Title, description, type
- Discussion period, voting period
- Quorum requirement, status

### Vote
Individual vote on election or proposal (encrypted for anonymity).
- Election or proposal reference
- Voter, choice, timestamp

### Notification
User notification across channels.
- Type, title, body
- Channel (in_app, email, sms, push)
- Read status, timestamps

### Announcement
Association-wide announcements.
- Title, content, priority
- Published/expires timestamps

### Message
Direct or group messages between members.
- Sender, recipient or conversation
- Content, sent/read timestamps

### Document
File records for association documents.
- Title, file URL, MIME type, size
- Folder reference, uploader

### Audit Log
Comprehensive activity logging for compliance.
- Event type/action, actor, IP address
- Resource affected, before/after changes
- Metadata, timestamp

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
