# Analytics & Reporting Specification

## Overview

Analytics & Reporting is the **standardised reporting surface** of CircleUp's V1.9 MVP — personal financial dashboard for members, savings-goal tracking, financial statements, per-circle health dashboard, per-association dashboard, per-federation dashboard, and a unified reports center. This section gives every role the metrics they need without exposing the deeper administrative tools in platform-administration.

## User Flows

- **Personal Dashboard** — Member's home for personal finance: total saved, expected payouts, dues status, EF debts, recent contributions, upcoming events.
- **Savings Goals** — Define personal savings goals (target amount, deadline, linked circles), progress tracking, milestone celebrations.
- **Statements** — Per-period (monthly / quarterly / yearly) financial statements for the member: contributions in, payouts received, dues paid, balance.
- **Circle Health Dashboard** — Per-circle health: collection rate, on-time rate, member engagement, EF usage, projected completion; benchmark vs. comparable circles.
- **Association Dashboard (analytics)** — Per-association rollup: member growth, dues compliance, circle activity, engagement; mirrors Associations' analytics with focus on read-only consumption.
- **Federation Dashboard (analytics)** — Cross-chapter rollup for federations: chapter health, combined finance trends, governance activity.
- **Reports Center** — Generate, save, and share custom reports: report type, date range, scope (member / circle / association / federation), output format (PDF / CSV / XLSX).

## UI Requirements

- Adopts Associations stacked-card layout pattern with chart-rich cards.
- **Personal Dashboard**: stats hero (Total Saved / Expected Payouts / Active Circles / EF Debts), upcoming-events strip, recent-activity feed.
- **Savings Goals**: goal cards with progress ring, deadline countdown, "Add contribution" CTA, milestone log.
- **Statements**: period picker, summary card (in / out / net), itemised list with category chips, download PDF/CSV.
- **Circle Health / Association / Federation Dashboards**: stats hero + benchmark-comparison cards + trend charts + risk-indicators row; consistent layout across scope levels.
- **Reports Center**: report-type gallery → wizard (Type → Scope → Period → Output) → preview → generate → saved-reports list.

### Mobile & platform
- Mobile-first; charts use Recharts (responsive); long tables collapse to swipeable cards.
- Reports download via Capacitor native file-save with share to email / messaging.

## Configuration

- shell: true
