# Milestone 1: Foundation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

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
- **DO** implement empty states when no records exist
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

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
