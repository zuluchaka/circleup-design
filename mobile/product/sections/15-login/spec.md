# Section 15 — Login & Onboarding

## Overview

Account lifecycle: sign in (email/password + social), sign up, email verification, and the guided **onboarding wizard** that walks a new user from "I just signed up" to "I'm ready to contribute" (profile, trust-building steps, first circle pick).

## Screens

| Slug | Purpose |
| --- | --- |
| `signin` | Sign in with email/password or Google/Apple. |
| `signup` | Create account with intent context (member/organizer/starter). |
| `verify` | Email verification waiting state with resend & change email. |
| `onboarding` | Multi-step wizard: profile → identity → preferences → first circle. |

## UI Requirements

- **Sign in** uses a full-bleed soft gradient. Email + password fields with platform-aware autofill (iOS Keychain / Android Autofill). Social buttons below a divider.
- **Sign up** mirrors sign-in layout. Inline password strength meter. T&Cs link is always visible (not buried in tooltips).
- **Verify** is a calm waiting screen with a big circular check (idle), countdown for resend (30s), and a "Change email" affordance.
- **Onboarding** progress dots; each step's primary CTA is sticky at the bottom. Last step shows a "Recommended circle for you" card.

## Data Shape

`AuthSession`, `OnboardingProfile`, `OnboardingStep`. See `data.json` and `types.ts`.

## Integration

- Sign-up intent (`member`/`organizer`/`starter`) routes onboarding's last step to **Section 1: Associations** create vs join.
- Verified identity feeds **Section 2: Members & Trust** Verified factor (+15 trust).
- Onboarding step 3 prompts notification permissions which power **Section 6**.
