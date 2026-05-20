# Section 2 — Members & Trust

## Overview

The directory of every person in an association, their role, and their **Trust Score** (0–1000). Trust Score is CircleUp's transparent reliability rating — every member can see exactly which factors drive their score and what to do to improve it. The mobile experience optimises for: scanning the roster, looking up a specific person, opening your own score breakdown, and inviting new members.

## Screens

| Slug | Purpose |
| --- | --- |
| `directory` | Searchable, filterable member list with avatars, roles, Trust badges. |
| `profile` | Individual member detail: contact, role, history, endorsements. |
| `trust` | Trust Score factor breakdown with explanations and improvement tips. |
| `invite` | Send invites via email / SMS / shareable link with role pre-selection. |

## UI Requirements

- **Directory** is a vertically scrolling list of `ListRow` items. Search bar pinned to top; filter chip strip below it (All / Active / Pending / Role · Treasurer / Trust ≥ 700 / Joined this year).
- **Avatar** uses the deterministic colour from the member's name. Role badge shows next to the name. Trust badge shows on the right with the score number.
- **Profile** opens as a full screen with hero header (gradient using the member's avatar hue). Below: contact card, current role, joined date, contributions count, payouts received, endorsement count.
- **Trust screen** lays out the 5 factors as horizontal bars showing weight and the member's current status per factor. Tap a factor → expands to show the rule and an improvement tip.
- **Trust deep-dive** must reinforce **transparency**: never hide the math. Show "Your score = sum of weighted factor scores."
- **Invite** is a 2-step modal-feeling screen: pick channel (email/SMS/link) → enter contacts and choose default role (Member / Organizer). Show a preview of the message.

## Data Shape

A `Member` carries identity, contact, status, role, Trust Score, and aggregated stats. The score derives from a `TrustFactor[]` set; weights add to 100. See `data.json` and `types.ts`.

## Integration

- Profile → "View contribution history" routes to **Section 4: Treasury & Funds** filtered for that member.
- Profile → "Endorse" creates an entry that feeds the **Peer endorsements** trust factor (Section 10 also surfaces endorsement nudges).
- Invite send routes to **Section 6: Communication & Events** for the message dispatch and tracks delivery.
- Trust badge appears as a compact widget in Sections 3, 4, 9, 12 — same component, same source of truth.
