# Section 10 — User Flows

## Flow A · Member acts on a recommendation

1. Opens `feed`. First card: "Consider doubling your share next cycle."
2. Taps Why? → drawer explains: 14 months on-time, <2% projected default.
3. Taps CTA **Request 2nd share** → routes to Section 12 `request`.

## Flow B · Member chats with the assistant

1. Opens `assistant`. Taps suggested prompt "When is my next payout?".
2. Assistant replies: "August 25, CHF 2,400 (cycle 11 of Main CHF Circle). View schedule →"
3. Tap "View schedule" deep-links to Section 3 `payouts`.

## Flow C · Organiser responds to a fraud alert

1. Receives push: "Unusual login on Kofi Mensah's account."
2. Opens `risk` → fraud card. Reads geo + device info.
3. Taps **Force re-auth** → Kofi gets a forced sign-out + step-up.

## Edge states

- **Low confidence**: recommendations below threshold are hidden by default; settings lets the user opt in.
- **Assistant doesn't know**: "I'm not sure — here's where to find this manually" with a deep link.
