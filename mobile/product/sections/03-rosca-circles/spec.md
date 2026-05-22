# Section 3 — ROSCA Circles

## Overview

The heart of CircleUp. A **Circle** is a group of members making a fixed periodic contribution and taking turns receiving the pot. This section is what members open most often. Three roles share the screens with different surfaces visible: **Member** (contribute, see schedule), **Treasurer** (collect, reconcile, manage exceptions), and **President/Organizer** (oversight, configuration, governance).

Key concepts: **cycle** (one rotation through all members), **payout order**, **contribution status** per member per cycle, the **Emergency Fund** that auto-covers defaults, and **role-gated surfaces** (organizer/treasurer extensions appear conditionally on otherwise-shared screens).

## Screens

Mobile carries the full desktop feature set, organised into phases so that the core member loop ships first and organiser/admin surfaces ship behind it.

### Phase 1 — Core member loop ✅ (built)

| Slug | Role | Purpose |
| --- | --- | --- |
| `my-circles` | Member | List of circles the member belongs to with status snapshot, pinned Pay-Now banner, branching by `active` / `forming` / `completed`. |
| `circle-detail` | Member | Single circle: my-participation, this-cycle, members preview, payout-schedule preview, recent contributions, Emergency Fund. |
| `contribute` | Member | Three-step sheet (amount → method → confirm) with EF disclosure and receipt-style review. |
| `payouts` | Member | Vertical cycle timeline with own slot highlighted, filter tabs (All / Past / Upcoming), countdown card. |
| `treasurer` | Treasurer | Cycle banner with collection ring, 3-tile summary, exception cards with inline Remind / Cover by EF / Mark-in-arrears actions, recent collections, EF activity. |

### Phase 2 — Discovery & joining

| Slug | Role | Purpose |
| --- | --- | --- |
| `discover` | Member | Browse public circles. Search bar, filter chips (amount range, cadence, language, payout method, status), AI-recommended row, paginated result cards each showing organizer trust score and eligibility hint. |
| `circle-public` | Member (non-member) | Preview-only detail for prospective members: hero, contribution + cadence, member-fill, organizer card, payout-order preview, "Request to join" CTA. No private financial data. |
| `join-request` | Member | Pre-flight eligibility sheet (circle not full, association dues current, Enhanced-KYC verified when required), reason note, submit. If full → routes to `waitlist`. |
| `waitlist` | Member | Member's own position card (position number, ahead-of-me count, joined date), expected promotion hint, opt-out action. |
| `invitations` | Member | Inbox of received circle invitations with inviter, circle summary, expiry countdown, accept / decline. |

### Phase 3 — Creating & renewing

| Slug | Role | Purpose |
| --- | --- | --- |
| `create` | Member (any) | Multi-step wizard with progress dots: Basics → Schedule → Allocation → Penalties → Review. AI-suggestion CTA on Schedule step. Inline tier-limit and Enhanced-KYC warnings. |
| `renewal` | Organizer + Members | Renewal proposal + voting panel. Status badges, proposal form (organizer), per-member vote actions (opt-in / opt-out), deadline countdown, organizer actions (start voting / create renewed / cancel). |

### Phase 4 — Live cycle ops (organizer/treasurer)

| Slug | Role | Purpose |
| --- | --- | --- |
| `cycle-progress` | Organizer/Treasurer | Real-time payment grid: header stats (Confirmed / Pending / Failed / Collected vs Expected), one row per member with status chip, last-paid timestamp, retry control; trigger-payout button when threshold met. |
| `cash-collection` | Treasurer | Bottom-sheet form for `hybrid` / `manual_only` circles: member selector, amount, location, optional notes, generated receipt number, reconciliation checklist. |
| `exception-action` | Treasurer | Full-screen variant of the exception sheet from `treasurer`: send-reminder composer, EF coverage confirm with debit explainer, mark-in-arrears with reason. |

### Phase 5 — Member-action sheets

| Slug | Role | Purpose |
| --- | --- | --- |
| `pay-for-member` | Member | Sheet: member selector, amount field, attribution confirmation, optional "track as repayment" toggle. |
| `position-swap` | Member | Sheet: target-member selector, reason note, approval-status indicator, organizer-approval requirement flag. |
| `bidding` | Member (bidding circles) | Bid submission with current-bids list, transparency toggle, countdown to deadline, winner-announcement card. |
| `payout-advance` | Member | Sheet: requested amount, reason, eligibility check (against future payout), organizer/platform review status. |
| `auto-pay` | Member | Toggle on/off, primary + backup method selectors, standing-order summary. |

### Phase 6 — Health, risk & moderation

