# Section 4 — Treasury & Funds

## Overview

The **treasurer's workbench**: balances and audit-grade tooling for every fund the association holds. Funds are distinct ledgers (Operating, Welfare, Emergency, Project) each with its own balance, rules, signers, and approval workflow. Where Section 3 (ROSCA Circles) handles per-circle contribution and payout UI, this section sits above it — treasurers reconcile, members request welfare aid, auditors review history, and admins import bank statements.

Treasury V1.9 emphasises Swiss-bank-aware tooling (PostFinance CSV import, CHF as default with EUR/USD/GBP support), audit-grade reports, and an explicit reconciliation flow between platform-recorded transactions and external bank statements.

Three roles share these surfaces with different controls visible: **Treasurer** (run reconciliation, generate reports, manage funds), **Member** (request welfare aid, see disbursements), and **Auditor** (read-only access to ledger, reports, statements).

## Screens

Mobile carries the full desktop feature set, organised into phases so that the core treasurer loop ships first and reporting/compliance/integrations ship behind it.

### Phase 1 — Core treasurer loop

| Slug | Role | Purpose |
| --- | --- | --- |
| `overview` | Treasurer | Dashboard: 4-up stats hero (Total Funds / Available / Pending / EF Balance), action queue, recent transactions strip, per-fund grid with sparklines, total + EF carve-out. |
| `fund-detail` | Treasurer | Single fund: sticky header with balance, stats strip, tabbed view (Ledger / Reconciliation / EF / Reports), inline rules disclosure (signers, max disbursement, allowed sources/uses). |
| `request` | Member | 3-step welfare-aid wizard (Reason → Amount → Supporting docs) with eligibility note based on Trust Score + tenure, optional repayment-tracking toggle. |
| `approvals` | Treasurer + Signers | Approvals queue with quorum progress per request (e.g. 2/3 signers), inline approve / reject / request-more-info actions, deadline countdown. |

### Phase 2 — Ledger & reconciliation

| Slug | Role | Purpose |
| --- | --- | --- |
| `ledger` | Treasurer + Auditor | Filterable double-entry ledger across all funds: filter by fund / date / category / status / counterparty, running balance column, category badges, export PDF/CSV. |
| `entry-detail` | Treasurer + Auditor | Single transaction: full counterparty info, source document link, related entries (e.g. EF cover → repayment chain), audit-trail timeline, post-adjustment shortcut. |
| `reconciliation` | Treasurer | Two-column diff (Platform ledger | Bank statement) with drag-to-match (collapses to stacked accordions on mobile), match / discrepancy / orphan statuses, inline "post adjustment" form with reason and audit trail. |

### Phase 3 — Reporting & compliance

| Slug | Role | Purpose |
| --- | --- | --- |
| `reports` | Treasurer | Financial Report Panel: period picker (monthly / quarterly / annual), scope picker (one fund / all funds / circle subset), preview KPIs, balance sheet, cash flow, download (native save). |
| `audit-report` | Treasurer + Auditor | Audit-grade report generator: full transaction history, EF interventions, reconciliation records, signer attestations, exports to PDF / CSV / XBRL preview. |
| `statements` | All (role-aware) | Downloadable statements list: per-cycle, per-period, per-fund; native file-save for Capacitor; pinned latest statement at top. |

### Phase 4 — Currency & investments

| Slug | Role | Purpose |
| --- | --- | --- |
| `multi-currency` | Treasurer | Per-association/per-circle currency selection (CHF default, EUR/USD/GBP supported), exchange-rate source dropdown (FX provider), real-time conversion preview, locale and thousands-separator settings. |
| `investments` | Treasurer (read-only) | Investment Manager preview: idle EF balances surfaced as opportunity cards (money-market, bond ladders) with risk/return; "Talk to advisor" CTA. Read-only in V1.9 MVP. |

### Phase 5 — Swiss-specific integrations

