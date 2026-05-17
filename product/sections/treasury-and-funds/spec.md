# Treasury & Funds

Multi-fund accounting with audit trails, welfare and mutual aid fund management, and application workflows for fund requests.

---

## Shell Configuration

- **Display Mode:** Inside App Shell
- **Navigation Label:** Treasury
- **Icon Suggestion:** Landmark (bank/treasury icon)

---

## Overview

The Treasury & Funds section provides comprehensive financial management capabilities for the CircleUp platform. It enables treasurers to monitor fund positions in real-time, ensures segregated accounting per circle, supports multi-currency operations, and provides complete audit trails for regulatory compliance.

This section serves multiple user roles:
- **Treasurers** managing day-to-day fund operations
- **Members** requesting emergency fund disbursements
- **Auditors** reviewing financial records
- **Platform administrators** viewing aggregated portfolio positions

---

## Screen Designs

### 1. Treasury Dashboard

**Purpose:** Real-time overview of fund positions across all circles a user manages or participates in.

**Key Elements:**
- Total portfolio value with trend indicator
- Fund breakdown by category (contributions, payouts pending, emergency fund, investments)
- Pending transactions requiring action
- Cash flow summary (inflows vs outflows, 30-day view)
- Quick actions: Transfer, Reconcile, Generate Report

**User Story Reference:** US-3.2, US-3.8

---

### 2. Circle Fund Detail

**Purpose:** Detailed view of a single circle's segregated fund account.

**Key Elements:**
- Circle identification header with fund status badge
- Current balance with available vs held amounts
- Transaction history with filters (date range, type, status)
- Segregation indicator showing isolation from other circles
- Fund allocation breakdown (pie chart)
- Export options for statements

**User Story Reference:** US-3.1, US-3.6

---

### 3. Transaction Ledger

**Purpose:** Comprehensive financial record for audit and compliance purposes.

**Key Elements:**
- Searchable transaction table with columns: Date, Type, Description, Amount, Balance, Status
- Advanced filters: transaction type, date range, member, status
- Batch export (CSV, PDF)
- Audit trail details on row expansion (who, when, what changed)
- Reconciliation status indicators
- Print-friendly view option

**User Story Reference:** US-3.6, US-3.7

---

### 4. Reconciliation Console

**Purpose:** Daily automated reconciliation review and manual adjustment interface.

**Key Elements:**
- Reconciliation summary cards (matched, unmatched, pending review)
- Discrepancy list with severity indicators
- Side-by-side comparison view (expected vs actual)
- Resolution workflow (approve match, flag for review, manual adjust)
- Historical reconciliation reports
- Automated reconciliation schedule settings

**User Story Reference:** US-3.7

---

### 5. Emergency Fund Panel

**Purpose:** Manage emergency fund requests and voting within a circle.

**Key Elements:**
- Emergency fund balance and utilization rate
- Active request cards with voting progress
- Request form: amount, reason, supporting documents
- Voting interface: approve/deny with optional comment
- Request history with outcomes
- Fund replenishment settings

**User Story Reference:** US-3.5

---

### 6. Investment Manager

**Purpose:** Configure and monitor low-risk investment allocations for idle funds.

**Key Elements:**
- Investment portfolio summary with current yield
- Available investment instruments (money market, T-bills, etc.)
- Allocation configuration sliders
- Performance charts (returns over time)
- Risk indicator badges
- Liquidity timeline showing when funds are available

**User Story Reference:** US-3.3

---

### 7. Multi-Currency Settings

**Purpose:** Configure payout currency preferences and view exchange rates.

**Key Elements:**
- Supported currencies list with current exchange rates
- Default currency selector per circle
- Payout preference configuration (fixed currency vs floating)
- Exchange rate alerts setup
- Currency conversion preview calculator
- Historical exchange rate chart

**User Story Reference:** US-3.4

---

### 8. Audit Report Generator

**Purpose:** Generate comprehensive financial reports for auditors and regulators.

**Key Elements:**
- Report type selector (annual summary, transaction detail, reconciliation, compliance)
- Date range picker
- Circle/fund selector (single, multiple, all)
- Report preview pane
- Export formats (PDF, Excel, CSV)
- Scheduled report configuration
- Report history with download links

**User Story Reference:** US-3.6

---

## Data Entities

This section primarily interacts with:

- **Fund** — Segregated account for a circle with balance and transaction history
- **Transaction** — Individual financial movement (contribution, payout, transfer, fee)
- **ReconciliationRecord** — Daily reconciliation results and discrepancies
- **EmergencyFundRequest** — Member request for emergency disbursement
- **EmergencyFundVote** — Member vote on a pending request
- **Investment** — Allocation of idle funds to investment instruments
- **CurrencyPreference** — User/circle currency and payout settings
- **AuditReport** — Generated compliance report with metadata

---

## Interactions & Flows

### View Fund Position
1. User navigates to Treasury Dashboard
2. System displays aggregated portfolio value
3. User clicks on specific circle card
4. System shows Circle Fund Detail with full breakdown

### Daily Reconciliation Review
1. System runs automated reconciliation at configured time
2. Treasurer receives notification of results
3. Treasurer opens Reconciliation Console
4. Reviews any discrepancies flagged
5. Approves matches or flags for manual review
6. System updates reconciliation status

### Emergency Fund Request
1. Member opens Emergency Fund Panel
2. Clicks "Request Funds"
3. Fills amount, reason, uploads supporting documents
4. Submits request to circle
5. Other members receive voting notification
6. Members cast votes (approve/deny)
7. Upon reaching threshold, funds disbursed or request denied
8. All parties notified of outcome

### Generate Audit Report
1. Auditor opens Audit Report Generator
2. Selects report type and parameters
3. Previews report content
4. Exports in required format
5. Report logged to history for future reference

### Configure Investment Allocation
1. Treasurer opens Investment Manager
2. Reviews available instruments and current yield
3. Adjusts allocation sliders
4. System shows projected returns
5. Confirms changes
6. System reallocates funds according to new configuration

---

## States & Edge Cases

- **Empty Fund:** New circle with no contributions yet — show onboarding prompt
- **Reconciliation Mismatch:** Highlight discrepancies prominently, block certain operations until resolved
- **Pending Emergency Request:** Show countdown timer if voting has deadline
- **Insufficient Emergency Fund:** Disable request submission, show replenishment options
- **Investment Lock Period:** Show when funds will be available for withdrawal
- **Multi-Currency Volatility:** Warn user when exchange rate has moved significantly since last check
- **Audit in Progress:** Indicate when report generation is processing for large datasets

---

## Accessibility Notes

- All financial tables support keyboard navigation
- Currency amounts announced with currency code by screen readers
- Color-coded status indicators paired with text/icon alternatives
- High contrast mode support for financial dashboards
- Transaction amounts use proper ARIA labels for clarity

---

## Design Considerations

- Use consistent number formatting (locale-aware, 2 decimal places for currency)
- Align all currency amounts to the right in tables
- Use green/red sparingly and always with secondary indicators (icons, text)
- Provide loading states for real-time data fetches
- Consider offline scenarios for mobile treasurers in areas with poor connectivity
