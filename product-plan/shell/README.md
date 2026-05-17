# CircleUp — Application Shell

## Overview

CircleUp uses a collapsible sidebar navigation pattern optimized for its 16 functional areas. The sidebar organizes navigation into logical groups with collapsible headers, supports icon-only collapse for more content space, and places the user menu at the bottom.

## Navigation Structure

| Group | Items | Route |
|-------|-------|-------|
| **Home** | Homepage | `/` |
| **Core** | Associations | `/associations` |
| | Members & Trust | `/members` |
| | ROSCA Circles | `/circles` |
| **Finance** | Treasury & Funds | `/treasury` |
| | Credit & Lending | `/credit` |
| | Multi-Share | `/multi-share` |
| **Governance** | Governance & Voting | `/governance` |
| | Documents | `/documents` |
| | Projects & Fundraising | `/projects` |
| **Engagement** | Communication & Events | `/communication` |
| | Community & Social | `/community` |
| **Intelligence** | Analytics & Reporting | `/analytics` |
| | AI Insights | `/insights` |
| **Organization** | Federations | `/federations` |
| **Administration** | Platform Admin | `/admin` |

## RBAC-Aware Navigation

The sidebar adapts based on the user's effective permissions:
- **Hidden (none):** Items with no access are not rendered
- **Read-Only (read):** Items with read access show eye icon and muted styling
- **Full Access (write/read_write):** Normal display with badges

## Components Provided

- `AppShell.tsx` — Main layout wrapper with sidebar and content area
- `MainNav.tsx` — Navigation component with collapsible groups, RBAC support
- `UserMenu.tsx` — User menu with avatar, role badges, dropdown

## Layout

- Sidebar width: 252px (expanded), 60px (collapsed)
- Collapse toggle at bottom of sidebar
- Active state: indigo-50 background with indigo-700 text

## Responsive Behavior

- **Desktop (1024px+):** Full sidebar with labels, user can toggle collapse
- **Tablet (768px–1023px):** Collapsed to icons by default
- **Mobile (<768px):** Off-canvas drawer with hamburger toggle

## Design Tokens Used

- Primary: `indigo` — active states, admin accents
- Secondary: `amber` — notification badges, warnings
- Neutral: `slate` — backgrounds, borders, text
- Font: Inter
- Icons: lucide-react (18px, strokeWidth 1.5)

## Callback Props

| Callback | Description |
|----------|-------------|
| `onNavigate` | Called when user clicks a nav item with the route path |
| `onToggleCollapse` | Called when sidebar collapse toggle is clicked |
| `onLogout` | Called when user clicks logout in user menu |
| `onViewProfile` | Called when user clicks their profile |
| `onViewSettings` | Called when user clicks settings |
