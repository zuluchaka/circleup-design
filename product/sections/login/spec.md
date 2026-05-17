# Login Specification

## Overview
The Login section provides all authentication entry points for CircleUp's V1.9 MVP — registration (email/password and social), login, password recovery, email verification, and initial profile onboarding. It serves as the gateway to the platform, establishing trust and security from the first interaction. In V1.9, auth tokens flow through a **platform abstraction layer** so the same UI works in both web and the Capacitor Android shell (JWT stored via the platform layer; SSO redirects round-trip through native browser when needed).

## User Flows
- **Email Registration** — User fills in email, password (with strength meter), first name, last name, accepts ToS/Privacy Policy, optional referral code. Account created with default Trust Score of 650. Verification email sent within 30 seconds.
- **Social Registration (Google/Apple)** — User clicks "Continue with Google" or "Continue with Apple", completes OAuth 2.0/PKCE flow, account created with auto-verified email. Prompted for missing profile fields if provider data is incomplete.
- **Email Login** — User enters email/password, optional "Remember me" (30-day session). Lockout after 5 failed attempts (15-min cooldown). Unverified accounts shown verification prompt.
- **Social Login (Google/Apple)** — Returning social users authenticate via provider. Unlinked accounts offered option to create new or link existing account.
- **Forgot Password** — User enters email, receives reset link (1-hour validity). Same confirmation message regardless of email existence (prevents enumeration). New password invalidates all sessions.
- **Email Verification** — Click verification link (24-hour validity) to activate account. Resend option (rate-limited 3/hour) with spam folder guidance. Expired links offer re-send.
- **Profile Onboarding Wizard** — Post-verification guided setup: photo, phone, bio, location, language preferences. Progress bar shows Trust Score improvement per step. Skippable with persistent reminder.
- **Language Selection** — User can switch UI language (EN, FR, DE, IT, PT) directly from the login/registration page before signing in.

## UI Requirements
- Split layout: form on one side, hero illustration with value propositions on the other (collapses to stacked on mobile)
- Social login buttons ("Continue with Google", "Continue with Apple") displayed prominently above email form
- Real-time inline validation for email format and password strength meter (8+ chars, 1 uppercase, 1 number)
- "Account exists" detection with link to login and password reset
- Referral code input field (collapsible/optional)
- Lockout countdown timer after 5 failed login attempts
- Verification pending page with resend button and spam folder instructions
- Step-by-step onboarding wizard with progress bar and Trust Score preview
- Language selector dropdown accessible from all auth pages
- CircleUp logo and tagline on all auth screens
- Fully responsive (mobile-first)
- Light and dark mode support
- **Capacitor-aware**: JWT storage routed through the platform layer (web `localStorage` vs. native `SecureStorage`); social-auth OAuth opens in the native in-app browser; deep links return the user to the correct AuthFlow state.

## Configuration
- shell: false
