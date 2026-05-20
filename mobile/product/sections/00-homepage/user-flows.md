# Section 0 — User Flows

## Flow A · Returning member signs in

1. User opens the app. Lands on `welcome`.
2. Taps **Sign in**.
3. Routes to Section 15 `signin` (out of scope here).

## Flow B · New member discovers and signs up

1. User opens the app. Lands on `welcome`.
2. Scrolls the hero stat row and taps **Learn more** → goes to `discover`.
3. Horizontally pages through the 4 education cards.
4. Taps **I'm ready** at the end → routes to `quiz`.
5. Completes the 4 quiz questions.
6. Score shown with recommendation **You're ready to join**.
7. Taps **Get started** → routes to Section 15 `signup` with `intent=member` query param.

## Flow C · Aspiring organiser explores pricing

1. User opens the app on `welcome`.
2. Taps the **Organising a group?** secondary CTA.
3. Routes to `pricing`.
4. Reviews three tiers, taps **Choose Pro** on the recommended tier.
5. Routes to Section 15 `signup` with `intent=organizer&plan=pro`.

## Flow D · Skeptical visitor reads, leaves, comes back later

1. Visit 1: lands on `welcome` → opens `discover` → backs out, closes app.
2. Visit 2 (next day): app remembers no auth, lands on `welcome` again.
3. Direct-taps **Take the readiness quiz** secondary CTA → completes quiz.
4. Recommendation: **Build Trust first**. Reads explanatory body. Taps **Join a starter circle** → routes to `signup` with `intent=starter`.

## Error / Edge states

- **Network unavailable**: education images render with low-res placeholders; quiz still works (it is fully local).
- **Quiz abandoned mid-flow**: state lives in memory only; if the user backs out, the quiz resets next entry.
- **Already authenticated** (deep-link to Homepage from outside the app): redirect to authenticated home in Section 6 (Inbox) or last-viewed section.
