# Credit & Lending

## Overview

Credit products built on ROSCA participation: payout advances, credit scores, personal loans, and credit bureau reporting.

## User Flows

1. View credit score dashboard
2. Request payout advance
3. Apply for personal loan
4. Use credit score simulator
5. Opt-in to credit bureau reporting

## Visual Reference

See the `.png` screenshot files in this directory for the target UI design.

## Components Provided

- `CreditScoreDashboard`
- `PayoutAdvances`
- `LoanCenter`
- `LoanApplications`
- `CollectiveLending`
- `CreditBuilding`
- `PortfolioDashboard`

## Data Used

See `types.ts` for complete TypeScript interface definitions.
See `sample-data.json` for example data.

## Integration Notes

- All components are props-based — they accept data and callbacks via props
- No internal state management or API calls — you provide everything
- Components support dark mode via Tailwind `dark:` variants
- Responsive design with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
