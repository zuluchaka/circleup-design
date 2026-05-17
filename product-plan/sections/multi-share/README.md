# Multi-Share

## Overview

Enhanced ROSCA with multiple shares (1-10) per member, proportional payouts, eligibility workflows, and compliance monitoring.

## User Flows

1. Request additional shares
2. View share distribution
3. Make multi-share contribution
4. Approve share request (organizer)
5. Monitor compliance (admin)

## Visual Reference

See the `.png` screenshot files in this directory for the target UI design.

## Components Provided

- `MultiShare`
- `MultiShareProps`
- `CircleDashboard`
- `ShareRequestModal`
- `ShareHistoryTimeline`
- `ContributionPayment`
- `PersonalShareSummary`
- `PlatformAdminDashboard`

## Data Used

See `types.ts` for complete TypeScript interface definitions.
See `sample-data.json` for example data.

## Integration Notes

- All components are props-based — they accept data and callbacks via props
- No internal state management or API calls — you provide everything
- Components support dark mode via Tailwind `dark:` variants
- Responsive design with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
