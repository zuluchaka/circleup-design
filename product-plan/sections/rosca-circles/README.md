# ROSCA Circles

## Overview

Automated savings circles with contribution collection, payout disbursement, multiple allocation methods, Emergency Fund protection, and AI risk prediction.

## User Flows

1. Discover and join a circle
2. Create new circle via wizard
3. Make a contribution payment
4. View payout schedule
5. Manage circle as organizer
6. Record cash collection
7. View emergency fund

## Visual Reference

See the `.png` screenshot files in this directory for the target UI design.

## Components Provided

- `CircleDiscovery`
- `MyCirclesDashboard`
- `CircleDetail`
- `CreateCircleWizard`
- `ContributionFlow`
- `PayoutSchedule`
- `BiddingInterface`
- `PositionSwap`
- `TreasurerDashboard`
- `MemberRiskScores`
- `DisputeManagement`
- `EmergencyFundPanel`
- `CircleManagement`
- `CashCollection`
- `InviteMembers`
- `WaitlistManagement`

## Data Used

See `types.ts` for complete TypeScript interface definitions.
See `sample-data.json` for example data.

## Integration Notes

- All components are props-based — they accept data and callbacks via props
- No internal state management or API calls — you provide everything
- Components support dark mode via Tailwind `dark:` variants
- Responsive design with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
