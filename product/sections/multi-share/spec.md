# CircleUp Platform
## AI-Powered Association Management Platform
# Multiple Contribution Shares Feature
## Complete Epics & User Stories Documentation

| Document Version | 1.1 |
|------------------|-----|
| Date | January 2026 |
| Author | Senior AI Product Manager |
| Classification | Product Development |
| Stakeholders | Circle Organizer, Verified Member, Platform Administrator |

---

## 1. Executive Summary

This document provides comprehensive Epics and User Stories for the Multiple Contribution Shares feature of the CircleUp platform. This feature enables ROSCA Circle members to contribute multiples of the base contribution amount based on their financial capacity, receiving proportionally larger payouts in return.

### 1.1 Feature Overview

Traditional ROSCA circles typically require all members to contribute the same fixed amount. However, in practice, some members have greater financial capacity and desire to save more within the same trusted circle. The Multiple Contribution Shares feature allows members to request and hold multiple "shares" of a circle, where each share represents one unit of the base contribution amount.

**Example:** In a circle with CHF 500 base contribution: a member holding 2 shares contributes CHF 1,000 per cycle and receives a payout of 2x the standard payout amount. This creates flexibility while maintaining the mathematical integrity of the ROSCA model.

### 1.2 Business Value

| Value Driver | Description |
|--------------|-------------|
| Increased AUM | Higher total contributions per circle increases platform Assets Under Management |
| Member Flexibility | Members can scale participation to match their financial goals without joining multiple circles |
| Organizer Efficiency | Organizers can accommodate varying member capacities within a single, manageable circle |
| Revenue Growth | Platform fees scale with contribution volume, directly increasing revenue per circle |
| Market Differentiation | Feature addresses real-world ROSCA flexibility not offered by competitors |

### 1.3 Document Scope

This document covers 7 Epics containing 51 User Stories across 4 stakeholder types: Verified Circle Organizer, Verified Circle Member, Platform Administrator, and System. Each user story includes detailed acceptance criteria in Given-When-Then format following INVEST principles.

---

## 2. Stakeholder Impact Analysis

| Stakeholder | Primary Interactions | Key Concerns | Epic Coverage |
|-------------|---------------------|--------------|---------------|
| Verified Organizer | Configure multi-share settings, approve requests, manage payouts | Circle balance, fairness, complexity management | E001, E004, E005 |
| Verified Member | Request shares, make contributions, receive payouts | Affordability, payout timing, transparency | E002, E003, E004, E007 |
| Platform Admin | Configure limits, monitor usage, handle disputes | System integrity, fraud prevention, support load | E006 |
| System | Calculate amounts, process payments, enforce rules | Accuracy, performance, audit trail | E003, E004, E005 |

---

## 3. Epic Summary

| Epic ID | Epic Name | Primary Stakeholder | Stories | Priority |
|---------|-----------|---------------------|---------|----------|
| MCS-E001 | Multi-Share Circle Configuration | Verified Organizer | 8 | P0 |
| MCS-E002 | Share Request & Allocation | Verified Member | 9 | P0 |
| MCS-E003 | Multi-Share Contribution Processing | Verified Member / System | 7 | P0 |
| MCS-E004 | Multi-Share Payout Processing | Verified Member / Organizer | 8 | P0 |
| MCS-E005 | Multi-Share Dashboard & Reporting | Organizer / Member | 8 | P1 |
| MCS-E006 | Platform Administration & Compliance | Platform Administrator | 8 | P1 |
| MCS-E007 | Multi-Share Education & Onboarding | Verified Member | 3 | P1 |

---

## 4. Epic 1: Multi-Share Circle Configuration

| Epic ID | MCS-E001 |
|---------|----------|
| Epic Name | Multi-Share Circle Configuration |
| Business Goal | Enable organizers to create and configure circles that support multiple contribution shares per member |
| Success Metric | 30% of new circles enable multi-share option; Average 1.5 shares per member in enabled circles |
| Primary Stakeholder | Verified Circle Organizer |

---

### US 1.1: Enable Multi-Share Option During Circle Creation

| Story ID | MCS-US001 | Priority | P0 - Critical | Story Points | 5 |
|----------|-----------|----------|---------------|--------------|---|

**User Story:** As a verified circle organizer, I want to enable multiple contribution shares when creating a new circle, so that members with greater financial capacity can contribute more and receive larger payouts.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I am on Step 2 (Parameters) of circle creation wizard | I view the configuration options | I see a toggle labeled "Allow Multiple Shares" with default OFF |
| AC2 | Multi-share toggle is OFF | I toggle it to ON | Additional configuration fields appear: Maximum Shares per Member (dropdown 2-10), Share Request Mode (Auto-Approve / Organizer Approval) |
| AC3 | Multi-share is enabled | I set maximum shares to 5 | System validates that total potential shares (max_shares x max_members) does not exceed platform limit of 100 shares |
| AC4 | Configuration exceeds limits | I try to proceed | Inline error displays: "Maximum total shares exceeded. Reduce member count or shares per member." |
| AC5 | Valid multi-share configuration set | I proceed to Review step | Summary shows multi-share settings with calculated ranges for total pool value and individual payout |
| AC6 | I hover over info icon next to multi-share toggle | Tooltip appears | Explanation displays: "Allow members to hold multiple shares. Each share requires one unit of the base contribution and provides one unit of payout." |

---

### US 1.2: Set Maximum Shares Per Member Limit

| Story ID | MCS-US002 | Priority | P0 - Critical | Story Points | 3 |
|----------|-----------|----------|---------------|--------------|---|

**User Story:** As a verified circle organizer, I want to set a maximum number of shares any single member can hold, so that no single member can dominate the circle and the rotation remains balanced.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | Multi-share is enabled for new circle | I view max shares field | Dropdown shows options 2 through 10, with default value of 3 |
| AC2 | Circle has 20 member slots configured | I try to set max shares to 6 | Warning displays: "High share limit may result in uneven circle balance. Consider reducing to 5 or fewer." |
| AC3 | I set max shares to 4 | I view the summary calculator | Calculator shows: Base contribution CHF X, Member range 1-4 shares, Contribution range CHF X to CHF 4X per cycle |
| AC4 | Circle is created with max 4 shares | A member tries to request 5 shares | Request is rejected with message: "Maximum shares per member is 4 for this circle" |
| AC5 | Circle already has member with 4 shares (max) | That member tries to request additional share | "Request Additional Share" button is disabled with tooltip: "You have reached the maximum shares allowed" |

---

### US 1.3: Configure Share Request Approval Mode

| Story ID | MCS-US003 | Priority | P0 - Critical | Story Points | 3 |
|----------|-----------|----------|---------------|--------------|---|

**User Story:** As a verified circle organizer, I want to choose whether share requests require my approval or are automatically granted, so that I can balance administrative overhead with control over circle composition.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | Multi-share is enabled | I view approval mode options | Two radio buttons display: "Auto-Approve" and "Require Organizer Approval" (default) |
| AC2 | I select Auto-Approve mode | A member requests additional shares | Shares are granted immediately if within limits; member notified; organizer receives info notification |
| AC3 | I select Organizer Approval mode | A member requests additional shares | Request enters Pending state; organizer notified; organizer dashboard shows pending request count |
| AC4 | Circle is in Forming status with Organizer Approval mode | I view circle settings | I can change approval mode; change takes effect for new requests only |
| AC5 | Circle is in Active status | I try to change approval mode | Setting is locked with message: "Approval mode cannot be changed after circle starts" |

---

### US 1.4: View Multi-Share Impact Calculator

| Story ID | MCS-US004 | Priority | P1 - High | Story Points | 5 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a verified circle organizer, I want to see a dynamic calculator showing how multi-share affects circle totals, so that I understand the financial implications before creating the circle.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | Multi-share enabled with CHF 500 base, 10 members, max 3 shares | I view the calculator panel | Shows: Minimum pool (all 1 share): CHF 5,000/cycle; Maximum pool (all 3 shares): CHF 15,000/cycle |
| AC2 | Calculator is visible | I adjust any parameter (base amount, members, max shares) | Calculator updates in real-time without page refresh |
| AC3 | Calculator shows ranges | I hover over "Typical scenario" link | Tooltip shows: "Based on platform data, average is 1.5 shares per member in multi-share circles" |
| AC4 | Emergency fund rate is 1% | Calculator displays | Emergency fund range shown: "CHF 50 - CHF 150 per cycle reserved for protection" |
| AC5 | I want to understand payout scenarios | I click "View Example Payouts" | Modal shows: Member with 1 share receives CHF 5,000-15,000; Member with 3 shares receives CHF 15,000-45,000 (depending on circle composition) |

