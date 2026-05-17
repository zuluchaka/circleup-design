# CircleUp — Complete Implementation Instructions

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist (first-time users, after deletions)
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Test-Driven Development

Each section includes a `tests.md` file with detailed test-writing instructions. These are **framework-agnostic** — adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, RSpec, Minitest, PHPUnit, etc.).

**For each section:**
1. Read `product-plan/sections/[section-id]/tests.md`
2. Write failing tests for key user flows (success and failure paths)
3. Implement the feature to make tests pass
4. Refactor while keeping tests green

---

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


---

# Milestone 1: Foundation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

---


## Goal

Set up the foundational elements: design tokens, data model types, routing structure, and application shell.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

**Colors (Tailwind):**
- **Primary:** `indigo` — Buttons, links, active navigation states, key accents
- **Secondary:** `amber` — Notification badges, warnings, highlights
- **Neutral:** `slate` — Backgrounds, text, borders, navigation chrome

**Typography (Google Fonts):**
- **Heading & Body:** Inter (weights: 300, 400, 500, 600, 700)
- **Monospace:** JetBrains Mono (weights: 400, 500)

**Reference files:**
- `product-plan/design-system/tokens.css` — CSS custom properties with full shade scales
- `product-plan/design-system/tailwind-colors.md` — Tailwind class usage examples
- `product-plan/design-system/fonts.md` — Google Fonts import snippet

### 2. Data Model Types

Create TypeScript interfaces for the 22 core entities:

**Core:** User, Association, Membership, Circle, Participant
**Financial:** Contribution, Payout, EmergencyFundIntervention, Transaction, PaymentMethod, WelfareFund, WelfareApplication
**Trust:** TrustScore, TrustScoreFactors
**Governance:** Election, Proposal, Vote
**Communication:** Notification, Announcement, Message, Event
**System:** Document, AuditLog

**Reference files:**
- `product-plan/data-model/types.ts` — Complete TypeScript interface definitions
- `product-plan/data-model/README.md` — Entity relationships and design decisions
- `product-plan/data-model/sample-data.json` — Example data for testing

**Key design decisions:**
- UUIDv7 primary keys (globally unique, sortable)
- Soft deletes via `deleted_at` timestamp
- `created_at` / `updated_at` audit columns on all tables
- JSONB settings for flexible configuration
- Stripe integration for all payments (tokenized)

### 3. Routing Structure

Create routes for all 17 sections plus the application shell:

| Route | Section | Shell? |
|-------|---------|--------|
| `/` | Homepage | No (standalone) |
| `/login` | Login | No (standalone) |
| `/register` | Login | No (standalone) |
| `/forgot-password` | Login | No (standalone) |
| `/verify-email` | Login | No (standalone) |
| `/onboarding` | Login | No (standalone) |
| `/associations` | Associations | Yes |
| `/members` | Members & Trust | Yes |
| `/circles` | ROSCA Circles | Yes |
| `/treasury` | Treasury & Funds | Yes |
| `/credit` | Credit & Lending | Yes |
| `/multi-share` | Multi-Share | Yes |
| `/governance` | Governance & Voting | Yes |
| `/documents` | Documents | Yes |
| `/projects` | Projects & Fundraising | Yes |
| `/communication` | Communication & Events | Yes |
| `/community` | Community & Social | Yes |
| `/analytics` | Analytics & Reporting | Yes |
| `/insights` | AI Insights | Yes |
| `/federations` | Federations | Yes |
| `/admin` | Platform Administration | Yes |

### 4. Application Shell

Copy the shell components from `product-plan/shell/components/`:

- `AppShell.tsx` — Main layout wrapper with sidebar and content area
- `MainNav.tsx` — Collapsible sidebar navigation with RBAC support
- `UserMenu.tsx` — User menu with avatar, role badges, dropdown

**Wire Up Navigation:**

The sidebar organizes navigation into groups with collapsible headers:

| Group | Items |
|-------|-------|
| Home | Homepage |
| Core | Associations, Members & Trust, ROSCA Circles |
| Finance | Treasury & Funds, Credit & Lending, Multi-Share |
| Governance | Governance & Voting, Documents, Projects & Fundraising |
| Engagement | Communication & Events, Community & Social |
| Intelligence | Analytics & Reporting, AI Insights |
| Organization | Federations |
| Administration | Platform Admin |

**RBAC-Aware Navigation:**
- Items with `none` access are hidden entirely
- Items with `read` access show eye icon and muted styling
- Items with `write`/`read_write` access display normally
- Empty groups are hidden

**User Menu expects:**
- User name and email
- Avatar URL (optional, falls back to initials)
- Access role (admin, standard_user, invitee)
- Contextual roles (president, treasurer, secretary, member)
- Logout callback
- Settings callback

**Responsive Behavior:**
- Desktop (1024px+): Full sidebar with labels, 252px width
- Tablet (768px-1023px): Collapsed to icons (60px), expandable on hover
- Mobile (<768px): Off-canvas drawer with hamburger toggle

## Files to Reference

- `product-plan/design-system/` — Color tokens, typography, CSS properties
- `product-plan/data-model/` — Type definitions, relationships, sample data
- `product-plan/shell/README.md` — Shell specification and design intent
- `product-plan/shell/components/` — AppShell, MainNav, UserMenu components

