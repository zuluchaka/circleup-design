export type InboxKind = "thread" | "announcement" | "system";
export type RsvpStatus = "yes" | "maybe" | "no";
export type Channel = "In-app" | "Push" | "Email" | "SMS" | "Push + Email" | "System";

export type InboxItem = {
  id: string;
  kind: InboxKind;
  title: string;
  preview: string;
  at: string;
  unread: boolean;
  channel: Channel;
};

export type Message = {
  id: string;
  from: string;
  body: string;
  at: string;
  mine: boolean;
};

export type Thread = {
  id: string;
  title: string;
  messages: Message[];
};

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export type EventCategory =
  | "cultural"
  | "agm"
  | "workshop"
  | "fundraiser"
  | "meetup"
  | "info_session"
  | "religious"
  | "sport"
  | "social";

export type EventStatus = "draft" | "open" | "sold_out" | "past" | "cancelled";

export type EventLocation =
  | { kind: "in_person"; venue: string; address: string; onlineUrl: null }
  | { kind: "online"; venue: string; address: string; onlineUrl: string };

export type EventBucket = "Today" | "This week" | "Later" | "Past";

export type EventItem = {
  id: string;
  title: string;
  description: string;
  associationId: string;
  associationName: string;
  associationInitials: string;
  associationCity: string;
  secretaryId: string;
  secretaryName: string;
  secretaryTrust: number;
  secretaryHue: string;
  isPublic: boolean;
  category: EventCategory;
  tags: string[];
  date: string;
  endsAt: string;
  location: EventLocation;
  accent: string;
  price: number;
  currency: string;
  capacity: number;
  rsvp: { yes: number; maybe: number; no: number };
  checkInOpen: boolean;
  yourRsvp: RsvpStatus | null;
  status: EventStatus;
  bucket: EventBucket;
};

export type EventAttendee = {
  memberId: string;
  name: string;
  trust: number;
  hue: string | null;
  rsvp: RsvpStatus;
  rsvpAt: string;
  paid: boolean;
  checkedIn: boolean;
  isMember: boolean;
};

export type EventDetail = EventItem & {
  agenda: { id: string; time: string; label: string }[];
  attendees: EventAttendee[];
  invitationsSent: number;
  invitationsAccepted: number;
};

export type EventInvitation = {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventAccent: string;
  associationName: string;
  inviterId: string;
  inviterName: string;
  inviterRole: "Secretary" | "President" | "Member";
  inviterTrust: number;
  channel: "WhatsApp" | "SMS" | "Email" | "Push" | "In-app";
  message: string | null;
  sentAt: string;
  expiresAt: string;
  status: "pending" | "accepted" | "declined" | "expired";
};

export type CreateEventDraft = {
  title: string;
  description: string;
  associationId: string;
  category: EventCategory;
  date: string;
  startTime: string;
  endTime: string;
  locationKind: "in_person" | "online";
  venue: string;
  address: string;
  onlineUrl: string;
  capacity: number;
  price: number;
  currency: string;
  isPublic: boolean;
  audience: "public" | "all_members" | "circle" | "committee" | "custom";
  tags: string[];
  accent: string;
};

export type InviteAttendeesPanel = {
  eventId: string;
  audiences: {
    id: string;
    label: string;
    hint: string;
    estimatedReach: number;
  }[];
  channels: {
    id: "whatsapp" | "sms" | "email" | "push" | "in_app";
    label: string;
    hint: string;
  }[];
  defaultMessage: string;
};

// ---------------------------------------------------------------------------
// Announcements + QR (existing)
// ---------------------------------------------------------------------------

export type Announcement = {
  id: string;
  title: string;
  body: string;
  sentAt: string;
  sender: string;
  audience: string;
  deliveryStats: {
    push?: { sent: number; opened: number };
    email?: { sent: number; opened: number };
    sms?: { sent: number; opened: number };
  };
};

export type CheckIn = {
  eventId: string;
  expected: number;
  checkedIn: number;
  lastFive: { name: string; at: string }[];
};
