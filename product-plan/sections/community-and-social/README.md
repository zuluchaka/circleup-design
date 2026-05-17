# Community & Social

## Overview

Referral rewards, achievement badges, savings leaderboards, challenges, and success stories.

## User Flows

1. Generate and share referral link
2. View badge gallery and progress
3. Browse leaderboards
4. Enroll in savings challenge
5. Read success stories

## Visual Reference

See the `.png` screenshot files in this directory for the target UI design.

## Components Provided

- `CommunitySocialDashboard`
- `ReferralDashboard`
- `BadgeGallery`
- `Leaderboard`
- `SavingsChallenges`
- `SuccessStories`

## Data Used

See `types.ts` for complete TypeScript interface definitions.
See `sample-data.json` for example data.

## Integration Notes

- All components are props-based — they accept data and callbacks via props
- No internal state management or API calls — you provide everything
- Components support dark mode via Tailwind `dark:` variants
- Responsive design with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