## Done When

- [ ] Design tokens configured (indigo/amber/slate colors, Inter/JetBrains Mono fonts)
- [ ] Google Fonts loading correctly
- [ ] Data model types defined for all 22 core entities
- [ ] Database schema created (or migrations ready)
- [ ] Routes exist for all 17 sections (can be placeholder pages)
- [ ] Shell renders with collapsible sidebar navigation
- [ ] Navigation groups are collapsible with chevron indicators
- [ ] Active route highlighted in navigation (indigo-50 bg, indigo-700 text)
- [ ] Navigation links to correct routes
- [ ] User menu shows user info with role badges
- [ ] User menu dropdown works (profile, settings, logout)
- [ ] RBAC controls which nav items are visible
- [ ] Responsive on mobile (off-canvas drawer)
- [ ] Dark mode support with `dark:` variants


---

# Milestone 2: Homepage

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---


## Goal

Implement the Homepage feature.

## Overview

The public-facing landing page that serves as the primary entry point for prospective users. It educates visitors about ROSCA/savings circles, builds trust through social proof and security transparency, and converts visitors into registered users through multiple pathways including readiness quizzes, pricing comparison, and registration forms.

**Key Functionality:**
- Explore platform value proposition and ROSCA education
- Take member or organizer readiness quiz
- Compare pricing tiers and fee structure
- Register for account via email or social login
- View testimonials and community impact

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/homepage/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/homepage/components/`:

Homepage, HeroSection, StatsSection, BenefitsSection, HowItWorksSection, TestimonialsSection, ComparisonSection, CircleExamplesSection, TrustSection, CommunityShowcaseSection, PricingSection, FaqSection, QuizSection, CtaSection, Footer

### Data Layer

The components expect data shapes defined in `product-plan/sections/homepage/types.ts`. You'll need to:
- Create API endpoints for CRUD operations
- Implement data fetching and state management
- Connect real data to the component props

### Callbacks

Wire up all callback props defined in the component interfaces. Each `on*` prop should be connected to your routing, API calls, or state management. Review `types.ts` for the complete list of callback props and their signatures.

### Empty States

Implement empty state UI for when no records exist yet:
- **No data yet:** Show a helpful message and call-to-action when the primary list/collection is empty
- **No related records:** Handle cases where associated records don't exist
- **First-time user experience:** Guide users to create their first item with clear CTAs
- **Filtered results empty:** Show "No results found" with filter reset option

## Files to Reference

- `product-plan/sections/homepage/README.md` — Feature overview and design intent
- `product-plan/sections/homepage/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/homepage/components/` — React components
- `product-plan/sections/homepage/types.ts` — TypeScript interfaces
- `product-plan/sections/homepage/sample-data.json` — Test data
- `product-plan/sections/homepage/*.png` — Visual references

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data from backend
- [ ] Empty states display properly when no records exist
- [ ] All callback props wired to routing and API calls
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design in screenshots
- [ ] Responsive on mobile
- [ ] Dark mode support


---

# Milestone 3: Associations

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---


## Goal

Implement the Associations feature.

## Overview

Create and manage community organizations (diaspora associations, cultural clubs, savings groups). Users can belong to multiple associations, each with customizable branding, cultural terminology, and multi-language support (EN, FR, DE, IT, PT). Includes a comprehensive 5-phase import/migration wizard for onboarding existing associations with their member rosters, ROSCA circles (including mid-cycle state), and historical financial data.

**Key Functionality:**
- View and manage my associations
- Create new association from scratch or via import
- Discover and join public associations
- Manage settings, branding, and members
- Import existing association via 5-phase migration wizard

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/associations/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/associations/components/`:

MyAssociationsList, MyAssociationsListProps, AssociationDashboard, AssociationDashboardProps, DiscoverAssociations, DiscoverAssociationsProps, MemberDirectory, MemberDirectoryProps, AssociationSettings, AssociationSettingsProps, AssociationAdministration, AssociationAdministrationProps, InviteMembers, InviteMembersProps, CreateAssociation, CreateAssociationProps, FederationDashboard, FederationDashboardProps, ChapterDirectory, ChapterDirectoryProps, PolicyManager, PolicyManagerProps, AssociationAnalytics, AssociationAnalyticsProps, FederationAnalytics, FederationAnalyticsProps, MigrationDashboard, MigrationWizard, MigrationWizardProps, AssociationCard, RoleBadge, AssociationTypeBadge, ActivityFeed, AnnouncementCard

### Data Layer

The components expect data shapes defined in `product-plan/sections/associations/types.ts`. You'll need to:
- Create API endpoints for CRUD operations
- Implement data fetching and state management
- Connect real data to the component props

### Callbacks

Wire up all callback props defined in the component interfaces. Each `on*` prop should be connected to your routing, API calls, or state management. Review `types.ts` for the complete list of callback props and their signatures.

### Empty States

Implement empty state UI for when no records exist yet:
- **No data yet:** Show a helpful message and call-to-action when the primary list/collection is empty
- **No related records:** Handle cases where associated records don't exist
- **First-time user experience:** Guide users to create their first item with clear CTAs
- **Filtered results empty:** Show "No results found" with filter reset option

## Files to Reference

- `product-plan/sections/associations/README.md` — Feature overview and design intent
- `product-plan/sections/associations/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/associations/components/` — React components
- `product-plan/sections/associations/types.ts` — TypeScript interfaces
- `product-plan/sections/associations/sample-data.json` — Test data
- `product-plan/sections/associations/*.png` — Visual references

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data from backend
- [ ] Empty states display properly when no records exist
- [ ] All callback props wired to routing and API calls
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design in screenshots
- [ ] Responsive on mobile
- [ ] Dark mode support


---

# Milestone 4: Members & Trust

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---


## Goal

Implement the Members & Trust feature.

## Overview

Comprehensive member directory with profiles, roles, and engagement tracking. The centerpiece is the AI Trust Score (0-1000) that calculates member reliability based on payment history (40%), verification level (20%), tenure (15%), engagement (10%), network connections (10%), and external factors (5%).

**Key Functionality:**
- Browse member directory with search and filters
- View member profile with trust score breakdown
- View own trust score with improvement tips
- Review at-risk members with risk indicators (organizer)
- Give and request references

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/members-and-trust/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/members-and-trust/components/`:

TrustScoreBadge, RoleBadge, StatusBadge, TrustScoreGauge, MemberDirectory, MemberProfile, MyTrustScore, AtRiskMembers

### Data Layer

The components expect data shapes defined in `product-plan/sections/members-and-trust/types.ts`. You'll need to:
- Create API endpoints for CRUD operations
- Implement data fetching and state management
- Connect real data to the component props

### Callbacks

Wire up all callback props defined in the component interfaces. Each `on*` prop should be connected to your routing, API calls, or state management. Review `types.ts` for the complete list of callback props and their signatures.

### Empty States

Implement empty state UI for when no records exist yet:
- **No data yet:** Show a helpful message and call-to-action when the primary list/collection is empty
- **No related records:** Handle cases where associated records don't exist
- **First-time user experience:** Guide users to create their first item with clear CTAs
- **Filtered results empty:** Show "No results found" with filter reset option

## Files to Reference

- `product-plan/sections/members-and-trust/README.md` — Feature overview and design intent
- `product-plan/sections/members-and-trust/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/members-and-trust/components/` — React components
- `product-plan/sections/members-and-trust/types.ts` — TypeScript interfaces
- `product-plan/sections/members-and-trust/sample-data.json` — Test data
- `product-plan/sections/members-and-trust/*.png` — Visual references

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data from backend
- [ ] Empty states display properly when no records exist
- [ ] All callback props wired to routing and API calls
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design in screenshots
- [ ] Responsive on mobile
- [ ] Dark mode support


---

# Milestone 5: ROSCA Circles

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---


## Goal

Implement the ROSCA Circles feature.

## Overview

Automated ROSCA savings circles with customizable contribution schedules, multiple payout allocation methods (fixed rotation, bidding, lottery, need-based), automated payment collection, Emergency Fund protection (1% of contributions covers defaults), AI-powered risk prediction, and comprehensive tools for organizers.

**Key Functionality:**
- Discover and join circles with AI recommendations
- Create new circle with multi-step wizard
- Make contributions with payment method selection
- View payout schedule and request position swaps
- Manage circle as organizer
- Record cash collections and view emergency fund

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/rosca-circles/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/rosca-circles/components/`:

CircleDiscovery, MyCirclesDashboard, CircleDetail, CreateCircleWizard, ContributionFlow, PayoutSchedule, BiddingInterface, PositionSwap, TreasurerDashboard, MemberRiskScores, DisputeManagement, EmergencyFundPanel, CircleManagement, CashCollection, InviteMembers, WaitlistManagement

### Data Layer

The components expect data shapes defined in `product-plan/sections/rosca-circles/types.ts`. You'll need to:
- Create API endpoints for CRUD operations
- Implement data fetching and state management
- Connect real data to the component props

### Callbacks

Wire up all callback props defined in the component interfaces. Each `on*` prop should be connected to your routing, API calls, or state management. Review `types.ts` for the complete list of callback props and their signatures.

### Empty States

Implement empty state UI for when no records exist yet:
- **No data yet:** Show a helpful message and call-to-action when the primary list/collection is empty
- **No related records:** Handle cases where associated records don't exist
- **First-time user experience:** Guide users to create their first item with clear CTAs
- **Filtered results empty:** Show "No results found" with filter reset option

## Files to Reference

- `product-plan/sections/rosca-circles/README.md` — Feature overview and design intent
- `product-plan/sections/rosca-circles/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/rosca-circles/components/` — React components
- `product-plan/sections/rosca-circles/types.ts` — TypeScript interfaces
- `product-plan/sections/rosca-circles/sample-data.json` — Test data
- `product-plan/sections/rosca-circles/*.png` — Visual references

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data from backend
- [ ] Empty states display properly when no records exist
- [ ] All callback props wired to routing and API calls
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design in screenshots
- [ ] Responsive on mobile
- [ ] Dark mode support


---

# Milestone 6: Treasury & Funds

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---


## Goal

Implement the Treasury & Funds feature.

## Overview

Comprehensive financial management for treasurers. Real-time fund monitoring, segregated accounting per circle, multi-currency support, automated reconciliation, emergency fund management, investment allocation, and complete audit trails for Swiss regulatory compliance.

**Key Functionality:**
- View fund position on treasury dashboard
- Drill into circle-level fund detail
- Review daily reconciliation and resolve discrepancies
- Manage emergency fund requests and voting
- Generate and export audit reports
- Configure investment allocation

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/treasury-and-funds/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/treasury-and-funds/components/`:

TreasuryDashboard, CircleFundDetail, TransactionLedger, ReconciliationConsole, EmergencyFundPanel, InvestmentManager, MultiCurrencySettings, AuditReportGenerator

### Data Layer

The components expect data shapes defined in `product-plan/sections/treasury-and-funds/types.ts`. You'll need to:
- Create API endpoints for CRUD operations
- Implement data fetching and state management
- Connect real data to the component props

### Callbacks

Wire up all callback props defined in the component interfaces. Each `on*` prop should be connected to your routing, API calls, or state management. Review `types.ts` for the complete list of callback props and their signatures.

### Empty States

Implement empty state UI for when no records exist yet:
- **No data yet:** Show a helpful message and call-to-action when the primary list/collection is empty
- **No related records:** Handle cases where associated records don't exist
- **First-time user experience:** Guide users to create their first item with clear CTAs
- **Filtered results empty:** Show "No results found" with filter reset option

## Files to Reference

- `product-plan/sections/treasury-and-funds/README.md` — Feature overview and design intent
- `product-plan/sections/treasury-and-funds/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/treasury-and-funds/components/` — React components
- `product-plan/sections/treasury-and-funds/types.ts` — TypeScript interfaces
- `product-plan/sections/treasury-and-funds/sample-data.json` — Test data
- `product-plan/sections/treasury-and-funds/*.png` — Visual references

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data from backend
- [ ] Empty states display properly when no records exist
- [ ] All callback props wired to routing and API calls
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design in screenshots
- [ ] Responsive on mobile
- [ ] Dark mode support


---

# Milestone 7: Governance & Voting

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---


## Goal

Implement the Governance & Voting feature.

## Overview

Democratic decision-making through elections, proposals, and committees. Supports multiple voting models (majority, supermajority, consensus, weighted) to accommodate different cultural governance traditions.

**Key Functionality:**
- Create and run elections with nominations
- Submit and vote on proposals
- Cast ballots via voting booth
- Configure governance rules and voting models
- Join committees

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/governance-and-voting/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/governance-and-voting/components/`:

GovernanceDashboard, ElectionManager, ProposalCenter, VotingBooth, CommitteeDirectory, GovernanceSettings, DecisionArchive, CandidateProfile

### Data Layer

The components expect data shapes defined in `product-plan/sections/governance-and-voting/types.ts`. You'll need to:
- Create API endpoints for CRUD operations
- Implement data fetching and state management
- Connect real data to the component props

### Callbacks

Wire up all callback props defined in the component interfaces. Each `on*` prop should be connected to your routing, API calls, or state management. Review `types.ts` for the complete list of callback props and their signatures.

### Empty States

Implement empty state UI for when no records exist yet:
- **No data yet:** Show a helpful message and call-to-action when the primary list/collection is empty
- **No related records:** Handle cases where associated records don't exist
- **First-time user experience:** Guide users to create their first item with clear CTAs
- **Filtered results empty:** Show "No results found" with filter reset option

## Files to Reference

- `product-plan/sections/governance-and-voting/README.md` — Feature overview and design intent
- `product-plan/sections/governance-and-voting/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/governance-and-voting/components/` — React components
- `product-plan/sections/governance-and-voting/types.ts` — TypeScript interfaces
- `product-plan/sections/governance-and-voting/sample-data.json` — Test data
- `product-plan/sections/governance-and-voting/*.png` — Visual references

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data from backend
- [ ] Empty states display properly when no records exist
- [ ] All callback props wired to routing and API calls
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design in screenshots
- [ ] Responsive on mobile
- [ ] Dark mode support


---

# Milestone 8: Communication & Events

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---


## Goal

Implement the Communication & Events feature.

## Overview

Multi-channel messaging (in-app, email, SMS, push, WhatsApp) and comprehensive event management with registration and payment integration. Supports multi-language communication and intelligent notification delivery.

**Key Functionality:**
- View unified inbox
- Send direct and group messages
- Create and schedule announcements
- Create events with registration and ticketing
- Configure notification preferences

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/communication-and-events/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/communication-and-events/components/`:

Inbox, Conversations, ChatView, Announcements, AnnouncementComposer, EventsCalendar, EventDetails, EventCreator, NotificationPreferences, CommunicationTemplates

### Data Layer

The components expect data shapes defined in `product-plan/sections/communication-and-events/types.ts`. You'll need to:
- Create API endpoints for CRUD operations
- Implement data fetching and state management
- Connect real data to the component props

### Callbacks

Wire up all callback props defined in the component interfaces. Each `on*` prop should be connected to your routing, API calls, or state management. Review `types.ts` for the complete list of callback props and their signatures.

### Empty States

Implement empty state UI for when no records exist yet:
- **No data yet:** Show a helpful message and call-to-action when the primary list/collection is empty
- **No related records:** Handle cases where associated records don't exist
- **First-time user experience:** Guide users to create their first item with clear CTAs
- **Filtered results empty:** Show "No results found" with filter reset option

## Files to Reference

- `product-plan/sections/communication-and-events/README.md` — Feature overview and design intent
- `product-plan/sections/communication-and-events/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/communication-and-events/components/` — React components
- `product-plan/sections/communication-and-events/types.ts` — TypeScript interfaces
- `product-plan/sections/communication-and-events/sample-data.json` — Test data
- `product-plan/sections/communication-and-events/*.png` — Visual references

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data from backend
- [ ] Empty states display properly when no records exist
- [ ] All callback props wired to routing and API calls
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design in screenshots
- [ ] Responsive on mobile
- [ ] Dark mode support


---

# Milestone 9: Documents

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---


## Goal

Implement the Documents feature.

## Overview

Document management for association records including meeting minutes, financial reports, member agreements, and circle policies. Documents organized by circle with automatic generation of key financial records and digital signature support.

**Key Functionality:**
- Browse document library with folder navigation
- Upload documents with metadata and permissions
- Preview documents in-app
- Sign membership agreements digitally
- Use document templates

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/documents/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/documents/components/`:

DocumentLibrary, CircleDocuments, DocumentViewer, DocumentUpload, DocumentTemplates, AgreementSigning

### Data Layer

The components expect data shapes defined in `product-plan/sections/documents/types.ts`. You'll need to:
- Create API endpoints for CRUD operations
- Implement data fetching and state management
- Connect real data to the component props

### Callbacks

Wire up all callback props defined in the component interfaces. Each `on*` prop should be connected to your routing, API calls, or state management. Review `types.ts` for the complete list of callback props and their signatures.

### Empty States

Implement empty state UI for when no records exist yet:
- **No data yet:** Show a helpful message and call-to-action when the primary list/collection is empty
- **No related records:** Handle cases where associated records don't exist
- **First-time user experience:** Guide users to create their first item with clear CTAs
- **Filtered results empty:** Show "No results found" with filter reset option

## Files to Reference

- `product-plan/sections/documents/README.md` — Feature overview and design intent
- `product-plan/sections/documents/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/documents/components/` — React components
- `product-plan/sections/documents/types.ts` — TypeScript interfaces
- `product-plan/sections/documents/sample-data.json` — Test data
- `product-plan/sections/documents/*.png` — Visual references

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data from backend
- [ ] Empty states display properly when no records exist
- [ ] All callback props wired to routing and API calls
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design in screenshots
- [ ] Responsive on mobile
- [ ] Dark mode support


---

# Milestone 10: Analytics & Reporting

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---


## Goal

Implement the Analytics & Reporting feature.

## Overview

Personal dashboards, circle health metrics, downloadable statements, and business intelligence at every organizational level — individual savings, circle performance, association aggregates, and federation-wide oversight.

**Key Functionality:**
- View personal savings dashboard
- Monitor circle health metrics (organizer)
- Generate and download statements
- Create and track savings goals
- Schedule and export custom reports

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/analytics-and-reporting/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/analytics-and-reporting/components/`:

PersonalDashboard, CircleHealthDashboard, AssociationDashboard, FederationDashboard, Statements, SavingsGoals, ReportsCenter

### Data Layer

The components expect data shapes defined in `product-plan/sections/analytics-and-reporting/types.ts`. You'll need to:
- Create API endpoints for CRUD operations
- Implement data fetching and state management
- Connect real data to the component props

### Callbacks

Wire up all callback props defined in the component interfaces. Each `on*` prop should be connected to your routing, API calls, or state management. Review `types.ts` for the complete list of callback props and their signatures.

### Empty States

Implement empty state UI for when no records exist yet:
- **No data yet:** Show a helpful message and call-to-action when the primary list/collection is empty
- **No related records:** Handle cases where associated records don't exist
- **First-time user experience:** Guide users to create their first item with clear CTAs
- **Filtered results empty:** Show "No results found" with filter reset option

## Files to Reference

- `product-plan/sections/analytics-and-reporting/README.md` — Feature overview and design intent
- `product-plan/sections/analytics-and-reporting/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/analytics-and-reporting/components/` — React components
- `product-plan/sections/analytics-and-reporting/types.ts` — TypeScript interfaces
- `product-plan/sections/analytics-and-reporting/sample-data.json` — Test data
- `product-plan/sections/analytics-and-reporting/*.png` — Visual references

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data from backend
- [ ] Empty states display properly when no records exist
- [ ] All callback props wired to routing and API calls
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design in screenshots
- [ ] Responsive on mobile
- [ ] Dark mode support


---

# Milestone 11: Credit & Lending

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---


## Goal

Implement the Credit & Lending feature.

## Overview

Credit products built on ROSCA participation history. Members can request payout advances, view their CircleUp credit score (0-1000), apply for personal loans backed by circle participation, and opt-in to credit bureau reporting.

**Key Functionality:**
- View credit score with factor breakdown
- Request payout advance with eligibility check
- Apply for personal loan
- Use credit score simulator
- Opt-in to credit bureau reporting
- View loan portfolio (admin)

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/credit-and-lending/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/credit-and-lending/components/`:

CreditScoreDashboard, PayoutAdvances, LoanCenter, LoanApplications, CollectiveLending, CreditBuilding, PortfolioDashboard

### Data Layer

The components expect data shapes defined in `product-plan/sections/credit-and-lending/types.ts`. You'll need to:
- Create API endpoints for CRUD operations
- Implement data fetching and state management
- Connect real data to the component props

### Callbacks

Wire up all callback props defined in the component interfaces. Each `on*` prop should be connected to your routing, API calls, or state management. Review `types.ts` for the complete list of callback props and their signatures.

### Empty States

Implement empty state UI for when no records exist yet:
- **No data yet:** Show a helpful message and call-to-action when the primary list/collection is empty
- **No related records:** Handle cases where associated records don't exist
- **First-time user experience:** Guide users to create their first item with clear CTAs
- **Filtered results empty:** Show "No results found" with filter reset option

## Files to Reference

- `product-plan/sections/credit-and-lending/README.md` — Feature overview and design intent
- `product-plan/sections/credit-and-lending/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/credit-and-lending/components/` — React components
- `product-plan/sections/credit-and-lending/types.ts` — TypeScript interfaces
- `product-plan/sections/credit-and-lending/sample-data.json` — Test data
- `product-plan/sections/credit-and-lending/*.png` — Visual references

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data from backend
- [ ] Empty states display properly when no records exist
- [ ] All callback props wired to routing and API calls
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design in screenshots
- [ ] Responsive on mobile
- [ ] Dark mode support


---

# Milestone 12: AI Insights

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---


## Goal

Implement the AI Insights feature.

## Overview

AI-powered intelligence hub providing personalized circle recommendations, predictive analytics, fraud detection, and proactive assistance. Members receive financial health guidance via AI chat. Organizers access default risk predictions and optimization suggestions.

**Key Functionality:**
- View personalized AI insight cards
- Chat with AI financial health assistant
- Monitor member default risk (organizer)
- Review fraud detection alerts (admin)
- Explore trust network visualization

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/ai-insights/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/ai-insights/components/`:

AiInsightsDashboard, OrganizerInsights, FraudAnalytics, FinancialHealthChatComponent, TrustNetwork

### Data Layer

The components expect data shapes defined in `product-plan/sections/ai-insights/types.ts`. You'll need to:
- Create API endpoints for CRUD operations
- Implement data fetching and state management
- Connect real data to the component props

### Callbacks

Wire up all callback props defined in the component interfaces. Each `on*` prop should be connected to your routing, API calls, or state management. Review `types.ts` for the complete list of callback props and their signatures.

### Empty States

Implement empty state UI for when no records exist yet:
- **No data yet:** Show a helpful message and call-to-action when the primary list/collection is empty
- **No related records:** Handle cases where associated records don't exist
- **First-time user experience:** Guide users to create their first item with clear CTAs
- **Filtered results empty:** Show "No results found" with filter reset option

## Files to Reference

- `product-plan/sections/ai-insights/README.md` — Feature overview and design intent
- `product-plan/sections/ai-insights/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/ai-insights/components/` — React components
- `product-plan/sections/ai-insights/types.ts` — TypeScript interfaces
- `product-plan/sections/ai-insights/sample-data.json` — Test data
- `product-plan/sections/ai-insights/*.png` — Visual references

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data from backend
- [ ] Empty states display properly when no records exist
- [ ] All callback props wired to routing and API calls
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design in screenshots
- [ ] Responsive on mobile
- [ ] Dark mode support


---

# Milestone 13: Community & Social

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---


## Goal

Implement the Community & Social feature.

## Overview

Community engagement features that strengthen trust, encourage savings behavior, and drive organic platform growth. Referral rewards, achievement badges, savings leaderboards, challenges, and success stories.

**Key Functionality:**
- Generate and share referral links
- View achievement badges and progress
- Browse savings leaderboards
- Enroll in savings challenges
- Read and submit success stories

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/community-and-social/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/community-and-social/components/`:

CommunitySocialDashboard, ReferralDashboard, BadgeGallery, Leaderboard, SavingsChallenges, SuccessStories

### Data Layer

The components expect data shapes defined in `product-plan/sections/community-and-social/types.ts`. You'll need to:
- Create API endpoints for CRUD operations
- Implement data fetching and state management
- Connect real data to the component props

### Callbacks

Wire up all callback props defined in the component interfaces. Each `on*` prop should be connected to your routing, API calls, or state management. Review `types.ts` for the complete list of callback props and their signatures.

### Empty States

Implement empty state UI for when no records exist yet:
- **No data yet:** Show a helpful message and call-to-action when the primary list/collection is empty
- **No related records:** Handle cases where associated records don't exist
- **First-time user experience:** Guide users to create their first item with clear CTAs
- **Filtered results empty:** Show "No results found" with filter reset option

## Files to Reference

- `product-plan/sections/community-and-social/README.md` — Feature overview and design intent
- `product-plan/sections/community-and-social/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/community-and-social/components/` — React components
- `product-plan/sections/community-and-social/types.ts` — TypeScript interfaces
- `product-plan/sections/community-and-social/sample-data.json` — Test data
- `product-plan/sections/community-and-social/*.png` — Visual references

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data from backend
- [ ] Empty states display properly when no records exist
- [ ] All callback props wired to routing and API calls
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design in screenshots
- [ ] Responsive on mobile
- [ ] Dark mode support


---

# Milestone 14: Multi-Share

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---


## Goal

Implement the Multi-Share feature.

## Overview

Enhanced ROSCA functionality allowing members to hold multiple shares (1-10) of the base contribution, receiving proportionally larger payouts. Includes share request workflows, Trust Score-based eligibility, and compliance monitoring.

**Key Functionality:**
- Request additional shares in a circle
- View circle share distribution
- Make multi-share contribution
- Approve/reject share requests (organizer)
- Monitor platform-wide metrics (admin)

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/multi-share/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/multi-share/components/`:

MultiShare, MultiShareProps, CircleDashboard, ShareRequestModal, ShareHistoryTimeline, ContributionPayment, PersonalShareSummary, PlatformAdminDashboard

### Data Layer

The components expect data shapes defined in `product-plan/sections/multi-share/types.ts`. You'll need to:
- Create API endpoints for CRUD operations
- Implement data fetching and state management
- Connect real data to the component props

### Callbacks

Wire up all callback props defined in the component interfaces. Each `on*` prop should be connected to your routing, API calls, or state management. Review `types.ts` for the complete list of callback props and their signatures.

### Empty States

Implement empty state UI for when no records exist yet:
- **No data yet:** Show a helpful message and call-to-action when the primary list/collection is empty
- **No related records:** Handle cases where associated records don't exist
- **First-time user experience:** Guide users to create their first item with clear CTAs
- **Filtered results empty:** Show "No results found" with filter reset option

## Files to Reference

- `product-plan/sections/multi-share/README.md` — Feature overview and design intent
- `product-plan/sections/multi-share/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/multi-share/components/` — React components
- `product-plan/sections/multi-share/types.ts` — TypeScript interfaces
- `product-plan/sections/multi-share/sample-data.json` — Test data
- `product-plan/sections/multi-share/*.png` — Visual references

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data from backend
- [ ] Empty states display properly when no records exist
- [ ] All callback props wired to routing and API calls
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design in screenshots
- [ ] Responsive on mobile
- [ ] Dark mode support


---

# Milestone 15: Projects & Fundraising

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---


## Goal

Implement the Projects & Fundraising feature.

## Overview

Community fundraising campaigns with donation collection, progress tracking, donor management, impact reporting, and matching campaign support.

**Key Functionality:**
- Browse active and past campaigns
- Make donation with various amounts
- Create fundraising campaign
- Manage donors with CRM
- View campaign analytics

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/projects-and-fundraising/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/projects-and-fundraising/components/`:

CampaignCard, CampaignList, CampaignDetail, DonationFlow, CampaignCreator, CampaignDashboard, DonorManagement

### Data Layer

The components expect data shapes defined in `product-plan/sections/projects-and-fundraising/types.ts`. You'll need to:
- Create API endpoints for CRUD operations
- Implement data fetching and state management
- Connect real data to the component props

### Callbacks

Wire up all callback props defined in the component interfaces. Each `on*` prop should be connected to your routing, API calls, or state management. Review `types.ts` for the complete list of callback props and their signatures.

### Empty States

Implement empty state UI for when no records exist yet:
- **No data yet:** Show a helpful message and call-to-action when the primary list/collection is empty
- **No related records:** Handle cases where associated records don't exist
- **First-time user experience:** Guide users to create their first item with clear CTAs
- **Filtered results empty:** Show "No results found" with filter reset option

## Files to Reference

- `product-plan/sections/projects-and-fundraising/README.md` — Feature overview and design intent
- `product-plan/sections/projects-and-fundraising/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/projects-and-fundraising/components/` — React components
- `product-plan/sections/projects-and-fundraising/types.ts` — TypeScript interfaces
- `product-plan/sections/projects-and-fundraising/sample-data.json` — Test data
- `product-plan/sections/projects-and-fundraising/*.png` — Visual references

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data from backend
- [ ] Empty states display properly when no records exist
- [ ] All callback props wired to routing and API calls
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design in screenshots
- [ ] Responsive on mobile
- [ ] Dark mode support


---

# Milestone 16: Platform Administration

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---


## Goal

Implement the Platform Administration feature.

## Overview

Administrative tools for platform operators including user account management, compliance monitoring (AML/KYC), regulatory reporting (FINMA), customer support, dispute resolution, system health monitoring, feature flags, and RBAC management.

**Key Functionality:**
- Monitor system health and alerts
- Manage user accounts
- Review compliance alerts and file SARs
- Handle support tickets and disputes
- Configure RBAC permissions
- Manage feature flags

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/platform-administration/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/platform-administration/components/`:

AdminDashboard, UserManagement, ComplianceDashboard, TransactionMonitor, SupportInbox, DisputeCenter, SystemHealth, ConfigurationPanel, FeatureFlags, RBACDashboard, PermissionMatrix, RoleManager, UserPermissions, RBACAuditTrail, AccessRequests, PermissionSimulator

### Data Layer

The components expect data shapes defined in `product-plan/sections/platform-administration/types.ts`. You'll need to:
- Create API endpoints for CRUD operations
- Implement data fetching and state management
- Connect real data to the component props

### Callbacks

Wire up all callback props defined in the component interfaces. Each `on*` prop should be connected to your routing, API calls, or state management. Review `types.ts` for the complete list of callback props and their signatures.

### Empty States

Implement empty state UI for when no records exist yet:
- **No data yet:** Show a helpful message and call-to-action when the primary list/collection is empty
- **No related records:** Handle cases where associated records don't exist
- **First-time user experience:** Guide users to create their first item with clear CTAs
- **Filtered results empty:** Show "No results found" with filter reset option

## Files to Reference

- `product-plan/sections/platform-administration/README.md` — Feature overview and design intent
- `product-plan/sections/platform-administration/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/platform-administration/components/` — React components
- `product-plan/sections/platform-administration/types.ts` — TypeScript interfaces
- `product-plan/sections/platform-administration/sample-data.json` — Test data
- `product-plan/sections/platform-administration/*.png` — Visual references

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data from backend
- [ ] Empty states display properly when no records exist
- [ ] All callback props wired to routing and API calls
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design in screenshots
- [ ] Responsive on mobile
- [ ] Dark mode support


---

# Milestone 17: Login

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---


## Goal

Implement the Login feature.

## Overview

Authentication entry points: registration (email/password and social via Google/Apple), login with session management, password recovery, email verification, and guided profile onboarding wizard with Trust Score progression.

**Key Functionality:**
- Register with email/password or social
- Login with credentials
- Reset forgotten password
- Complete email verification
- Complete profile onboarding wizard

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/login/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/login/components/`:

AuthFlow, AuthLayout, LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm, VerificationPending, OnboardingWizard, SocialButtons, PasswordInput

### Data Layer

The components expect data shapes defined in `product-plan/sections/login/types.ts`. You'll need to:
- Create API endpoints for CRUD operations
- Implement data fetching and state management
- Connect real data to the component props

### Callbacks

Wire up all callback props defined in the component interfaces. Each `on*` prop should be connected to your routing, API calls, or state management. Review `types.ts` for the complete list of callback props and their signatures.

### Empty States

Implement empty state UI for when no records exist yet:
- **No data yet:** Show a helpful message and call-to-action when the primary list/collection is empty
- **No related records:** Handle cases where associated records don't exist
- **First-time user experience:** Guide users to create their first item with clear CTAs
- **Filtered results empty:** Show "No results found" with filter reset option

## Files to Reference

- `product-plan/sections/login/README.md` — Feature overview and design intent
- `product-plan/sections/login/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/login/components/` — React components
- `product-plan/sections/login/types.ts` — TypeScript interfaces
- `product-plan/sections/login/sample-data.json` — Test data
- `product-plan/sections/login/*.png` — Visual references

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data from backend
- [ ] Empty states display properly when no records exist
- [ ] All callback props wired to routing and API calls
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design in screenshots
- [ ] Responsive on mobile
- [ ] Dark mode support


---

# Milestone 18: Federations

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---


## Goal

Implement the Federations feature.

## Overview

Federation setup and governance for umbrella organizations coordinating multiple child associations. Shared policy cascading, cross-association oversight, consolidated financial management, federation-wide elections, and inter-association coordination.

**Key Functionality:**
- Create federation and configure governance
- Link child associations
- Define and cascade policies
- View consolidated financial dashboard
- Run federation-wide elections
- Manage cross-association member directory

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/federations/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/federations/components/`:

StatsRow, AlertPanel, AssociationCards, LeadershipDirectory, PolicyManager, FinancialDashboard, MemberDirectory, ElectionManager, EventsAnnouncements, ReportsCenter, FederationList, FederationOverview, FederationDashboard

### Data Layer

The components expect data shapes defined in `product-plan/sections/federations/types.ts`. You'll need to:
- Create API endpoints for CRUD operations
- Implement data fetching and state management
- Connect real data to the component props

### Callbacks

Wire up all callback props defined in the component interfaces. Each `on*` prop should be connected to your routing, API calls, or state management. Review `types.ts` for the complete list of callback props and their signatures.

### Empty States

Implement empty state UI for when no records exist yet:
- **No data yet:** Show a helpful message and call-to-action when the primary list/collection is empty
- **No related records:** Handle cases where associated records don't exist
- **First-time user experience:** Guide users to create their first item with clear CTAs
- **Filtered results empty:** Show "No results found" with filter reset option

## Files to Reference

- `product-plan/sections/federations/README.md` — Feature overview and design intent
- `product-plan/sections/federations/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/federations/components/` — React components
- `product-plan/sections/federations/types.ts` — TypeScript interfaces
- `product-plan/sections/federations/sample-data.json` — Test data
- `product-plan/sections/federations/*.png` — Visual references

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data from backend
- [ ] Empty states display properly when no records exist
- [ ] All callback props wired to routing and API calls
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design in screenshots
- [ ] Responsive on mobile
- [ ] Dark mode support


---


