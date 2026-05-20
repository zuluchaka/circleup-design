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

export type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  accent: string;
  price: number;
  rsvp: { yes: number; maybe: number; no: number };
  yourRsvp: RsvpStatus | null;
  bucket: "Today" | "This week" | "Later" | "Past";
  description: string;
};

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
