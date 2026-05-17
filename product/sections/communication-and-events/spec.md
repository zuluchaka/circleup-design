# Communication & Events Specification

## Overview

Communication & Events is the **collaboration layer** of CircleUp's V1.9 MVP — the unified inbox, conversation threads, announcements, calendar of events, agendas, minutes, attendance, voting, surveys, and translations. V1.9 promotes this section from a single "messages" surface into a full coordination workbench: associations and circles can prospect, RSVP, run live meetings with quorum tracking, record minutes with review/approval workflow, capture votes, and run multi-language event content with translation editing.

This section adopts the **Associations stacked-card layout pattern** (sticky header + stats grid + filter chips + stacked cards) across every screen and is one of the surfaces explicitly restyled in V1.9.

## User Flows

### Inbox & Conversations
- **Inbox** — Unified list of conversations, announcements, RSVPs, votes-needed, with unread badges and notification preferences.
- **Conversations / Chat View** — Threaded DMs and group threads with member roster; supports attachments and replies.
- **Notification Preferences** — Per-channel mute/notify settings (in-app, email, push, native mobile push via Capacitor).

### Announcements
- **Announcement Composer** — Compose, schedule, target (all members / role / circle); supports translations.
- **Announcements (feed)** — Pinned + recent announcements with read-receipt tracking and edit/delete (organizer).
- **Communication Templates** — Reusable templates for recurring messages (welcome, dues-due, vote-now).

### Events — discovery & scheduling
- **Events Dashboard** — Top-level event hub with upcoming, past, prospecting tabs.
- **Events Calendar / Consolidated Calendar** — Single calendar across all the user's circles + associations; conflict awareness.
- **Recurring Event Setup** — Weekly / monthly / custom rules with end-date or count.
- **Conflict Checker** — Detects scheduling collisions across circles and surfaces resolution suggestions.
- **Event Translation Editor** — Edit event title/description in multiple languages (EN/FR/DE/IT/PT).

### Events — operations
- **Event Creator / Event Editor** — Full event form with type, location, attendees, agenda, attachments.
- **Event Details** — Member-facing event page with RSVP, agenda preview, location map.
- **Meeting RSVP / RSVP Dashboard** — RSVP responses (yes/no/maybe) per event and per member, with organizer view.
- **Live Meeting Tracker** — In-meeting view with attendance check-in, quorum indicator, minute notes, vote capture.
- **Quorum Indicator** — Live count vs. required quorum threshold with status color.
- **QR Check-in** — Members scan QR to mark attendance at in-person meetings.
- **Waitlist Manager** — Capacity-constrained events with waitlist and auto-promote.

### Agendas & minutes
- **Agenda Editor / Agenda View** — Per-event agenda with ordered items, time allocation, presenter assignment, doc attachments.
- **Minutes Editor** — Capture decisions, action items, votes, attendance during/after meeting.
- **Minutes Review** — Multi-stage approval (secretary draft → president approval → publish).
- **Minutes View** — Published, read-only minutes with download/share.

### Attendance
- **Attendance Sheet** — Per-event sheet with check-in toggles, late/excused flags, notes.
- **Attendance History** — Per-member historical attendance with reliability score.
- **Attendee Tracker** — Real-time attendee list during a live meeting.
- **Circle Attendance Patterns** — Pattern analysis across circles for an organizer dashboard.
- **Past Events View** — Searchable archive of past events with minutes, attendance, decisions.

### Voting & surveys
- **Vote Recorder** — Capture votes during meetings (motion title, in-favor / against / abstain, weighted by share where applicable).
- **Survey Builder / Survey Response** — Async surveys outside meetings; multiple-choice, free-text, single/multi-select.

### Prospecting (new in V1.9)
- **Prospecting Dashboard** — Pipeline of prospective members and outreach events.
- **Prospecting Event Creator** — Create open events for prospects (e.g., info session) with conversion tracking.

### Admin
- **Admin Events Overview** — Platform-staff view of events across associations with flags and moderation actions.
- **Event Notification Config** — Configure reminder schedules and channels for an event class.
- **Event Gallery** — Visual gallery of past event photos.
- **Circle Event Manager** — Per-circle event configuration shortcut.

## UI Requirements

### Canonical layout
Associations stacked-card pattern throughout — sticky header with title + back + actions; horizontal 2–5 stats grid; filter chip row; stacked content cards (`rounded-xl bg-white dark:bg-slate-900 border …`); mobile collapses stats 2-up and pins primary CTAs.

### Notable screens
- **Inbox** — Unified inbox-style list with type icons (DM / announcement / RSVP / vote), unread badges, search and filter chips by type and circle/association.
- **Live Meeting Tracker** — Two-pane on desktop (agenda + minutes), single-pane on mobile with bottom-pinned vote/attendance/quorum controls; sticky quorum-indicator chip.
- **Events Calendar** — Month/week/day toggle, color-coded by source (circle / association / federation), conflict markers.
- **Agenda / Minutes editors** — Block-based editor with reorderable items, vote-capture inline blocks, attendees panel.
- **Vote Recorder** — Motion card + voter list with weighted vote bar (when multi-share enabled).
- **Survey Builder** — Drag-add questions, branching, translation toggle per question.
- **Prospecting Dashboard** — Funnel chart + outreach list + conversion metrics.
- **QR Check-in** — Full-screen camera/scanner view; works inside Capacitor shell using native camera.

### Mobile & platform
- Capacitor-aware: native push for RSVP reminders, native camera for QR check-in, native calendar export, native share for minutes/PDF.
- Mobile-first responsive; all editors collapse to single column with progressive disclosure.

## Configuration

- shell: true
