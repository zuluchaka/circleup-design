# Section 4 — Treasury & Funds

## Overview

Multi-fund accounting for an association. Funds are distinct ledgers (Operating, Welfare, Emergency, Project) each with its own balance, rules, and approval workflow. Treasurers run reconciliation; members request welfare aid; auditors review history.

## Screens

| Slug | Purpose |
| --- | --- |
| `overview` | Funds list with balances, trend sparklines, total + EF carve-out. |
| `fund-detail` | Single fund: balance, ledger entries, allowed sources/uses. |
| `request` | Member-facing welfare aid request wizard. |
| `approvals` | Approvals queue with quorum / signer state per request. |

## UI Requirements

- **Overview** is a tabbed-feeling list. Top card shows total across all funds with an Emergency Fund highlight. Each fund row: name, balance, currency, 30-day sparkline.
- **Fund detail** has a balance hero, a ledger (debits red, credits green, EF transfers blue), and a "Rules" disclosure block (who can disburse, who can approve, max single disbursement).
- **Request** is a 3-step wizard (Reason → Amount → Supporting docs). Show eligibility note based on Trust Score + tenure.
- **Approvals** shows each pending request with quorum progress (e.g. 2/3 signers), an inline approve/reject action, and a one-tap "Request more info" message back to the requester.

## Data Shape

A `Fund` has type, balance, rules, and a list of `LedgerEntry`. A `WelfareRequest` is a workflow state machine with status `Draft / Submitted / In review / Approved / Disbursed / Declined`. See `data.json` and `types.ts`.

## Integration

- EF carve-out from **Section 3** flows in here on every contribution.
- Approval routes to **Section 5: Governance & Voting** if quorum is required by config.
- Disbursement creates a **Section 6: Communication & Events** receipt notification to the member.
- Statements (downloadable) live in **Section 8: Analytics & Reporting** and reference fund history here.
