# Section 0 — Homepage

## Overview

The Homepage section is the **public-facing entry** for the CircleUp mobile app. Prospective users land here from app store searches, referral links, marketing campaigns, and shared invite codes. The section's job is to: explain ROSCA & welfare-fund value, build trust quickly, qualify the user (member vs. organizer), and route them to the right onboarding path.

Unlike the rest of the app, **the Homepage runs unauthenticated**. No member context, no association — every UI element must work for a first-time visitor.

## Screens

| Slug | Purpose |
| --- | --- |
| `welcome` | Hero, value proposition, primary CTAs (Sign in / Get started). |
| `discover` | Educational scroll: what is a ROSCA, who it serves, success stories. |
| `quiz` | 4-step readiness quiz that scores the user and recommends a path. |
| `pricing` | Pricing tiers with what's included; transparent fee disclosure. |

## UI Requirements

- **No app shell / tab bar.** The Homepage uses its own header and lives outside the authenticated navigation.
- **Hero block** at the top of `welcome` with a bold gradient panel using `theme.primary` → `palette.indigo[400]`. Stat row (1B+ ROSCA users, 184 associations served, CHF 2.1M circulated) sits below.
- **Two primary CTAs** on `welcome`: "I'm joining a group" (sign in) and "I'm organizing a group" (sign up + organizer-specific onboarding).
- **Education** in `discover` uses 3–5 horizontally-paginated cards explaining: what a ROSCA is, the global cultural variants (susu, tanda, paluwagan, tontine), how Trust Score works, and Emergency Fund protection.
- **Readiness quiz** in `quiz` shows progress dots, single-question-per-step, large tappable answer cards, and a score readout at the end with a recommendation badge ("You're ready to join" / "Consider building Trust first" / "You're a great fit to organize").
- **Pricing** in `pricing` is a vertical list of 3 tiers with feature checklists. Highlight the recommended tier with `theme.primary`. Disclose the 1% Emergency Fund contribution in body text.
- **Accessibility:** every CTA target ≥ 48dp tall; quiz answer cards ≥ 56dp; text contrast meets WCAG AA against the gradient hero.
- **Localisation surface:** body strings must be safe to swap to FR, DE, IT, PT.

## Data Shape

Public, static content. No personalization, no authenticated calls. The Quiz computes a local readiness score; nothing is persisted until the user signs up.

See `data.json` for canonical sample content and `types.ts` for shape.

## Integration

- `welcome` → "Sign in" navigates to **Section 15: Login** (`signin`).
- `welcome` → "Get started" navigates to **Section 15: Login** (`signup`).
- `quiz` end-state recommendations route to:
  - "Join a group" → **Section 15: Login** (`signup`) → **Section 1: Associations** (member onboarding).
  - "Organize a group" → **Section 15: Login** (`signup`) → **Section 1: Associations** (`create`).
- `pricing` "Choose plan" CTAs route to `signup` and stamp the plan choice into the onboarding wizard.

## Out of Scope (handled elsewhere)

- Live association data / member directory — that lives behind auth.
- Localised pricing in foreign currencies — pricing page shows CHF only for v1.
- Brand customisation per association — Homepage uses the canonical CircleUp brand.
