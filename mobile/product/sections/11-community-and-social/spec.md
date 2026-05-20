# Section 11 — Community & Social

## Overview

The "stickiness" layer: referral rewards, achievement badges, leaderboards, savings challenges, and milestone celebrations. Designed to reinforce on-time contributions and long-tenure participation without making the experience feel gamified-in-a-cheap-way. The aesthetic stays adult: muted celebration, real numbers, no confetti by default.

## Screens

| Slug | Purpose |
| --- | --- |
| `feed` | Community activity stream (kudos, milestones, joins). |
| `badges` | Earned + locked badges with progress to next. |
| `leaderboard` | Opt-in leaderboard for contribution streaks and savings totals. |
| `referrals` | Referral link, reward state, history of invites. |

## UI Requirements

- **Feed cards** are smaller than insight cards. Use a member chip + verb sentence.
- **Badges**: 3-column grid. Locked badges show a silhouette with the trigger condition. No more than 2 currency symbols visible per row to keep things calm.
- **Leaderboard**: opt-in (default off). When opted in, show top 10 by metric, anonymised handles option.
- **Referrals**: large copyable code, share affordance, reward ladder (e.g., 1 invite → CHF 5 credit, 3 → CHF 20).

## Data Shape

`FeedItem`, `Badge`, `LeaderboardEntry`, `Referral`. See `data.json` and `types.ts`.

## Integration

- Referral conversions feed **Section 8: Analytics**.
- Badges power profile chips in **Section 2: Members & Trust**.
- Challenges link to **Section 3: ROSCA Circles** behaviour.
