# Section 19 — User Flows  (CM-only)

## Flow A · CM resumes onboarding for an in-flight BR

1. From BR detail (Section 17) → taps the "Continue onboarding" banner.
2. Lands on `/business-relationships/br3/onboarding`.
3. Sees 60% progress, amber escalation banner "Behind schedule · 48h+".
4. Two steps done (✓ Association profile, ✓ Account activation), Dues configuration also ✓ (with on-behalf flag), Member invitations in-progress (blue dot 4), First circle pending.
5. Taps **Complete** on Member invitations → inline form expands.
6. Checks "Complete on behalf of president" → consent-note field appears.
7. Types "Confirmed by Arun on call 2026-05-19. 18 founding member emails attached.", taps **Mark complete**.
8. Step card flips green ✓; toast "Member invitations marked complete"; audit trail gains a new entry.
9. CM moves to First circle. Completes (no on-behalf). Status flips to `completed`; hero gradient turns emerald; success banner shows; first billing cycle confirmation is implicit.

## Flow B · Fresh activation enters onboarding

1. From a BR list card → taps **Activate** on a pending BR.
2. Confirms in the activate bottom sheet → BR transitions to `active`.
3. *(Future wiring)* CM is auto-routed to `/business-relationships/[id]/onboarding`.
4. The screen renders a fresh 0% checklist with all 5 steps pending and a blue indicator dot on step 1 (Association profile).

## Flow C · On-behalf with consent

1. CM taps Complete on a step the president was supposed to do.
2. Toggles "Complete on behalf of president" — the consent-note field appears.
3. The Mark Complete CTA stays disabled until the note is non-empty.
4. On confirm, the step flips green AND a new entry lands in the bottom audit-trail card with step, recorder, timestamp, and italicised note.

## Flow D · Escalation states

1. Checklist passes 48h without progress → `escalationLevel = "amber"`.
2. Amber banner appears: "Behind schedule · 48h+ · Reach out to the president to unblock the remaining steps."
3. Passes 7d → `escalationLevel = "red"`. Banner switches to red with an AlertTriangle icon.
4. CM can still complete steps in either escalated state. Escalation clears when status flips to `completed`.

## Error / Edge states

- **Completed checklist**: all step cards lock (no Complete button); hero is emerald; success banner is shown.
- **On-behalf with empty consent**: Mark Complete CTA stays disabled and visually muted.
- **BR without fixture data**: a fresh 0% checklist is synthesised so the screen always renders.