| Slug | Role | Purpose |
| --- | --- | --- |
| `analytics` | Organizer | Health metrics with trend arrows, benchmark-comparison bars, monthly-trends sparkline, risk-indicators row, member-reliability list. |
| `risk-scores` | Organizer | Member risk panel: summary stats (total assessed, average risk, high/med/low counts), per-member score with factor-breakdown chip, assess-all action, applicant-assessment search. |
| `disputes` | All (role-aware) | List with status badges (open / acknowledged / escalated / resolved), priority + type, evidence-upload sheet, organizer timeline, platform escalation path. |
| `dispute-detail` | All (role-aware) | Single dispute: evidence carousel, action timeline, comment thread, next-step CTAs. |
| `emergency-fund` | Member + Organizer | Balance gauge, fund-rate stat, intervention list with debt-remaining bar per row, member-driven repayment input. |

### Phase 7 — Settings & governance

| Slug | Role | Purpose |
| --- | --- | --- |
| `settings` | Organizer | Header stats (Status / Cycle / Contribution / Frequency), Pause/Resume card, read-only Configuration grid, Extend-Circle control. |
| `management` | Organizer | Member list with suspend/remove, waitlist promote, invitations panel, disputes summary. Pause / Extend live in `settings`, not here. |
| `invite` | Organizer | Channel-selector sheet (Email / SMS / WhatsApp / QR code / copy link), bulk-send form, per-invitation status badges, resend / cancel. |
| `participants` | All | Full member list with role, position, trust score, payment stats, status badge, action menu — linkable from Quick-Nav and embedded as the preview in `circle-detail`. |
| `multi-share` | Member (where enabled) | Share-request form, current-shares card, share-history list with proportional contribution/payout breakdown. |
| `documents` | All | Per-circle folder: charters, receipts, statements, signed agreements; viewer + download. |

### Phase 8 — Account & admin

| Slug | Role | Purpose |
| --- | --- | --- |
| `circle-account` | Treasurer + Organizer | B2B account wrapper: account number, status pill, balance hero, 4-up metric cards (Total Balance / Contributions This Cycle / EF Balance / Platform Fees), recent transactions table, next-payout sidebar. |
| `admin-monitoring` | Platform Staff | Cross-circle table with health flags, dispute counts, off-platform-activity filter, freeze-account action. |

## UI Requirements

### Canonical mobile layout

- **AppHeader** at top: title, optional subtitle, back arrow when sub-routed, trailing icon button.
- **Hero strip** (where relevant): coloured by circle accent or status; carries the single most important number on the screen.
- **Stats grid**: 2-up on phones; collapse from desktop's 4-up.
- **Stacked cards**: rounded `radius.lg`, hairline border, `space.lg` padding. Dark mode is first-class.
- **Action bar**: pinned bottom CTA for screens with a single primary action (Pay now, Submit, Confirm, etc.).
- **Bottom sheets** instead of modals for short workflows (Pay-for-member, Position swap, Cash collection, Invite channel picker, etc.). Backdrop dims, drag handle visible, dismiss-on-backdrop.
- **Quick-Nav row** in `circle-detail`: horizontally scrollable chip strip linking into the Phase 4–8 sub-routes that are actually visible to the user's role.

### Per-screen specifics (Phase 2 onward — Phase 1 already documented in built components)

