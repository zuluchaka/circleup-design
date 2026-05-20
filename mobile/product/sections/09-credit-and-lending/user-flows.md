# Section 9 — User Flows

## Flow A · Member takes a payout advance

1. From hub, taps **Get advance** card (visible only when an advance is available).
2. Routes to `advance`. Sees offer: up to CHF 1,200, repaid from August payout, 1.2% fee.
3. Selects CHF 800. Reviews effective cost and disclosures.
4. Taps **Accept advance**. Confirm sheet. Confirmed.
5. Funds disbursed; banner shows next payout in August will be reduced.

## Flow B · Member applies for a personal loan

1. Opens `loan`. Step 1: amount CHF 4,000, term 12 months.
2. Step 2: use of funds — Education.
3. Step 3: reviews schedule, signs with biometric.
4. Banner: "Under review. Typical decision within 24h."

## Flow C · Member opts into bureau reporting

1. Opens `bureau`. Reads explainer.
2. Toggles **Report to TransUnion CH** on. Consent screen with plain-language summary appears.
3. Confirms. Status flips to "Reporting active."

## Edge states

- **Insufficient credit**: advance screen shows zero-eligibility with build-credit tips.
- **Active advance outstanding**: advance screen shows current advance instead of new offer.
- **Bureau partner unavailable in region**: toggle disabled with reason.
