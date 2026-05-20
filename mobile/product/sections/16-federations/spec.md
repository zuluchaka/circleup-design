# Section 16 — Federations

## Overview

A **Federation** groups multiple associations under a single governance umbrella (e.g. a regional diaspora federation that links 4–20 local circles). Federations enable shared policies, consolidated finance, cross-association events, and federation-wide elections — without merging the underlying associations.

## Screens

| Slug | Purpose |
| --- | --- |
| `overview` | Federation hub: aggregated stats, member associations list. |
| `associations` | Federated associations management with link/unlink. |
| `consolidated` | Consolidated finance: dues, transfers, federation-wide funds. |

## UI Requirements

- **Overview** uses a different visual register from the Association hub: a darker hero strip with the federation crest. Aggregate stats: associations count, total members, total CHF circulating, governance status.
- **Associations** lists each association with status (active/onboarding/leaving), contact organiser, and quick-link to that association's hub.
- **Consolidated** finance has tabs: Dues, Transfers, Federation Fund. Dues row shows each association's monthly contribution to federation operations and any overdue amounts.

## Data Shape

`Federation`, `FederatedAssociation`, `ConsolidatedFinance`. See `data.json` and `types.ts`.

## Integration

- Federation-wide elections route to **Section 5: Governance & Voting** under federation scope.
- Cross-association communication uses **Section 6** with federation audience.
- Consolidated finance debits and credits flow through each association's **Section 4** ledger.
- Federation events live in **Section 6** with cross-association RSVP.
