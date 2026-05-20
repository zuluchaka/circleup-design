# Section 8 — User Flows

## Flow A · Member checks their savings progress

1. From hub, taps **My progress** chip → `personal`.
2. Sees CHF 2,400 saved YTD, contribution streak 12 months, Trust +18 in 90 days.
3. Taps **Download statement** → generates a PDF, opens share sheet.

## Flow B · Treasurer audits circle health

1. From hub, taps **Circle health** → `circle-health` for Main CHF Circle.
2. Sees 94% collection, 2 at-risk members, 91% attendance, 14% welfare uptake.
3. Taps Default risk tile → drilldown lists Linh P. and Chinedu O. with recommended outreach.

## Edge states

- **No data yet**: empty state with "Come back after your first contribution" copy.
- **Long export**: statement generation > 10s shows progress modal with backgrounding option.
