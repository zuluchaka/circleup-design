// =============================================================================
// Data Types - Governance & Voting
// =============================================================================

export type ElectionStatus = 'draft' | 'nominations' | 'voting' | 'closed' | 'certified' | 'cancelled'
export type CandidateStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn'
export type ProposalStatus = 'draft' | 'discussion' | 'voting' | 'passed' | 'rejected' | 'implemented' | 'withdrawn'
export type ProposalCategory = 'financial' | 'governance' | 'programs' | 'partnerships' | 'bylaws' | 'other'
export type CommitteeStatus = 'active' | 'inactive' | 'dissolved'
export type CommitteeRole = 'chair' | 'vice_chair' | 'member'
export type VoteChoice = 'for' | 'against' | 'abstain'
export type VotingModel = 'simple_majority' | 'supermajority' | 'ranked_choice' | 'consensus' | 'weighted'
export type CulturalPreset = 'parliamentary' | 'consensus' | 'elder_council' | 'custom'
export type DecisionOutcome = 'passed' | 'rejected' | 'certified' | 'tied' | 'quorum_not_met'

export interface Position {
  id: string
  associationId: string
  title: string
  description: string
  termLength: number
  termLimitCount: number
  currentHolderId: string | null
  currentHolderName: string | null
  termStartDate: string | null
  termEndDate: string | null
  responsibilities: string[]
  isVacant: boolean
}

export interface Election {
  id: string
  associationId: string
  associationName: string
  title: string
  description: string
  positionIds: string[]
  status: ElectionStatus
  nominationStartDate: string
  nominationEndDate: string
  votingStartDate: string
  votingEndDate: string
  votingMethod: VotingModel
  eligibleVoterCount: number
  votescast: number
  quorumRequired: number
  quorumMet: boolean
  allowProxyVoting: boolean
  secretBallot: boolean
  resultsVisibility: 'realtime' | 'after_close'
  certifiedDate?: string
  createdBy: string
  createdAt: string
}

export interface Candidate {
  id: string
  electionId: string
  positionId: string
  userId: string
  name: string
  photoUrl: string
  status: CandidateStatus
  isIncumbent: boolean
  platformStatement: string
  qualifications: string[]
  endorsementCount: number
  nominatedAt: string
  approvedAt: string | null
}

export interface Endorsement {
  id: string
  candidateId: string
  endorserId: string
  endorserName: string
  statement: string
  createdAt: string
}

export interface CoSponsor {
  id: string
  name: string
}

export interface ProposalAttachment {
  name: string
  url: string
  size: number
}

export interface Proposal {
  id: string
  associationId: string
  associationName: string
  title: string
  description: string
  category: ProposalCategory
  status: ProposalStatus
  sponsorId: string
  sponsorName: string
  coSponsors: CoSponsor[]
  submittedAt: string
  discussionEndDate: string | null
  votingStartDate: string | null
  votingEndDate: string | null
  quorumRequired: number
  approvalThreshold: number
  votesFor: number
  votesAgainst: number
  abstentions: number
  totalEligibleVoters: number
  attachments: ProposalAttachment[]
  commentCount: number
  implementedAt?: string
}

export interface ProposalComment {
  id: string
  proposalId: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
  isAmendment: boolean
}

export interface Committee {
  id: string
  associationId: string
  name: string
  description: string
  status: CommitteeStatus
  memberCount: number
  chairId: string
  chairName: string
  viceChairId: string | null
  viceChairName: string | null
  meetingSchedule: string
  nextMeetingDate: string
  documentsCount: number
  isOpen: boolean
  createdAt: string
}

export interface CommitteeMember {
  id: string
  committeeId: string
  userId: string
  name: string
  role: CommitteeRole
  joinedAt: string
}

export interface PositionVote {
  positionId: string
  candidateId: string
}

export interface Vote {
  id: string
  type: 'election' | 'proposal'
  electionId: string | null
  proposalId: string | null
  voterId: string
  positionVotes?: PositionVote[]
  choice?: VoteChoice
  castAt: string
  isProxy: boolean
}

export interface ElectionWinner {
  positionId: string
  positionTitle: string
  winnerId: string
  winnerName: string
  voteCount: number
}

export interface Decision {
  id: string
  type: 'election' | 'proposal'
  associationId: string
  title: string
  description: string
  outcome: DecisionOutcome
  votesFor?: number
  votesAgainst?: number
  abstentions?: number
  winners?: ElectionWinner[]
  participationRate: number
  decidedAt: string
  implementedAt?: string | null
  certifiedAt?: string
  proposalId?: string
  electionId?: string
}

export interface NotificationTiming {
  electionReminders: number[]
  proposalReminders: number[]
  quorumWarning: boolean
}

export interface GovernanceSettings {
  id: string
  associationId: string
  associationName: string
  votingModel: VotingModel
  quorumPercentage: number
  defaultVotingPeriodDays: number
  defaultDiscussionPeriodDays: number
  termLimitEnabled: boolean
  maxConsecutiveTerms: number | null
  proxyVotingEnabled: boolean
  secretBallotDefault: boolean
  amendmentThreshold: number
  constitutionalChangeThreshold: number
  culturalPreset: CulturalPreset
  notificationTiming: NotificationTiming
  updatedAt: string
  updatedBy: string
}

