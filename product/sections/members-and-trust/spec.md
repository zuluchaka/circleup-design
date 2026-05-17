# Members & Trust Specification

## Overview

Members & Trust is the **identity, reputation, and personal-profile** layer of CircleUp's V1.9 MVP — the per-user public profile, private profile editing, Trust Score gauge with factor breakdown, at-risk-members surface for organizers, payment-method management, and the canonical role/status badge library used across the product. In V1.9, Trust Score is a first-class signal feeding into circle eligibility, payout-advance approvals, Enhanced-KYC gating, and member-risk panels.

## User Flows

### Personal profile
- **My Profile Page** — User's view of their own profile: avatar, name, contact, role badges across associations/circles, Trust Score, achievements, payment methods, language preferences.
- **Edit Profile Modal** — Inline edit for display name, avatar, bio, phone, location, language; KYC re-verification trigger.
- **Add Card Modal** — Add a payment method via Stripe Elements (card / bank account / SEPA / Twint when eligible).
- **My Trust Score** — Dedicated dashboard with current score, factor breakdown (payment history, verification, tenure, engagement, network, external), trend chart, improvement recommendations.

### Public member profile
- **Member Profile** — Read-only public view of another member: avatar, name, role chips, Trust Score badge, mutual circles/associations, completed-cycles count, send-message CTA.

### Organizer-facing
- **Member Directory** — Searchable list of all members in an association/circle with role, Trust Score, KYC status, dues status, activity, action menu.
- **At-Risk Members** — Organizer surface of members flagged by churn warnings, late-payment patterns, low engagement, or KYC expiring — with one-click outreach.

### Shared UI primitives (re-used cross-section)
- **TrustScoreBadge / TrustScoreGauge** — Compact badge for inline use; full gauge for profile/dashboard.
- **RoleBadge / StatusBadge** — Standardised role chips (President / Treasurer / Secretary / Organizer / Member) and status pills (Active / Suspended / Removed / Pending KYC).

## UI Requirements

- Adopts Associations stacked-card layout pattern across all standalone screens.
- **My Profile Page**: Hero with avatar + name + Trust Score gauge; tabbed sections (About / Memberships / Payment Methods / Settings); mobile-pinned "Edit" CTA.
- **My Trust Score**: Large gauge (0–1000) with color band, factor breakdown rows (icon + score + weight + delta), trend sparkline, recommendation cards.
- **Member Directory**: Searchable table with avatar, role chip, Trust Score badge, KYC chip, dues chip, last-active timestamp, action menu (Suspend / Remove / Send Message / Change Role).
- **At-Risk Members**: Stacked cards by warning type (Churn / Late Payments / KYC Expiring / Low Engagement) with severity color, member info, suggested action, outreach CTA.
- **Member Profile (public)**: Compact hero, mutual-circles list, role badges, message CTA; respects privacy settings.
- **Edit Profile Modal / Add Card Modal**: Centered modal with focus trap, validation, success/error states; Add Card uses Stripe Elements with Twint option when association is Swiss + CHF.
- **Trust Score gauge**: Reusable component with size variants (sm = inline badge, md = card metric, lg = dashboard hero).

### Mobile & platform
- Mobile-first: stats collapse 2-up, modals become bottom sheets.
- Capacitor: avatar capture uses native camera; Touch/Face ID gating for profile edits where biometric is set up.

## Configuration

- shell: true
