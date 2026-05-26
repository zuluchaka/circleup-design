# Section 20 — Profile

## Overview

The **Profile** tab is the user's own home in the app — distinct from `Section 2: Members & Trust` (which views *other* members). It is the bottom-nav destination labelled "Profile" and serves three jobs:

1. **Identity at a glance** — who am I in CircleUp, what's my Trust Score, which associations do I belong to, what does my membership look like right now.
2. **Account control** — every setting that's about *me* (not about a circle or association): personal info, identity verification, payment methods, security, notifications, language, subscription.
3. **Support & legal** — help, FAQs, contact, terms, privacy, app version.

The hub itself never edits data inline; every action routes into a dedicated subview so users can drill in, change one thing at a time, and back out. The hub also surfaces a small handful of read-only stats (trust score, contributions, payouts) without duplicating Section 8 analytics — it's a snapshot, not a dashboard.

> **Mobile-specific section.** The web app handles profile/settings inside a drop-down menu off the header. On mobile, Profile is a primary nav surface and warrants its own dedicated screens for thumb-friendly access.

## Screens

| Slug | Purpose |
| --- | --- |
| `hub` | Identity hero with avatar / name / trust score, role + association strip, 3-tile stats snapshot (Contributions / Payouts / Circles), 9-item menu grid linking to each subview, Sign-out card. |
| `personal-info` | Edit form for name, photo, bio (≤ 280 chars), languages spoken, location, date of birth, gender (optional). Photo update opens a sheet with Camera / Gallery / Remove. |
| `identity` | KYC tier badge (Basic / Enhanced) with progress bar, verified-channels list (phone / email / national ID), document carousel for uploaded IDs, "Upgrade to Enhanced KYC" CTA when applicable. |
| `payment-methods` | List of payment instruments grouped by purpose: Pay-in (cards, TWINT, bank debit) and Pay-out (IBAN, mobile wallet). Default + backup selectors, add-new sheet, per-row remove. |
| `security` | Password change, biometric toggle (Face ID / fingerprint), 2FA setup (SMS / authenticator app), active-sessions list with device + location, "Sign out of all devices" action. |
| `notifications` | Matrix of categories × channels: Contributions due, Payouts, Votes, Disputes, Announcements, Marketing × Push / Email / SMS / WhatsApp. Master "Quiet hours" card at top with start/end pickers. |
| `language` | **Appearance** segmented control (Light / Dark / System) at the top, language picker (EN / FR / DE / IT / PT) with regional flag and native-name label, currency display picker (CHF / EUR / USD), country selector. (Hub menu copy reads "Language & appearance" to reflect the appearance card.) |
| `subscription` | Current plan card (Free / Plus / Pro) with status + renewal date, next-bill amount, billing-history list (last 6 months), "Switch plan" + "Cancel subscription" actions. |
| `help` | Help-search input, FAQ category cards, "Contact support" CTA (in-app message or email), "Report a bug" form launcher, status-page link. |
| `legal-about` | Legal links (Terms / Privacy / Cookies / FINMA disclosure / Open-source licenses) + About card (app version, build, region, environment). |

### Edge-state variants (separate routes, exercised by the screenshot capture script)

| Slug | Purpose |
| --- | --- |
| `identity-basic` | Identity screen rendered with `kyc.tier = "basic"`, completion 40%, national-ID channel in `action_required`, no documents on file yet. Surfaces the Upgrade-to-Enhanced CTA. |
| `identity-rejected` | Identity screen with a rejected national-ID channel and a flagged passport document; replaces the green "fully verified" banner with a red "Documents need attention" card + Re-submit CTA. |
| `payment-methods-empty` | Payment methods screen with no methods configured at all — renders the dedicated empty-state card with twin "Add pay-out / Add pay-in" CTAs (per edge state in user-flows.md). |
| `subscription-past-due` | Subscription screen with `status = "past_due"` and the most recent invoice as `failed`; adds a red "Payment failed" banner above the plan card and swaps the indigo hero to rose. |
| `subscription-trial` | Subscription screen with `status = "trial"` on the Pro plan (CHF 0, 14 days remaining). Plan card lists trial-specific features. Billing history is empty. |
| `subscription-cancels-soon` | Subscription screen with `status = "cancels_at_period_end"` and a `cancelsOn` date — amber `CANCELS SOON` pill, otherwise the live Plus plan. |
| `subscription-cancelled` | Subscription screen with `status = "cancelled"` after a downgrade — Free plan, slate `CANCELLED` pill, Free-tier features. |
| `hub-past-due` | Hub rendered with subscription past-due, surfacing a red "Payment failed" banner above the ACCOUNT section that taps through to `subscription`. |

