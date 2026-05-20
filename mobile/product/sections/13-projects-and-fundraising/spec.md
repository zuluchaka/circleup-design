# Section 13 — Projects & Fundraising

## Overview

Lets an association raise money for **specific projects** outside the rotating ROSCA mechanism: school transport, emergency aid, building improvements, scholarships. Supports one-off donations, recurring giving, matching campaigns, and impact reporting back to donors.

## Screens

| Slug | Purpose |
| --- | --- |
| `campaigns` | Active and past campaigns with progress bars. |
| `campaign-detail` | Single campaign with story, donors, and CTA. |
| `donate` | Donation amount + method flow. |
| `impact` | Post-campaign impact report with photos and outcomes. |

## UI Requirements

- **Campaigns list** card layout with cover hue, raised/goal, donor count, days left.
- **Detail** has hero band, story body, optional matching banner ("CHF 1 matched up to CHF 5,000"), donor wall (anonymisable).
- **Donate** quick-pick amount chips (CHF 25/50/100/200/Custom) and recurring toggle.
- **Impact** is image-led: 3-5 large photos with captions and outcomes.

## Data Shape

`Campaign { id, title, raised, goal, donors, daysLeft, matching, accent }`, `Donation`, `ImpactStory`. See `data.json` and `types.ts`.

## Integration

- Donations debit a member's wallet via **Section 4: Treasury & Funds** project fund.
- Receipts dispatched via **Section 6: Communication & Events**.
- Federation-wide campaigns surface in **Section 16: Federations**.
