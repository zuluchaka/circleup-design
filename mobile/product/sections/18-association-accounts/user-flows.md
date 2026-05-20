# Section 18 — User Flows

## Flow A · CM jumps from a BR to the linked Association Account

1. From `Relationships` tab → taps a BR card → lands on BR detail (Section 17).
2. Scrolls to **Linked Accounts** card → sees `Association Account · ASS-4F12-PRI`.
3. Taps the card → routes to `/association-accounts/ASS-4F12-PRI`.
4. Sees: header (account number, status pill), balance card (CHF 1'240.55 frozen visual since BR is suspended), restricted-mode banner, 3 fund-category cards, recent entries.

## Flow B · Treasurer records a manual dues credit

1. Lands on `overview` for `ASS-7K2N-PRI` (their own association).
2. Taps **+ Credit** on the balance card.
3. Bottom sheet (future): enter amount (CHF 250), entry type "dues_collected", fund "General", description "May dues — Marie Diallo".
4. Submits → snackbar "Credit posted. Balance CHF 12,890.55." with **Undo** action (6s).
5. New row appears at the top of the entries list with running balance, green `+ 250.00`.

## Flow C · Treasurer attempts a debit in restricted mode

1. Lands on `overview` for `ASS-4F12-PRI` (linked BR suspended).
2. Restricted banner reads "Restricted · Suspended BR · only dues + fee debits allowed."
3. Taps **− Debit** → bottom sheet opens. Type selector only shows `dues_collected` and `fee_payment`.
4. Picks `fee_payment`, amount CHF 80, description "March platform fee". Submits.
5. Snackbar "Fee payment posted." New debit row appears with red `- 80.00`.

## Flow D · President approves a high-value transaction

1. CM has queued a debit of CHF 8,000 for a circle payout, above the `approval_threshold` of CHF 5,000.
2. President opens the account → sees the **Approvals strip**: "1 pending approval — tap to review."
3. Taps → routes to approvals list (future screen).
4. Reviews + approves → on return, balance updates and the debit row appears as approved.

## Error / Edge states

- **Frozen account**: balance card grays out, action chips disabled, banner reads "Account frozen on 12 May 2026."
- **Closed account**: same as frozen but action chips removed entirely; only read access remains.
- **Restricted mode** (suspended BR upstream): debit-type selector hides anything other than `dues_collected` and `fee_payment`.
- **Below-target fund**: progress bar shows red tail; variance label "−CHF 800 of target."
- **Empty entries**: "Account ready · waiting for first dues collection" with a single CTA.
