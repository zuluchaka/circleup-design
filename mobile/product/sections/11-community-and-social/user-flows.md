# Section 11 — User Flows

## Flow A · Member shares their referral link

1. Opens `referrals`. Sees CHF 5 + CHF 20 reward ladder.
2. Taps **Share** → native share sheet → sends via WhatsApp.
3. New invite logged with "Sent" status.

## Flow B · Member earns a badge

1. Member crosses 12-month streak.
2. Push notification: "You earned 12-Month Streak."
3. Opens `badges`. New badge highlighted with subtle pulse.

## Flow C · Member opts into leaderboard

1. Opens `leaderboard`. Empty state with opt-in toggle.
2. Toggles on, chooses "Anonymised name". Lands on top 10.

## Edge states

- **Privacy default**: leaderboard always opt-in.
- **Referral fraud**: invite stuck on "Pending review" if signals look gamed.