- **Discover**: search bar pinned under the header; below it a horizontally scrolling AI-recommendations row, then filter chips, then result cards. Each card shows: name, contribution + cadence pill, member-fill bar, organizer avatar + trust badge, eligibility hint ("Eligible", "Dues outstanding", "Full · waitlist").
- **Circle (public)**: same hero pattern as `circle-detail` but no financial-private blocks (no my-participation, no EF activity, no recent contributions). Bottom CTA = "Request to join" → routes to `join-request`.
- **Join request**: eligibility list with green checks / red blockers; if any blocker, CTA disabled with explanatory copy. Reason note input. Submit creates a request and returns to `my-circles` with a "Pending" status chip.
- **Waitlist**: large position number, "X members ahead of you", expected promotion estimate, "Leave waitlist" secondary action.
- **Invitations**: inbox rows with circle accent dot, inviter avatar, expiry countdown pill; tap → sheet with circle summary + accept / decline.
- **Create wizard**: progress dots at top; each step uses standard form patterns (text input, segmented control, radio, slider). AI suggestion CTA renders an in-step "Apply suggestion" card. Review step shows the full configuration as a read-only summary card with edit affordances per section. Tier-limit / KYC warnings as inline alert blocks.
- **Renewal**: status pill at top (Proposed / Voting / Approved / Rejected / Cancelled / Created); proposal form for organizer; for members, a vote card with opt-in / opt-out radio + deadline countdown.
- **Cycle progress**: 4-tile header (Cycle X/Y, Due date, Per member, Collected vs Expected), then a payment grid (one row per member: avatar, name, status chip, last-paid timestamp, retry icon). Sticky footer "Trigger payout" appears only when threshold is met and the user is the organizer.
- **Cash collection**: member selector chip, large amount input, location + notes inputs, generated receipt number preview, reconciliation toggle.
- **Pay-for-member**: member chip, amount input pre-filled to the missing contribution, "Track as repayment" toggle, confirm CTA.
- **Position swap**: target-member selector, reason note, requires-organizer-approval indicator, "Send swap request" CTA.
- **Bidding**: countdown banner at top, bid input with min/max guidance, current-bids list (transparency toggle hides amounts when off), submit CTA.
- **Payout advance**: amount input capped at future-payout amount, reason note, eligibility checklist, submit CTA.
- **Auto-pay**: master toggle, primary method + backup method selectors, "Active from next cycle" status footer.
- **Analytics**: 4-tile trend strip (Collection rate / On-time rate / Engagement / At-risk count) with up/down arrows; below, monthly-trends sparkline; benchmark-comparison bar group; member-reliability list (top 5 + "See all").
- **Risk scores**: summary tiles (Total assessed / Avg risk / High / Med / Low), then a sortable list; each row expands to show factor breakdown (payment history, verification, tenure, engagement, network, external).
- **Disputes**: tabs (Open / Resolved). List rows show priority dot, type icon, status pill, last-update timestamp. Tap → `dispute-detail` with evidence carousel, action timeline, comment thread, role-aware CTAs.
- **Emergency Fund**: balance gauge top, fund-rate stat alongside, intervention list with each row carrying a debt-remaining bar; repayment input docked at bottom.
- **Settings**: status pill + Pause/Resume button at top; configuration grid below; Extend-Circle stepper at bottom (organizer only).
- **Management**: tabs (Members / Waitlist / Invitations / Disputes). Members tab supports suspend/remove from a per-row action menu.
- **Invite**: channel chips (Email / SMS / WhatsApp / QR / Link); selecting a chip swaps the lower form between bulk-send (Email/SMS/WhatsApp) or QR display or copy-link preview. Sent invitations list at bottom with status badges.
- **Participants**: identical to the embedded preview in `circle-detail` but full-list, sortable, filterable; per-row action menu role-aware.
- **Multi-share**: current-shares card (X of Y allowed), share-history list with proportional breakdown (e.g., 2 × CHF 200 + 2 × CHF 2 EF = CHF 404), share-request form.
- **Documents**: folder grid (Charter / Receipts / Statements / Signed agreements) → list view per folder → viewer screen (PDF/image) with download action.
- **Circle account**: account-number header pill (status colored), balance hero, 4-up metric grid, recent-transactions table, next-payout summary card.
- **Admin monitoring**: cross-circle table with health flags column, dispute counts, off-platform-activity filter, per-row freeze-account action behind a confirm sheet.

### Cross-cutting patterns

- **Role-gating**: organizer-only / treasurer-only / admin-only surfaces are hidden — not disabled — for users without the role. Quick-Nav chips omit entries the user can't access.
- **Default coverage flow**: when a contribution is auto-covered by the EF, the affected member's row shows a yellow chip "Covered by EF" with a tap-through explainer.
- **Twint eligibility**: Twint surfaces only when the circle's association is Swiss (`country=CH`), `paymentMode` includes Stripe, and currency is CHF.
- **Off-platform policy**: per-circle flag governs whether Cash Collection / Off-Platform Recording surfaces appear at all.
- **Native back behaviour**: every sub-route supports the system back gesture without losing form state in active sheets.
- **Haptics**: success haptic on contribution confirm, payout trigger, dispute resolve.
- **Offline**: cycle-progress and treasurer surfaces show a stale-data banner when the device is offline; contribute is fully blocked offline.

## Data Shape

A `Circle` has cadence, contribution amount, cycle index, member list with payout order, status (`active` / `forming` / `completed`), payment mode (`stripe_only` / `hybrid` / `manual_only`), payout method (`fixed` / `bidding` / etc.), KYC and penalty parameters, and aggregated stats. Each member has a per-cycle `ContributionStatus`. Phase 2+ adds: invitations, waitlist entries, join requests, renewal proposals, bids, swap requests, disputes (with evidence references), risk scores (with factor breakdown), EF interventions and repayments, document references, and circle-account transactions. See `data.json` and `types.ts` — these expand as each phase lands.

## Integration

- Contribution success → posts an `Activity` to **Section 1: Associations** (`dashboard` recent activity).
- Default → triggers a **Section 10: AI Insights** risk alert and an **Section 6: Communication & Events** notification to the treasurer.
- Emergency Fund coverage → debits the Emergency Fund balance held by **Section 4: Treasury & Funds**.
- Trust badges everywhere → reference **Section 2: Members & Trust**.
- Multi-share modifier → if the member holds more than 1 share (**Section 12**), contribution amount and payout amount scale proportionally.
- Circle creation / renewal → provisions a Circle Account via **Section 18: Association Accounts**.
- Disputes → escalation path routes to **Section 14: Platform Administration**.
- Documents → per-circle folder stored under **Section 7: Documents**, linked from the circle's `documents` route.
- Invitations sent via WhatsApp / SMS / Email → handled through **Section 6: Communication & Events** delivery infrastructure.
