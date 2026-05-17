# Credit & Lending Specification

## Overview

Credit & Lending is the **member-credit layer** of CircleUp's V1.9 MVP — collective loans backed by association funds, individual credit-building activities, payout advances against future ROSCA payouts, a personal credit-score dashboard, and a portfolio dashboard for organizers/treasurers. The section integrates with rosca-circles (payout advances) and treasury-and-funds (collective-loan funding), and is gated by Trust Score and association tier.

## User Flows

- **Loan Center** — Member-facing hub: my active loans, available loan products (personal, collective, payout-advance), loan history.
- **Loan Applications** — Application form with loan type, amount, term, purpose; eligibility check against Trust Score, dues status, KYC level.
- **Payout Advances** — Specialized form for requesting early access to a future ROSCA payout; shows fee, repayment schedule, impact on payout date; cross-links to rosca-circles.
- **Collective Lending** — Association-funded loans to members: governance approval flow, collateralisation rules, repayment tracking.
- **Credit Building** — Optional activities to improve credit score (regular savings deposits, on-time dues, financial literacy modules); progress tracker.
- **Credit Score Dashboard** — Personal credit score (separate from Trust Score), factor breakdown, history, recommendations for improvement.
- **Portfolio Dashboard** — Organizer/treasurer view of all loans across the association: outstanding balance, performing/at-risk/default counts, recovery actions.

## UI Requirements

- Adopts Associations stacked-card layout pattern.
- **Loan Center**: stats hero (Active Loans / Total Borrowed / Available Limit / Credit Score), loan-product cards with eligibility chip, my-loans list.
- **Loan Applications**: multi-step form (Type → Details → Review → Submit) with eligibility validation inline.
- **Payout Advances**: schedule-impact visualization (before/after payout date), fee breakdown, "Request advance" CTA.
- **Collective Lending**: association-loan request flow, governance integration (proposal → vote → disbursement), collateral form.
- **Credit Building**: activity cards with progress bars, points/level system, milestone celebrations.
- **Credit Score Dashboard**: large gauge, factor rows, trend sparkline, action recommendations.
- **Portfolio Dashboard**: stats hero (Outstanding / Performing / At-Risk / Defaulted), loan table with status chips, recovery action menu.

### Mobile & platform
- Mobile-first; loan applications support saving as draft, native file-upload for supporting docs (KYC, payslip).
- Disbursements use the same payment-mode rules as rosca-circles (Stripe + Twint where eligible).

## Configuration

- shell: true
