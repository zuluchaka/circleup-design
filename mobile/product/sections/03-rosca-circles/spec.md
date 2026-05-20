# Section 3 — ROSCA Circles

## Overview

The heart of CircleUp. A **Circle** is a group of members making a fixed periodic contribution and taking turns receiving the pot. This section is what members open most often. Three roles share the screens with different surfaces visible: **Member** (contribute, see schedule), **Treasurer** (collect, reconcile, manage exceptions), and **President/Organizer** (oversight).

Key concepts: **cycle** (one rotation through all members), **payout order**, **contribution status** per member per cycle, and the **Emergency Fund** that auto-covers defaults.

## Screens

| Slug | Purpose |
| --- | --- |
| `my-circles` | List of circles the member belongs to with status snapshot. |
| `circle-detail` | Single circle: cycle progress, members, next payout, exceptions. |
| `contribute` | Make a contribution with method selection and confirm step. |
| `payouts` | Payout schedule with past, present, and future rotation slots. |
| `treasurer` | Treasurer-only dashboard: collection rate, reminders, defaults. |

## UI Requirements

- **My Circles** cards stack vertically. Each card shows: circle name, contribution amount + cadence, next due date, your status chip (Paid / Due / Overdue), cycle progress bar (cycle N of M).
- **Circle Detail**: hero band uses circle accent colour; current-cycle progress dial dominates the top. Below: "Next payout" card with the recipient's avatar and date. Then a roster section showing each member's current-cycle status.
- **Contribute**: 3-step bottom-sheet feel. Amount confirmed (locked to the circle's contribution + 1% EF) → method (linked bank / card / wallet) → confirm. Show the EF disclosure.
- **Payouts**: vertical timeline with one row per cycle. Past cycles show actual payout amounts; future cycles show projected. Member's own slot is highlighted.
- **Treasurer**: 3-tile summary (Collected %, Default risk count, Emergency Fund balance) and an exceptions list with quick actions (Remind / Mark covered by EF / Mark in-arrears).
- **Default coverage flow**: when a contribution is auto-covered by the EF, the affected member's row shows a yellow chip "Covered by EF" with a tap-through explainer.

## Data Shape

A `Circle` has cadence, contribution amount, cycle index, member list with payout order, and aggregated stats. Each member has a per-cycle `ContributionStatus`. See `data.json` and `types.ts`.

## Integration

- Contribution success → posts an `Activity` to **Section 1: Associations** (`dashboard` recent activity).
- Default → triggers a **Section 10: AI Insights** risk alert and an **Section 6: Communication & Events** notification to the treasurer.
- Emergency Fund coverage → debits the Emergency Fund balance held by **Section 4: Treasury & Funds**.
- Trust badges everywhere → reference **Section 2: Members & Trust**.
- Multi-share modifier → if the member holds more than 1 share (**Section 12**), contribution amount and payout amount scale proportionally.
