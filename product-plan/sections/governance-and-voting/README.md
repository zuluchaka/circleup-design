# Governance & Voting

## Overview

Elections, proposals, committees, and flexible decision-making models (majority, supermajority, consensus, weighted).

## User Flows

1. Create and run an election
2. Submit and vote on a proposal
3. Cast ballot in voting booth
4. Configure governance rules
5. Join a committee

## Visual Reference

See the `.png` screenshot files in this directory for the target UI design.

## Components Provided

- `GovernanceDashboard`
- `ElectionManager`
- `ProposalCenter`
- `VotingBooth`
- `CommitteeDirectory`
- `GovernanceSettings`
- `DecisionArchive`
- `CandidateProfile`

## Data Used

See `types.ts` for complete TypeScript interface definitions.
See `sample-data.json` for example data.

## Integration Notes

- All components are props-based — they accept data and callbacks via props
- No internal state management or API calls — you provide everything
- Components support dark mode via Tailwind `dark:` variants
- Responsive design with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
