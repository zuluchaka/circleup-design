export type Cadence = "Weekly" | "Bi-weekly" | "Monthly" | "Quarterly";
export type MemberCycleStatus = "Paid" | "Due" | "Overdue" | "EF";
export type PayoutSlotStatus = "Paid" | "Upcoming" | "Projected" | "Skipped";

export type Circle = {
  id: string;
  name: string;
  contribution: number;
  currency: string;
  cadence: Cadence;
  members: number;
  cycle: number;
  cycleLength: number;
  yourStatus: MemberCycleStatus;
  yourDueAmount: number;
  nextDue: string;
  nextPayoutTo: string;
  nextPayoutAmount: number;
  nextPayoutDate: string;
  collectionRate: number;
  emergencyFund: number;
  accent: string;
};

export type RosterSlot = {
  id: string;
  name: string;
  trust: number;
  status: MemberCycleStatus;
  slot: number;
  paidAt: string | null;
};

export type PaymentMethod = {
  id: string;
  label: string;
  kind: "bank" | "card" | "wallet";
  default: boolean;
};

export type PayoutSlot = {
  cycle: number;
  to: string;
  amount: number;
  date: string;
  status: PayoutSlotStatus;
};

export type TreasurerException = {
  id: string;
  memberId: string;
  name: string;
  issue: string;
  trust: number;
};

// ---------------------------------------------------------------------------
// Phase 2 — discovery & joining
// ---------------------------------------------------------------------------

export type EligibilityStatus = "ok" | "blocker" | "warning";

export type EligibilityCheck = {
  id: string;
  label: string;
  detail: string;
  status: EligibilityStatus;
};

export type JoinEligibility = {
  circleId: string;
  canJoin: boolean;
  isFull: boolean;
  checks: EligibilityCheck[];
};

export type WaitlistEntry = {
  circleId: string;
  position: number;
  totalAhead: number;
  joinedAt: string;
  expectedPromotion: string;
  notifyOnPromotion: boolean;
};

// ---------------------------------------------------------------------------
// Phase 3 — creating & renewing
// ---------------------------------------------------------------------------

export type PayoutMethod = "fixed" | "bidding" | "random";
export type PaymentMode = "stripe_only" | "hybrid" | "manual_only";
export type Visibility = "public" | "association_only" | "private";

export type DraftCircle = {
  name: string;
  description: string;
  contribution: number;
  currency: string;
  cadence: Cadence;
  cycleLength: number;
  maxMembers: number;
  payoutMethod: PayoutMethod;
  paymentMode: PaymentMode;
  emergencyFundRate: number;
  gracePeriodDays: number;
  latePenalty: number;
  language: string;
  visibility: Visibility;
};

export type CreateAiSuggestion = {
  reason: string;
  successProbability: number;
  maxMembers: number;
  payoutMethod: PayoutMethod;
  emergencyFundRate: number;
  gracePeriodDays: number;
  latePenalty: number;
};

export type CreateTierLimit = {
  tier: "Free" | "Basic" | "Pro";
  memberLimit: number;
  current: number;
};

export type RenewalStatus = "proposed" | "voting" | "approved" | "rejected" | "cancelled" | "created";
export type MemberVote = "opt_in" | "opt_out" | "pending";

export type RenewalVoter = {
  memberId: string;
  name: string;
  trust: number;
  vote: MemberVote;
  votedAt: string | null;
};

export type RenewalProposal = {
  id: string;
  parentCircleId: string;
  parentCircleName: string;
  status: RenewalStatus;
  proposedStart: string;
  proposedContribution: number;
  proposedCurrency: string;
  proposedDuration: number;
  proposedCadence: Cadence;
  changesFromParent: string[];
  notes: string;
  votingDeadline: string;
  optInCount: number;
  optOutCount: number;
  pendingCount: number;
  requiredOptIns: number;
  voters: RenewalVoter[];
};

// ---------------------------------------------------------------------------
// Phase 4 — live cycle ops
// ---------------------------------------------------------------------------

export type CycleMemberStatus = "Paid" | "Pending" | "Failed" | "Late" | "EF";

export type CycleMember = {
  memberId: string;
  name: string;
  slot: number;
  trust: number;
  status: CycleMemberStatus;
  amount: number;
  method: string | null;
  paidAt: string | null;
  failureReason: string | null;
  retryCount: number;
};

