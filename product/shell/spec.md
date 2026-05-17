# Application Shell Specification

## Overview

CircleUp uses a collapsible sidebar navigation pattern optimized for its 16 functional areas. The sidebar organizes navigation into logical groups with collapsible headers, supports icon-only collapse for more content space, and places the user menu at the bottom for easy access. Navigation items are conditionally shown based on the user's RBAC permissions — items with `none` access mode are hidden entirely, and items with `read` access show a subtle eye icon indicator.

## Navigation Structure

### Home
- **Homepage** → `/` — Dashboard overview and quick actions

### Core
- **Associations** → `/associations` — Create and manage associations
- **Members & Trust** → `/members` — Member directory and Trust Scores
- **ROSCA Circles** → `/circles` — Savings circles and contributions

### Finance
- **Treasury & Funds** → `/treasury` — Multi-fund accounting
- **Credit & Lending** → `/credit` — Advances and loans
- **Multi-Share** → `/multi-share` — Multiple contribution shares and enhanced payouts

### Governance
- **Governance & Voting** → `/governance` — Elections and proposals
- **Documents** → `/documents` — Document storage and sharing
- **Projects & Fundraising** → `/projects` — Community fundraising campaigns

### Engagement
- **Communication & Events** → `/communication` — Messaging and events
- **Community & Social** → `/community` — Referrals and achievements

### Intelligence
- **Analytics & Reporting** → `/analytics` — Dashboards and reports
- **AI Insights** → `/insights` — Predictions and recommendations

### Organization
- **Federations** → `/federations` — Multi-association federation management

### Administration
- **Platform Admin** → `/admin` — User management, compliance, RBAC, and system health

## RBAC-Aware Navigation

The sidebar adapts dynamically based on the current user's effective permissions (Access Role ceiling × Contextual Role grants):

- **Hidden (none):** Navigation items where the user has `none` effective access are not rendered. Empty groups are also hidden.
- **Read-Only (read):** Items where the user has only `read` access show a subtle eye icon and muted styling.
- **Full Access (write/read_write):** Items with write access display normally with badges and full interactivity.
- **Collapsible Groups:** Navigation groups have clickable headers that can be collapsed/expanded. Chevron icon indicates state.
- **Permission Tooltip:** Hovering a nav item in collapsed mode shows the feature name and read-only status if applicable.

### Permission Profiles by Role

**Platform Admin (admin access role):**
- All 16 features visible with full read_write access
- Admin panel and Federations visible

**Treasurer (standard_user + treasurer contextual role):**
- 14 features visible (Federations and Platform Admin hidden)
- Governance and AI Insights shown as read-only
- Full access to all finance features

**Member (standard_user + member contextual role):**
- 13 features visible (Federations, Platform Admin, AI Insights hidden)
- Associations, Members, Treasury, Multi-Share, Documents, Projects, Analytics shown as read-only
- Full access to Circles, Credit, Governance, Communication, Community

**Invitee (invitee access role):**
- 6 features visible (most features hidden)
- All visible items shown as read-only except Homepage
- Only Homepage, Associations, Circles, Projects, Communication, Community visible

## User Menu

**Location:** Bottom of sidebar, above collapse toggle

**User Button:**
- Avatar with fallback initials (colored ring for admin users — indigo ring)
- Online status indicator (green dot)
- User name (primary text)
- Contextual role label + access role badge on second line (e.g., "Treasurer | STANDARD")

**Dropdown Contents:**
- User info header with email, role badges (access role with shield icon, contextual role)
- Active Roles section showing up to 3 contextual roles with scope names
- My Permissions — view effective permissions
- Settings
- Help
- Log out (red, separated by divider)

**Dropdown Positioning:**
- Expanded sidebar: appears above the user button, same width
- Collapsed sidebar: appears to the right of the sidebar, fixed width

## Layout Pattern

**Sidebar Navigation** with collapsible behavior:
- Default width: 252px (expanded), 60px (collapsed)
- Collapse toggle button at bottom of sidebar (PanelLeftClose / PanelLeft icons)
- Navigation groups with collapsible headers and chevron indicators
- Active state: indigo-50 background with indigo-700 text and subtle shadow
- Hover state: slate-100 background
- Read-only state: muted text (slate-500) with eye icon

## Responsive Behavior

- **Desktop (1024px+):** Full sidebar with labels, user can toggle collapse
- **Tablet (768px–1023px):** Collapsed to icons by default, expandable on hover
- **Mobile (<768px):** Off-canvas drawer with hamburger toggle in fixed header. Header shows logo + user avatar. Overlay backdrop on open.

## Design Notes

- Uses indigo (primary) for active states, admin accents, and key UI elements
- Uses amber (secondary) for notification badges and warnings
- Uses slate (neutral) for backgrounds, borders, and text
- Inter font throughout for consistency
- Icons from lucide-react library (18px, strokeWidth 1.5 default, 2 for active)
- Smooth transitions (200ms) for collapse/expand and hover states
- Dark mode support with `dark:` variants throughout
- Online indicator (emerald-500 dot) on user avatar
- Admin users get indigo ring on avatar for visual distinction

## Shell Preview

The shell preview includes an interactive **role switcher** that demonstrates how navigation adapts for 4 user profiles:
1. **Platform Admin** — Full access to all 16 features
2. **Treasurer** — Finance focus, 2 read-only items, 2 hidden
3. **Member** — Basic access, 7 read-only items, 3 hidden
4. **Invitee** — Minimal access, all read-only, 10 hidden

Permission summary bar shows counts: full access (green), read-only (amber), hidden (gray).