---

### US 1.5: Edit Multi-Share Settings Before Circle Starts

| Story ID | MCS-US005 | Priority | P1 - High | Story Points | 3 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a verified circle organizer, I want to modify multi-share settings while the circle is still forming, so that I can adjust based on member feedback before commitments are finalized.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | Circle is in Forming status with multi-share enabled | I navigate to Circle Settings | Multi-share configuration section is editable |
| AC2 | Member already holds 4 shares; I try to reduce max to 3 | I attempt to save | Error: "Cannot reduce below existing allocations. [Member Name] currently holds 4 shares." |
| AC3 | I increase max shares from 3 to 5 | I save changes | All members notified: "Circle settings updated: Maximum shares increased to 5"; Existing allocations unchanged |
| AC4 | Circle has pending share requests | I disable multi-share entirely | Confirmation required: "Disabling will reject 3 pending requests and reduce all members to 1 share. Continue?"; All affected members notified if confirmed |
| AC5 | Circle is in Active status | I view multi-share settings | All fields are read-only with message: "Multi-share settings are locked after circle starts" |

---

### US 1.6: View Circle Terms with Multi-Share Details

| Story ID | MCS-US006 | Priority | P0 - Critical | Story Points | 3 |
|----------|-----------|----------|---------------|--------------|---|

**User Story:** As a potential circle member, I want to clearly understand multi-share terms before joining, so that I know my options and obligations regarding share quantities.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I receive invitation to multi-share enabled circle | I view the invitation | Circle details prominently show: "Multiple Shares Allowed (up to X per member)" |
| AC2 | I view circle terms | I expand multi-share section | Clear explanation shows: contribution per share, payout calculation, request process, and maximum shares |
| AC3 | I click "Join Circle" | Join flow begins | Step asks: "How many shares would you like?" with slider (1 to max) and amount calculator showing contribution commitment |
| AC4 | I select 2 shares with CHF 500 base | I view commitment summary | Shows: "Your commitment: CHF 1,000 per cycle for 10 cycles. Your payout: CHF 10,000 when your turn arrives." |
| AC5 | Circle does not allow multiple shares | I view invitation | No multi-share information displayed; join flow does not ask about share quantity |

---

### US 1.7: Configure Share Lock Period

| Story ID | MCS-US033 | Priority | P1 - High | Story Points | 3 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a verified circle organizer, I want to set a lock period during which share changes are not allowed, so that the circle maintains stability during critical phases like the first and last cycles.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | Multi-share is enabled for new circle | I view advanced settings | "Share Lock Period" option displays with: Start Lock (cycles 1-3), End Lock (last 1-3 cycles), Custom |
| AC2 | I set start lock to 2 cycles | Circle begins | Share increase/decrease requests are blocked for first 2 cycles; members see "Share changes available after Cycle 2" |
| AC3 | I set end lock to 2 cycles | Circle reaches cycle 8 of 10 | Share changes blocked; members see "Share changes locked for final cycles to ensure circle completion" |
| AC4 | Member tries to request shares during lock period | Request is attempted | Button disabled with tooltip: "Share changes are temporarily locked. Available again on [date]" |
| AC5 | Emergency share reduction is needed during lock | Member contacts organizer | Organizer can submit exception request to platform admin with documented hardship reason |

---

### US 1.8: Set Minimum Share Holding Period

| Story ID | MCS-US034 | Priority | P2 - Medium | Story Points | 3 |
|----------|-----------|----------|-------------|--------------|---|

**User Story:** As a verified circle organizer, I want to require members to hold additional shares for a minimum number of cycles before reducing, so that the circle has predictable contribution flows.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | Multi-share is enabled | I view share configuration | "Minimum Hold Period" dropdown shows: None, 2 cycles, 3 cycles, Until payout received |
| AC2 | Minimum hold is set to 3 cycles; member gained 2nd share in cycle 2 | Member requests reduction in cycle 4 | Request rejected: "Additional shares must be held for 3 cycles. Reduction available after Cycle 5." |
| AC3 | Hold period set to "Until payout received" | Member with 3 shares requests reduction before payout | Request rejected: "Share reduction available after you receive your payout" |
| AC4 | Member has genuine financial hardship | Member submits hardship request | Organizer can approve early reduction with documented reason; exception logged |

---

## 5. Epic 2: Share Request & Allocation

| Epic ID | MCS-E002 |
|---------|----------|
| Epic Name | Share Request & Allocation |
| Business Goal | Enable members to request, receive, and manage multiple shares within a circle |
| Success Metric | 85% share request approval rate; Average request processing time under 24 hours |
| Primary Stakeholder | Verified Circle Member |

---

### US 2.1: Request Additional Shares in Circle

| Story ID | MCS-US007 | Priority | P0 - Critical | Story Points | 5 |
|----------|-----------|----------|---------------|--------------|---|

**User Story:** As a verified circle member, I want to request additional shares in my circle, so that I can increase my savings commitment and receive a larger payout.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I am a member of multi-share enabled circle with 1 share | I view my circle membership card | "Request Additional Share" button is visible if I am below max shares |
| AC2 | I click Request Additional Share | Request modal opens | Modal shows: current shares, available slots, contribution impact calculator, and quantity selector |
| AC3 | I select 2 additional shares (going from 1 to 3) | I view impact summary | Summary shows: "New contribution: CHF 1,500/cycle (+CHF 1,000). New payout: CHF 15,000 (+CHF 10,000)." |
| AC4 | Circle is in Forming status; I submit request | Request is processed per circle approval mode | Auto-approve: shares granted immediately. Organizer approval: request enters Pending status |
| AC5 | Circle is in Active status; I submit request | Request is processed | Warning shown: "Request will apply from next cycle. You must pay increased amount starting [date]." Effective date clearly displayed |
| AC6 | I have pending share request | I try to submit another request | Button disabled with message: "You have a pending request. Please wait for approval or cancel existing request." |

---

### US 2.2: Approve/Reject Share Requests (Organizer)

| Story ID | MCS-US008 | Priority | P0 - Critical | Story Points | 5 |
|----------|-----------|----------|---------------|--------------|---|

**User Story:** As a verified circle organizer, I want to review and approve or reject member share requests, so that I can maintain appropriate circle balance and member composition.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | Circle has Organizer Approval mode; member submits request | I view my organizer dashboard | Notification badge shows pending request count; "Share Requests" section visible |
| AC2 | I click on pending request | Request details expand | Shows: member name, Trust Score, current shares, requested shares, request date, member payment history |
| AC3 | I view request impact analysis | Impact section loads | Shows: new total shares in circle, share distribution chart, effect on payout rotation |
| AC4 | I click Approve | Confirmation modal appears | Modal shows summary; on confirm: member notified, shares allocated, audit log updated |
| AC5 | I click Reject | Rejection modal appears | Required reason field (dropdown: Circle Balance, Trust Concerns, Capacity Limit, Other + free text); member notified with reason |
| AC6 | Request pending for 72+ hours | System checks timeout | Organizer receives reminder notification; after 7 days, request auto-expires with notification to member |

---

### US 2.3: Cancel Pending Share Request

| Story ID | MCS-US009 | Priority | P1 - High | Story Points | 2 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a verified circle member, I want to cancel my pending share request, so that I can change my mind before approval if my circumstances change.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I have a pending share request | I view my circle membership | Pending request banner shows with "Cancel Request" button |
| AC2 | I click Cancel Request | Confirmation appears | "Are you sure you want to cancel your request for [X] additional shares?" |
| AC3 | I confirm cancellation | Request is cancelled | Request removed from pending queue; organizer notified; I can submit new request immediately |
| AC4 | Request was already approved/rejected | I try to cancel | No cancel option shown; status shows "Approved" or "Rejected" with date |

