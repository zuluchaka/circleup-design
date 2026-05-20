# Section 19 — Onboarding Checklist  (CM-only)

## Overview

An **Onboarding Checklist** is the 5-step playbook a Circle Manager runs through immediately after a **Business Relationship** is activated (Section 17). It tracks the operational readiness of a newly-signed association so that — when 100% complete — the association is fully onboarded and the first billing cycle is live.

This section is **gated** the same way as Section 17: only Mafao employees with an active `CircleManagerProfile` see it. One checklist exists per BR, created automatically when the contract is signed (CM-US005).

## Screens

| Slug | Purpose |
| --- | --- |
| `checklist` | One BR's onboarding view: hero progress, escalation banner, step-indicator dots, 5 step cards (each individually completable with on-behalf consent), audit trail. |

(Future: `templates` — admin-side editing of the default checklist; `bulk` — CM-side view across all in-flight onboardings with escalation sorting.)

## UI Requirements

- **Hero hierarchy**: indigo gradient for in-progress / escalated; emerald gradient when 100% complete. The state shift is celebratory and gives the CM a clear "done" moment.
- **Big progress** in the hero: `N/5 STEPS` label + `XX%` numeral + filled bar (amber fill in progress, emerald when complete). The percentage is the headline number.
- **Escalation banner** below the hero when applicable: amber for 48h+, red for 7d+. The label reads "Behind schedule" or "Escalated".
- **Step indicator card**: 5 numbered dots connected by lines. Done = green ✓, in-progress = blue numbered, pending = grey numbered. Lives just below banners.
- **Step cards** stacked vertically: per-step icon (Building2 / Banknote / Receipt / Users / CircleDot), label, description, status row. When completed: shows `✓ {completedBy} · {relative time}`. When pending: a primary "Complete" pill button on the right.
- **Inline complete form**: tapping "Complete" expands the card with an "On behalf of president" toggle. When on-behalf is on, a consent-note textarea appears and the Mark Complete CTA disables until non-empty. This implements CM-US005's consent-tracking requirement.
- **Audit trail card** at the bottom: lists every on-behalf action with step, recorder, relative time, and italicised consent note.
- **Success state**: green hero, emerald success banner ("Association onboarded · all 5 steps complete · first billing cycle live"), all step cards locked (no Complete buttons).
- **Dark mode**: gradient + soft-bg tokens already adapt; step `successSoft` background on completed cards keeps visual hierarchy.

## Data Shape

The checklist carries: identity (`id`, `brId`, `contractReference`), state (`status`, `escalationLevel`, `completionPercentage`), `steps` keyed by `OnboardingStepKey` (5 steps), and an append-only `completedOnBehalf` audit trail. See `types.ts` and `data.json` for two sample checklists:
- `ob-br3` — 60% complete, amber escalation, one on-behalf action recorded (the rich demo case)
- `ob-br1` — 100% complete, no on-behalf entries (the success case)

For BRs without a checklist in fixtures, the screen synthesises a fresh 0% checklist on the fly so any BR id can be opened.

## Integration

- **From BR detail (Section 17)** → future link/CTA: when checklist exists and is in progress, surface a banner "Onboarding 60% complete · 3/5 steps done" routing to `/business-relationships/[id]/onboarding`.
- **From the Activate sheet** (Section 17, list cards or detail) → on confirm, the CM is taken straight to the onboarding screen for the freshly-activated BR.
- **Step completion** triggers Rails-side side effects in production:
  - `account_activation` → `AssociationAccount.provision_for_association!` (Section 18 — actually already wired by activate, this is more of a verify step)
  - `dues_config` → AssociationDuesConfig record persisted
  - `member_invitations` → triggers invite emails via `DuesMailer`
  - `first_circle` → routes to the ROSCA new-circle wizard (Section 3)
- **100% completion** → flips the association from `migrating` to `active` (per Section 1 spec) and unlocks all member-facing surfaces.

## Access Control (RBAC)

- **Circle Manager**: full read + write. On-behalf actions are audit-logged with consent notes.
- **President**: read-only access to their own onboarding (future surface, not in scope here).
- **Members**: no access.

## Roadmap Anchors

- V1.1 — CM-US005 — Done in Rails: 5-step wizard, complete-on-behalf with consent, escalation at 48h (amber) / 7d (red), 100% completion activates association.
- This mobile section mirrors `OnboardingChecklistView.tsx` from `app/javascript/components/b2b/` with a mobile-native single-screen pattern (inline expand-to-complete instead of modal).
