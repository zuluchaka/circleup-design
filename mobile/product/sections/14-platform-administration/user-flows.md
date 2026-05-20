# Section 14 — User Flows

## Flow A · Operator clears a KYC application

1. Opens `console`. Sees KYC backlog 38.
2. Taps the chip → `kyc` queue.
3. Picks the top-risk-scored applicant. Reviews ID, selfie, address.
4. Taps **Approve**. Applicant moves to Active in Section 2.

## Flow B · Support agent handles a payout dispute

1. Opens `support`. Filters Disputes.
2. Opens the **Payout mismatch** ticket.
3. Sees linked Section 3 cycle, contributor list, ledger entries.
4. Issues correction, posts thread back to member via Section 6.

## Flow C · Engineer rolls out a flag

1. Opens `flags`. Finds `multi-share-v2`.
2. Bumps cohort to 25% of Pro associations.
3. Saves with rationale note.

## Edge states

- **Frozen account**: KYC denial freezes the user and posts an audit entry.
- **Compliance review needed**: ticket auto-tagged when a member draws > CHF 5,000 in 30 days.
