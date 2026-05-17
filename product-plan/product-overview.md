# CircleUp — Product Overview

## Summary

An AI-powered association management platform that empowers diaspora associations, cultural groups, and savings communities to organize members, govern decisions, manage collective finances, and build toward shared prosperity. CircleUp bridges traditional community finance practices with modern financial services, serving over 1 billion global ROSCA participants who remain underserved by existing digital platforms.

## Key Problems Solved

1. **Fragmented Operations** — Associations juggle spreadsheets, WhatsApp, and paper records across 4-7 disconnected tools. CircleUp provides a unified platform replacing fragmented tools with a single source of truth.

2. **Trust Deficits in Community Finance** — ROSCAs lack transparency, leading to disputes and fraud. CircleUp provides verifiable records, AI-powered Trust Scores (0-1000), and Emergency Fund protection that automatically covers defaults.

3. **Cultural Mismatch** — Generic platforms ignore community finance traditions like susu, tontine, paluwagan, and tandas. CircleUp offers multi-language support (EN, FR, DE, IT, PT), cultural terminology, and flexible governance models.

4. **Financial Exclusion** — Community savings don't connect to formal banking. CircleUp bridges informal savings to formal financial services through Swiss banking partnerships and credit-building features.

## Planned Sections

1. **Homepage** — Public-facing landing page with platform discovery, ROSCA education, trust building, interactive readiness quizzes, pricing transparency, and conversion pathways
2. **Associations** — Create and manage associations with customizable settings, branding, cultural terminology, multi-language support, member directory, role management, and import/migration capabilities
3. **Members & Trust** — Member directory with profiles, roles, engagement tracking, and AI Trust Score (0-1000 reliability rating with transparent factor breakdown)
4. **ROSCA Circles** — Automated contribution collection, payout disbursement, payment prediction to prevent defaults, and Emergency Fund protection
5. **Treasury & Funds** — Multi-fund accounting with audit trails, welfare and mutual aid fund management, and application workflows
6. **Governance & Voting** — Elections, proposals, committees, and flexible decision-making models accommodating different cultural governance traditions
7. **Communication & Events** — Multi-channel messaging (in-app, email, SMS, push), event management with registration and payment integration
8. **Documents** — Document storage, sharing, and organization for association records, meeting minutes, financial reports, and member agreements
9. **Analytics & Reporting** — Personal dashboards, circle health metrics, downloadable statements, and business intelligence
10. **Credit & Lending** — Payout advances, CircleUp credit scores, personal loans backed by circle participation, and credit bureau reporting
11. **AI Insights** — Personalized circle recommendations, default risk prediction, fraud detection, AI financial health assistant, and smart savings suggestions
12. **Community & Social** — Referral rewards, achievement badges, savings leaderboards, community events, milestone celebrations, and savings challenges
13. **Multi-Share** — Enhanced ROSCA allowing members to hold multiple shares (1-10), with share request workflows, Trust Score-based eligibility, and compliance alerts
14. **Projects & Fundraising** — Community fundraising campaigns with donation collection, progress tracking, donor management, and impact reporting
15. **Platform Administration** — Administrative tools for user management, compliance monitoring (AML/KYC), regulatory reporting (FINMA), support ticketing, and system health
16. **Login** — User registration (email/password and social via Google/Apple), secure login, password recovery, email verification, and guided onboarding wizard
17. **Federations** — Federation setup and governance, child association linking, shared policy cascading, cross-association oversight, consolidated financial management, and federation-wide elections

## Data Model

Core entities: User, Association, Membership, Circle, Participant, Contribution, Payout, Emergency Fund Intervention, Trust Score, Payment Method, Transaction, Welfare Fund, Welfare Application, Event, Election, Proposal, Vote, Notification, Announcement, Message, Document, Audit Log

## Design System

**Colors:**
- Primary: `indigo` — Used for buttons, links, key accents
- Secondary: `amber` — Used for tags, highlights, secondary elements
- Neutral: `slate` — Used for backgrounds, text, borders

**Typography:**
- Heading: Inter
- Body: Inter
- Mono: JetBrains Mono

## Implementation Sequence

Build this product in milestones:

1. **Foundation** — Set up design tokens, data model types, routing structure, and application shell
2. **Homepage** — Public-facing landing page
3. **Associations** — Association management with settings and branding
4. **Members & Trust** — Member directory and Trust Scores
5. **ROSCA Circles** — Savings circles and contributions
6. **Treasury & Funds** — Multi-fund accounting
7. **Governance & Voting** — Elections and proposals
8. **Communication & Events** — Messaging and events
9. **Documents** — Document management
10. **Analytics & Reporting** — Dashboards and reports
11. **Credit & Lending** — Advances and loans
12. **AI Insights** — Predictions and recommendations
13. **Community & Social** — Referrals and achievements
14. **Multi-Share** — Multiple contribution shares
15. **Projects & Fundraising** — Community fundraising
16. **Platform Administration** — Admin tools
17. **Login** — Authentication and onboarding
18. **Federations** — Multi-association federation management

Each milestone has a dedicated instruction document in `instructions/incremental/`.
