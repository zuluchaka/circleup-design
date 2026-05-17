# Federations Specification

## Overview

Federations are **associations of associations** — the umbrella governance layer in CircleUp's V1.9 MVP for organisations that group multiple chapter associations under a single federation (e.g., a Swiss-wide diaspora federation with city chapters). Federation admins coordinate cross-chapter policies, leadership, finances, elections, events, alerts, and reporting while preserving each chapter's autonomy.

## User Flows

- **Federation List** — All federations the user belongs to with role and chapter count.
- **Federation Overview** — Hero stats (chapters, members, combined funds, active circles) and quick-actions row.
- **Federation Dashboard** — Chapter rollup with health indicators, recent cross-chapter activity, pending federation-level approvals.
- **Association Cards (chapter grid)** — Visual grid of chapter associations with logo, member count, health badge, primary contact.
- **Leadership Directory** — Federation-wide leaders (president, secretary, treasurer) plus per-chapter leadership; contact details.
- **Member Directory (federation)** — Cross-chapter member search with chapter filter, role, Trust Score.
- **Events Announcements (federation)** — Federation-wide announcements and events that broadcast to all chapters.
- **Financial Dashboard (federation)** — Combined finances across chapters: total funds, dues collected, EF reserves, per-chapter breakdown.
- **Election Manager (federation)** — Run federation-wide elections (typically for federation leadership) with weighted-by-chapter or one-member-one-vote.
- **Policy Manager (federation)** — Federation-level policies that bind all chapters (membership rules, code of conduct, dispute escalation).
- **Reports Center** — Generate federation-wide reports (membership, finance, governance, compliance) for download.
- **Alert Panel** — Federation-admin alerts surface: chapter at risk, federation-wide compliance flag, unusual financial activity.

## UI Requirements

- Adopts Associations stacked-card layout pattern with a "rollup" variant (cards represent chapter associations, not items).
- **Federation Overview / Dashboard**: stats hero (Chapters / Members / Funds / Active Circles / Open Alerts), chapter grid, recent-activity feed.
- **Association Cards**: chapter logo, name, member count, health-score badge, primary contact, "Open" CTA.
- **Leadership Directory**: tabs (Federation Leadership / Per-Chapter Leadership) with cards.
- **Financial Dashboard (federation)**: stats hero + per-chapter rollup table + chart of combined cash flow.
- **Policy Manager (federation)**: versioned editor with effective-date scheduling and chapter-acknowledgement tracking.
- **Election Manager (federation)**: reuses governance Election Manager with federation-scope and weighted-by-chapter option.
- **Reports Center**: report-type cards (Membership / Finance / Governance / Compliance) → form → preview → download.
- **Alert Panel**: severity-color cards with chapter context, drill-down action.

### Mobile & platform
- Mobile shows compact chapter grid (2-up); detail screens single-column with bottom-pinned actions.
- Reports download via Capacitor native file-save.

## Configuration

- shell: true
