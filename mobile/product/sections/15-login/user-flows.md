# Section 15 — User Flows

## Flow A · Sign in (returning member)

1. Lands on `signin`. Email + password auto-filled by Keychain.
2. Taps **Sign in**. Biometric confirm appears (Face ID). Confirms.
3. Routes to authenticated home (Section 6 `inbox`).

## Flow B · Sign up (new member from quiz outcome)

1. Lands on `signup` with `intent=member` query.
2. Enters email, password (strength: Strong). Reads T&C summary, accepts.
3. Routes to `verify`. Email arrives in 5s. Member taps deep link in email.
4. App returns to `verify` already verified. Auto-advances to `onboarding`.

## Flow C · Onboarding wizard

1. Step 1 (Profile): first name, last name, language pref. Continue.
2. Step 2 (Identity): scans ID with camera. Wait state. Verified ✅.
3. Step 3 (Preferences): notification permissions, payment method link.
4. Step 4 (First circle): shown 2 recommended starter circles.
5. Taps **Join Welfare Booster** → routes to Section 3 with circle preselected.

## Edge states

- **Wrong password (3x)**: rate-limit screen with reset link.
- **Email verification expired**: shows resend with new countdown.
- **Onboarding bailed mid-flow**: resumes from last completed step on next launch.
- **No camera permission** at step 2: offers fallback document upload.
