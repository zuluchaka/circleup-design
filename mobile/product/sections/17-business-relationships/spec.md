# Section 17 — Business Relationships  (CM-only)

## Overview

A **Business Relationship (BR)** is the formal B2B contract between a partner **Association** (the Account Holder) and **Mafao** — represented by a **Circle Manager (CM)**, an internal Mafao employee. This section is the CM's working surface: their portfolio of BRs, with the ability to triage health, drive renewals, and onboard new BRs from prospects.

The section is **gated**: only users with `is_mafao_employee = true` and an active `CircleManagerProfile` see the Relationships tab in the bottom nav. Member-side users never see it.

## Screens

| Slug | Purpose |
| --- | --- |
| `list` | CM portfolio hub: BR list with filters, metric cards, and `+ New BR` entry point. Inline lifecycle sheets on each card (activate / suspend / terminate). |
| `detail` | One BR: contract terms, fee agreement, billing history, linked Association Account, parties, lifecycle actions (activate / suspend / renew / terminate / request data export) via bottom sheets. |
| `create` | 3-step wizard: choose-or-create association → tier + fee agreement → review & send for signature. Step 1 has 3 modes (Pick existing · Create new · Migrate from spreadsheet) — this is the **only** path to bring new associations onto the platform. Lands on a confirmation card with the new `BR-XXXXXXXX` reference and 14-day deadline. |
| `dashboard` | Portfolio-level analytics: MRR trend with month-over-month delta, 6 metric tiles, tier mix stacked bar, upcoming renewals timeline (≤90d), churn-risk list. |

## UI Requirements

- **CM context strip** in the hero on every BR screen: avatar with CM-badge dot, employee ID, capacity (`active/max circles`), live MRR. This is the single source of truth for who's logged in and what they manage.
- **BR card** must always show: association logo + name, status pill, tier chip (`PRO`/`BASIC`/`FREE`), monospace BR-reference (`BR-XXXXXXXX`), relationship type, region, member count, MRR, started date, contract end date. When at-risk: a coloured banner (churn = danger, expiring ≤ 60d = warning).
- **Actions on the card are status-driven**: pending → Activate, active → Suspend, suspended → Terminate, terminated → Closed (disabled). Mirrors the Rails state machine on `BusinessRelationship`.
- **Filters** are 3 horizontal chip rows: status / tier / risk (healthy+risk / expiring / churn / overdue billing). Search is unified across BR-ref, association name, and region.
- **Metric cards** at the top of the hub: Active · Pending · At risk · MRR. Tone-coded.
- **`+ New BR` CTA** is the primary action card on the hub (above metrics), not a floating button — CMs need the explainer copy more than they need the chrome.
- **Detail screen** groups information into stacked cards: Contract terms · Fee agreement · Billing history · Account links · Documents · Danger zone. Lifecycle actions live at the bottom in a sticky-feeling action row.
- **Create-wizard step 1** has a 3-mode segmented control at the top: `Pick existing` · `Create new` · `Migrate from spreadsheet`. The picker mode shows pipeline prospects + discoverable associations. The create mode collects the essentials inline (name, region, type, currency, language, contribution baseline, terminology preset). The migrate mode is a CSV upload with parse → validate → review summary. All three modes yield a `Candidate` that the wizard carries into step 2.
- **Dark mode**: indigo gradient header darkens; tier/status pill backgrounds use `*Soft` tokens that already adapt.
- **Empty state** for the list uses a search-icon + "clear filters" action. Non-CM gate uses a Building2 icon + access-only message.

## Data Shape

The `BusinessRelationship` carries: identity (`reference`), parties (`association`, `circle_manager_profile`), terms (`relationship_type`, `fee_agreement` JSON, `subscription_tier`), lifecycle (`status` = pending/active/suspended/terminated, `started_at`, `contract_end_date`, `renewal_deadline`, `renewal_status`, `grace_period_end`, `termination_effective_at`, `data_export_status`), and rollups (`monthly_revenue`, `overdue_amount`, derived `isChurnRisk` / `isExpiringSoon` flags).

See `types.ts` for the design-time shape and `data.json` for sample CM portfolio data. The portable type intentionally flattens the Rails model — production implementations should hydrate it from `/api/v1/b2b/business_relationships` and friends.

## Integration

- BR list → routes via the bottom-nav `Relationships` tab (CM-only).
- BR detail "View detail" on a card → routes to `business-relationships/[id]`.
- `+ New BR` (future) → routes to `business-relationships/new` (wizard) or pulls a prospect from the CM pipeline.
- Account links on the BR detail → **Section 18: Association Accounts** (`overview`) and per-circle CircleAccount views.
- "Request data export" on detail → BR-US005 data-export workflow.
- BR activation auto-provisions an `AssociationAccount` (Rails: `AssociationAccount.provision_for_association!`); the activation action should make this consequence visible to the CM.

## Access Control (RBAC)

- CMs see only BRs assigned to their own `CircleManagerProfile`.
- Admins (platform-administration section) see all BRs across all CMs.
- Association presidents see read-only details of their *own* BR (not implemented in this section — that surface lives under the member-facing Associations section).

## Roadmap Anchors

- V1.1 — Circle Manager Profiles, Business Relationships, Account auto-provisioning (BR-US001…BR-US006) — Done in Rails.
- V1.6 — BR Dashboard (navigation, list, detail, discover) — Done in Rails web; this section is the mobile equivalent.
