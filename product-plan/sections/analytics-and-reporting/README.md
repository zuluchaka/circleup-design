# Analytics & Reporting

## Overview

Personal dashboards, circle health metrics, statements, savings goals, and business intelligence at every organizational level.

## User Flows

1. View personal savings dashboard
2. Monitor circle health (organizer)
3. Generate and download statement
4. Create and track savings goal

## Visual Reference

See the `.png` screenshot files in this directory for the target UI design.

## Components Provided

- `PersonalDashboard`
- `CircleHealthDashboard`
- `AssociationDashboard`
- `FederationDashboard`
- `Statements`
- `SavingsGoals`
- `ReportsCenter`

## Data Used

See `types.ts` for complete TypeScript interface definitions.
See `sample-data.json` for example data.

## Integration Notes

- All components are props-based — they accept data and callbacks via props
- No internal state management or API calls — you provide everything
- Components support dark mode via Tailwind `dark:` variants
- Responsive design with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
