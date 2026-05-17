# ROSCA Circles Specification

## Overview

ROSCA Circles is the core product of CircleUp — a Swiss-first, multi-currency rotating savings platform where members of an association create or join circles to contribute regularly and take turns receiving the pooled funds. The V1.9 MVP covers the full circle lifecycle: discovery, formation, contributions, payouts, renewals, emergency-fund protection, AI-powered risk and configuration suggestions, and a B2B circle-account ledger that wraps each circle's fund for compliance and reporting. Circles are scoped to a parent **Association** and respect Swiss-tier subscription limits (Free: 10 members, Basic: 30, Pro: 100) and Enhanced-KYC thresholds (contributions above CHF 500/month).

## User Flows

### Discovery & joining
- **Browse & Discover Circles** — Search public circles by contribution amount, frequency, language, association; filter by status, payout method; view organizer trust score and association eligibility.
- **View Circle Detail** — Member roster with avatars and trust scores, payout-schedule timeline with the current cycle highlighted, financial summary, my-participation panel, and quick-nav to all sub-views (Participants, Payout Schedule, Bidding, Position Swap, Emergency Fund, Treasurer, Risk Scores, Disputes, Documents, Settings, Cash Collection, Invite, Waitlist).
- **Join a Circle** — Pre-flight eligibility check (circle not full, user is an active association member, association dues current, Enhanced-KYC verified when required). If full, join the waitlist.
- **Receive & Respond to Invitation** — Inbox of received invitations with circle details, inviter, expiry countdown; accept or decline.

### Circle creation
- **Create New Circle (Organizer)** — Multi-step wizard: Basics → Schedule → Allocation → Penalties → Review. Configures name, description, **CHF**/EUR/USD/GBP contribution amount, frequency (weekly / bi-weekly / monthly), duration (cycles), max members (must equal duration), payout method, emergency-fund rate, grace period, late-fee percentage, visibility, language. Wizard surfaces tier-limit warnings and Enhanced-KYC requirements before submission.
- **Get AI Configuration Suggestions** — Recommended max members, payout method, emergency-fund rate, grace period, and penalty rate based on similar successful circles, with stated success probability.
- **Renew Circle (Organizer + Members)** — At or near completion, organizer proposes a renewal with new start date and optional adjustments (contribution amount, duration, frequency). Members vote opt-in / opt-out within the voting deadline. On approval, a renewed circle is provisioned and members carry over.

### Membership & invitations
- **Invite Members** — Send via SMS, WhatsApp, email, or QR code; copy shareable link; track invitation status (pending / sent / accepted / declined / expired); resend or cancel.
- **Manage Waitlist (Organizer)** — Ordered list with positions, manual reorder, promote from waitlist when a spot opens, opt-in notification flags.
- **Suspend / Remove Member (Organizer)** — Reason-tagged action with audit trail (organizer cannot be removed).

### Contributions & payouts
- **Make Contribution** — View amount due (including emergency-fund portion and platform fee), select payment method, complete payment, receive Stripe-backed confirmation. Method options depend on the circle's **payment mode**: `stripe_only` (card / bank_account / sepa_debit / mobile_money / **Twint** when eligible), `hybrid` (Stripe + manual), or `manual_only` (cash collection only).
- **Twint Eligibility** — Twint surfaces only when the circle's association is Swiss (country=CH), payment_mode includes Stripe, and currency is CHF.
- **Make Partial Contribution** — Pay what you can, see remaining balance, schedule catch-up; failed payments expose `retryCount` and `failureReason`.
- **Pay for Another Member** — Select member, make payment on their behalf, optional repayment-tracking.
- **Set Up Auto-Pay** — Standing order with backup payment method.
- **View Payout Schedule** — Timeline with each cycle, recipient, scheduled date, amount, and status (completed / upcoming / scheduled); current recipient highlighted; calendar export.
- **Receive Payout** — Track status, confirm receipt, choose disbursement method (bank_account / card / Twint).
- **Request Payout Advance** — Member requests early access against future payout; organizer/platform reviews against eligibility.
- **Request Position Swap** — Submit swap to another member with reason; target accepts/declines; optionally requires organizer approval.
- **Participate in Bidding** — Submit bid in `bidding` circles, view current bids (transparency-toggle), countdown timer to bidding deadline, winner notification.

