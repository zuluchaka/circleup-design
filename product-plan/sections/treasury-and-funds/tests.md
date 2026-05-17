# Test Instructions: Treasury & Funds

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, RSpec, Minitest, PHPUnit, etc.).

## Overview

Financial management with real-time fund monitoring, segregated accounting, reconciliation, emergency fund, investments, and audit trails.

---

## User Flow Tests

### Flow 1: View treasury dashboard

**Scenario:** User wants to view treasury dashboard

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

### Flow 2: Drill into circle fund detail

**Scenario:** User wants to drill into circle fund detail

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

### Flow 3: Review reconciliation

**Scenario:** User wants to review reconciliation

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

### Flow 4: Manage emergency fund requests

**Scenario:** User wants to manage emergency fund requests

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

### Flow 5: Generate audit report

**Scenario:** User wants to generate audit report

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

**Scenario:** No funds yet — appears after circles are created

**Setup:**
- Primary data collection is empty (`[]`)

**Expected Results:**
- [ ] Empty state message is visible with helpful description
- [ ] Primary CTA is visible and functional
- [ ] No blank screens or broken layouts

### Related Records Empty State

**Scenario:** Fund with no transactions, no reconciliation items

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

- `TreasuryDashboard`
- `CircleFundDetail`
- `TransactionLedger`
- `ReconciliationConsole`
- `EmergencyFundPanel`
- `InvestmentManager`
- `MultiCurrencySettings`
- `AuditReportGenerator`

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
