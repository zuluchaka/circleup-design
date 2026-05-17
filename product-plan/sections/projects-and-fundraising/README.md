# Projects & Fundraising

## Overview

Community fundraising campaigns with donation collection, progress tracking, donor management, and matching campaigns.

## User Flows

1. Browse campaigns
2. Make a donation
3. Create a campaign
4. Manage donors

## Visual Reference

See the `.png` screenshot files in this directory for the target UI design.

## Components Provided

- `CampaignCard`
- `CampaignList`
- `CampaignDetail`
- `DonationFlow`
- `CampaignCreator`
- `CampaignDashboard`
- `DonorManagement`

## Data Used

See `types.ts` for complete TypeScript interface definitions.
See `sample-data.json` for example data.

## Integration Notes

- All components are props-based — they accept data and callbacks via props
- No internal state management or API calls — you provide everything
- Components support dark mode via Tailwind `dark:` variants
- Responsive design with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
