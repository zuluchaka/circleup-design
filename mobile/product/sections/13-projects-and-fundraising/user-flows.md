# Section 13 — User Flows

## Flow A · Member donates to a campaign

1. Opens `campaigns`. Taps **School Bus** campaign.
2. `campaign-detail` shows CHF 12,400 / CHF 25,000, 84 donors, 22 days left.
3. Taps **Donate**. Picks CHF 50. Confirms with TWINT.
4. Thank-you screen with share buttons.

## Flow B · Organiser launches a new campaign

1. From hub, taps **+ Campaign** (organiser-only).
2. 3-step wizard: Cover + title → Story → Goal & matching.
3. Publishes. Notification goes to opted-in members.

## Flow C · Donor reads impact report

1. From `campaigns`, taps a past campaign.
2. `impact` opens with photos and outcome list ("38 children transported daily").

## Edge states

- **Goal reached early**: campaign keeps accepting "stretch" donations with explicit consent banner.
- **Refund request**: opens a thread to organisers via Section 6.
