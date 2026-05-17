# Platform Administration

## Overview

Admin tools for user management, compliance (AML/KYC), regulatory reporting (FINMA), support, disputes, system health, and RBAC.

## User Flows

1. View admin dashboard
2. Manage user accounts
3. Review compliance alerts
4. Handle support tickets
5. Configure RBAC permissions
6. Manage feature flags

## Visual Reference

See the `.png` screenshot files in this directory for the target UI design.

## Components Provided

- `AdminDashboard`
- `UserManagement`
- `ComplianceDashboard`
- `TransactionMonitor`
- `SupportInbox`
- `DisputeCenter`
- `SystemHealth`
- `ConfigurationPanel`
- `FeatureFlags`
- `RBACDashboard`
- `PermissionMatrix`
- `RoleManager`
- `UserPermissions`
- `RBACAuditTrail`
- `AccessRequests`
- `PermissionSimulator`

## Data Used

See `types.ts` for complete TypeScript interface definitions.
See `sample-data.json` for example data.

## Integration Notes

- All components are props-based — they accept data and callbacks via props
- No internal state management or API calls — you provide everything
- Components support dark mode via Tailwind `dark:` variants
- Responsive design with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
