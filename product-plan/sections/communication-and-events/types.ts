// Communication & Events Types

// ============================================
// Core Enums
// ============================================

export type NotificationChannel = 'in_app' | 'email' | 'sms' | 'push' | 'whatsapp';

export type NotificationCategory =
  | 'payments'
  | 'governance'
  | 'social'
  | 'announcements'
  | 'events'
  | 'messages';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export type MessageType = 'text' | 'image' | 'file' | 'system';

export type ConversationType = 'direct' | 'group' | 'channel';

export type EventType = 'meeting' | 'celebration' | 'fundraiser' | 'workshop' | 'social' | 'other';

export type RSVPStatus = 'going' | 'maybe' | 'not_going' | 'pending';

export type TicketType = 'free' | 'member' | 'non_member' | 'vip';

export type AnnouncementStatus = 'draft' | 'scheduled' | 'published' | 'expired';

export type NotificationFrequency = 'instant' | 'daily_digest' | 'weekly_summary';

// ============================================
// User & Member References
// ============================================

export interface UserReference {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

// ============================================
// Notifications
// ============================================

export interface Notification {
  id: string;
  type: string;
  category: NotificationCategory;
  title: string;
  body: string;
  channel: NotificationChannel;
  priority: NotificationPriority;
  actionUrl?: string;
  actionLabel?: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  category: NotificationCategory;
  channels: NotificationChannel[];
  frequency: NotificationFrequency;
  enabled: boolean;
  quietHoursStart?: string; // HH:mm format
  quietHoursEnd?: string;
}

export interface NotificationGroup {
  date: string;
  notifications: Notification[];
}

// ============================================
// Messages & Conversations
// ============================================

export interface Message {
  id: string;
  conversationId: string;
  sender: UserReference;
  content: string;
  type: MessageType;
  attachment?: MessageAttachment;
  replyTo?: string;
  readBy: string[];
  createdAt: string;
  editedAt?: string;
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  size: number;
  thumbnailUrl?: string;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string;
  participants: UserReference[];
  lastMessage?: Message;
  unreadCount: number;
  pinnedAt?: string;
  mutedUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuickReply {
  id: string;
  title: string;
  content: string;
  shortcut?: string;
  isShared: boolean;
  createdBy: string;
}

// ============================================
// Announcements
// ============================================

export interface Announcement {
  id: string;
  associationId: string;
  title: string;
  content: string;
  priority: NotificationPriority;
  status: AnnouncementStatus;
  author: UserReference;
  targetAudience: AnnouncementAudience;
  requiresAcknowledgment: boolean;
  acknowledgedBy: string[];
  publishedAt?: string;
  expiresAt?: string;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementAudience {
  type: 'all' | 'roles' | 'circles';
  roles?: string[];
  circleIds?: string[];
}

export interface AnnouncementStats {
  totalRecipients: number;
  viewCount: number;
  viewRate: number;
  acknowledgedCount: number;
  acknowledgedRate: number;
  channelBreakdown: {
    channel: NotificationChannel;
    delivered: number;
    opened: number;
  }[];
}

// ============================================
// Events
// ============================================

export interface Event {
  id: string;
  associationId: string;
  title: string;
  description: string;
  type: EventType;
  startDate: string;
  endDate: string;
  timezone: string;
  location?: EventLocation;
  virtualLink?: string;
  capacity?: number;
  registrationCount: number;
  waitlistCount: number;
  ticketOptions: TicketOption[];
  coverImage?: string;
  organizer: UserReference;
  registrationDeadline?: string;
  isRecurring: boolean;
  recurringPattern?: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface EventLocation {
  name: string;
  address: string;
  city: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface TicketOption {
  id: string;
  name: string;
  type: TicketType;
  price: number;
  currency: string;
  quantity?: number;
  soldCount: number;
  description?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  user: UserReference;
  rsvpStatus: RSVPStatus;
  ticketType: TicketType;
  guestCount: number;
  guestNames?: string[];
  paymentStatus?: 'pending' | 'completed' | 'refunded';
  paymentAmount?: number;
  checkedInAt?: string;
  responses?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface EventReminder {
  id: string;
  eventId: string;
  timing: '1_week' | '1_day' | '2_hours' | '30_minutes';
  sent: boolean;
  sentAt?: string;
}

// ============================================
// Templates
// ============================================

export interface MessageTemplate {
  id: string;
  associationId?: string;
  name: string;
  category: NotificationCategory;
  subject?: string;
  content: string;
  variables: string[];
  language: string;
  isDefault: boolean;
  createdBy: UserReference;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Inbox & History
// ============================================

export interface InboxItem {
  id: string;
  type: 'notification' | 'message' | 'announcement';
  item: Notification | Message | Announcement;
  read: boolean;
  archived: boolean;
  createdAt: string;
}

export interface InboxFilters {
  type?: 'notification' | 'message' | 'announcement';
  read?: boolean;
  category?: NotificationCategory;
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
}

// ============================================
// Component Props
// ============================================

export interface InboxProps {
  items: InboxItem[];
  filters: InboxFilters;
  onFilterChange: (filters: InboxFilters) => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onItemClick: (item: InboxItem) => void;
}

export interface ConversationsListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (conversation: Conversation) => void;
  onNewMessage: () => void;
  onSearch: (query: string) => void;
}

export interface ChatViewProps {
  conversation: Conversation;
  messages: Message[];
  currentUserId: string;
  quickReplies: QuickReply[];
  onSendMessage: (content: string, type: MessageType, attachment?: File) => void;
  onReply: (messageId: string, content: string) => void;
  onReact: (messageId: string, emoji: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export interface AnnouncementsListProps {
  announcements: Announcement[];
  onAcknowledge: (id: string) => void;
  onView: (announcement: Announcement) => void;
}

export interface AnnouncementComposerProps {
  announcement?: Announcement;
  templates: MessageTemplate[];
  onSave: (announcement: Partial<Announcement>) => void;
  onPublish: (announcement: Partial<Announcement>) => void;
  onSchedule: (announcement: Partial<Announcement>, scheduledFor: string) => void;
  onCancel: () => void;
}

export interface EventsCalendarProps {
  events: Event[];
  view: 'month' | 'week' | 'list';
  selectedDate: string;
  onViewChange: (view: 'month' | 'week' | 'list') => void;
  onDateChange: (date: string) => void;
  onEventClick: (event: Event) => void;
  onCreateEvent: () => void;
}

export interface EventDetailsProps {
  event: Event;
  registration?: EventRegistration;
  attendees: EventRegistration[];
  currentUserId: string;
  onRegister: (ticketType: TicketType, guestCount: number) => void;
  onUpdateRSVP: (status: RSVPStatus) => void;
  onCancelRegistration: () => void;
  onShare: () => void;
  onAddToCalendar: () => void;
}

export interface EventCreatorProps {
  event?: Event;
  onSave: (event: Partial<Event>) => void;
  onPublish: (event: Partial<Event>) => void;
  onCancel: () => void;
}

export interface NotificationPreferencesProps {
  preferences: NotificationPreference[];
  onUpdate: (preference: NotificationPreference) => void;
  onSaveAll: () => void;
}

export interface TemplatesManagerProps {
  templates: MessageTemplate[];
  categories: NotificationCategory[];
  onSelect: (template: MessageTemplate) => void;
  onCreate: () => void;
  onEdit: (template: MessageTemplate) => void;
  onDelete: (id: string) => void;
  onDuplicate: (template: MessageTemplate) => void;
}
