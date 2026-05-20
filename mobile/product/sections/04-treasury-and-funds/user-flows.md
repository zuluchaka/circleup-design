# Section 4 — User Flows

## Flow A · Member requests welfare aid

1. From the hub, taps **Request aid** in a Section 4 entry point.
2. Routes to `request`. Step 1 (Reason): selects "Medical emergency" and writes a short note.
3. Step 2 (Amount): asks for CHF 800. Eligibility note shows max available based on Trust + tenure (CHF 1,200).
4. Step 3 (Docs): attaches a photo of the hospital bill.
5. Submits. Banner: "Request sent. 2 of 3 signers must approve."

## Flow B · Treasurer approves a request

1. Opens `approvals`, sees 3 pending requests.
2. Taps the medical one → request detail with attached doc.
3. Quorum currently 1/3. Taps **Approve**.
4. Quorum updates to 2/3. Once a 3rd signer approves, status flips to **Approved**.

## Flow C · Treasurer disburses funds

1. From `approvals`, opens a request marked **Approved**.
2. Taps **Disburse**. Picks bank account, confirms.
3. Disbursement runs. Ledger entry created in `fund-detail` view.
4. Member receives a notification + receipt.

## Edge states

- **Insufficient balance**: disbursement blocked with explainer; treasurer can move funds between funds (recorded as transfer).
- **Trust too low**: request step 2 shows the eligibility ceiling and a path to build Trust (link to Section 2 `trust`).
- **Auditor read-only**: auditor sees ledger and approvals but cannot approve/disburse.
