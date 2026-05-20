# Section 2 — User Flows

## Flow A · Treasurer looks up a member before approving a welfare request

1. Opens `directory`, types "Aïssat" into search → filters to Aïssatou Dembélé.
2. Taps the row → routes to `profile`.
3. Skims Trust Score (689 — Strong), 14 on-time contributions, 0 missed.
4. Backs out, returns to the welfare approval flow in Section 4.

## Flow B · Member reviews their own Trust Score after a missed payment

1. From hub, taps their avatar in `AppHeader` → routes to own `profile`.
2. Taps the Trust badge → routes to `trust`.
3. Sees "On-time contributions" factor moved from Excellent (35/35) to Strong (28/35); explanatory tip lists "Pay back this cycle to recover."
4. Taps the tip → deep-links to Section 3 `contribute` to clear the open contribution.

## Flow C · Organiser invites 8 new members from contacts

1. Taps **Invite members** quick action on `dashboard`.
2. Routes to `invite`. Step 1: picks **Shareable link**.
3. Step 2: chooses default role **Member**; previews message; toggles "Auto-add to Welfare Booster circle".
4. Taps **Send & copy link**. Snackbar confirms; 6 of 8 contacts auto-receive an SMS; 2 fall back to a copy-link prompt.

## Edge states

- **Empty directory**: shown for new associations; CTA invites bulk-import or single invite.
- **Pending member**: cannot vote or receive payouts; profile shows a "Verification pending" banner with steps.
- **Suspended member**: profile shows red banner; Trust badge hidden; reactivation path explained.
