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
  host?: UserReference;
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
  canCreate?: boolean;
  onCreateEvent: () => void;
}

export interface EventDetailsProps {
  event: Event;
  registration?: EventRegistration;
  attendees: EventRegistration[];
  currentUserId: string;
  isPresidentOrOrganizer?: boolean;
  onRegister: (ticketType: TicketType, guestCount: number) => void;
  onUpdateRSVP: (status: RSVPStatus) => void;
  onCancelRegistration: () => void;
  onShare: () => void;
  onAddToCalendar: () => void;
  onEdit?: () => void;
  onCancelEvent?: (eventId: string) => void;
  onDuplicate?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
}

export interface EventCreatorProps {
  event?: Event;
  associationId?: string;
  token?: string;
  onSave: (event: Record<string, unknown>) => void;
  onPublish: (event: Record<string, unknown>) => void;
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

// ============================================
// Meeting & Agenda Types (E-EVT-001, E-EVT-002)
// ============================================

export type MeetingType = 'ga' | 'committee' | 'board' | 'special'
export type AgendaStatus = 'draft' | 'published' | 'in_progress' | 'completed'
export type AgendaItemType = 'info' | 'discussion' | 'vote' | 'election' | 'report'
export type AgendaItemStatus = 'pending' | 'in_progress' | 'completed' | 'skipped' | 'deferred'
export type QuorumType = 'percentage' | 'headcount'
export type VotingProcedure = 'simple_majority' | 'two_thirds' | 'unanimous'

export interface Agenda {
  id: string
  eventId: string
  meetingType: MeetingType
  quorumRequirement?: number
  quorumType: QuorumType
  votingProcedure: VotingProcedure
  templateApplied?: string
  publishedAt?: string
  status: AgendaStatus
  totalEstimatedDuration: number
  createdAt: string
  updatedAt: string
}

export interface AgendaItem {
  id: string
  title: string
  description?: string
  itemType: AgendaItemType
  presenterId?: string
  presenterName?: string
  position: number
  estimatedDurationMinutes?: number
  actualDurationMinutes?: number
  isMandatory: boolean
  legalReference?: string
  outcome?: string
  startedAt?: string
  completedAt?: string
  status: AgendaItemStatus
  documents: AgendaItemDoc[]
}

export interface AgendaItemDoc {
  id: string
  documentId: string
  documentType: 'proposal' | 'report' | 'budget' | 'attachment'
  documentName?: string
}

// ============================================
// Meeting Invitations & RSVP (E-EVT-003)
// ============================================

export type MeetingRSVPStatus = 'pending' | 'attending' | 'not_attending' | 'proxy'

export interface MeetingInvitation {
  id: string
  userId: string
  userName: string
  sentVia: 'email' | 'push'
  sentAt?: string
  rsvpStatus: MeetingRSVPStatus
  proxyToUserId?: string
  proxyToUserName?: string
  respondedAt?: string
  reminderSentCount: number
}

export interface MeetingInvitationStats {
  total: number
  attending: number
  notAttending: number
  proxy: number
  pending: number
  predictedAttendance: number
}

// ============================================
// Attendance Tracking (E-EVT-004)
// ============================================

export type AttendanceStatus = 'present' | 'absent' | 'excused' | 'proxy'
export type CheckinMethod = 'manual' | 'qr_code' | 'self_checkin'

export interface AttendanceRecord {
  id: string
  userId: string
  userName: string
  status: AttendanceStatus
  proxyForUserId?: string
  proxyForUserName?: string
  checkedInAt?: string
  checkedInVia?: CheckinMethod
  checkedOutAt?: string
  notes?: string
  markedById?: string
}

export interface QuorumStatus {
  presentCount: number
  totalMembers: number
  needed: number
  met: boolean
  percentage: number
}

// ============================================
// Meeting Minutes (E-EVT-005)
// ============================================

export type MinutesStatus = 'draft' | 'pending_review' | 'approved' | 'published'

export interface MeetingMinutesData {
  id: string
  eventId: string
  agendaId: string
  authorId: string
  authorName: string
  status: MinutesStatus
  summary?: string
  approvedById?: string
  approvedByName?: string
  approvedAt?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface MinuteItemData {
  id: string
  agendaItemId: string
  agendaItemTitle: string
  discussionNotes?: string
  decision?: string
  voteResult: { for?: number; against?: number; abstain?: number }
  actionItems: ActionItem[]
  position: number
}

export interface ActionItem {
  description: string
  assignee_id?: string
  due_date?: string
  completed?: boolean
}

export interface MinuteComment {
  id: string
  userId: string
  userName: string
  content: string
  resolved: boolean
  parentId?: string
  createdAt: string
  replies?: MinuteComment[]
}

// ============================================
// Meeting Component Props
// ============================================

export interface AgendaEditorProps {
  agenda: Agenda
  items: AgendaItem[]
  onAddItem: (item: Partial<AgendaItem>) => void
  onUpdateItem: (id: string, item: Partial<AgendaItem>) => void
  onDeleteItem: (id: string) => void
  onReorder: (itemIds: string[]) => void
  onPublish: () => void
}

export interface AgendaViewProps {
  agenda: Agenda
  items: AgendaItem[]
}

export interface LiveMeetingTrackerProps {
  agenda: Agenda
  items: AgendaItem[]
  onStartItem: (id: string) => void
  onCompleteItem: (id: string, outcome?: string) => void
}

export interface RSVPDashboardProps {
  invitations: MeetingInvitation[]
  stats: MeetingInvitationStats
  onSendReminder: (userId: string) => void
  onBulkInvite: () => void
}

export interface AttendanceSheetProps {
  attendances: AttendanceRecord[]
  quorum: QuorumStatus
  onMarkAttendance: (records: { userId: string; status: AttendanceStatus; proxyForUserId?: string }[]) => void
  onUpdateAttendance: (id: string, updates: Partial<AttendanceRecord>) => void
}

export interface MinutesEditorProps {
  minutes: MeetingMinutesData
  items: MinuteItemData[]
  agendaItems: AgendaItem[]
  onUpdateMinutes: (data: Partial<MeetingMinutesData>) => void
  onUpdateItem: (agendaItemId: string, data: Partial<MinuteItemData>) => void
  onSubmitForReview: () => void
}

export interface MinutesViewProps {
  minutes: MeetingMinutesData
  items: MinuteItemData[]
  comments: MinuteComment[]
  onComment: (content: string, parentId?: string) => void
  onResolveComment: (id: string) => void
  onDownloadPdf: () => void
}

// ============================================
// Event Surveys (M-EVT-US053)
// ============================================

export type SurveyQuestionType = 'text' | 'rating' | 'multiple_choice'
export type SurveyStatus = 'draft' | 'sent' | 'closed'

export interface SurveyQuestion {
  question: string
  type: SurveyQuestionType
  options?: string[]
}

export interface EventSurvey {
  id: string
  eventId: string
  questions: SurveyQuestion[]
  status: SurveyStatus
  sentAt?: string
  closedAt?: string
  responseCount: number
  createdAt: string
  updatedAt: string
}

export interface EventSurveyResponse {
  id: string
  userId: string
  userName: string
  answers: Record<string, string>
  submittedAt?: string
}

// ============================================
// Event Media (M-EVT-US054)
// ============================================

export type MediaType = 'photo' | 'video' | 'document'

export interface EventMediaItem {
  id: string
  eventId: string
  uploaderId: string
  uploaderName: string
  mediaType: MediaType
  caption?: string
  position: number
  fileUrl?: string
  createdAt: string
}

// ============================================
// Event Translations (M-EVT-US055)
// ============================================

export type SupportedLocale = 'de' | 'fr' | 'it' | 'en'

export interface EventTranslation {
  id: string
  eventId: string
  locale: SupportedLocale
  title: string
  description?: string
  createdAt: string
  updatedAt: string
}