export type CycleProgress = {
  circleId: string;
  cycle: number;
  cycleLength: number;
  dueDate: string;
  perMember: number;
  currency: string;
  expectedTotal: number;
  collectedTotal: number;
  confirmed: number;
  pending: number;
  failed: number;
  payoutRecipient: string;
  payoutAmount: number;
  payoutTriggerable: boolean;
  members: CycleMember[];
};

export type CollectionLocation = {
  id: string;
  label: string;
  hint: string;
};

export type ExceptionContext = {
  exceptionId: string;
  memberId: string;
  name: string;
  trust: number;
  issue: string;
  daysOverdue: number;
  amountDue: number;
  currency: string;
  phone: string;
  whatsapp: string;
  email: string;
  cycle: number;
  efBalance: number;
  efRemainingAfter: number;
  history: {
    paidLastCycle: boolean;
    missedCyclesYear: number;
    onTimeRate: number;
  };
};

// ---------------------------------------------------------------------------
// Phase 5 — member-action sheets
// ---------------------------------------------------------------------------

export type PositionSwapCandidate = {
  memberId: string;
  name: string;
  trust: number;
  currentSlot: number;
  cyclesAway: number;
  willingnessHint: string;
};

export type BidEntry = {
  bidderId: string;
  bidderInitial: string;
  amount: number;
  isYou: boolean;
};

export type BiddingState = {
  circleId: string;
  cycle: number;
  payoutAmount: number;
  currency: string;
  deadline: string;
  minimumBid: number;
  yourCurrentBid: number | null;
  yourMaxBid: number;
  transparencyMode: "open" | "blind";
  bids: BidEntry[];
};

export type PayoutAdvanceEligibility = {
  yourPosition: number;
  cyclesToPayout: number;
  estimatedPayoutAmount: number;
  currency: string;
  maxAdvance: number;
  cooldownDays: number;
  checks: EligibilityCheck[];
  reviewerTrustThreshold: number;
};

export type AutoPaySetup = {
  enabled: boolean;
  primaryMethodId: string;
  backupMethodId: string | null;
  nextChargeDate: string;
  nextChargeAmount: number;
  currency: string;
  scheduleNote: string;
};

// ---------------------------------------------------------------------------
// Phase 6 — health, risk & moderation
// ---------------------------------------------------------------------------

export type Trend = "up" | "down" | "flat";

export type AnalyticsMetric = {
  id: string;
  label: string;
  value: string;
  benchmark: string;
  trend: Trend;
  delta: string;
  toneHint: "good" | "bad" | "neutral";
};

export type MonthlyPoint = {
  month: string;
  collectionRate: number;
  onTimeRate: number;
};

export type ReliabilityEntry = {
  memberId: string;
  name: string;
  trust: number;
  onTimeRate: number;
  missedCycles: number;
  direction: Trend;
};

export type CircleAnalytics = {
  cycle: number;
  projectedCompletion: string;
  metrics: AnalyticsMetric[];
  monthlyTrend: MonthlyPoint[];
  topReliable: ReliabilityEntry[];
  watchList: ReliabilityEntry[];
};

export type RiskFactor = {
  id: string;
  label: string;
  weight: number;
  contribution: number;
  signal: "positive" | "negative" | "neutral";
};

export type RiskScore = {
  memberId: string;
  name: string;
  trust: number;
  score: number;
  band: "low" | "medium" | "high";
  recommendation: string;
  factors: RiskFactor[];
};

export type RiskSummary = {
  totalAssessed: number;
  averageRisk: number;
  high: number;
  medium: number;
  low: number;
  scores: RiskScore[];
};

export type DisputeStatus = "open" | "acknowledged" | "escalated" | "resolved";
export type DisputeType = "missed_payment" | "off_platform" | "conflict" | "fraud" | "other";
export type DisputePriority = "low" | "medium" | "high";

export type DisputeSummary = {
  id: string;
  title: string;
  filedBy: string;
  filedById: string;
  against: string;
  againstId: string;
  type: DisputeType;
  priority: DisputePriority;
  status: DisputeStatus;
  filedAt: string;
  lastUpdate: string;
  evidenceCount: number;
};

export type DisputeEvidence = {
  id: string;
  kind: "image" | "document" | "video" | "audio";
  label: string;
  size: string;
  uploadedAt: string;
};

export type DisputeTimelineEvent = {
  id: string;
  kind: "filed" | "acknowledged" | "evidence" | "escalated" | "comment" | "resolved";
  actor: string;
  actorRole: string;
  at: string;
  body: string;
};

