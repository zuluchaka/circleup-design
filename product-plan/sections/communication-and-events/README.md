# Communication & Events

## Overview

Multi-channel messaging and event management with registration and payment integration.

## User Flows

1. View unified inbox
2. Send a message
3. Create announcement
4. Create event with registration
5. Configure notification preferences

## Visual Reference

See the `.png` screenshot files in this directory for the target UI design.

## Components Provided

- `Inbox`
- `Conversations`
- `ChatView`
- `Announcements`
- `AnnouncementComposer`
- `EventsCalendar`
- `EventDetails`
- `EventCreator`
- `NotificationPreferences`
- `CommunicationTemplates`

## Data Used

See `types.ts` for complete TypeScript interface definitions.
See `sample-data.json` for example data.

## Integration Notes

- All components are props-based — they accept data and callbacks via props
- No internal state management or API calls — you provide everything
- Components support dark mode via Tailwind `dark:` variants
- Responsive design with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
