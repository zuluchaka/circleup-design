# Homepage

## Overview

Public-facing landing page for prospective users with platform discovery, ROSCA education, trust building, interactive readiness quizzes, pricing transparency, and conversion pathways for both members and organizers.

## User Flows

1. Visit landing page and explore value proposition
2. Take member or organizer readiness quiz
3. Compare pricing tiers
4. Register for account
5. View testimonials and community impact

## Visual Reference

See the `.png` screenshot files in this directory for the target UI design.

## Components Provided

- `Homepage`
- `HeroSection`
- `StatsSection`
- `BenefitsSection`
- `HowItWorksSection`
- `TestimonialsSection`
- `ComparisonSection`
- `CircleExamplesSection`
- `TrustSection`
- `CommunityShowcaseSection`
- `PricingSection`
- `FaqSection`
- `QuizSection`
- `CtaSection`
- `Footer`

## Data Used

See `types.ts` for complete TypeScript interface definitions.
See `sample-data.json` for example data.

## Integration Notes

- All components are props-based — they accept data and callbacks via props
- No internal state management or API calls — you provide everything
- Components support dark mode via Tailwind `dark:` variants
- Responsive design with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