| Slug | Role | Purpose |
| --- | --- | --- |
| `postfinance-import` | Treasurer | 4-step import wizard (Upload CSV → Auto-detect format → Map to ledger entries → Confirm and post) with progress indicator and validation report; surfaces mismatched lines for manual mapping. |
| `external-accounts` | Treasurer | Bank link management: PostFinance / Stripe / other linked accounts with status (linked / re-auth / expired), last-sync timestamp, manual reconnect, per-account default currency. |

## UI Requirements

### Canonical mobile layout

- **AppHeader** at top: title, optional subtitle (fund name or period), back arrow when sub-routed, trailing icon button (Download / Filter / Search).
- **4-up stats hero** on `overview`: collapses to 2-up on phones; the EF tile is colour-accented (warning) to emphasise auto-coverage role.
- **Sticky balance header** on `fund-detail`: balance value remains visible while the user scrolls the ledger.
- **Stacked cards** throughout: rounded `radius.lg`, hairline border, `space.lg` padding. Dark mode is first-class.
- **Action bar** pinned bottom for screens with a single primary action (Submit request, Confirm approval, Post adjustment, Generate report).
- **Filter chips** above ledger and statements lists.
- **Tab strips** (in-screen) where a single domain has sub-views (`fund-detail` ledger/reconciliation/EF/reports).

### Per-screen specifics (Phase 1 already documented; below is Phase 2 onward)

- **Overview**: hero card with total + EF carve-out callout. Below, a horizontally scrollable action-queue strip (pending reconciliations / unconfirmed transfers / expiring statements). Then per-fund grid: name, balance, currency, 30-day sparkline, trust pill. Tap a fund → `fund-detail`.
- **Fund detail**: balance hero with sparkline behind. Stats strip (Available / Pending / This cycle / Signers). Tab row (Ledger / Reconciliation / EF / Reports). Default tab is Ledger with a 10-entry preview + "See full ledger →" link to `ledger`.
- **Request**: progress dots at top. Step 1 = Reason chips + free-text note. Step 2 = amount input with eligibility note (e.g. "Up to CHF 2'000 based on Trust Score 824 and 18-month tenure"). Step 3 = supporting docs uploader (camera / file). Bottom dock CTA: "Submit request".
- **Approvals**: filter tabs (Pending / Decided). Each request card: amount, reason, requester avatar + trust, quorum progress dots (filled vs empty signers), deadline countdown, three inline action buttons (Approve / Reject / Request info). Tap card → full detail sheet.
- **Ledger**: top filter strip (Fund chips + Date range chip + Category chip). Below, a virtualised list: date column, debit/credit columns (red/green), category badge, counterparty, running balance. Tap a row → `entry-detail`. Top-right Download icon → CSV/PDF export sheet.
- **Entry detail**: receipt-style card with amount and category at top. Then rows: counterparty (with avatar), date + time, fund affected, ledger reference, source document (tap to view), related entries (e.g. EF cover → repayment installments chain), audit trail timeline (filed by, posted by, adjusted by). Bottom: "Post adjustment" secondary action.
- **Reconciliation**: stacked accordion sections (Platform / Bank) per date. Each row shows match status pill (Matched / Discrepancy / Orphan). Tapping a Platform row brings up a "Match with bank" sheet; tapping a Bank row brings up a "Match with platform" sheet. Inline "Post adjustment" form for unmatched rows with reason note.
- **Reports**: period segmented control (Month / Quarter / Year). Scope picker (All funds / One fund / Custom). Preview card with KPI tiles (Inflows / Outflows / Net / EF used). Balance sheet preview. Cash flow preview. Bottom CTA: "Generate report" → native file-save.
- **Audit report**: similar layout to `reports` but includes a "Signer attestations" section listing each signer's last attestation and a checklist of what's included (full transaction history / EF interventions / reconciliation records). XBRL preview is a small badge.
- **Statements**: list of statements grouped by period. Each row: period label, fund(s), file size, generated-by, generated-at, pinned badge if latest. Tap → opens viewer or triggers native file-save.
- **Multi-currency**: top picker showing current default currency with flag icon. Below, list of supported currencies as radio-like rows with flag, ISO code, full name, and the last FX rate. FX-provider dropdown (e.g. "PostFinance daily rates"). Locale and thousands-separator preview at the bottom showing the same amount under three locales.
- **Investments**: opportunity cards (money-market / bond ladder / fixed deposit) each with: risk indicator (Low / Medium / High), projected annualised return, lockup period, minimum amount. "Talk to advisor" CTA per card. A "V1.9 PREVIEW" pill on the screen header makes the read-only status explicit.
- **PostFinance import**: 4-step progress at top (Upload / Detect / Map / Confirm). Step 1 = drop zone with sample-CSV hint. Step 2 = parsed-format card showing detected separator, decimal, date format with "Looks right?" confirmation. Step 3 = mapping table: each CSV column → ledger field, with auto-suggested mappings and a search dropdown for manual override. Step 4 = validation report (X entries ready / Y need attention) and a "Post N entries to ledger" CTA.
- **External accounts**: list of linked accounts. Each row: bank icon + masked account number, status pill (Linked / Re-auth needed / Expired), last-sync timestamp, default-currency pill, "Reconnect" or "View statements" inline action. A "Link a new account" CTA at the bottom routes to the relevant provider's auth flow.

