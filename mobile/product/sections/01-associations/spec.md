# Section 1 — Associations

## Overview

An **Association** is the top-level tenant in CircleUp. Every member, circle, fund, event, and decision lives inside one. This section lets an authenticated user: see the association's hub, create a new association (from scratch or by migrating an existing one), tune settings, and brand it. The mobile experience prioritises the **organiser** flows that happen most often on-the-go: viewing the hub, taking quick actions, and resuming an in-progress migration.

## Screens

| Slug | Purpose |
| --- | --- |
| `dashboard` | Association hub: stats, quick actions, recent activity, switcher. |
| `settings` | Profile, languages, currency, fee, danger zone. |

> **Note on creation:** there is no standalone `create` or `migration` screen in this section. New associations only come into existence through a **Business Relationship** (Section 17), where step 1 of the BR creation wizard lets the Circle Manager either *pick an existing association*, *create a new one*, or *migrate one from a spreadsheet*. This reflects the business reality that every association on the platform sits under a CM contract — there is no self-serve association creation path. See `mobile/product/sections/17-business-relationships/spec.md` for the wizard details.

## UI Requirements

- **Hub header** uses the association's brand hue as a 30% tint behind the title. Avatar/initial badge appears on the left.
- **Stat strip** under the header: 4 chips (Members, Circles, Trust avg, Funds CHF). Scrolls horizontally if it overflows.
- **Quick actions** as a 2×2 grid: Add member, Start circle, New announcement, Open treasury.
- **Recent activity** is a list with member avatars, an event-type icon, time-ago. Tappable rows route deep into the relevant section.
- **Create wizard** is a single-column step list with sticky progress at the top and a sticky primary CTA at the bottom. Each step is a single ScrollView.
- **Cultural terminology step** offers presets (susu / tanda / paluwagan / tontine / custom) that pre-fill labels used across the app.
- **Migration wizard** has a long-running progress state — show estimated rows imported, errors, warnings. Use a stepped progress component (5 steps: upload → parse → validate → review → go-live). Members can pause and resume.
- **Settings** is grouped: Profile, Locale & currency, Branding, Fees & Emergency Fund, Notifications, Danger Zone. Each group is its own card.
- **All write actions** show inline confirm-and-undo (snackbar with Undo, 6s) — no destructive modals unless the action is irreversible.
- **Dark mode**: brand hue gets a darker, less-saturated treatment in dark mode (use `brandHue` + alpha overlay).

## Data Shape

The Association entity owns: identity, branding (logo, hue, terminology), locale (language, currency), fee config (Emergency Fund %), and lifecycle (active / migrating / archived). See `data.json` for a complete sample and `types.ts` for fields.

## Integration

- Add member → routes to **Section 2: Members & Trust** (`invite`).
- Start circle → routes to **Section 3: ROSCA Circles** (`circle-detail` for new circle wizard).
- Open treasury → routes to **Section 4: Treasury & Funds** (`overview`).
- New announcement → routes to **Section 6: Communication & Events** (compose modal).
- Migration "go live" → flips the association from `migrating` to `active` and unlocks all sections for members.
- Settings → Federations sub-link → routes to **Section 16: Federations** if the association is part of one.
