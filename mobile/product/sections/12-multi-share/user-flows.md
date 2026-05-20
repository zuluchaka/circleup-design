# Section 12 — User Flows

## Flow A · Member requests a 2nd share

1. Coming from Section 10 recommendation, lands on `request` for Main CHF Circle.
2. Slider preselects 2 shares. Eligibility check: ✅ Trust ≥ 700, tenure ≥ 12 months, circle concentration OK.
3. Reviews new contribution amount (CHF 404 incl. EF) and projected payout (CHF 4,800).
4. Confirms. Treasurer + Auditor must sign off. Request enters review.

## Flow B · Member tries to over-allocate

1. Slider moves to 4 shares.
2. Eligibility shows ❌ "Would exceed circle concentration cap (32% > 30%)".
3. Slider snaps back to 3.

## Flow C · Organiser monitors concentration

1. Opens `monitor`. Sees Main CHF Circle's distribution table.
2. Spots a near-cap holder (28%). Flag does not trigger but a soft warning is logged.

## Edge states

- **Ineligible**: request screen shows the failing checks and clear build-up advice.
- **Pending approval**: button disabled with status note.
