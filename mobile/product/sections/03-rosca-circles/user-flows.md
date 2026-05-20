# Section 3 — User Flows

## Flow A · Member contributes on the due date

1. Opens app → push notification "Main CHF Circle · CHF 200 due today" → taps it.
2. Deep-links to `contribute` for Main CHF Circle, pre-filled CHF 202 (200 + 1% EF).
3. Selects linked bank (PostFinance · *4892).
4. Taps **Confirm contribution**. 800ms confirmation.
5. Lands on success state with cycle progress bar incremented; next due date shown.

## Flow B · Member views their next payout

1. From `my-circles`, taps Main CHF Circle.
2. Routes to `circle-detail`. Sees "Next payout · Kofi Mensah · May 25".
3. Taps **Payout schedule** → routes to `payouts`.
4. Scrolls to own slot (cycle 11) → "Projected · August 2026 · CHF 2,400".

## Flow C · Treasurer handles a default

1. From `dashboard`, opens treasurer dashboard for Main CHF Circle.
2. Routes to `treasurer`. Sees Linh P. is 3 days overdue.
3. Taps Linh P.'s row → options: **Send reminder** / **Mark covered by EF** / **Pause member**.
4. Taps **Mark covered by EF**. Confirm modal explaining the EF debit. Confirms.
5. Linh's row updates to "Covered by EF". Cycle collection rate jumps from 94% to 100%.
6. Member Linh receives a private message (Section 6) explaining the situation and her repayment plan.

## Flow D · Organiser previews next cycle before locking it in

1. From `circle-detail`, taps **Next cycle** stepper → preview screen.
2. Sees the rotation order, projected payouts, and any flagged risks (1 member predicted at-risk).
3. Taps **Confirm cycle** → locks the payout order.

## Edge states

- **Bank link expired**: contribute screen shows inline link-bank action; user must re-auth before paying.
- **Multi-share member**: contribute amount shows breakdown (e.g., 2 × CHF 200 + 2 × CHF 2 EF = CHF 404).
- **Holiday / weekend due date**: amount shows as due with a hint "Bank transfer may settle Monday."
- **Last cycle of the rotation**: success state offers **Start a new cycle** with options to keep or change roster.
