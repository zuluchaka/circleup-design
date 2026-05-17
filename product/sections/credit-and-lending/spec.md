# Credit & Lending Specification

## Overview
Credit & Lending enables CircleUp members to access credit products built on their ROSCA participation history. Members can request payout advances, build and view their CircleUp credit score, apply for personal loans backed by circle participation, and report positive payment history to credit bureaus—bridging community savings to formal financial services.

## User Flows

### Member Credit Score & Education
- View CircleUp credit score (0-1000) with transparent factor breakdown on dashboard
- Use credit score simulator to see how actions (on-time payments, joining circles) affect score
- Access personalized credit-building tips and educational content
- Check pre-qualification for available products without hard credit inquiry

### Payout Advances
- Request advance on upcoming payout with eligibility check based on contribution history
- View advance amount limits, interest/fees disclosure, and instant decision
- Set up auto-repayment from future payout or manual repayment schedule
- Use early repayment calculator to see interest savings

### Personal Loans
- Apply for personal loans backed by circle participation history
- Upload supporting documents and track application status
- View repayment schedule with amortization, principal/interest breakdown
- Request loan guarantor/co-signer from trusted circle members
- Refinance existing loans at better rates as credit score improves
- Request payment restructuring during financial hardship

### Collective Lending
- Circle proposes group lending to help members with larger expenses
- Members vote on loan requests within the circle
- Collective guarantee mechanism with repayment back to circle fund

### Credit Bureau & Documentation
- Opt-in to credit bureau reporting to build external credit history
- Track credit-building progress and see reporting status
- Export loan documentation for external credit applications
- Receive partner bank introductions based on credit performance

### Platform Operator (Admin)
- Monitor loan portfolio risk with real-time dashboards
- View early warning indicators and default predictions
- Manage collection workflows and write-off procedures

## UI Requirements
- Credit score prominently displayed with circular gauge visualization
- Factor breakdown showing payment history (40%), verification (20%), tenure (15%), engagement (10%), network (10%), external (5%)
- Pre-qualification cards showing available products with estimated terms
- Advance request flow with clear eligibility criteria and instant approval/decline
- Loan application wizard with document upload and status tracking
- Repayment schedule table with upcoming payment highlighted
- Credit score simulator with sliders/toggles for "what-if" scenarios
- Auto-repayment toggle with source selection (from payout vs. linked payment method)
- Guarantor request flow with member search and invitation
- Progress indicators for credit bureau reporting and credit-building goals
- Educational content cards with actionable tips
- Admin dashboard with portfolio metrics, risk indicators, and collection queues

## Configuration
- shell: true