---

### US 2.4: Request Share Reduction

| Story ID | MCS-US010 | Priority | P1 - High | Story Points | 5 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a verified circle member with multiple shares, I want to request a reduction in my share count, so that I can reduce my commitment if my financial situation changes.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I hold 3 shares in an active circle | I view my membership settings | "Request Share Reduction" option visible |
| AC2 | I initiate share reduction | Reduction modal opens | Shows current shares, minimum allowed (1), reduction options (reduce to 2 or reduce to 1), and impact calculator |
| AC3 | Circle is in Active status; I already received my payout | I request reduction | Warning: "Reduction requires you to continue contributing at current level until cycle ends to maintain circle balance. Effective from next cycle." |
| AC4 | Circle is in Active status; I have NOT yet received payout | I request reduction | Warning: "Your payout will be reduced proportionally. Current expected payout: CHF 15,000. After reduction: CHF 10,000." Explicit confirmation required |
| AC5 | Share reduction would leave "orphan" shares in rotation | I submit request | Request requires organizer approval regardless of circle setting; organizer must find replacement shares or approve gap |
| AC6 | Circle is in Forming status | I reduce shares | Reduction applies immediately; freed shares become available for others |

---

### US 2.5: View Share Allocation History

| Story ID | MCS-US011 | Priority | P2 - Medium | Story Points | 3 |
|----------|-----------|----------|-------------|--------------|---|

**User Story:** As a verified circle member, I want to view the history of my share requests and changes, so that I have a complete record of my participation level over time.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I navigate to my circle membership | I click "Share History" tab | Timeline view displays all share-related events |
| AC2 | Timeline is displayed | I view entries | Each entry shows: date, event type (Requested, Approved, Rejected, Cancelled, Reduced), share count change, status |
| AC3 | A request was rejected | I click on rejected entry | Expands to show rejection reason provided by organizer |
| AC4 | I want to export history | I click export icon | Downloads CSV with complete share history for this circle |

---

### US 2.6: Receive Share Request Notifications

| Story ID | MCS-US012 | Priority | P0 - Critical | Story Points | 3 |
|----------|-----------|----------|---------------|--------------|---|

**User Story:** As a verified circle member, I want to receive notifications about my share request status, so that I know immediately when my request is processed.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I submit share request in Organizer Approval mode | Request is submitted | Confirmation in-app notification: "Your request for X additional shares has been submitted. You will be notified when [Organizer] reviews it." |
| AC2 | Organizer approves my request | Approval is recorded | Push notification + email: "Great news! Your request for X additional shares in [Circle Name] has been approved. New total: Y shares." |
| AC3 | Organizer rejects my request | Rejection is recorded | Push notification + email: "Your request for additional shares in [Circle Name] was not approved. Reason: [Reason]. You may submit a new request." |
| AC4 | Request expires (7 days without decision) | Expiry occurs | Notification: "Your share request in [Circle Name] has expired. You may submit a new request if still interested." |
| AC5 | Auto-approve mode active | I submit request | Immediate notification: "Your request for X additional shares has been automatically approved. New total: Y shares. New contribution: CHF Z per cycle." |

---

### US 2.7: Join Share Waitlist

| Story ID | MCS-US035 | Priority | P1 - High | Story Points | 5 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a verified circle member, I want to join a waitlist for additional shares when the circle is at capacity, so that I can automatically receive shares when they become available.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | Circle has reached maximum total shares (e.g., 50 shares) | I try to request additional shares | Message shows: "Circle is at capacity. Join waitlist?" with position indicator |
| AC2 | I join the waitlist | Waitlist entry is created | Confirmation: "You're #3 on the waitlist for additional shares. We'll notify you when shares become available." |
| AC3 | Another member reduces their shares | System checks waitlist | First waitlist member notified: "A share is now available! You have 48 hours to claim it." |
| AC4 | Waitlist member doesn't respond in 48 hours | Timeout occurs | Offer moves to next waitlist member; original member moved to end of waitlist |
| AC5 | I want to leave waitlist | I click "Leave Waitlist" | Removed immediately; position freed for others; can rejoin at end of queue |

---

### US 2.8: Transfer Shares to Another Member

| Story ID | MCS-US036 | Priority | P2 - Medium | Story Points | 8 |
|----------|-----------|----------|-------------|--------------|---|

**User Story:** As a verified circle member with multiple shares, I want to transfer one or more shares to another existing member, so that I can reduce my commitment while keeping shares within trusted circle members.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I hold 3 shares; another member holds 1 share (below max) | I view share management options | "Transfer Shares" button visible |
| AC2 | I initiate transfer | Transfer modal opens | Shows: my current shares, eligible recipients (members below max), share quantity selector |
| AC3 | I select to transfer 1 share to Maria | Transfer request submitted | Both parties notified; Maria must accept transfer within 72 hours |
| AC4 | Maria accepts transfer | Transfer is processed | My shares: 2, Maria's shares: 2; both contribution amounts update; organizer notified |
| AC5 | Transfer would put recipient over max shares | I try to select quantity | Quantity limited to recipient's available capacity; tooltip explains limit |
| AC6 | Organizer has disabled transfers | I view share options | "Transfer Shares" not visible; setting shown in circle rules |

---

### US 2.9: Request Emergency Share Reduction

| Story ID | MCS-US037 | Priority | P1 - High | Story Points | 5 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a verified circle member facing financial hardship, I want to request an expedited share reduction with documentation, so that I can reduce my commitment quickly without defaulting.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I hold multiple shares and face hardship | I view share reduction options | "Emergency Reduction" option visible alongside standard reduction |
| AC2 | I select emergency reduction | Emergency request form opens | Requires: reason category (job loss, medical, family emergency), brief explanation, optional documentation upload |
| AC3 | I submit emergency request | Request is flagged as urgent | Organizer receives priority notification; request highlighted in dashboard; 24-hour SLA for response |
| AC4 | Organizer approves emergency reduction | Reduction processed immediately | Effective from current cycle if contribution not yet made; member notified; support resources shared |
| AC5 | Emergency reduction approved during lock period | Exception is granted | Lock period bypassed; audit log records emergency exception with documentation |

---

## 6. Epic 3: Multi-Share Contribution Processing

| Epic ID | MCS-E003 |
|---------|----------|
| Epic Name | Multi-Share Contribution Processing |
| Business Goal | Process member contributions accurately based on their share count with proper accounting and receipts |
| Success Metric | 100% accurate contribution calculation; Zero payment discrepancy disputes related to share counts |
| Primary Stakeholder | Verified Circle Member / System |

---

### US 3.1: Calculate Contribution Amount Based on Shares

| Story ID | MCS-US013 | Priority | P0 - Critical | Story Points | 5 |
|----------|-----------|----------|---------------|--------------|---|

**User Story:** As a system, I want to automatically calculate each member's contribution amount based on their share count, so that members are charged the correct amount each cycle.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | Circle has base contribution CHF 500; member has 3 shares | New cycle begins | System calculates member contribution as CHF 1,500 (500 x 3) |
| AC2 | Emergency fund rate is 1% | Contribution is calculated | Emergency fund deduction applied per share: CHF 1,500 x 1% = CHF 15 to emergency fund; CHF 1,485 to circle pool |
| AC3 | Member's share count changed mid-cycle (approved reduction) | Current cycle contribution is due | Member pays at original share level for current cycle; new rate applies next cycle |
| AC4 | Member's share count increased mid-cycle | Current cycle contribution is due | Member pays at original rate for current cycle; increased rate applies next cycle (no partial contributions) |
| AC5 | Platform fee is 1.5% per transaction | Fee is calculated | Fee calculated on total contribution: CHF 1,500 x 1.5% = CHF 22.50 platform fee |

---

### US 3.2: Display Contribution Amount with Share Breakdown

| Story ID | MCS-US014 | Priority | P0 - Critical | Story Points | 3 |
|----------|-----------|----------|---------------|--------------|---|

