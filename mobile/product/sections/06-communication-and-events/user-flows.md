# Section 6 — User Flows

## Flow A · Member RSVPs to AGM and pays for Summer Fest

1. Opens `events`. Sees AGM (free) and Summer Fest (CHF 15) under "Later".
2. Taps AGM → `event-detail` → taps **Going**. Snackbar confirms.
3. Backs to list, taps Summer Fest → taps **Going** → payment sheet → Pay CHF 15 with TWINT.
4. Ticket QR appears; calendar handoff offered.

## Flow B · Organiser checks in attendees at the festival

1. Opens `event-detail` for Summer Fest, taps **Scan tickets** (organiser-only).
2. Routes to `qr`. Camera opens. Member scans theirs → green check, name shown.
3. Tally updates: 64 expected · 41 checked in.

## Flow C · Treasurer sends a contribution reminder

1. Opens composer (FAB on `inbox`).
2. Audience: Main CHF Circle. Channels: Push + Email.
3. Types message, previews, sends.
4. Receipt shows 12 push delivered, 12 email queued.

## Flow D · Member reads a private DM

1. Push notification "Amara messaged you" → opens `thread`.
2. Reads, types reply, sends. Read receipt shows once Amara opens it.

## Edge states

- **Event cancelled**: ticket shows refund status; banner explains.
- **SMS quota exceeded**: composer disables SMS toggle with explainer linking to plan upgrade (Section 0 `pricing`).
- **Past event**: detail shows attendance summary and a "Thanks for coming" badge.
