# Federations Specification

## Overview
The Federations section enables federation presidents and treasurers to establish and manage umbrella organizations that coordinate multiple child associations. It provides federation setup with governance configuration, child association linking, shared policy cascading, cross-association oversight with aggregated dashboards, consolidated financial management (dues collection, multi-fund accounting, budgeting, inter-association transfers), federation-wide elections and voting, cross-association member directory, federation reporting, and inter-association event coordination.

## User Flows
- **Create Federation** — Verified organizer completes setup wizard (name, description, logo, governance type, founding charter). Assigned Federation President role.
- **Link Child Associations** — Search and invite associations to join the federation. Association presidents accept/decline. Multi-level org tree visualization (federation > associations > circles).
- **Manage Federation Leadership** — Assign roles (Vice-President, Secretary General, Treasurer General, Committee Chair) with customizable permissions. Term limits and role transfer with 48-hour cooling period.
- **Define Governance Policies** — Create policies (Trust Score minimums, verification standards, contribution limits, code of conduct) with enforcement levels: Mandatory, Recommended, or Optional. Cascade to all child associations with compliance tracking.
- **Federation Dashboard** — Aggregated metrics across all associations: total members, active circles, combined financials, federation health score. Drill-down into individual associations. Side-by-side comparison of up to 4 associations. Threshold alerts for anomalies.
- **Consolidated Member Directory** — Aggregated member list across all child associations showing affiliations, roles, and cross-association memberships. Search, filter, and export (CSV/PDF).
- **Federation Financial Dashboard** — Consolidated finances: total balance, income vs expenses (MTD/YTD), per-association financial summaries. Cash flow trend charts with 12-month rolling view.
- **Collect Federation Dues** — Configure dues (flat or per-member, annual/quarterly). Automated invoicing, payment tracking, grace periods, and escalation for overdue associations.
- **Manage Federation Funds** — Multiple fund accounts (General, Event, Reserve, Special Projects). Configurable allocation rules for incoming dues. Inter-fund transfers with audit trail. Minimum threshold alerts.
- **Annual Budget Management** — Create budget with categorized allocations. Track spending against approved budget. Early warning at 80% threshold. Year-over-year comparison.
- **Inter-Association Transfers & Grants** — Initiate transfers from federation to child associations with multi-approval workflow. Complete transfer history log.
- **Federation Financial Reports** — Generate AGM reports, budget vs actual, transaction audit logs. Export as branded PDF or Excel. Schedule recurring auto-generated reports.
- **Federation Elections & Voting** — Create elections (president, board, referendum) with nomination periods, secret ballots, and automatic result tallying. Tamper-proof audit trail with participation rates by association.
- **Federation Events & Announcements** — Create federation-wide events targeting specific associations. Track RSVP and attendance by association. Broadcast announcements with "Federation" badge.
- **Cross-Association Member Mobility** — Members transferring between child associations retain their federation-level Trust Score and participation history.
- **Federation Compliance Dashboard** — Monitor child association compliance with federation policies. Compliance deadlines, violation alerts, and remediation tracking.

## UI Requirements
- Federation Dashboard: hero section with federation branding, aggregated stats row, association health cards with drill-down, alert panel for threshold breaches
- Organizational Tree: interactive multi-level hierarchy visualization (federation > associations > circles)
- Association Comparison: side-by-side metric comparison grid for up to 4 associations with color-coded performance indicators
- Policy Manager: create/edit policies with enforcement level toggles, compliance tracker showing acknowledgment status per association
- Financial Dashboard: multi-fund balance overview, income vs expense charts (12-month rolling), per-association financial cards, alert flags for overdue dues
- Dues Management: configuration panel with dues rules, invoice list with payment status (Paid/Pending/Overdue), automated escalation timeline
- Budget View: category-based budget vs actual with variance indicators (green/yellow/red), year-over-year comparison charts
- Member Directory: searchable/filterable aggregated list with association affiliation badges, cross-membership indicators, export options
- Election Manager: wizard for election setup, candidate profiles with endorsements, secret ballot interface, results dashboard with participation analytics
- Leadership Directory: role cards with permissions, term expiration indicators, role transfer workflow
- Federation Events: event creation form with multi-association targeting, RSVP analytics by association, announcement feed with federation badge
- Reports Center: report type selector, branded PDF preview, scheduling configuration, download options
- Fully responsive (mobile-first), light and dark mode support

## Configuration
- shell: true