**User Story:** As a verified circle member, I want to clearly see how my contribution amount is calculated, so that I understand why I pay what I pay and trust the system.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I hold 3 shares in circle with CHF 500 base | I view contribution due screen | Shows: "3 shares x CHF 500 = CHF 1,500" with clear breakdown |
| AC2 | Contribution due screen is displayed | I view breakdown details | Shows: Base amount per share, number of shares, subtotal, Emergency Fund deduction (if applicable), platform fee, total due |
| AC3 | I hover over "Emergency Fund" line item | Tooltip appears | Explains: "1% of your contribution is pooled to protect against member defaults" |
| AC4 | My share count will increase next cycle | I view payment screen | Banner shows: "Note: Starting next cycle, your contribution will be CHF X based on your Y shares" |

---

### US 3.3: Process Multi-Share Payment

| Story ID | MCS-US015 | Priority | P0 - Critical | Story Points | 8 |
|----------|-----------|----------|---------------|--------------|---|

**User Story:** As a verified circle member with multiple shares, I want to make my contribution payment in a single transaction, so that I fulfill my multi-share obligation efficiently.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | My total contribution is CHF 1,500 (3 shares) | I click Pay Now | Payment screen pre-fills CHF 1,500; cannot change amount (full payment only) |
| AC2 | I complete payment via Stripe | Payment succeeds | Single transaction recorded; internally tracked as 3 share contributions; receipt shows share breakdown |
| AC3 | Payment fails mid-transaction | Error occurs | Entire payment rolled back; no partial contribution recorded; error message displayed with retry option |
| AC4 | Organizer records manual/cash payment for multi-share member | Recording payment | System pre-fills expected amount (share count x base); allows organizer to record full amount; requires note for any deviation |
| AC5 | Auto-pay is enabled for multi-share member | Contribution due date arrives | System charges correct multi-share amount automatically; member receives confirmation with share breakdown |

---

### US 3.4: Generate Multi-Share Contribution Receipt

| Story ID | MCS-US016 | Priority | P1 - High | Story Points | 3 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a verified circle member, I want to receive a detailed receipt showing my share-based contribution, so that I have documentation for my records and potential tax purposes.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | Payment completes successfully | Receipt is generated | Receipt includes: Member name, Circle name, Date, Cycle number, Share count, Amount per share, Total amount, Transaction reference |
| AC2 | Receipt is displayed | I view breakdown section | Shows: "3 shares x CHF 500.00 = CHF 1,500.00"; Emergency Fund: CHF 15.00; Net to Pool: CHF 1,485.00 |
| AC3 | I want to download receipt | I click Download PDF | Professional PDF generated with CircleUp branding, complete breakdown, and Swiss legal compliance text |
| AC4 | I want to email receipt | I click Email Receipt | Receipt PDF sent to my registered email with contribution summary in email body |

---

### US 3.5: Handle Multi-Share Contribution Reminders

| Story ID | MCS-US017 | Priority | P0 - Critical | Story Points | 3 |
|----------|-----------|----------|---------------|--------------|---|

**User Story:** As a verified circle member with multiple shares, I want to receive reminders showing my exact contribution amount, so that I can prepare the correct funds before the due date.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I have 3 shares; contribution is due in 3 days | Reminder is sent | Message includes: "Your contribution of CHF 1,500 (3 shares x CHF 500) is due on [date]. Tap to pay now." |
| AC2 | I receive push notification | I tap the notification | Deep links directly to payment screen with amount pre-filled |
| AC3 | Contribution is overdue by 1 day | Overdue reminder is sent | Message emphasizes urgency: "Your CHF 1,500 contribution is overdue. Please pay immediately to avoid affecting your Trust Score." |
| AC4 | Organizer views late member | Member status is displayed | Shows: member name, share count, amount owed (with share breakdown), days overdue |

---

### US 3.6: Set Up Graduated Auto-Pay for Multi-Share

| Story ID | MCS-US038 | Priority | P2 - Medium | Story Points | 5 |
|----------|-----------|----------|-------------|--------------|---|

**User Story:** As a verified circle member with multiple shares, I want to configure graduated payment schedules for my multi-share contributions, so that I can spread larger payments across multiple dates within the cycle.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I have 4 shares (CHF 2,000 total contribution) | I view payment settings | "Split Payment" option available for contributions over CHF 1,000 |
| AC2 | I enable split payment | Configuration options display | Options: 2 payments (50/50), Weekly (for monthly cycles), Custom dates |
| AC3 | I select 2 payments for monthly cycle | Schedule is set | Payment 1: CHF 1,000 on 1st; Payment 2: CHF 1,000 on 15th; both auto-charged |
| AC4 | First split payment fails | System handles partial | Second payment still attempted; member notified; status shows "1 of 2 payments complete" |
| AC5 | All split payments complete before deadline | Contribution marked complete | Single contribution record created; receipt shows split payment details |

---

### US 3.7: View Multi-Share Payment Comparison

| Story ID | MCS-US039 | Priority | P2 - Medium | Story Points | 3 |
|----------|-----------|----------|-------------|--------------|---|

**User Story:** As a verified circle member considering additional shares, I want to compare my current contribution against potential multi-share scenarios, so that I can make an informed decision about requesting more shares.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I hold 1 share in CHF 500 base circle | I view "Share Calculator" | Interactive tool shows current vs. potential contributions and payouts |
| AC2 | I adjust share slider to 3 | Comparison updates | Side-by-side: Current (1 share): CHF 500/month, CHF 5,000 payout vs. With 3 shares: CHF 1,500/month, CHF 15,000 payout |
| AC3 | I want to understand total commitment | I view "Full Cycle View" | Shows: Total contributions over circle duration, total payout, net benefit calculation |
| AC4 | Calculator considers my Trust Score | Eligibility indicator shows | "Based on your Trust Score of 850, you're eligible for up to 4 shares in this circle" |

---

## 7. Epic 4: Multi-Share Payout Processing

| Epic ID | MCS-E004 |
|---------|----------|
| Epic Name | Multi-Share Payout Processing |
| Business Goal | Calculate and disburse payouts proportional to member share counts with transparent accounting |
| Success Metric | 100% accurate payout calculation; Payout disputes < 0.1% |
| Primary Stakeholder | Verified Circle Member / Organizer |

---

### US 4.1: Calculate Payout Amount Based on Shares

| Story ID | MCS-US018 | Priority | P0 - Critical | Story Points | 8 |
|----------|-----------|----------|---------------|--------------|---|

**User Story:** As a system, I want to calculate payout amounts proportional to each member's share count, so that members receive fair payouts matching their contribution level.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | Circle has 10 members with total 15 shares; CHF 500 base | Cycle pool is calculated | Total cycle pool = 15 shares x CHF 500 = CHF 7,500 (before emergency fund) |
| AC2 | Member has 3 shares; total circle has 15 shares | Member's payout is calculated | Payout = (3/15) x CHF 7,500 = CHF 1,500 (proportional to share ownership) |
| AC3 | Alternative calculation: Member receives for all their shares | Payout is calculated using share-based method | Payout = Member's shares x Total contributions from all other members per share |
| AC4 | Circle uses payout rotation by share (not by member) | Member with 3 shares reaches payout turn | Member receives 3 consecutive payouts (one per share) or single consolidated payout (configurable by organizer) |
| AC5 | Emergency fund has been used for a default | Payout is calculated | Payout calculated from actual collected funds; any shortfall documented and explained to recipient |

---

### US 4.2: Configure Payout Order for Multi-Share Members

| Story ID | MCS-US019 | Priority | P0 - Critical | Story Points | 8 |
|----------|-----------|----------|---------------|--------------|---|

**User Story:** As a verified circle organizer, I want to configure how multi-share payouts are ordered and distributed, so that all members understand and accept the payout schedule.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I am configuring multi-share payout order | I view payout mode options | Two modes available: "Consolidated" (one large payout) and "Distributed" (multiple payouts) |
| AC2 | I select Consolidated mode | Member with 3 shares reaches payout turn | Member receives single payout of 3x base payout amount; member appears once in rotation |
| AC3 | I select Distributed mode | Member with 3 shares is placed in rotation | Member appears 3 times in payout rotation; each appearance receives 1x base payout |
| AC4 | Random payout order selected with multi-share | Order is generated | Each share is treated as separate entry in random draw; member with 3 shares has 3 entries |
| AC5 | Fixed order with multi-share | I set payout order | Drag-drop interface shows each share position; can group or spread member's shares |
| AC6 | Members view payout schedule | Schedule is displayed | Clear visualization shows: position number, member name, shares for that position, expected payout amount, expected date |

