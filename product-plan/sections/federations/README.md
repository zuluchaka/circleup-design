# Federations

## Overview

Federation management: governance, child association linking, policy cascading, consolidated finances, elections, and cross-association coordination.

## User Flows

1. Create federation
2. Link child associations
3. Configure policies
4. View financial dashboard
5. Run federation election
6. Manage cross-association members

## Visual Reference

See the `.png` screenshot files in this directory for the target UI design.

## Components Provided

- `StatsRow`
- `AlertPanel`
- `AssociationCards`
- `LeadershipDirectory`
- `PolicyManager`
- `FinancialDashboard`
- `MemberDirectory`
- `ElectionManager`
- `EventsAnnouncements`
- `ReportsCenter`
- `FederationList`
- `FederationOverview`
- `FederationDashboard`

## Data Used

See `types.ts` for complete TypeScript interface definitions.
See `sample-data.json` for example data.

## Integration Notes

- All components are props-based — they accept data and callbacks via props
- No internal state management or API calls — you provide everything
- Components support dark mode via Tailwind `dark:` variants
- Responsive design with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