### Cross-cutting patterns

- **Role-gating**: treasurer-only / auditor-only / member-only surfaces are hidden — not disabled — for users without the role. The Overview action-queue strip suppresses treasurer-only entries for non-treasurers.
- **Locale-aware formatting**: all financial figures use the active locale (`de-CH` formats CHF 12'345.50; `en-CH` formats CHF 12,345.50). Locale preview lives in `multi-currency`.
- **Native file-save**: reports, statements, and ledger exports save through Capacitor file-save; the in-app share-sheet is the fallback on web.
- **Offline mode**: ledger and statements are cached for offline viewing; reconciliation and report generation require connectivity and show a soft-blocked state.
- **EF cross-reference**: the EF tile on `overview` and the EF tab on `fund-detail` both deep-link to the per-circle EF panel in **Section 3** rather than duplicating that surface.

## Data Shape

A `Fund` has type (`operating` / `welfare` / `emergency` / `project`), balance, currency, rules (signers required, max single disbursement, allowed sources/uses), and a list of `LedgerEntry`. A `WelfareRequest` is a workflow state machine with status `Draft / Submitted / In review / Approved / Disbursed / Declined`. Phase 2+ adds: filterable transaction lists with running balance, reconciliation matches (Platform ledger ↔ Bank statement entries), reports (period KPI snapshots + downloadable artefacts), audit attestations, supported currencies and FX rates, investment opportunities, PostFinance CSV imports with parsed rows, and external-account links with sync state. See `data.json` and `types.ts` — these expand as each phase lands.

## Integration

- **EF carve-out from Section 3 (ROSCA Circles)** flows in here on every contribution; EF interventions appear in `ledger` and tap-through to the per-circle EF panel in Section 3.
- **Approval routes** to **Section 5: Governance & Voting** if quorum is required by config (extends the per-fund signers rule).
- **Disbursement** creates a **Section 6: Communication & Events** receipt notification to the member; the message includes a download link to the disbursement receipt held in this section.
- **Statements and reports** are also surfaced under **Section 8: Analytics & Reporting** and reference fund history defined here.
- **Documents**: receipts, statements, signed agreements live under the per-circle **Section 7: Documents** folder when scoped to a circle; treasury-level documents stay here.
- **Federations (Section 16)** aggregate fund balances across multiple associations; this section is the canonical source for those rollups.
- **Platform Administration (Section 14)** can freeze a fund's circle account; the freeze state surfaces here as a banner on `overview` and a status pill on `fund-detail`.