---

### US 4.3: View Payout Projection with Share Details

| Story ID | MCS-US020 | Priority | P1 - High | Story Points | 5 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a verified circle member, I want to see my projected payout amount based on my current shares, so that I can plan my finances around my expected payout.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I hold 3 shares in circle with 15 total shares | I view my circle dashboard | "Your Expected Payout" prominently displays calculated amount with share breakdown |
| AC2 | Circle is in Active status | I view payout projection | Shows: "Based on 3 shares: Expected payout CHF X. Your position: #Y. Expected date: [date]." |
| AC3 | Circle composition changes (member adds shares) | Projections update | All members' projections recalculated; notification sent if significant change (>5% payout variance) |
| AC4 | I have pending share increase request | I view projections | Shows both current projection and "If request approved" projection side-by-side |

---

### US 4.4: Process Multi-Share Payout

| Story ID | MCS-US021 | Priority | P0 - Critical | Story Points | 8 |
|----------|-----------|----------|---------------|--------------|---|

**User Story:** As a verified circle member with multiple shares, I want to receive my proportionally larger payout when my turn arrives, so that I receive the benefit of my increased contribution.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I have 3 shares and it is my payout turn | All cycle contributions are complete | System initiates payout to my registered bank account within 24 hours |
| AC2 | Payout is processing (Consolidated mode) | Payout status updates | I see single payout entry with full multi-share amount; status shows: Initiated - Processing - Completed |
| AC3 | Payout completes successfully | Notification is sent | Message: "Your payout of CHF X (3 shares) has been deposited. Transaction ref: [ref]. Thank you for participating!" |
| AC4 | Payout fails (bank rejection) | Error is detected | Member notified to update bank details; organizer notified; payout retried automatically after bank details updated |
| AC5 | Member has already received payout (Distributed mode) | Second share payout turn arrives | Separate payout processed; member status shows "X of Y payouts received" |

---

### US 4.5: Generate Multi-Share Payout Receipt

| Story ID | MCS-US022 | Priority | P1 - High | Story Points | 3 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a verified circle member, I want to receive a detailed payout receipt showing the share-based calculation, so that I have complete documentation of my payout for records and potential tax purposes.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | Payout is completed | Receipt is generated | Receipt includes: Member name, Circle name, Payout date, Share count at payout, Total shares in circle, Calculation breakdown, Net amount received, Bank account (masked) |
| AC2 | Receipt shows calculation | I view breakdown | Shows: "Your shares: 3 of 15 total (20%). Cycle pool: CHF 7,500. Your payout: CHF 1,500." |
| AC3 | Member's share count changed during circle | Receipt shows history | Summary section shows contribution history: "Total contributed: CHF X over Y cycles at various share levels" |
| AC4 | I need official documentation | I download PDF receipt | PDF includes: CircleUp letterhead, unique receipt number, QR code for verification, Swiss compliance disclaimers |

---

### US 4.6: Handle Multi-Share Default Scenarios

| Story ID | MCS-US023 | Priority | P0 - Critical | Story Points | 8 |
|----------|-----------|----------|---------------|--------------|---|

**User Story:** As a system, I want to handle default scenarios fairly when a multi-share member fails to pay, so that the circle continues functioning and other members are protected.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | Member with 3 shares misses payment | Default is triggered | Emergency fund covers full 3-share default (CHF 1,500); fund balance reduced by full amount |
| AC2 | Emergency fund insufficient for full multi-share default | Shortfall calculated | Emergency fund depleted; remaining shortfall distributed proportionally across all members' payouts for this cycle |
| AC3 | Multi-share member defaults after receiving payout | Recovery process initiates | Debt recorded at full multi-share level (3x base); Trust Score penalty applied; recovery notification sent |
| AC4 | Organizer removes defaulting multi-share member | Removal is processed | Member removed; all their remaining payout positions become available; circle recalculates with reduced total shares |
| AC5 | Defaulting member makes partial payment | Payment is recorded | Partial payment applied proportionally across shares; status shows: "2 of 3 shares paid"; remaining 1 share still in default |

---

### US 4.7: Request Payout Position Swap

| Story ID | MCS-US040 | Priority | P2 - Medium | Story Points | 5 |
|----------|-----------|----------|-------------|--------------|---|

**User Story:** As a verified circle member with multiple shares, I want to request swapping my payout position with another member, so that I can receive my payout earlier or later based on my needs.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I have payout position #8; I need funds sooner | I view payout schedule | "Request Swap" button visible next to other members' positions |
| AC2 | I request swap with member in position #3 | Swap request sent | Other member notified: "[Name] would like to swap payout positions with you (their #8 for your #3)" |
| AC3 | Other member accepts swap | Positions exchanged | Both members' schedules update; organizer notified; audit log records swap |
| AC4 | I have 3 shares (3 payout positions) in distributed mode | I request swap | Can swap individual share positions or all positions together |
| AC5 | Swap would affect member who already received payout | Swap attempted | Swap not allowed with completed positions; only future positions eligible |

---

### US 4.8: Configure Payout Acceleration for Multi-Share

| Story ID | MCS-US041 | Priority | P1 - High | Story Points | 5 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a verified circle organizer, I want to offer payout acceleration options for multi-share members, so that members with larger commitments can optionally receive payouts sooner by paying a small premium.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I am configuring circle with multi-share enabled | I view payout options | "Allow Payout Acceleration" toggle with fee configuration (0.5%-2%) |
| AC2 | Acceleration is enabled at 1% fee | Member with 3 shares requests acceleration | Member sees: "Move up 2 positions for CHF 150 fee (1% of CHF 15,000 payout)" |
| AC3 | Member accepts acceleration | Position swap processed | Member moves up; displaced member(s) receive portion of acceleration fee as compensation |
| AC4 | Multiple members request acceleration for same position | Conflict detected | First requester gets priority; others offered next available acceleration |
| AC5 | Acceleration would move member ahead of someone who already contributed more cycles | Fairness check triggers | Warning: "This would place you ahead of members with more contributions. Proceed?" |

---

## 8. Epic 5: Multi-Share Dashboard & Reporting

| Epic ID | MCS-E005 |
|---------|----------|
| Epic Name | Multi-Share Dashboard & Reporting |
| Business Goal | Provide clear visibility into multi-share circle composition and dynamics for all stakeholders |
| Success Metric | 90% user comprehension of share-based displays; < 5 support tickets/month related to multi-share confusion |
| Primary Stakeholder | Organizer / Member |

---

### US 5.1: View Circle Share Distribution

| Story ID | MCS-US024 | Priority | P1 - High | Story Points | 5 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a circle organizer or member, I want to see a visualization of how shares are distributed across members, so that I understand the circle's composition at a glance.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | Multi-share circle has 10 members with varying shares | I view circle dashboard | Share distribution chart displays: donut/pie chart showing each member's share percentage |
| AC2 | I view member list | List displays | Each member shows: name, avatar, share count badge, percentage of total shares |
| AC3 | I hover over chart segment | Details tooltip appears | Shows: member name, X shares (Y% of total), expected payout amount |
| AC4 | Circle composition changes | Dashboard updates | Real-time update when share allocations change; animation shows shift |

---

### US 5.2: View Organizer Analytics for Multi-Share Circles

| Story ID | MCS-US025 | Priority | P1 - High | Story Points | 5 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a verified circle organizer, I want to see analytics about multi-share usage and impact, so that I can make informed decisions about circle management.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I navigate to circle analytics | Analytics dashboard loads | Multi-share metrics section displays: total shares, average shares/member, share distribution histogram |
| AC2 | I view share request analytics | Request metrics display | Shows: total requests, approval rate, average processing time, rejection reasons breakdown |
| AC3 | I want to understand share concentration | Concentration metric displays | "Share Concentration Index" shows if shares are evenly distributed or concentrated; warnings if one member exceeds 25% of shares |
| AC4 | I export circle report | Report generates | PDF includes: share distribution summary, member share history, contribution/payout totals by share level |

