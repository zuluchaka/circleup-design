# Projects & Fundraising Specification

## Overview

Projects & Fundraising is the **community fundraising** layer of CircleUp's V1.9 MVP — associations and circles can run public or member-only fundraising campaigns for community projects (school equipment, festival, emergency relief, scholarship fund). Distinct from ROSCAs (rotating savings among trusted members) and Credit & Lending (loans), this section supports one-way donations toward a stated goal with optional reward tiers.

V1.9 keeps the focus on association-led fundraising for community causes — not personal crowdfunding — to align with CircleUp's positioning as a community-trust platform.

## User Flows

- **Campaign List** — Browse all campaigns visible to the user: by association, status, category; filter and search.
- **Campaign Detail** — Member-facing campaign page: title, story, target amount, raised so far, donor count, days left, donation tiers, recent updates, donate CTA.
- **Donation Flow** — Multi-step: select amount (suggested or custom) → enter details (name optional / anonymous toggle / message) → choose payment method (Stripe / Twint / SEPA) → confirm → thank-you with shareable receipt.
- **Campaign Creator** — Organizer-facing campaign builder: basics (title, story, image, target, deadline) → tiers (optional reward levels) → settings (visibility, who can donate, anonymous-allowed) → review → save draft / publish.
- **Campaign Dashboard** — Organizer's per-campaign view: live donation feed, total raised, donor count, conversion rate, share/promote actions, edit/pause CTAs, post-an-update.
- **Donor Management** — Organizer view of all donors across campaigns: filter by tier / amount / recency; export contact list; bulk thank-you messages.

## UI Requirements

- Adopts Associations stacked-card layout pattern.
- **Campaign List**: filter chips (status / category / association), search, campaign cards with hero image + progress bar + raised/target + days-left badge.
- **Campaign Detail**: hero image + title + raised/target hero, donor count, days-left countdown, donation tiers card grid, story rich-text, recent-updates feed, sticky-bottom Donate CTA on mobile.
- **Donation Flow**: 3-step wizard (Amount → Details → Payment) with progress dots; mobile-pinned bottom CTAs; Twint option visible when eligible.
- **Campaign Creator**: 4-step wizard (Basics → Tiers → Settings → Review) with live preview pane (desktop) / preview step (mobile).
- **Campaign Dashboard**: stats hero (Raised / Goal / Donors / Days Left / Conversion), live-feed card, recent-donations table, "Post update" CTA opens composer.
- **Donor Management**: searchable table with filters, donor card on row-click (history, total given, tier), bulk-action toolbar.

### Mobile & platform
- Mobile-first donation flow with sticky-bottom CTA, native share for campaign links, native receipt download.
- Twint donations supported when association is Swiss + CHF + Stripe-enabled.

## Configuration

- shell: true