### Confirm sheets (separate routes, exercised by the screenshot capture script)

Every destructive row opens a `ConfirmSheet` (icon, title, description, primary destructive button, ghost Cancel). Variant routes pre-open each sheet so the design can be captured.

| Slug | Sheet |
| --- | --- |
| `hub-confirm-sign-out` | "Sign out?" — opened from the hub's Sign-out card. Primary action routes to `/welcome`. |
| `security-confirm-sign-out-all` | "Sign out of all devices?" — opened from Security's danger row. |
| `security-confirm-delete` | "Delete account?" — opened from Security's danger-zone card. Warns that active circles must be closed or transferred first. |
| `subscription-confirm-cancel` | "Cancel CircleUp Plus?" — opened from Subscription's Cancel action card. Lists what the user loses and keeps; primary is "Cancel subscription", secondary is "Keep Plus". |
| `personal-info-photo-sheet` | "Update profile photo" action sheet — opened from the avatar camera dot in `personal-info`. Options: Take photo / Choose from gallery / Remove photo (destructive). |
| `hub-association-switcher` | "Switch active association" sheet — opened from the association pill on the hub. Lists every membership with role + join year; tapping a row sets it as the active context (trust score, stats, notifications follow). |
| `subscription-cancel-snackbar` | Subscription screen with the post-cancel snackbar rendered: "Plus cancelled — renews to Free on Jun 30." plus an **UNDO** action. Auto-dismisses after 10s in production; the variant pins it open for capture. |

### Toast / Snackbar primitive

A `Snackbar` primitive (`components/shared/Snackbar.tsx`) is provided at the app root via `SnackbarProvider`. Screens call `useSnackbar().showSnackbar({...})` to render a transient bottom-anchored toast. Options: `message`, `tone` (`neutral` / `success` / `danger`), `duration` (ms; `0` disables auto-dismiss), `action` (`{ label, onPress }`), and `bottomOffset` (defaults to `84` for tab screens, pass `24` for full-screen sub-routes). Snackbars replace each other — at most one is visible at a time. Currently wired into **`subscription`** (cancel-undo) — other documented snackbars across the app (notification save, photo update success, etc.) are pending.

## UI Requirements

### Cross-cutting

- **AppHeader** is suppressed on `hub` (the gradient hero replaces it). Every subview uses the standard `AppHeader` with title, back arrow, and an optional trailing save / done button.
- **Bottom-tab bar** stays visible on `hub` only. Subviews omit the tab bar (full-screen pushes) so the user can focus on one task without thumb-distance temptations.
- **Save behaviour**: editing screens (`personal-info`, `notifications`, `language`, `security` for password) follow an **explicit-save** model — a sticky bottom action bar with `Save` (primary) + `Discard` (text). No auto-save. Unsaved-state badge appears in the AppHeader if user tries to leave.
- **Section-card spacing**: each subview groups controls into stacked `Card`s with `space.lg` vertical gaps. Within a card, list rows separate with hairline dividers.
- **Destructive actions** (Sign out, Cancel subscription, Sign out of all devices, Delete account) are rendered with `danger` tone and always require a confirm sheet. Delete account lives at the bottom of `security` under a separate "Danger zone" card to keep it discoverable for store-compliance reviewers without putting it next to everyday actions.
- **Dark mode**: every screen tested with `mode=dark`; the hero gradient swaps from indigo-700→indigo-900 (light) to indigo-900→indigo-950 (dark).

### Per-screen specifics