---

### US 5.3: View Personal Multi-Share Summary

| Story ID | MCS-US026 | Priority | P1 - High | Story Points | 3 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a verified circle member, I want to see a summary of my multi-share participation across all my circles, so that I understand my total commitment and expected benefits.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I hold shares in multiple circles | I view my personal dashboard | "My Shares" card shows: total shares across all circles, total monthly commitment, total expected payouts |
| AC2 | I expand circle details | Per-circle breakdown displays | Each circle shows: circle name, my shares, monthly contribution, payout position, expected payout date |
| AC3 | I have pending share requests | Pending section displays | Shows: circle name, requested shares, request date, current status (Pending/Approved/Rejected) |
| AC4 | I want year-end summary | Annual summary available | Shows: total contributed by share level, total received, share history timeline |

---

### US 5.4: Export Multi-Share Transaction History

| Story ID | MCS-US027 | Priority | P2 - Medium | Story Points | 3 |
|----------|-----------|----------|-------------|--------------|---|

**User Story:** As a verified circle member or organizer, I want to export transaction history with share details, so that I have records for accounting, tax, or audit purposes.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I navigate to transaction history | Export option visible | "Export" button available with format options (CSV, PDF) |
| AC2 | I export CSV | File downloads | Columns include: Date, Type, Circle, Share Count at Transaction, Base Amount, Total Amount, Status, Reference |
| AC3 | I export PDF | Report generates | Formatted report with: header showing date range, summary statistics, detailed transaction table with share breakdowns |
| AC4 | I apply date range filter | Export respects filter | Only transactions within selected date range included; filter clearly stated on export |

---

### US 5.5: View Real-Time Circle Pool Status

| Story ID | MCS-US028 | Priority | P1 - High | Story Points | 5 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a circle organizer or member, I want to see real-time status of the circle pool accounting for multi-share contributions, so that I can track progress toward cycle completion.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | Current cycle is in progress with multi-share members | I view circle dashboard | Pool status shows: X of Y shares contributed (Z%), with progress bar |
| AC2 | I view contribution breakdown | Detailed status displays | Shows per-member: name, shares held, shares paid, shares pending, amount contributed, amount due |
| AC3 | Multi-share member makes payment | Pool updates in real-time | Animation shows contribution added; progress bar advances; notification appears if I'm viewing |
| AC4 | All contributions complete | Payout ready status shows | "100% Collected" with celebration animation; "Payout Processing" status with ETA; Next recipient highlighted |

---

### US 5.6: View Share Concentration Alerts

| Story ID | MCS-US042 | Priority | P1 - High | Story Points | 3 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a verified circle organizer, I want to receive alerts when share distribution becomes too concentrated, so that I can maintain a balanced and fair circle.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | Single member's shares exceed 30% of total | Threshold breached | Organizer receives alert: "Share concentration warning: [Member] now holds 35% of circle shares" |
| AC2 | Top 2 members hold more than 50% combined | Threshold breached | Dashboard shows warning banner: "High share concentration detected. Consider limiting additional share approvals." |
| AC3 | I view concentration metrics | Analytics display | Shows: Gini coefficient for share distribution, concentration trend over time, comparison to healthy circles |
| AC4 | I want to set custom thresholds | I access alert settings | Can configure: single member threshold (20-50%), top 3 members threshold (40-70%), alert frequency |

---

### US 5.7: Compare Multi-Share Performance Across Circles

| Story ID | MCS-US043 | Priority | P2 - Medium | Story Points | 5 |
|----------|-----------|----------|-------------|--------------|---|

**User Story:** As a verified circle member participating in multiple multi-share circles, I want to compare my share performance across circles, so that I can optimize my savings strategy.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I am member of 3 multi-share circles | I view "My Shares" dashboard | Comparison table shows all circles with: shares held, monthly commitment, payout position, expected return |
| AC2 | I want to see efficiency metrics | I click "Performance Analysis" | Shows: effective savings rate per circle, payout timing comparison, recommendation for optimal share distribution |
| AC3 | One circle has better terms | Recommendation displays | "Consider increasing shares in [Circle A] - 15% better effective return than [Circle B]" |
| AC4 | I want historical comparison | I view "Share History" | Timeline shows share changes across all circles with contribution/payout milestones |

---

### US 5.8: View Multi-Share Impact on Trust Score

| Story ID | MCS-US044 | Priority | P1 - High | Story Points | 3 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a verified circle member, I want to understand how my multi-share participation affects my Trust Score, so that I can make decisions that positively impact my reputation.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I have successfully maintained 3 shares for 6 cycles | I view Trust Score breakdown | Shows: "Multi-share reliability bonus: +45 points" with explanation |
| AC2 | I view Trust Score factors | Multi-share section displays | Factors: shares held, on-time payment rate at higher amounts, share tenure, successful share increases |
| AC3 | I'm considering adding shares | Impact preview available | "Adding 1 share could improve your Trust Score by 10-20 points over 3 cycles if payments remain on time" |
| AC4 | I defaulted on multi-share payment | Trust Score impact shown | Penalty scaled to share count: "Multi-share default: -60 points (3x base penalty for 3 shares)" |

---

## 9. Epic 6: Platform Administration & Compliance

| Epic ID | MCS-E006 |
|---------|----------|
| Epic Name | Platform Administration & Compliance |
| Business Goal | Enable platform administrators to configure, monitor, and manage multi-share functionality across the platform |
| Success Metric | Zero compliance violations; 99.9% system accuracy in share calculations |
| Primary Stakeholder | Platform Administrator |

---

### US 6.1: Configure Platform-Wide Multi-Share Limits

| Story ID | MCS-US029 | Priority | P0 - Critical | Story Points | 5 |
|----------|-----------|----------|---------------|--------------|---|

**User Story:** As a platform administrator, I want to configure global limits for multi-share functionality, so that I can manage platform risk and ensure system stability.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I access platform admin settings | Multi-share configuration section available | Shows: Global maximum shares per member, Maximum shares per circle, Multi-share feature toggle |
| AC2 | I set global max shares to 5 | Setting is saved | All existing circles with higher max remain grandfathered; new circles cannot exceed 5; audit log records change |
| AC3 | I disable multi-share feature globally | Feature is disabled | New circles cannot enable multi-share; existing multi-share circles continue to function; banner warns organizers of disabled feature |
| AC4 | I set KYC requirement for multi-share | Requirement is applied | Members requesting >2 shares must have verified KYC; existing allocations grandfathered but flagged for review |

---

### US 6.2: Monitor Multi-Share Platform Metrics

| Story ID | MCS-US030 | Priority | P1 - High | Story Points | 5 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a platform administrator, I want to view platform-wide metrics about multi-share usage, so that I can understand feature adoption and identify potential issues.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I access admin dashboard | Multi-share metrics panel displays | Shows: % of circles with multi-share enabled, average shares per member, total platform shares, share request volume |
| AC2 | I view trend charts | Historical data displays | Charts show: multi-share adoption over time, average shares trend, request approval rate trend |
| AC3 | I filter by association type | Filtered metrics display | Can compare multi-share usage across: cultural, professional, religious, family association types |
| AC4 | I identify high-share circles | Alert list displays | Circles where single member holds >40% of shares flagged; click through to circle details |

---

### US 6.3: Handle Multi-Share Dispute Resolution

| Story ID | MCS-US031 | Priority | P1 - High | Story Points | 5 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a platform administrator, I want to review and resolve disputes related to multi-share allocations or payouts, so that I can ensure fair treatment of all members and maintain platform trust.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | Support ticket involves multi-share dispute | Complete share history accessible | Can view: member's share allocation history, all contributions by share level, payout calculations, organizer actions |
| AC2 | I need to verify payout calculation | Calculation breakdown available | Shows: formula used, input values (shares, pool size), expected output, actual output, any discrepancies |
| AC3 | I need to manually adjust shares | Admin override available | Can adjust member share count with: reason (required), effective date, impact preview, affected member notification |
| AC4 | Adjustment would affect completed payouts | Impact analysis displays | Warning shows: affected payouts, potential clawback required, member communication template |

