# Associations Specification

## Overview

The Associations section is the **organizational container** for CircleUp's V1.9 MVP — a Swiss-first platform where diaspora associations, cultural clubs, ROSCA savings groups, and federations manage their members, governance, finances, and ROSCA circles together. Each association has a customizable identity (branding, cultural terminology, language), subscription tier (Free / Basic / Pro), and operates as the **regulatory and financial parent** of all the circles created within it. V1.9 introduces formal president onboarding, treasurer-managed ledger and dues, compliance document handling, organizer-performance tracking, multi-association membership, and an end-to-end migration wizard for importing existing associations onto CircleUp.

This section is the canonical home for the **Associations stacked-card layout pattern** that V1.9 has converged on across the product (Circles, My Finances, Events, Messages are restyled to match).

## User Flows

### Membership lifecycle
- **My Associations Dashboard** — All associations the user belongs to with role badges (President, Treasurer, Secretary, Organizer, Member), member count, unread activity, quick actions; "Discover" and "Create" entry points. Surfaces two inline lifecycle sections at the top:
  - **Pending invitations** — invitations received from other associations, with inline Accept / Decline.
  - **Pending requests** — join requests the user has submitted that are still awaiting approval, with status, expiry, and a Cancel request action. Cancelling removes the request from the association's review queue.
  - **Empty state** — first-time users with no associations, no invitations and no pending requests see a single empty-state card with "Browse Associations" and (when a payment card is on file) "Create Your Own"; otherwise a contextual nudge to add a card before creating.
- **Multi-Association Dashboard** — For users in many associations, a higher-density cross-association overview with switcher and consolidated counts.
- **My Associations List** — A denser, single-column alternative to the Dashboard for power-users. Same data, no inline lifecycle sections, sorted list of belongings; used inside compact shell layouts and as a fallback when the dashboard cards would scroll excessively.
- **Discover Associations** — Search/filter by type, language, location, association type (cultural, savings, professional, federation); request to join with eligibility pre-check.
- **View Association Dashboard** — Branding hero, stats strip (members, circles, total funds, EF balance), announcements, activity feed, role-appropriate quick actions; pinned restyle-pattern header.
- **Invite / Apply / Join** — Generate invite links, send SMS/email/WhatsApp, manage pending invitations (admin side), track join requests (admin side). The member-facing counterparts live in **My Associations Dashboard** (Pending invitations + Pending requests sections above).

### Governance & president lifecycle
- **President Onboarding Wizard** — Multi-step setup for incoming president: contract review, governance handoff, banking & treasury linkage, communication preferences, kick-off announcement.
- **President Contract Review** — Token-gated contract acceptance page for a nominated president; accept or request modifications.
- **President Dashboard Widgets** — Composite widgets surfacing risks, member messages, pending approvals, financial alerts; deep-linkable from notifications. The **Pending approvals** banner aggregates counts across approval queues — **Request to join** (links to a review modal), Transaction approvals, and Dues disputes. The Request-to-join modal shows the applicant profile (avatar, location, Trust Score, mutual members), the applicant's message, and a list of **eligibility pre-checks** (KYC, language, Trust Score threshold, geo/residence, referral, duplicate-membership) each with a passed / warning / failed / manual-review state and a recommendation verdict (auto-approve / needs review / blocking). The president can **Approve** or **Reject with a reason** inline; rejected requests carry the reason back to the applicant.
- **President Notification Center** — Inbox of governance-relevant notifications: at-risk circles, escalated disputes, finance approvals, succession reminders.
- **President Succession** — Formal handover flow: nominate successor, vote/confirm, contract review, role swap with audit trail.
- **Organizer Performance** — Per-organizer metrics: circles managed, on-time rate, disputes, member satisfaction; surfaced to president for performance reviews.

### Members & roles
- **Member Directory** — Searchable list with avatar, role, join date, KYC status, dues status, action menu (suspend, remove, change role).
- **Chapter Directory** — For federation/multi-chapter associations: list of chapters with member counts and primary contact.
- **Policy Manager** — Define and version association policies (membership rules, code of conduct, dispute resolution).

### Finance, dues, treasury
- **Association Finance View** — Top-level finance entry point: balances, recent transactions, link-outs to ledger, dues, subscriptions.
- **Association Ledger Dashboard** — Full double-entry ledger view for treasurers: monthly entries, categories, subscription tier banner, recent billing records, "Subscription paid" CTA.
- **Treasurer Member Ledger Dashboard** — Per-member ledger drill-down: dues paid, owed, EF debt, manual adjustments.
- **Financial Overview** — Executive summary card: collected vs. disbursed, EF balance, projected runway.
- **Dues Config Form** — Treasurer configures association-wide dues: amount, frequency, grace period, late-fee, enforcement actions.
- **Dues Payment Modal** — Member-facing dues payment with Stripe / Twint / SEPA / Manual; partial-payment supported.
- **Member Dues History** — Per-member dues timeline with status badges and treasurer-only manual adjustment.
- **Dues Dispute Form** — Member files a dispute on a dues charge; treasurer reviews and resolves.
- **Transaction Approvals List** — Treasurer queue for transactions requiring co-sign or president approval (above-threshold disbursements, refunds, manual adjustments).
- **Subscription Management** — View current tier, member-cap usage, KYC threshold status, upgrade/downgrade CTA, billing history.
- **Subscription Payment Modal** — Pay invoices via Stripe/Twint with auto-renew toggle.
- **Ledger Report Viewer** — Generate and view PDF/CSV ledger reports for a date range; download to device (native save on mobile via Capacitor).