- **Hub**: gradient hero (200dp tall) with circular avatar (96dp), name (h1), role + city line, and — when the user belongs to more than one association — an **association switcher pill** with the active association name + count, which opens a bottom sheet listing every membership and lets the user flip the active context. Trust-pill (`★ 945`). Below: 3 stat tiles with icons (Contributions 47 · Payouts 3 · Circles 4). Below: menu grid of 9 icon-tile cards (Personal info / Identity / Payment methods / Security / Notifications / Language & appearance / Subscription / Help / Legal & about). Bottom: full-width destructive Sign-out card (opens a ConfirmSheet rather than routing immediately). When `subscription.status === "past_due"`, a red "Payment failed" banner sits between the stat tiles and the ACCOUNT menu, tapping through to `subscription` (see `hub-past-due` variant).
- **Personal info**: hero shows the current avatar with a camera-icon overlay; tap → opens the **Update profile photo** action sheet (Take photo / Choose from gallery / Remove photo). Form fields: Name, Bio (text-area with char counter 0/280), Languages (multi-chip selector), Location (City + Country fields), Date of birth (date picker), Gender (segmented chips with "Prefer not to say" option).
- **Identity**: KYC-tier hero ("Basic KYC" indigo / "Enhanced KYC" emerald) with progress bar. Verified-channels list: phone, email, national-ID. Each row → status pill (Verified ✓ / Pending / Action required). Documents card: horizontal scroll of uploaded ID thumbnails with re-upload icon. Upgrade CTA card with reason copy and `Upgrade to Enhanced` button → routes to Login section's KYC step.
- **Payment methods**: Pay-in section header, then each card: brand logo (Visa / Mastercard / TWINT / PostFinance), masked digits, expiry, default-badge if applicable. Pay-out section below. Add-new sheet shows method choices (Card / TWINT / Bank account / Mobile wallet). Each row supports swipe-left → Delete with confirm.
- **Security**: rows for Password (last changed N days ago, ChevronRight), Biometrics (toggle), 2FA (status + setup CTA). Active-sessions card with device + city + last-active timestamp. "Sign out of all devices" danger row, followed by a **Danger zone** card with **Delete account** (required by Apple / Google store policies for accounts created in-app). Both destructive actions require a confirm sheet; Delete account warns that active circles must be closed or transferred first.
- **Notifications**: Quiet-hours card at top (toggle + start/end time pickers). Matrix below: each category row × four channel toggles. Use bordered toggle pills (filled when on). Save bar visible only when dirty.
- **Language**: **Appearance card** at the top with a Light / Dark / System segmented control (writes to `ThemeModeProvider`, which overrides the OS color scheme). Language list with native + English names and a country flag — selected row gets a check icon. Currency picker as segmented control (CHF / EUR / USD). Country selector as a single tappable row → routes to a country-picker sheet (out of scope here, just shown as ChevronRight).
- **Subscription**: Plan card with crown icon, plan name, status pill (Active / Cancelled / Trial), renewal date, next-bill amount. Below: 6-row billing-history list with dates, amounts, invoice download icon. Two danger-row actions: Switch plan / Cancel subscription.
- **Help**: search input at top, then category grid (Getting started / Contributions / Payouts / KYC / Disputes / Account). Below: Contact support row (opens in-app composer), Report a bug row, Status page row (external link).
- **Legal & about**: legal section with 5 rows (Terms / Privacy / Cookies / FINMA disclosure / Open-source licenses). About card with app version, build number, region, environment label (Production / Sandbox), and a small "Powered by Mafao" footer.

### Accessibility & touch targets

- All tappable rows ≥ 56dp tall.
- Toggles use platform-native components for screen-reader compatibility.
- Form labels always above the input, not as placeholder-only.
- Danger actions never rely solely on red color — paired icon + label.

## Data Shape

A single `UserProfile` object aggregates everything visible on the hub: identity, association memberships, role, trust score, KYC tier, contact channels, language, currency, plan. Subviews source narrower slices: `PaymentMethod[]`, `Session[]`, `NotificationPreference`, `BillingEntry[]`, etc.

See `data.json` for the sample profile and `types.ts` for the canonical shapes.

## Integration

- **Trust pill on hub** → routes to **Section 2: Members & Trust** (`trust`) for the user's own factor breakdown.
- **Contributions stat** → routes to **Section 8: Analytics & Reporting** (`personal`) filtered to the current user.
- **Payouts stat** → routes to **Section 3: ROSCA Circles** (`payouts`) — the user's own upcoming and past payouts.
- **Circles stat** → routes to **Section 3: ROSCA Circles** (`my-circles`).
- **Upgrade to Enhanced KYC** on `identity` → routes to **Section 15: Login** (`onboarding`) at the KYC step.
- **Switch plan / Cancel subscription** on `subscription` → routes through the same Stripe-backed flow as **Section 0: Homepage** (`pricing`).
- **Contact support** on `help` → opens a thread in **Section 6: Communication & Events** (`inbox`) targeted at the Mafao support inbox.
- **Sign out** anywhere → routes to **Section 15: Login** (`signin`) and clears all in-memory auth.

## Out of Scope (handled elsewhere)

- Editing another member's profile → that's Section 14 platform-admin territory.
- Detailed transaction history → lives in Section 4 Treasury & Funds and Section 8 Analytics.
- Endorsement management → Section 2 Trust.
- Push-notification *receipt* (the inbox) → Section 6 Communication & Events.