---

### US 6.4: Generate Multi-Share Compliance Reports

| Story ID | MCS-US032 | Priority | P1 - High | Story Points | 5 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a platform administrator, I want to generate compliance reports covering multi-share transactions, so that I can meet regulatory requirements and audit requests.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I need AML compliance report | Report generation available | Can generate: high-value multi-share transactions, members with rapid share accumulation, unusual share patterns |
| AC2 | I need FINMA-required reporting | Swiss regulatory format available | Report includes: all multi-share transactions above threshold, member identification, share change justifications |
| AC3 | I need audit trail | Complete audit log exportable | Includes: every share allocation, approval/rejection, calculation, payout - with timestamps and actors |
| AC4 | Report identifies anomaly | Investigation tools available | Can drill down from report to: member profile, circle details, transaction history, organizer communications |

---

### US 6.5: Configure Trust Score Requirements for Share Tiers

| Story ID | MCS-US045 | Priority | P0 - Critical | Story Points | 5 |
|----------|-----------|----------|---------------|--------------|---|

**User Story:** As a platform administrator, I want to set minimum Trust Score requirements for different share quantities, so that higher-risk multi-share positions are limited to proven reliable members.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I access platform share configuration | Trust Score tiers visible | Configuration table: 1-2 shares (min 500), 3-4 shares (min 650), 5+ shares (min 750) |
| AC2 | I set 3+ shares requires Trust Score 700 | Setting saved | Members with score below 700 see max 2 shares available; tooltip explains requirement |
| AC3 | Member's Trust Score drops below tier threshold | System evaluates | Existing shares grandfathered; future requests blocked; member notified: "Improve Trust Score to 700 to request additional shares" |
| AC4 | New member with no Trust Score history | Share limits apply | Limited to 1 share for first circle; can increase after establishing payment history |
| AC5 | Organizer wants to override for trusted member | Override request submitted | Platform admin can approve exception with documented justification |

---

### US 6.6: Detect and Flag Suspicious Share Patterns

| Story ID | MCS-US046 | Priority | P0 - Critical | Story Points | 8 |
|----------|-----------|----------|---------------|--------------|---|

**User Story:** As a platform administrator, I want the system to automatically detect and flag suspicious multi-share patterns, so that I can prevent potential fraud or abuse.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | Member rapidly accumulates shares across multiple circles | Pattern detected | Alert: "Unusual share accumulation: [Member] added 15 shares across 5 circles in 7 days" |
| AC2 | Member consistently reduces shares right after receiving payout | Pattern detected | Alert: "Payout-and-reduce pattern: [Member] has reduced shares within 1 cycle of payout 3 times" |
| AC3 | Related members (same household/IP) accumulate shares in same circle | Pattern detected | Alert: "Potential coordination: Members [A], [B], [C] (related accounts) hold 60% of [Circle] shares" |
| AC4 | Share transfers cluster around payout dates | Pattern detected | Alert: "Suspicious transfer timing: 5 share transfers in [Circle] within 48 hours of payout" |
| AC5 | Admin reviews flagged pattern | Investigation tools available | Can view: member relationship graph, share movement timeline, contribution/payout history, communication logs |

---

### US 6.7: Manage Share-Related Refunds and Adjustments

| Story ID | MCS-US047 | Priority | P1 - High | Story Points | 5 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a platform administrator, I want to process refunds and adjustments for multi-share disputes, so that I can resolve issues fairly while maintaining accurate accounting.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | Member was incorrectly charged for 3 shares instead of 2 | I initiate adjustment | Adjustment wizard shows: original charge, correct charge, difference, refund method options |
| AC2 | I process partial refund | Refund executed | Member receives refund; circle pool adjusted; all affected calculations recalculated; audit trail created |
| AC3 | Adjustment affects already-disbursed payout | Impact analysis shows | "This adjustment affects [Recipient]'s payout by CHF -50. Options: Adjust next payout / Request return / Absorb difference" |
| AC4 | I need to reverse a share allocation | Reversal wizard opens | Shows: current state, proposed reversal, members affected, required notifications, confirmation checklist |
| AC5 | Multiple adjustments needed for same circle | Batch processing available | Can queue multiple adjustments; preview combined impact; execute atomically |

---

### US 6.8: Generate Multi-Share Risk Assessment Report

| Story ID | MCS-US048 | Priority | P1 - High | Story Points | 5 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a platform administrator, I want to generate risk assessment reports for multi-share activity, so that I can proactively identify and mitigate potential issues before they escalate.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I request risk assessment report | Report generates | Sections: High-concentration circles, Members with high total shares, Circles approaching share limits, Default risk analysis |
| AC2 | Report identifies high-risk circle | Risk details shown | Shows: share distribution, member Trust Scores, payment history, emergency fund adequacy, recommended actions |
| AC3 | I want to see default probability | Predictive analysis displays | "Members with 4+ shares have 2.3x higher default probability. Current exposure: CHF 125,000 across 15 members" |
| AC4 | Report includes trend analysis | Trends section shows | Month-over-month: share request volume, approval rate, default rate by share tier, emergency fund utilization |
| AC5 | I need to share report with compliance team | Export options available | PDF with executive summary, detailed appendix; scheduled automated delivery option |

---

## 10. Epic 7: Multi-Share Education & Onboarding

| Epic ID | MCS-E007 |
|---------|----------|
| Epic Name | Multi-Share Education & Onboarding |
| Business Goal | Ensure members understand multi-share mechanics before committing, reducing support tickets and disputes |
| Success Metric | 95% quiz completion rate for multi-share members; 50% reduction in multi-share related support tickets |
| Primary Stakeholder | Verified Circle Member |

---

### US 7.1: Complete Multi-Share Education Module

| Story ID | MCS-US049 | Priority | P1 - High | Story Points | 5 |
|----------|-----------|----------|-----------|--------------|---|

**User Story:** As a verified circle member requesting multiple shares for the first time, I want to complete a brief educational module, so that I fully understand my increased commitment and responsibilities.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I request 2+ shares for the first time ever | Request flow begins | "Multi-Share Introduction" module launches (skippable for returning multi-share members) |
| AC2 | Module starts | Content displays | Interactive slides covering: share concept, contribution scaling, payout calculation, responsibilities, risks |
| AC3 | I complete the module | Knowledge check appears | 5 quick questions testing understanding; must score 4/5 to proceed |
| AC4 | I fail knowledge check | Retry offered | "Review these topics and try again" with links to specific slides; unlimited retries |
| AC5 | I pass knowledge check | Completion recorded | Badge: "Multi-Share Certified" added to profile; can proceed with share request; never required to retake |

---

### US 7.2: View Multi-Share Scenario Simulator

| Story ID | MCS-US050 | Priority | P2 - Medium | Story Points | 5 |
|----------|-----------|----------|-------------|--------------|---|

**User Story:** As a potential multi-share member, I want to simulate different share scenarios with real numbers, so that I can visualize the impact on my finances before committing.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I'm considering multi-share participation | I access "Share Simulator" | Interactive tool with sliders for: base amount, share count, circle size, cycle frequency |
| AC2 | I set my parameters | Simulation runs | Visual timeline shows: monthly contribution dates, payout date, running balance, total contributed vs. received |
| AC3 | I want to see cash flow impact | Cash flow view displays | Monthly calendar showing: contribution debits, payout credit, net monthly impact |
| AC4 | I want to compare scenarios | Comparison mode enabled | Side-by-side view of 2-3 share configurations; highlight differences |
| AC5 | I like a scenario | Save option available | Can save scenario; if matches available circle, "Find Similar Circle" button appears |

---

### US 7.3: Receive Multi-Share Onboarding Tips

| Story ID | MCS-US051 | Priority | P2 - Medium | Story Points | 3 |
|----------|-----------|----------|-------------|--------------|---|

**User Story:** As a new multi-share member, I want to receive contextual tips during my first multi-share cycle, so that I successfully navigate my increased commitment.

**Acceptance Criteria:**