export interface DashboardSummary {
  activeElections: number
  upcomingElections: number
  pendingProposals: number
  activeCommittees: number
  userVotesPending: number
  recentDecisions: number
  participationRate: number
  nextVotingDeadline: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface GovernanceDashboardProps {
  /** Summary statistics for the dashboard */
  summary: DashboardSummary
  /** Active and upcoming elections */
  elections: Election[]
  /** Proposals in discussion or voting phase */
  proposals: Proposal[]
  /** Active committees */
  committees: Committee[]
  /** Recent governance decisions */
  decisions: Decision[]
  /** Called when user clicks to view an election */
  onViewElection?: (electionId: string) => void
  /** Called when user clicks to view a proposal */
  onViewProposal?: (proposalId: string) => void
  /** Called when user clicks to vote */
  onVote?: (type: 'election' | 'proposal', id: string) => void
  /** Called when user wants to submit a new proposal */
  onSubmitProposal?: () => void
}

export interface ElectionManagerProps {
  /** List of elections to display */
  elections: Election[]
  /** Available positions that can be filled */
  positions: Position[]
  /** Candidates for the elections */
  candidates: Candidate[]
  /** Called when admin creates a new election */
  onCreateElection?: (election: Partial<Election>) => void
  /** Called when admin edits an election */
  onEditElection?: (electionId: string, updates: Partial<Election>) => void
  /** Called when admin approves a candidate */
  onApproveCandidate?: (candidateId: string) => void
  /** Called when admin rejects a candidate */
  onRejectCandidate?: (candidateId: string) => void
  /** Called when admin certifies election results */
  onCertifyResults?: (electionId: string) => void
  /** Called when viewing election details */
  onViewElection?: (electionId: string) => void
}

export interface ProposalCenterProps {
  /** List of proposals to display */
  proposals: Proposal[]
  /** Comments on proposals */
  comments: ProposalComment[]
  /** Called when user submits a new proposal */
  onSubmitProposal?: (proposal: Partial<Proposal>) => void
  /** Called when user adds a comment */
  onAddComment?: (proposalId: string, content: string, isAmendment: boolean) => void
  /** Called when user votes on a proposal */
  onVote?: (proposalId: string, choice: VoteChoice) => void
  /** Called when viewing proposal details */
  onViewProposal?: (proposalId: string) => void
  /** Called when filtering proposals */
  onFilter?: (filters: { status?: ProposalStatus; category?: ProposalCategory }) => void
}

export interface VotingBoothProps {
  /** The election or proposal being voted on */
  election?: Election
  proposal?: Proposal
  /** Candidates for election voting */
  candidates?: Candidate[]
  /** Current user's existing vote (if any) */
  existingVote?: Vote
  /** Whether changes are allowed after voting */
  allowChangeVote: boolean
  /** Called when user submits their vote */
  onSubmitVote?: (vote: Partial<Vote>) => void
  /** Called when user changes their vote */
  onChangeVote?: (voteId: string, updates: Partial<Vote>) => void
  /** Called when user wants to abstain */
  onAbstain?: (reason?: string) => void
}

export interface CommitteeDirectoryProps {
  /** List of committees to display */
  committees: Committee[]
  /** Members of committees */
  committeeMembers: CommitteeMember[]
  /** Called when user requests to join a committee */
  onRequestJoin?: (committeeId: string) => void
  /** Called when viewing committee details */
  onViewCommittee?: (committeeId: string) => void
  /** Called when admin creates a new committee */
  onCreateCommittee?: (committee: Partial<Committee>) => void
  /** Called when admin edits a committee */
  onEditCommittee?: (committeeId: string, updates: Partial<Committee>) => void
}

export interface GovernanceSettingsProps {
  /** Current governance settings */
  settings: GovernanceSettings
  /** Called when settings are updated */
  onUpdateSettings?: (updates: Partial<GovernanceSettings>) => void
  /** Called when cultural preset is selected */
  onSelectPreset?: (preset: CulturalPreset) => void
}

export interface DecisionArchiveProps {
  /** Archived decisions */
  decisions: Decision[]
  /** Called when viewing decision details */
  onViewDecision?: (decisionId: string) => void
  /** Called when exporting decisions */
  onExport?: (format: 'pdf' | 'csv', decisionIds: string[]) => void
  /** Called when filtering decisions */
  onFilter?: (filters: { type?: 'election' | 'proposal'; outcome?: DecisionOutcome; dateRange?: { start: string; end: string } }) => void
}

export interface CandidateProfileProps {
  /** The candidate being displayed */
  candidate: Candidate
  /** Endorsements for the candidate */
  endorsements: Endorsement[]
  /** The position they're running for */
  position: Position
  /** The election they're part of */
  election: Election
  /** Called when user endorses the candidate */
  onEndorse?: (candidateId: string, statement: string) => void
  /** Called when user asks a question */
  onAskQuestion?: (candidateId: string, question: string) => void
  /** Called when sharing candidate profile */
  onShare?: (candidateId: string) => void
}
