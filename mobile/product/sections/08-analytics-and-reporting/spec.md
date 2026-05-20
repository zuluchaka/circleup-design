# Section 8 — Analytics & Reporting

## Overview

Dashboards and exports across two audiences:
- **Member-level**: personal savings progress, contribution streaks, Trust trend, payouts received.
- **Organiser-level**: circle health, default risk, engagement, financial summaries, downloadable statements.

The mobile experience leans visual (sparklines, donuts, big numbers) and offers a single PDF "Statement" export per scope.

## Screens

| Slug | Purpose |
| --- | --- |
| `personal` | Member dashboard with savings progress and Trust trend. |
| `circle-health` | Per-circle organiser metrics (collection rate, defaults, attendance). |
| `statements` | List of generated statements with download CTAs. |

## UI Requirements

- **Personal** opens with a big saved-this-year number, sparkline of contributions, Trust delta vs. 90 days ago, and next payout countdown.
- **Circle health** uses a 2×2 metric grid (Collection rate · Default risk · Attendance · Welfare uptake). Tap any metric → drill-down list.
- **Statements** is a list with type chips (Personal · Circle · Association) and date ranges. Tap → background generation, then download/share sheet.

## Data Shape

`KpiTile { id, label, value, trend? }`. `Statement { id, scope, period, format }`. See `data.json` and `types.ts`.

## Integration

- Pulls live numbers from **Sections 3, 4, 5, 6**.
- Statements generated here are stored in **Section 7: Documents** library.
- Risk metric powered by **Section 10: AI Insights** prediction model.
