# Treasury & Funds

## Overview

Financial management with real-time fund monitoring, segregated accounting, reconciliation, emergency fund, investments, and audit trails.

## User Flows

1. View treasury dashboard
2. Drill into circle fund detail
3. Review reconciliation
4. Manage emergency fund requests
5. Generate audit report

## Visual Reference

See the `.png` screenshot files in this directory for the target UI design.

## Components Provided

- `TreasuryDashboard`
- `CircleFundDetail`
- `TransactionLedger`
- `ReconciliationConsole`
- `EmergencyFundPanel`
- `InvestmentManager`
- `MultiCurrencySettings`
- `AuditReportGenerator`

## Data Used

See `types.ts` for complete TypeScript interface definitions.
See `sample-data.json` for example data.

## Integration Notes

- All components are props-based — they accept data and callbacks via props
- No internal state management or API calls — you provide everything
- Components support dark mode via Tailwind `dark:` variants
- Responsive design with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
