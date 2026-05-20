# Section 9 — Credit & Lending

## Overview

Translates community-finance behavior into formal creditworthiness. Members see a **CircleUp Credit Score** (distinct from Trust — but derived from similar inputs), can take a **Payout Advance** (early access to a future ROSCA payout), apply for a **Personal Loan** secured against participation, and opt into **Credit Bureau Reporting** so their on-time contributions can build formal credit.

## Screens

| Slug | Purpose |
| --- | --- |
| `score` | CircleUp Credit score, factors, advice. |
| `advance` | Pre-calculated payout advance offer with terms. |
| `loan` | Personal loan application with eligibility, amount, schedule. |
| `bureau` | Opt-in / opt-out for bureau reporting; status & impact. |

## UI Requirements

- **Score** shows a 300–850 style gauge (ribbon-shaped), score number, and the 5 factor bars (same pattern as Trust but mapped to credit-relevant factors).
- **Advance** shows the maximum amount, repayment date (= next scheduled payout date), a 0–2% fee, and a sticky **Accept advance** CTA. Always disclose effective APR.
- **Loan** is a 3-step wizard (Amount + term → Use of funds → Review & sign). Sign step requires biometric confirm where available.
- **Bureau** is a single screen with status, partner bureau name, and a clear toggle with consequences spelled out.

## Data Shape

`Credit { score, band, factors[], advance, loan }`. See `data.json` and `types.ts`.

## Integration

- Source: payment history from **Section 3** and welfare repayment from **Section 4**.
- Advance approval debits the member's future payout in **Section 3** and increments a hold on the Operating Fund in **Section 4**.
- Bureau reporting triggers an outbound report flagged by **Section 14: Platform Administration** compliance.
