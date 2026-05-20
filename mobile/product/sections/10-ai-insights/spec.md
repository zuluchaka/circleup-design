# Section 10 — AI Insights

## Overview

A surface for ML-generated **recommendations, risk warnings, and fraud alerts**, plus a conversational **AI Assistant** scoped to the member's data. Insights are pushed and pulled — the member can browse a feed or open the assistant by intent.

## Screens

| Slug | Purpose |
| --- | --- |
| `feed` | Stream of recommendations, risks, and fraud alerts. |
| `assistant` | Chat-style assistant with quick-prompt chips. |
| `risk` | Aggregated risk dashboard for organisers (default risk, fraud, anomaly). |

## UI Requirements

- **Feed cards** have a kind chip (Recommendation / Risk / Fraud), title, body, and an action CTA. Each card has a Why? affordance opening a transparency drawer that explains the model and inputs used.
- **Assistant** uses a clean chat layout. Suggested prompts as chips above the composer: "How am I doing this cycle?", "When is my next payout?", "Why did my Trust change?".
- **Risk dashboard** has organiser-only access. Members at risk, anomalous contributions, suspicious logins. Each row links to action (DM, lock account, request manual review).

## Data Shape

`Insight { id, kind, title, body, action, dataInputs }`. `ChatMessage { role, content, citations }`. See `data.json` and `types.ts`.

## Integration

- Risk powers **Section 3** treasurer dashboard and **Section 8** default-risk metric.
- Fraud alerts trigger **Section 6** notifications + **Section 14** compliance review.
- Assistant calls into every section read-only — must respect role-based access.
