# Associations

## Overview

Create and manage community organizations with customizable branding, cultural terminology, multi-language support, and a 5-phase import/migration wizard.

## User Flows

1. View my associations list
2. Create new association
3. Discover and join associations
4. Manage association settings and members
5. Import existing association via migration wizard

## Visual Reference

See the `.png` screenshot files in this directory for the target UI design.

## Components Provided

- `MyAssociationsList`
- `MyAssociationsListProps`
- `AssociationDashboard`
- `AssociationDashboardProps`
- `DiscoverAssociations`
- `DiscoverAssociationsProps`
- `MemberDirectory`
- `MemberDirectoryProps`
- `AssociationSettings`
- `AssociationSettingsProps`
- `AssociationAdministration`
- `AssociationAdministrationProps`
- `InviteMembers`
- `InviteMembersProps`
- `CreateAssociation`
- `CreateAssociationProps`
- `FederationDashboard`
- `FederationDashboardProps`
- `ChapterDirectory`
- `ChapterDirectoryProps`
- `PolicyManager`
- `PolicyManagerProps`
- `AssociationAnalytics`
- `AssociationAnalyticsProps`
- `FederationAnalytics`
- `FederationAnalyticsProps`
- `MigrationDashboard`
- `MigrationWizard`
- `MigrationWizardProps`
- `AssociationCard`
- `RoleBadge`
- `AssociationTypeBadge`
- `ActivityFeed`
- `AnnouncementCard`

## Data Used

See `types.ts` for complete TypeScript interface definitions.
See `sample-data.json` for example data.

## Integration Notes

- All components are props-based — they accept data and callbacks via props
- No internal state management or API calls — you provide everything
- Components support dark mode via Tailwind `dark:` variants
- Responsive design with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
