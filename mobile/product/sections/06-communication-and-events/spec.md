# Section 6 — Communication & Events

## Overview

The two related-but-distinct streams that keep an association coordinated: **messaging** (1-1, group threads, announcements) and **events** (RSVPs, payments, check-in). The mobile app is where 80% of communication happens. Events especially benefit from on-device features (QR check-in, push reminders, calendar handoff).

## Screens

| Slug | Purpose |
| --- | --- |
| `inbox` | Unified inbox: threads + announcements + system messages. |
| `thread` | Single conversation view with sender avatars, time stamps, attachments. |
| `events` | Events list grouped Today / This week / Later. |
| `event-detail` | Event page with description, RSVP, payment, attendees. |
| `qr` | Organiser-facing QR scanner for check-in; member-facing ticket. |

## UI Requirements

- **Inbox** rows show last message preview, channel chip (Push / Email / In-app), unread badge.
- **Thread** uses bubble layout. Own messages right-aligned, primary color. Others left, surface color. System messages center, muted.
- **Events list** uses time-grouped sections. Today rows show a live "Starts in 3h" countdown.
- **Event detail** has a cover band using the event's accent colour. RSVP segmented control (Going / Maybe / No). If payment required, show a "Pay CHF 15 to confirm" CTA.
- **QR**: organiser view shows scanner area + recent check-ins count. Member view shows large QR code (1024px) with redundancy and a manual code below.
- **Composer**: announcement composer is a dedicated screen with audience picker (All / Circle / Committee / Custom), channel mix toggles (Push, Email, SMS).

## Data Shape

`Thread` / `Message` / `Announcement` for comms; `Event` / `RSVP` / `Ticket` for events. See `data.json` and `types.ts`.

## Integration

- Announcements composer integrates with **Section 1: Associations** audience definitions.
- Event RSVP payments flow to **Section 4: Treasury & Funds** (events fund).
- Check-in writes to **Section 8: Analytics & Reporting** attendance metric.
- System messages reference activities from every section (default coverage, payout, election results, etc.).
