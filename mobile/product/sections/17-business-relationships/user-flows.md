# Section 17 — User Flows  (CM-only)

## Flow A · CM triages portfolio on a Monday morning

1. Opens app → bottom nav lands on `Discover` by default.
2. Taps **Relationships** tab → routes to `business-relationships/list`.
3. Sees the hero: `CIRCLE MANAGER · MAF-0142 · Aminata Diallo · 7/12 circles · CHF 1'200 MRR`.
4. Glances at the metric cards: **At risk = 3** in red. Taps **Churn risk** filter chip.
5. List narrows to the 1 churn-risk BR (Filipino Community Basel, suspended, 12d grace remaining).
6. Taps **View detail** → routes to `business-relationships/[id]` showing contract terms, billing (overdue CHF 320), and lifecycle actions.
7. Taps **Initiate renewal** in the danger-zone card → snackbar "Renewal pending. Member treasurer notified." with 6-second Undo.

## Flow B · CM kicks off a new Business Relationship

1. From `list`, taps the **New Business Relationship** CTA card.
2. *(Future)* Routes to `business-relationships/new` — the 3-step wizard.
3. Step 1: pick prospect from CM pipeline OR pick an existing association without an active BR.
4. Step 2: tier (free/basic/pro) + fee agreement (percentage and/or flat).
5. Step 3: review + send for signature (creates `CmContract` with 14-day deadline).
6. On send, CM lands back on the BR list; the new BR appears at the top with **PENDING** status.

## Flow C · Activate a pending BR after the contract is signed

1. From `list`, status filter = **Pending**. One BR shows: Indian Professionals Zurich (advisory, PRO).
2. Taps the BR row → `detail`.
3. Reads contract summary, fee agreement, and onboarding readiness.
4. Taps **Activate** at the bottom of the detail.
5. Confirms → BR transitions to `active`; `AssociationAccount` auto-provisioned with 3 default fund categories. Snackbar: "BR activated. Association Account ready."
6. The Account Links card on the detail now becomes tappable, routing into the new Section 18 accounts surface.

## Flow D · Request data export before terminating

1. From `detail` on an active or suspended BR, CM scrolls to **Danger zone**.
2. Taps **Request data export** → snackbar "Export queued. Ready within 30 days." Status badge on the card flips from `not_requested` to `requested`.
3. Once ready (push notification), CM returns to `detail` → **Download export** appears.
4. After export download, CM taps **Terminate with notice** → 30-day notice scheduled. BR shows `Termination pending · ends 18 Jun 2026`.

## Flow E · Suspend with grace period

1. From `detail` on an active BR with overdue billing, CM taps **Suspend**.
2. Modal asks for reason (free text) + grace days (default 30, slider). CM confirms with reason "Unpaid invoice ×2".
3. BR transitions to `suspended`. Grace banner appears: `Grace period · 30 days remaining`.
4. Daily job (`BrExpiryJob`) decrements grace_period_end; auto-terminates on expiry.

## Error / Edge states

- **Capacity hit**: when CM is at `max_circles`, the `+ New BR` CTA disables with explainer "You're at 12/12 circles. Free a slot or request capacity increase."
- **Non-CM access**: a member who somehow lands on `/business-relationships/*` sees the access-only gate (Building2 icon + copy). Bottom-nav doesn't surface the tab in the first place for non-CMs.
- **Suspended association**: BRs in `restricted` mode show a banner explaining only `dues_collected` + `fee_payment` entries are allowed downstream.
- **Terminated BR**: detail screen shows the lifecycle history but all action buttons are disabled. A **Reassign to new CM** admin-only action is hidden from this section.
- **Network failure on activation**: optimistic toast rolls back; BR stays `pending`. CM can retry.
