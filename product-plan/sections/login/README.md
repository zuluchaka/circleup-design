# Login

## Overview

Authentication: registration, login, password recovery, email verification, and onboarding wizard with Trust Score progression.

## User Flows

1. Register with email
2. Register with social (Google/Apple)
3. Login with credentials
4. Reset forgotten password
5. Complete email verification
6. Complete onboarding wizard

## Visual Reference

See the `.png` screenshot files in this directory for the target UI design.

## Components Provided

- `AuthFlow`
- `AuthLayout`
- `LoginForm`
- `RegisterForm`
- `ForgotPasswordForm`
- `ResetPasswordForm`
- `VerificationPending`
- `OnboardingWizard`
- `SocialButtons`
- `PasswordInput`

## Data Used

See `types.ts` for complete TypeScript interface definitions.
See `sample-data.json` for example data.

## Integration Notes

- All components are props-based — they accept data and callbacks via props
- No internal state management or API calls — you provide everything
- Components support dark mode via Tailwind `dark:` variants
- Responsive design with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
