# Section 12 — Multi-Share

## Overview

Allows trusted members to hold **multiple shares (1–10)** of a circle's base contribution. Holding N shares means contributing N× the base and receiving N× the payout. Eligibility is gated by Trust Score, tenure, and platform-wide concentration limits (no member can hold more than 30% of a circle's total).

## Screens

| Slug | Purpose |
| --- | --- |
| `my-shares` | Per-circle share status and history. |
| `request` | Request additional shares with eligibility preview. |
| `monitor` | Platform / federation monitor for concentration & risk (organiser+). |

## UI Requirements

- **My Shares**: card per circle showing current shares, capacity, eligibility delta. Visual: stacked share blocks (1 to N) with grey "blocked" for the rest.
- **Request**: slider (1–10) with live eligibility check that disables ineligible amounts and explains why.
- **Monitor**: concentration heatmap-style table per circle.

## Data Shape

`ShareHolding`, `ShareRequest`, `ConcentrationRow`. See `data.json` and `types.ts`.

## Integration

- Multiplies contribution + payout in **Section 3**.
- Eligibility uses **Section 2** Trust and **Section 9** credit.
- Concentration alerts flow to **Section 10** risk and **Section 14** compliance.
