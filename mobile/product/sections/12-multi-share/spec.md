# Section 12 — Multi-Share

> **Implementation status: design pending.** Spec, `types.ts`, and `data.json` exist; no React components have been built for this section. The `my-shares`, `request`, and `monitor` routes currently render the generic `ScreenStub` placeholder. (Note: `RoscaMultiShare` exists in the codebase but belongs to Section 3 ROSCA Circles — it's not the screen meant for this section.) Captured screenshots under `screenshots/android/` are stub renders, not real designs. **Agent-OS should not implement this section directly** — primary screens need to be designed first (spec → component → sample-data wiring → screenshots). The data shape and eligibility rules in this file are authoritative and safe to rely on.

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
