# Treasury & Funds Specification

## Overview

Treasury & Funds is the **money operations** layer of CircleUp's V1.9 MVP — circle-scoped fund views, treasury dashboards, multi-currency settings, transaction ledger, reconciliation tooling, investment management, PostFinance import flow (Swiss-specific), financial reports, and emergency-fund administration. Where the `rosca-circles` section provides per-circle contribution / payout UI, this section is the **treasurer's workbench** for visibility, control, and compliance across all circles and association-level funds.

Treasury V1.9 emphasises Swiss-bank-aware tooling (PostFinance CSV import, CHF as default, multi-currency support EUR/USD/GBP), audit-grade ledger output, and an explicit reconciliation flow between platform-recorded transactions and external bank statements.

## User Flows

### Treasurer overview
- **Treasury Dashboard** — Top-level treasurer view: balances across all circle funds + association account, pending reconciliations, emergency-fund usage, recent transactions, action queue.
- **Circle Fund Detail** — Per-circle deep-dive: real-time balance, pending contributions / payouts, EF interventions, audit trail.

### Ledger & transactions
- **Transaction Ledger** — Full double-entry ledger view: filter by circle, date, category, status; export PDF/CSV.
- **Reconciliation Console** — Side-by-side platform ledger vs. external bank statement; match transactions, flag discrepancies, post adjustments with reason and audit trail.
- **PostFinance Import Flow** — Swiss-specific import wizard: upload PostFinance CSV → auto-detect format → preview parsing → map to ledger entries → confirm and post.

### Reporting & compliance
- **Financial Report Panel** — Generate period reports (monthly / quarterly / annual) with summary KPIs, balance sheet, cash flow.
- **Audit Report Generator** — Generate auditor-ready reports with full transaction history, EF interventions, reconciliation records, and signatures.

### Multi-currency
- **Multi-Currency Settings** — Per-association/per-circle currency selection (CHF default, EUR/USD/GBP supported), exchange-rate source, conversion display rules.

### Investments (optional, V1.9 preview)
- **Investment Manager** — Surface idle EF balances and propose conservative placement (money-market, bond ladders). Read-only preview in V1.9 MVP.

### Emergency fund
- **Emergency Fund Panel** — Treasury-side view of EF balance, interventions, recoveries, and contribution sources (cross-referenced from rosca-circles section).

## UI Requirements

- Adopts Associations stacked-card layout pattern.
- **Treasury Dashboard**: 4-up stats hero (Total Funds, Available, Pending, EF Balance), action queue card (pending reconciliations / unconfirmed transfers / expiring statements), recent-transactions table, per-circle fund grid.
- **Circle Fund Detail**: Sticky header with circle name and current balance, stats strip, tabbed view (Ledger / Reconciliation / EF / Reports).
- **Transaction Ledger**: Filterable table with debit/credit columns, running balance, category badges, drill-down to entry detail.
- **Reconciliation Console**: Two-column diff view (Platform | Bank), drag-to-match, status legend (matched / discrepancy / orphan), "post adjustment" inline form.
- **PostFinance Import Flow**: 4-step wizard (Upload → Detect → Map → Confirm) with progress indicator and validation report.
- **Financial Report Panel** / **Audit Report Generator**: Form to define period + scope, preview, generate, download (native save on Capacitor).
- **Multi-Currency Settings**: Currency picker with flag icons, exchange-rate source dropdown (FX provider), real-time conversion preview.
- **Investment Manager**: Read-only opportunity cards with risk/return and "Talk to advisor" CTA (V1.9 preview).
- **Emergency Fund Panel**: Mirrors rosca-circles EF view from the treasurer's vantage point.

### Mobile & platform
- Reports and statements saved via Capacitor native file-save.
- Reconciliation Console collapses two-column to stacked accordions on mobile.
- All financial figures formatted with currency-aware thousands separators and locale (CHF 12'345.50 in CH locale).

## Configuration

- shell: true
