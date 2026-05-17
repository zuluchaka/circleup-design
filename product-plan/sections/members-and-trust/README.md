# Members & Trust

## Overview

Member directory with profiles, roles, engagement tracking, and AI Trust Score (0-1000) with transparent factor breakdown.

## User Flows

1. Browse and search member directory
2. View member profile with trust score
3. View own trust score with improvement tips
4. Review at-risk members (organizer)

## Visual Reference

See the `.png` screenshot files in this directory for the target UI design.

## Components Provided

- `TrustScoreBadge`
- `RoleBadge`
- `StatusBadge`
- `TrustScoreGauge`
- `MemberDirectory`
- `MemberProfile`
- `MyTrustScore`
- `AtRiskMembers`

## Data Used

See `types.ts` for complete TypeScript interface definitions.
See `sample-data.json` for example data.

## Integration Notes

- All components are props-based — they accept data and callbacks via props
- No internal state management or API calls — you provide everything
- Components support dark mode via Tailwind `dark:` variants
- Responsive design with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
