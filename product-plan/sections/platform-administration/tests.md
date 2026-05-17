# Test Instructions: Platform Administration

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, RSpec, Minitest, PHPUnit, etc.).

## Overview

Admin tools for user management, compliance (AML/KYC), regulatory reporting (FINMA), support, disputes, system health, and RBAC.

---

## User Flow Tests

### Flow 1: View admin dashboard

**Scenario:** User wants to view admin dashboard

#### Success Path

**Setup:**
- User is authenticated and has appropriate permissions
- Required data exists (see `sample-data.json`)

**Steps:**
1. User navigates to the section
2. User interacts with the relevant UI elements
3. User completes the action

**Expected Results:**
- [ ] Action completes successfully
- [ ] UI updates to reflect the change
- [ ] Success feedback is shown to the user
- [ ] Data is persisted correctly

#### Failure Path: Server Error

**Setup:**
- Server returns 500 error

**Expected Results:**
- [ ] Error message is displayed
- [ ] User data is preserved
- [ ] User can retry the action

#### Failure Path: Validation Error

**Setup:**
- User submits invalid or incomplete data

**Expected Results:**
- [ ] Validation messages appear on invalid fields
- [ ] Form is not submitted
- [ ] Focus moves to first invalid field

---

### Flow 2: Manage user accounts

**Scenario:** User wants to manage user accounts

#### Success Path

**Setup:**
- User is authenticated and has appropriate permissions
- Required data exists (see `sample-data.json`)

**Steps:**
1. User navigates to the section
2. User interacts with the relevant UI elements
3. User completes the action

**Expected Results:**
- [ ] Action completes successfully
- [ ] UI updates to reflect the change
- [ ] Success feedback is shown to the user
- [ ] Data is persisted correctly

#### Failure Path: Server Error

**Setup:**
- Server returns 500 error

**Expected Results:**
- [ ] Error message is displayed
- [ ] User data is preserved
- [ ] User can retry the action

#### Failure Path: Validation Error

**Setup:**
- User submits invalid or incomplete data

**Expected Results:**
- [ ] Validation messages appear on invalid fields
- [ ] Form is not submitted
- [ ] Focus moves to first invalid field

---

### Flow 3: Review compliance alerts

**Scenario:** User wants to review compliance alerts

#### Success Path

**Setup:**
- User is authenticated and has appropriate permissions
- Required data exists (see `sample-data.json`)

**Steps:**
1. User navigates to the section
2. User interacts with the relevant UI elements
3. User completes the action

**Expected Results:**
- [ ] Action completes successfully
- [ ] UI updates to reflect the change
- [ ] Success feedback is shown to the user
- [ ] Data is persisted correctly

#### Failure Path: Server Error

**Setup:**
- Server returns 500 error

**Expected Results:**
- [ ] Error message is displayed
- [ ] User data is preserved
- [ ] User can retry the action

#### Failure Path: Validation Error

**Setup:**
- User submits invalid or incomplete data

**Expected Results:**
- [ ] Validation messages appear on invalid fields
- [ ] Form is not submitted
- [ ] Focus moves to first invalid field

---

### Flow 4: Handle support tickets

**Scenario:** User wants to handle support tickets

#### Success Path

**Setup:**
- User is authenticated and has appropriate permissions
- Required data exists (see `sample-data.json`)

**Steps:**
1. User navigates to the section
2. User interacts with the relevant UI elements
3. User completes the action

**Expected Results:**
- [ ] Action completes successfully
- [ ] UI updates to reflect the change
- [ ] Success feedback is shown to the user
- [ ] Data is persisted correctly

#### Failure Path: Server Error

**Setup:**
- Server returns 500 error

**Expected Results:**
- [ ] Error message is displayed
- [ ] User data is preserved
- [ ] User can retry the action

#### Failure Path: Validation Error

**Setup:**
- User submits invalid or incomplete data

**Expected Results:**
- [ ] Validation messages appear on invalid fields
- [ ] Form is not submitted
- [ ] Focus moves to first invalid field

---

### Flow 5: Configure RBAC permissions

**Scenario:** User wants to configure rbac permissions

#### Success Path

