# Section 18 — Association Accounts

## Overview

An **Association Account** is the formal double-entry ledger auto-provisioned for an association the moment its **Business Relationship** (Section 17) is activated. Every credit/debit — dues collected, fee payments, circle transfers, adjustments — flows through this ledger, with running balances and per-fund-category roll-ups.

This section gives **Circle Managers** and the **association's president/treasurer** a single screen to read the account, see fund-category health, scan recent entries, and (when authorised) record manual credits/debits.

## Screens

| Slug | Purpose |
| --- | --- |
| `overview` | Balance card, fund-category breakdown, recent entries, credit/debit actions. |

(Future: `ledger` — full paged entry history with filters; `report` — income/expense statement, fund balance, member standing; `approvals` — high-value transactions pending president approval.)

## UI Requirements

- **Account number** is shown verbatim in monospace: `ASS-XXXX-PRI`. Always visible in the header so the user can quote it.
- **Balance card** is the hero: gradient, prominent currency-formatted balance, account type + status row, action chips for `+ Credit` and `− Debit`. Disabled when account is `frozen` or `closed`.
- **Restricted mode banner** appears beneath the balance card when the linked BR is `suspended`. Per the Rails model, only `dues_collected` and `fee_payment` debits are allowed in restricted mode — the form selector reflects this.
- **Fund categories** appear as horizontally scrolling cards: name, current balance, progress bar against `target_amount` (when set), variance label. The 3 defaults are General Fund / Welfare Fund / Reserve Fund.
- **Approval threshold strip** surfaces the AA-US005 rule: "Transactions ≥ CHF X need president approval." Tap → routes to the approvals list (future screen).
- **Recent entries** are list rows, not a table. Each row shows: posted date (relative + absolute), entry-type label, description, fund-category chip, amount (green `+` for credit, red `-` for debit), running balance. Tap a row → future entry detail.
- **Sticky empty state** if no entries yet: "Account ready · waiting for first dues collection" with a primary action to record an opening credit.
- **Dark mode** uses the same indigo→purple balance gradient with `bg-elevated` cards underneath.

## Data Shape

The `AssociationAccount` carries: `account_number` (`ASS-XXXX-{PRI|RES|DUE}`), `account_type` (primary/reserve/dues), `currency`, `balance`, `status` (active/frozen/closed), and an `approval_threshold` for AA-US005. Fund categories own their own balances with optional `target_amount`. Entries are append-only with `direction` (credit/debit), `entry_type`, `running_balance`, optional `fund_category`, and a `reference` to whatever originated them (dues invoice, circle payout, BR fee billing, etc.).

See `data.json` for two sample accounts:
- `ASS-7K2N-PRI` — Senegalese Union of Switzerland, healthy, active, no restrictions
- `ASS-4F12-PRI` — Filipino Community Basel, **restricted** mode because of its suspended BR (br4)

And `types.ts` for portable typings.

## Integration

- **From BR detail (Section 17)** → "Linked Accounts" card routes to `/association-accounts/[id]`. This closes the previous dead link.
- **Account auto-provisioning** is triggered by `BusinessRelationship#activate!` → `AssociationAccount.provision_for_association!(currency:)`. Three default fund categories (General/Welfare/Reserve) are created on first provisioning.
- **Dues collection** (AA-US003/AA-US004) credits the account when a member pays an invoice.
- **Circle payouts** (Section 3 ROSCA) debit via `circle_transfer` entry type.
- **BR billing** (Section 17) debits via `fee_payment` entry type when a BillingRecord is paid.
- **President approvals** above `approval_threshold` route through a future approvals screen.

## Access Control (RBAC)

- **Circle Manager**: read-only access. Can view the account but cannot post manual entries unless `recorded_by` is delegated.
- **President**: full read + approve/reject for above-threshold transactions.
- **Treasurer**: full read + write (credit/debit/transfer).
- **Member**: not in this section — members see their own dues balance under Section 2 Members.

## Roadmap Anchors

- V1.1 — AA-US001 (auto-provisioning) through AA-US006 (reports + disputes) — Done in Rails.
- This mobile section maps to **AA-US001** (account view) and **AA-US002** (fund categories + ledger). Reports + disputes live in future screens.