| # | Given | When | Then |
|---|-------|------|------|
| AC1 | I'm in my first cycle with 2+ shares | First contribution approaches | Tip notification: "Remember, your contribution is CHF X (Y shares). Consider setting up auto-pay for peace of mind." |
| AC2 | I make my first multi-share payment | Payment completes | Celebration + tip: "Great job! You've completed your first multi-share contribution. Your payout will be Y times larger!" |
| AC3 | Cycle 3 begins | Checkpoint tip appears | "You're doing great with your multi-share commitment! Quick check: Is this amount still comfortable? [Adjust Shares]" |
| AC4 | My payout approaches | Preparation tip shows | "Your multi-share payout of CHF X is coming in Y days! Make sure your bank details are up to date." |
| AC5 | I've completed first multi-share circle | Graduation message | "Congratulations on completing your first multi-share circle! Your reliability has boosted your Trust Score by Z points." |

---

## 11. User Story Summary Table

| Epic | Story ID | Story Name | Priority | Points | Status |
|------|----------|------------|----------|--------|--------|
| E001 | MCS-US001 | Enable Multi-Share Option During Circle Creation | P0 | 5 | Draft |
| E001 | MCS-US002 | Set Maximum Shares Per Member Limit | P0 | 3 | Draft |
| E001 | MCS-US003 | Configure Share Request Approval Mode | P0 | 3 | Draft |
| E001 | MCS-US004 | View Multi-Share Impact Calculator | P1 | 5 | Draft |
| E001 | MCS-US005 | Edit Multi-Share Settings Before Circle Starts | P1 | 3 | Draft |
| E001 | MCS-US006 | View Circle Terms with Multi-Share Details | P0 | 3 | Draft |
| E001 | MCS-US033 | Configure Share Lock Period | P1 | 3 | Draft |
| E001 | MCS-US034 | Set Minimum Share Holding Period | P2 | 3 | Draft |
| E002 | MCS-US007 | Request Additional Shares in Circle | P0 | 5 | Draft |
| E002 | MCS-US008 | Approve/Reject Share Requests (Organizer) | P0 | 5 | Draft |
| E002 | MCS-US009 | Cancel Pending Share Request | P1 | 2 | Draft |
| E002 | MCS-US010 | Request Share Reduction | P1 | 5 | Draft |
| E002 | MCS-US011 | View Share Allocation History | P2 | 3 | Draft |
| E002 | MCS-US012 | Receive Share Request Notifications | P0 | 3 | Draft |
| E002 | MCS-US035 | Join Share Waitlist | P1 | 5 | Draft |
| E002 | MCS-US036 | Transfer Shares to Another Member | P2 | 8 | Draft |
| E002 | MCS-US037 | Request Emergency Share Reduction | P1 | 5 | Draft |
| E003 | MCS-US013 | Calculate Contribution Amount Based on Shares | P0 | 5 | Draft |
| E003 | MCS-US014 | Display Contribution Amount with Share Breakdown | P0 | 3 | Draft |
| E003 | MCS-US015 | Process Multi-Share Payment | P0 | 8 | Draft |
| E003 | MCS-US016 | Generate Multi-Share Contribution Receipt | P1 | 3 | Draft |
| E003 | MCS-US017 | Handle Multi-Share Contribution Reminders | P0 | 3 | Draft |
| E003 | MCS-US038 | Set Up Graduated Auto-Pay for Multi-Share | P2 | 5 | Draft |
| E003 | MCS-US039 | View Multi-Share Payment Comparison | P2 | 3 | Draft |
| E004 | MCS-US018 | Calculate Payout Amount Based on Shares | P0 | 8 | Draft |
| E004 | MCS-US019 | Configure Payout Order for Multi-Share Members | P0 | 8 | Draft |
| E004 | MCS-US020 | View Payout Projection with Share Details | P1 | 5 | Draft |
| E004 | MCS-US021 | Process Multi-Share Payout | P0 | 8 | Draft |
| E004 | MCS-US022 | Generate Multi-Share Payout Receipt | P1 | 3 | Draft |
| E004 | MCS-US023 | Handle Multi-Share Default Scenarios | P0 | 8 | Draft |
| E004 | MCS-US040 | Request Payout Position Swap | P2 | 5 | Draft |
| E004 | MCS-US041 | Configure Payout Acceleration for Multi-Share | P1 | 5 | Draft |
| E005 | MCS-US024 | View Circle Share Distribution | P1 | 5 | Draft |
| E005 | MCS-US025 | View Organizer Analytics for Multi-Share Circles | P1 | 5 | Draft |
| E005 | MCS-US026 | View Personal Multi-Share Summary | P1 | 3 | Draft |
| E005 | MCS-US027 | Export Multi-Share Transaction History | P2 | 3 | Draft |
| E005 | MCS-US028 | View Real-Time Circle Pool Status | P1 | 5 | Draft |
| E005 | MCS-US042 | View Share Concentration Alerts | P1 | 3 | Draft |
| E005 | MCS-US043 | Compare Multi-Share Performance Across Circles | P2 | 5 | Draft |
| E005 | MCS-US044 | View Multi-Share Impact on Trust Score | P1 | 3 | Draft |
| E006 | MCS-US029 | Configure Platform-Wide Multi-Share Limits | P0 | 5 | Draft |
| E006 | MCS-US030 | Monitor Multi-Share Platform Metrics | P1 | 5 | Draft |
| E006 | MCS-US031 | Handle Multi-Share Dispute Resolution | P1 | 5 | Draft |
| E006 | MCS-US032 | Generate Multi-Share Compliance Reports | P1 | 5 | Draft |
| E006 | MCS-US045 | Configure Trust Score Requirements for Share Tiers | P0 | 5 | Draft |
| E006 | MCS-US046 | Detect and Flag Suspicious Share Patterns | P0 | 8 | Draft |
| E006 | MCS-US047 | Manage Share-Related Refunds and Adjustments | P1 | 5 | Draft |
| E006 | MCS-US048 | Generate Multi-Share Risk Assessment Report | P1 | 5 | Draft |
| E007 | MCS-US049 | Complete Multi-Share Education Module | P1 | 5 | Draft |
| E007 | MCS-US050 | View Multi-Share Scenario Simulator | P2 | 5 | Draft |
| E007 | MCS-US051 | Receive Multi-Share Onboarding Tips | P2 | 3 | Draft |

---

## 12. Story Points Summary

| Epic | Epic Name | Stories | Total Points |
|------|-----------|---------|--------------|
| E001 | Multi-Share Circle Configuration | 8 | 28 |
| E002 | Share Request & Allocation | 9 | 41 |
| E003 | Multi-Share Contribution Processing | 7 | 30 |
| E004 | Multi-Share Payout Processing | 8 | 50 |
| E005 | Multi-Share Dashboard & Reporting | 8 | 32 |
| E006 | Platform Administration & Compliance | 8 | 43 |
| E007 | Multi-Share Education & Onboarding | 3 | 13 |
| **Total** | | **51** | **237** |

---

## 13. Priority Breakdown

| Priority | Stories | Points | Percentage |
|----------|---------|--------|------------|
| P0 - Critical | 18 | 102 | 43% |
| P1 - High | 22 | 91 | 38% |
| P2 - Medium | 11 | 44 | 19% |
| **Total** | **51** | **237** | **100%** |

---

## 14. INVEST Quality Validation Summary

All user stories in this document have been validated against the INVEST criteria:

| Criteria | Validation |
|----------|------------|
| **Independent** | Stories can be developed in any order without strict dependencies within each epic |
| **Negotiable** | Implementation details are flexible; stories capture intent, not specific UI or technical implementation |
| **Valuable** | Each story delivers clear value to at least one stakeholder type |
| **Estimable** | Scope is clear enough for team to estimate effort; story points assigned |
| **Small** | Stories fit within a single sprint iteration (2-8 points each) |
| **Testable** | Acceptance criteria in Given-When-Then format define clear pass/fail conditions |

---

## 15. Document Control

| Field | Value |
|-------|-------|
| Version | 1.1 |
| Status | Final - Approved |
| Author | Senior AI Product Manager |
| Owner | Mafao Sarl Product Team |
| Created | January 2026 |
| Updated | January 2026 |
| Next Review | July 2026 |

---

*End of Document*
