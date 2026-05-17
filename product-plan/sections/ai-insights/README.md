# AI Insights

## Overview

AI-powered recommendations, predictive analytics, fraud detection, financial health chat, and trust network visualization.

## User Flows

1. View AI insights dashboard
2. Chat with AI financial assistant
3. Monitor default risk (organizer)
4. Review fraud alerts (admin)
5. Explore trust network

## Visual Reference

See the `.png` screenshot files in this directory for the target UI design.

## Components Provided

- `AiInsightsDashboard`
- `OrganizerInsights`
- `FraudAnalytics`
- `FinancialHealthChatComponent`
- `TrustNetwork`

## Data Used

See `types.ts` for complete TypeScript interface definitions.
See `sample-data.json` for example data.

## Integration Notes

- All components are props-based — they accept data and callbacks via props
- No internal state management or API calls — you provide everything
- Components support dark mode via Tailwind `dark:` variants
- Responsive design with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
