# Section 5 — User Flows

## Flow A · Cast a vote in 15 seconds

1. Push notification "Budget proposal closes in 24h" → opens `ballot`.
2. Scans summary (CHF 48k operating budget). Taps **Yes** in sticky bar.
3. Confirm sheet appears (1 tap). Confirms.
4. Snackbar: "Vote recorded · quorum 88/138."

## Flow B · Review an election before voting

1. Opens `elections`. Sees Treasurer seat election ends in 4 days.
2. Taps Treasurer seat → 3 candidate cards.
3. Expands Mariam R.'s card — reads 3-line pitch, sees Trust 802.
4. Selects Mariam, taps **Cast vote**. Confirm sheet. Done.

## Flow C · Browse committees

1. Opens `committees`. Sees 4 standing committees.
2. Taps Finance committee → shows chair (Amara O., Treasurer), 4 other members, term ends Dec 2026.

## Edge states

- **Not eligible**: ballot screen disables the vote bar with explainer (e.g., pending member).
- **Already voted**: ballot screen shows your selection with a re-open window if voting still active and config allows.
- **Tied election**: history screen calls out the runoff date.