### Operations & treasury
- **Cycle Progress (All members)** — Real-time grid of who paid, who is pending, who failed; per-member retry status; collection progress vs. expected total; trigger payout button (organizer-only) once threshold met.
- **Record Cash Collection (Organizer)** — Manual cash entry for `hybrid` / `manual_only` circles; member selector, amount, location, optional notes; receipt number generated; reconciliation toggle.
- **Off-Platform Payment Recording** — Log payments made outside the platform; raise off-platform disputes; configured by per-circle off-platform-policy.
- **Treasurer / Circle Account Ledger** — Real-time balances (total collected, disbursed, emergency-fund balance, pending contributions, available for payout), pending transactions, expected-vs-actual variance per cycle, cash-flow projection, collection rate, on-time payment rate; export PDF/CSV.
- **Circle Account (B2B)** — Formal account wrapper around the circle's Fund with account number, status (active / frozen / closed / pending), recent transaction ledger, next-payout summary; provisioned automatically at circle creation.

### Health, risk & moderation
- **Circle Analytics (Organizer)** — Health metrics with benchmark comparison (collection rate, on-time payment rate, engagement), monthly trends, members-at-risk count, late-payment counts, emergency-fund usage, projected completion date.
- **Member Reliability** — Per-member reliability score and trend; flagged late-payment patterns.
- **View Member Risk Scores (Organizer)** — AI-predicted default risk (0–100) for prospective and existing members with factor breakdown (payment history, verification, tenure, engagement, network, external); summary aggregates; assess-all action; assess-applicant on demand.
- **Manage Disputes** — File dispute, attach evidence (documents / screenshots / videos), priority and type tagging, organizer acknowledge → escalate → resolve timeline; platform escalation path.
- **Churn Warnings** — Organizer-facing early-warning surface for members likely to drop, derived from engagement and payment-history signals.
- **View Emergency Fund** — Balance gauge, fund-rate, intervention history, per-intervention repayment progress, member-driven repayments (auto-debit / manual / card).

### Settings, governance, and admin
- **Circle Settings (Organizer)** — Read-only configuration display, **pause / resume** the circle, **extend** by additional cycles. Separated from organizer "Manage" actions (member management, invitations) for clarity.
- **Multi-Share (where enabled)** — Members hold more than one share in a circle, contributing and receiving proportionally; share-request and share-history tracking.
- **Document Space** — Per-circle document folders for charters, receipts, statements, signed agreements.
- **Admin Circle Monitoring (Platform Staff)** — Cross-circle dashboard for platform admins to monitor risk, flagged disputes, off-platform activity, and freeze accounts.

## UI Requirements

### Canonical layout pattern
All views adopt the **Announcements → Associations stacked-card pattern**:
- Sticky header strip with title, breadcrumb/back, primary action.
- Horizontally scrollable stats grid (2–5 cards) directly under the title.
- Search + filter chip row.
- Scrollable content stacked as rounded cards (`rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800`).
- Mobile: collapse stats to 2-up, hide secondary badges, surface a pinned "Pay Now" CTA banner per active circle.
- Dark mode is first-class for every screen.