**Setup:**
- User is authenticated and has appropriate permissions
- Required data exists (see `sample-data.json`)

**Steps:**
1. User navigates to the section
2. User interacts with the relevant UI elements
3. User completes the action

**Expected Results:**
- [ ] Action completes successfully
- [ ] UI updates to reflect the change
- [ ] Success feedback is shown to the user
- [ ] Data is persisted correctly

#### Failure Path: Server Error

**Setup:**
- Server returns 500 error

**Expected Results:**
- [ ] Error message is displayed
- [ ] User data is preserved
- [ ] User can retry the action

#### Failure Path: Validation Error

**Setup:**
- User submits invalid or incomplete data

**Expected Results:**
- [ ] Validation messages appear on invalid fields
- [ ] Form is not submitted
- [ ] Focus moves to first invalid field

---

### Flow 6: Manage feature flags

**Scenario:** User wants to manage feature flags

#### Success Path

**Setup:**
- User is authenticated and has appropriate permissions
- Required data exists (see `sample-data.json`)

**Steps:**
1. User navigates to the section
2. User interacts with the relevant UI elements
3. User completes the action

**Expected Results:**
- [ ] Action completes successfully
- [ ] UI updates to reflect the change
- [ ] Success feedback is shown to the user
- [ ] Data is persisted correctly

#### Failure Path: Server Error

**Setup:**
- Server returns 500 error

**Expected Results:**
- [ ] Error message is displayed
- [ ] User data is preserved
- [ ] User can retry the action

#### Failure Path: Validation Error

**Setup:**
- User submits invalid or incomplete data

**Expected Results:**
- [ ] Validation messages appear on invalid fields
- [ ] Form is not submitted
- [ ] Focus moves to first invalid field

---


## Empty State Tests

### Primary Empty State

**Scenario:** No alerts — show healthy system status

**Setup:**
- Primary data collection is empty (`[]`)

**Expected Results:**
- [ ] Empty state message is visible with helpful description
- [ ] Primary CTA is visible and functional
- [ ] No blank screens or broken layouts

### Related Records Empty State

**Scenario:** No pending tickets, no access requests

**Setup:**
- Parent record exists but child collection is empty

**Expected Results:**
- [ ] Parent renders correctly
- [ ] Child section shows appropriate empty state
- [ ] CTA to add child record is visible

### Filtered/Search Empty State

**Scenario:** User applies filters that return no results

**Expected Results:**
- [ ] Shows "No results found" message
- [ ] Shows guidance to adjust filters
- [ ] Shows "Clear filters" option

---

## Component Interaction Tests

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

For each component:
- [ ] Renders correctly with sample data
- [ ] All callback props fire with correct arguments when triggered
- [ ] Handles loading states appropriately
- [ ] Handles error states appropriately
- [ ] Responsive layout works on mobile

---

## Edge Cases

- [ ] Handles very long text content with proper truncation
- [ ] Works correctly with 1 item and 100+ items
- [ ] Preserves state when navigating away and back
- [ ] Transition from empty to populated state works smoothly
- [ ] Transition from populated to empty state shows empty state correctly
- [ ] Handles concurrent updates gracefully
- [ ] Works with slow network connections (loading states appear)

---

## Accessibility Checks

- [ ] All interactive elements are keyboard accessible
- [ ] Form fields have associated labels
- [ ] Error messages are announced to screen readers
- [ ] Focus is managed appropriately after actions (modals, navigation)
- [ ] Color contrast meets WCAG AA standards
- [ ] Images have appropriate alt text

---

## Sample Test Data

Use the data from `sample-data.json` or create variations:

```typescript
// Populated state — use sample-data.json
import sampleData from './sample-data.json';

// Empty states
const emptyList = [];

// Error states
const mockErrorResponse = {
  status: 500,
  message: "Internal server error"
};
```

---

## Notes for Test Implementation

- Mock API calls to test both success and failure scenarios
- Test each callback prop is called with correct arguments
- Verify UI updates optimistically where appropriate
- Test that loading states appear during async operations
- **Always test empty states** — pass empty arrays to verify helpful empty state UI
- Test transitions: empty -> first item created, last item deleted -> empty state returns