### Communications
- **Announcements Dashboard** — Composer + feed: pin, edit, delete, schedule announcements; receipt tracking.
- **Announcement Card** — Reusable card for embedding in dashboards.
- **Activity Feed** — Chronological cross-event activity stream (new members, payouts, disputes, dues, announcements).

### Compliance
- **Compliance Document Center** — Upload, categorize (incorporation, bylaws, KYC, contracts, tax), archive, download; visible to president/treasurer/secretary.

### Circles integration
- **Association Circles View** — Lists all ROSCA circles under the association with health, dues-coverage flag, organizer; deep-link to `rosca-circles` section.

### Federation
- **Federation Dashboard / Federation Analytics** — For federations (associations of associations): chapter rollup, cross-chapter metrics, federation-wide announcements and policies.

### Migration (importing onto CircleUp)
End-to-end guided wizard for onboarding existing associations:
- **Phase 1 — Association Setup Import** — Profile, governance structure, rules/bylaws, privacy and communication preferences.
- **Phase 2 — Member Roster Import** — CSV/XLSX upload, smart parsing, field mapping with confidence indicators, validation, bulk invitations, onboarding-funnel tracking.
- **Phase 3 — Circle Structure Import** — Per-circle config + payout order + mid-cycle state via Payment Matrix grid; multi-circle support.
- **Phase 4 — Historical Financial Data Import** — Contribution / payout / dues history; Trust Score bootstrap; immutable audit trail.
- **Phase 5 — Validation & Go-Live** — Blocking/warning report, member self-verification, immediate-vs-scheduled go-live with countdown, Emergency Pause.
- **Member Import Wizard** — Standalone reusable wizard for adding members at any point (not only initial migration).

### Health & monitoring
- **Health Scorecard** — Composite score (collection rate, member engagement, dispute load, EF usage, compliance status); displayed on Dashboard and standalone.

### Administration
- **Association Administration** — Cross-cutting admin panel: alerts, federation membership, billing, compliance shortcuts.
- **Association Analytics** — Member growth, dues compliance, engagement, circle activity.
- **Association Settings** — Tabbed: General, Branding, Language & Culture, Privacy, Governance, Subscription.

## UI Requirements

### Canonical layout — Associations stacked-card pattern
This is the **reference layout** the rest of the V1.9 product restyles to:
- Sticky header strip: title (with back chevron), subtitle, primary action(s).
- Horizontal 2–5 card stats grid directly under header (collapses 2-up on mobile).
- Filter chip row + search input.
- Stacked cards (`rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4–6`) for content sections.
- Mobile pinned bottom action where relevant.
- Dark mode parity throughout.

### Screens
- **My Associations Dashboard / Multi-Association Dashboard / My Associations List** — Stacked association cards (Dashboard) or dense rows (List), role badges, member count, fund summary, "Open" CTA. Dashboard variant includes top sections for **Pending invitations** (with Accept / Decline) and **Pending requests** (with Cancel).
- **President Pending-Approvals Banner + Join Request Review Modal** — Banner card on President Dashboard with per-queue counts; Request-to-join modal lists requests in a sidebar and shows eligibility pre-checks, applicant context, and Approve / Reject (with reason) actions per request.
- **Discover Associations** — Filter chips, association cards with type badge, language, member count, "Request to Join".
- **Create Association** — Two-card method picker (From Scratch / Import) → respective wizard.
- **Association Dashboard** — Branding hero, stats strip, announcements + activity, role-conditional CTAs.
- **President Dashboard Widgets** — Multi-card widget board.
- **President Onboarding Wizard** — Stepper with contract, governance, treasury, comms.
- **President Contract Review** — Single contract page with Accept / Request Modification.
- **President Notification Center / President Succession** — Notification list and succession flow.
- **Organizer Performance** — Sortable table with per-organizer metrics.
- **Member Directory / Chapter Directory** — Searchable table/list with role chips and action menu.
- **Policy Manager** — Versioned policy editor.
- **Association Finance View / Ledger Dashboard / Financial Overview** — Tabbed/sectioned finance hub with stats and ledger table.
- **Treasurer Member Ledger Dashboard** — Per-member finance drill-down.
- **Dues Config / Dues Payment Modal / Member Dues History / Dues Dispute** — Config form, payment modal, history list, dispute form.
- **Transaction Approvals List** — Queue with approve/reject, threshold info, audit trail.
- **Subscription Management / Subscription Payment Modal** — Tier card, usage gauges, billing history, payment modal.
- **Ledger Report Viewer** — Report list, generate-new form, download/share.
- **Announcements Dashboard** — Composer + feed.
- **Activity Feed** — Chronological list with type icons.
- **Compliance Document Center** — Upload, category filter, archive, download.
- **Association Circles View** — Stacked circle cards (links to `rosca-circles`).
- **Federation Dashboard / Federation Analytics** — Cross-chapter rollups.
- **Migration Dashboard / Migration Wizard / Phase 1–5 panels** — 5-phase progress with circle cards, member funnel, validation, go-live activation.
- **Health Scorecard** — Composite gauge + factor breakdown.

### Mobile & platform
- Mobile-first responsive: 2-up stats on `<sm:`, single-column content stacks, bottom-pinned actions for primary CTAs.
- Native file-save (Capacitor) for ledger reports, member-roster exports, compliance PDFs.

## Configuration

- shell: true