### Screens
- **My Circles Dashboard** — Header with stats (Active / Total Contributed / Total Funds / Upcoming Payouts / Completed), search + status-filter chips, vertically stacked Circle cards with progress ring (cycle X / Y) for active circles, member-fill bar for forming circles, mobile pinned Pay-Now banner, "Discover" and "Create Circle" actions.
- **Circle Discovery** — Searchable grid with cards (contribution amount, frequency, member count, organizer trust score, start date, eligibility hint); filter chips for amount range, frequency, language, payout method, status; AI recommendations row.
- **Circle Detail** — Header with title + association + organizer + status pill + Pay-Now CTA, 4-up stats (Progress / Members / Collected / Emergency Fund), Quick-Nav chip row linking to 13 sub-views, My-Participation card, Progress card (cycle bar + contribution + frequency + next payout), Members list, Payout Schedule timeline, Recent Contributions, Financial Summary, Circle Settings summary, Emergency-Fund Activity.
- **Create Circle Wizard** — Mobile progress dots + desktop step indicator; Basics (name, description, contribution amount, currency, visibility), Schedule (frequency, duration with auto-synced max participants, AI suggestion CTA), Allocation (payout method radios, emergency-fund rate slider), Penalties (grace period, late penalty, language), Review (all fields + total-payout calculation). Tier-limit and KYC warnings surface inline.
- **Cycle Progress** — Header stats (Cycle X / Y, Due Date, Amount per member, Expected total, Collected total, Confirmed / Pending / Failed counts), Payment Grid (one row per member with status, last-paid timestamp, retry button), Payout Recipient card + trigger-payout button (organizer when threshold met).
- **Payout Schedule** — Vertical timeline with rotation order, current recipient highlighted, calendar export action, request-swap action per row.
- **Contribution Flow** — Payment card with amount due, partial-payment toggle, payment-method selector (Twint where eligible), pay-for-another-member option, confirmation modal with receipt; failure state shows retry and failure reason.
- **Pay-for-Member Modal** — Member selector, amount, attribution confirmation, optional repayment-tracking.
- **Position Swap Modal** — Member selector, swap-request form, approval-status tracking, organizer-approval indicator.
- **Bidding Interface** — Bid submission form, current-bids list with rank, transparency toggle, countdown to deadline, winner announcement.
- **Cash Collection Form (Organizer)** — Member selector, amount, location, notes, receipt-number, reconciliation checklist.
- **Treasurer Dashboard** — Real-time balance cards, pending-transaction list, expected-vs-actual cycle chart, cash-flow projection graph, collection-rate and on-time-rate gauges, export PDF/CSV.
- **Circle Account Dashboard (B2B)** — Account number + status pill, balance hero, 4-up metric cards (Total Balance, Contributions This Cycle, Emergency Fund Balance, Platform Fees Total), recent transactions table, next-payout sidebar.
- **Circle Analytics Dashboard** — Metric cards with trend arrows, benchmark-comparison bars, monthly-trends line chart, risk-indicators row, member-reliability list, risk-alerts feed.
- **Circle Renewal Panel** — Status badges (proposed / voting / approved / rejected / cancelled / created), proposal form (proposed start, new contribution amount, new duration, notes), vote summary (opt-in / opt-out / pending / required-opt-ins / deadline), per-member vote actions, organizer actions (start voting, create renewed circle, cancel).
- **Circle Settings** — Header stats (Status, Cycle, Contribution, Frequency), Status card with Pause/Resume button (organizer), read-only Configuration grid, Extend Circle controls (organizer).
- **Members Risk Panel** — Summary stats (total assessed, average risk, high/medium/low counts), member list with risk-score, factor-breakdown tooltips, recommendation, assess-all button, applicant-assessment search.
- **Dispute Management** — List with status badges, evidence upload, priority + type, organizer timeline (acknowledge → escalate → resolve), escalation to platform support.
- **Emergency Fund Panel** — Balance gauge, fund-rate stat, intervention list with covered amount and debt-remaining bar, member-driven repayment input.
- **Waitlist Management** — Ordered list with position, trust score, joined date, promote / remove / notify / reorder actions.
- **Invite Members** — Channel selector (email / SMS / WhatsApp / QR code / copy link), bulk-send form, status badges per invitation, resend / cancel actions.
- **Circle Management (Organizer)** — Member list with suspend / remove, waitlist promote, invitations panel, disputes summary. Pause / Extend live in Settings (not Management) per V1.9 reorg.
- **Circle Participants (standalone)** — Full member list with role, position, trust score, payment stats, status badge, action menu — extracted so it can be linked to from Quick-Nav and embedded in CircleDetail.
- **Admin Circle Monitoring (Platform Staff)** — Cross-circle table with health flags, dispute counts, freeze-account action, off-platform-activity filter.

### Mobile & platform
- **Mobile-first responsive**: Tailwind `sm:` / `lg:` breakpoints throughout. Mobile screens collapse multi-column grids to single-column stacks and replace inline actions with bottom-pinned CTAs.
- **Capacitor mobile shell** (Phase 1–7 in implementation): native back-button, haptics on payment confirmations, status-bar tint matched to circle status, offline banner, safe-area insets, native file-save for receipts and statements.

## Configuration

- shell: true