export type DisputeDetail = {
  id: string;
  title: string;
  description: string;
  filedBy: string;
  filedById: string;
  against: string;
  againstId: string;
  type: DisputeType;
  priority: DisputePriority;
  status: DisputeStatus;
  filedAt: string;
  cycle: number;
  amountInvolved: number;
  currency: string;
  evidence: DisputeEvidence[];
  timeline: DisputeTimelineEvent[];
  yourRole: "filer" | "respondent" | "organizer" | "observer";
};

export type EfIntervention = {
  id: string;
  memberId: string;
  memberName: string;
  cycle: number;
  amount: number;
  paid: number;
  installments: number;
  installmentsPaid: number;
  at: string;
};

export type EmergencyFundPanel = {
  balance: number;
  currency: string;
  rate: number;
  perCycle: number;
  totalCovered: number;
  totalRecovered: number;
  activeInterventions: number;
  interventions: EfIntervention[];
};

// ---------------------------------------------------------------------------
// Phase 7 — settings & governance
// ---------------------------------------------------------------------------

export type CircleSettings = {
  status: "active" | "paused" | "completed";
  pausedSince: string | null;
  pauseReason: string | null;
  cyclesRemaining: number;
  maxExtendCycles: number;
  configuration: {
    cadence: Cadence;
    contribution: number;
    currency: string;
    payoutMethod: PayoutMethod;
    paymentMode: PaymentMode;
    visibility: Visibility;
    emergencyFundRate: number;
    gracePeriodDays: number;
    latePenalty: number;
    language: string;
  };
};

export type ManagementMember = {
  memberId: string;
  name: string;
  trust: number;
  role: "Member" | "Treasurer" | "Organizer";
  status: "active" | "suspended" | "in_arrears";
  slot: number;
  onTimeRate: number;
  joinedAt: string;
};

export type ManagementWaitlistEntry = {
  position: number;
  name: string;
  trust: number;
  joinedAt: string;
  channel: "Invite" | "Discover";
};

export type ManagementSummary = {
  members: ManagementMember[];
  waitlist: ManagementWaitlistEntry[];
  pendingInvitations: number;
  openDisputes: number;
};

export type InviteChannel = {
  id: "email" | "sms" | "whatsapp" | "qr" | "link";
  label: string;
  hint: string;
  active: boolean;
};

export type SentInvitation = {
  id: string;
  recipient: string;
  channel: "Email" | "SMS" | "WhatsApp" | "QR" | "Link";
  status: "pending" | "delivered" | "opened" | "accepted" | "declined" | "expired";
  sentAt: string;
};

export type InvitePanel = {
  channels: InviteChannel[];
  recentSent: SentInvitation[];
  qrCode: string;
  inviteLink: string;
};

export type Participant = {
  memberId: string;
  name: string;
  trust: number;
  role: "Member" | "Treasurer" | "Organizer";
  slot: number;
  status: "active" | "suspended" | "in_arrears";
  onTimeRate: number;
  cyclesPaid: number;
  missedCycles: number;
  joinedAt: string;
};

export type ShareHistoryEntry = {
  id: string;
  kind: "increase" | "decrease" | "request" | "approved" | "denied";
  cycle: number;
  newShareCount: number;
  at: string;
  note: string;
};

export type MultiSharePanel = {
  currentShares: number;
  maxShares: number;
  multiplier: number;
  baseContribution: number;
  currency: string;
  baseEfRate: number;
  pendingRequest: {
    requested: number;
    submittedAt: string;
    status: "pending" | "approved" | "denied";
  } | null;
  history: ShareHistoryEntry[];
};

export type DocumentFolder = {
  id: string;
  label: string;
  kind: "charter" | "receipts" | "statements" | "agreements" | "minutes";
  itemCount: number;
  lastUpdated: string;
};

export type CircleDocument = {
  id: string;
  folderId: string;
  label: string;
  kind: "pdf" | "image" | "spreadsheet" | "document";
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  pinned: boolean;
};

export type DocumentsPanel = {
  folders: DocumentFolder[];
  recent: CircleDocument[];
  storageUsed: number;
  storageLimit: number;
};

export type CircleInvitation = {
  id: string;
  circleId: string;
  circleName: string;
  circleAccent: string;
  contribution: number;
  currency: string;
  cadence: Cadence;
  inviterId: string;
  inviterName: string;
  inviterTrust: number;
  inviterRole: "Organizer" | "Treasurer" | "Member";
  associationName: string;
  channel: "WhatsApp" | "SMS" | "Email" | "Direct";
  message: string | null;
  sentAt: string;
  expiresAt: string;
  status: "pending" | "accepted" | "declined" | "expired";
};
