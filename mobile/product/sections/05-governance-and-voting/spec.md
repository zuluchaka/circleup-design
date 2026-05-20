# Section 5 — Governance & Voting

## Overview

Where decisions get made. Proposals, ballots, elections, and committees. CircleUp supports multiple decision models (committee-led, consensus, founder-led) and surfaces quorum + voting state transparently. The mobile experience focuses on **casting a ballot in under 20 seconds** and the **at-a-glance state** of any pending decision.

## Screens

| Slug | Purpose |
| --- | --- |
| `proposals` | List of proposals with status chips, end dates, and a vote-now affordance. |
| `ballot` | Single proposal: full body, your eligibility, options, vote action. |
| `elections` | Open and historical elections with candidate cards. |
| `committees` | Standing committees, members, terms, contact. |

## UI Requirements

- **Proposals list** groups by status: Voting (top), Discussion, Closed (collapsible). Status chip uses `theme.primary` for Voting, `theme.info` for Discussion, `theme.textMuted` for Closed.
- **Ballot screen** has a sticky vote bar at the bottom (Yes / No / Abstain). Quorum progress and time-remaining shown beneath the title. Show "Your vote is private to non-signers" disclaimer.
- **Elections** uses candidate cards with photo (avatar), pitch (3 lines), endorsements count. Tap to expand. Vote happens with a single selection + Confirm.
- **Committees** lists with chairperson highlighted, member chips, term end date.

## Data Shape

`Proposal { id, title, body, status, votes, quorum, endsAt }`. `Election { id, seat, candidates[], endsAt }`. `Committee { id, name, members, chair, termEnd }`. See `data.json` and `types.ts`.

## Integration

- Approving budget proposal in `ballot` posts a change to **Section 4: Treasury & Funds** allocations once the quorum is met.
- Election win promotes a member to a role in **Section 2: Members & Trust** (role badge auto-update).
- Voting activity feeds **Section 8: Analytics & Reporting** participation metric.
