# Platform Administration Specification

## Overview

Platform Administration is the **platform-staff workbench** for CircleUp's V1.9 MVP — system-wide oversight, compliance monitoring, dispute resolution, RBAC, feature flags, configuration, and support inbox. This section is **not member-facing**; access is gated by platform-admin roles and audited via the RBAC audit trail.

V1.9 adds permission simulator and matrix tools, expanded compliance dashboard, transaction monitoring with anomaly detection, and a feature-flag system for staged rollouts.

## User Flows

### Operations
- **Admin Dashboard** — Cross-platform health: associations, circles, members, transactions today, open disputes, compliance alerts, system status.
- **System Health** — Live status of platform components (API, payments, mailers, jobs, mobile push); incident timeline.
- **Transaction Monitor** — Real-time transaction feed with filters (status, amount, currency, payment method); anomaly highlights.
- **Compliance Dashboard** — Cross-association compliance posture: KYC coverage, AML flags, document expirations, regulatory reports.
- **Dispute Center** — Centralised dispute queue across all associations/circles with severity, age, action button (escalate / resolve / refund).
- **Support Inbox** — Member-submitted support tickets with conversation history, assignment, SLA timer.

### Access & permissions
- **User Management** — Search/edit all platform users; suspend, verify, force-logout, change role.
- **User Permissions** — Per-user permission view: assigned roles, inherited permissions, recent permission changes.
- **Role Manager** — Define and edit platform roles (CSV / association-admin / treasurer-helper / support / read-only).
- **Permission Matrix** — Visual matrix of roles × permissions with bulk edit.
- **Permission Simulator** — "Login as" simulator: select user → preview their effective permissions and accessible UI without affecting real auth.
- **RBAC Dashboard / RBAC Audit Trail** — Stats on role assignments, recent changes, full audit log of who-changed-what-when.
- **Access Requests** — Inbox of users requesting elevated access; approve/deny with reason; logged in audit trail.

### Configuration
- **Configuration Panel** — Platform-wide config (FX rates, default tier limits, KYC thresholds, EF default rate, support email).
- **Feature Flags** — Toggle features (per-tier / per-association / per-percentage rollout); flag history and rollback.

## UI Requirements

- Adopts Associations stacked-card layout pattern, with a denser variant for tables (more rows per viewport).
- **Admin Dashboard**: stats hero (Associations / Circles / Members / Transactions Today / Open Disputes / Compliance Alerts), system-status strip, recent-activity feed.
- **Dispute Center / Support Inbox**: split-pane on desktop (queue list + detail), single-pane on mobile.
- **Transaction Monitor**: live-updating table with anomaly badges, drill-down to transaction trace.
- **Compliance Dashboard**: KPI tiles (KYC coverage, AML flags, doc expirations), heatmap by association, "Generate regulatory report" CTA.
- **Permission Matrix**: scrollable matrix with sticky row/column headers, cell-level toggles, bulk-select tools.
- **Permission Simulator**: user-picker + "Simulate" → mock UI tree with permission badges (allowed / denied / inherited).
- **Feature Flags**: flag list with rollout slider, toggle, audience selector, history drawer.
- **RBAC Audit Trail**: filterable table with actor, action, target, timestamp, reason.

### Mobile & platform
- This section is primarily desktop-optimised; mobile gets a read-only summary plus emergency actions (freeze account, escalate dispute).
- All actions are logged to RBAC Audit Trail with actor + reason + before/after state.

## Configuration

- shell: true
