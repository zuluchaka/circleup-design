// Projects & Fundraising Types

export type CampaignCategory =
  | 'emergency'
  | 'project'
  | 'community'
  | 'education'
  | 'health'
  | 'infrastructure'
  | 'cultural'
  | 'other'

export type CampaignStatus =
  | 'draft'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled'

export type CampaignVisibility =
  | 'public'
  | 'members'
  | 'invited'

export type DonationStatus =
  | 'pending'
  | 'completed'
  | 'refunded'
  | 'failed'

export type RecurringFrequency =
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly'

export type DonorTier =
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'

export interface Campaign {
  id: string
  associationId: string
  associationName: string
  title: string
  description: string
  coverImage: string
  mediaGallery: MediaItem[]
  category: CampaignCategory
  goalAmount: number
  raisedAmount: number
  currency: string
  startDate: string
  endDate: string | null
  status: CampaignStatus
  visibility: CampaignVisibility
  allowAnonymous: boolean
  minDonation: number
  suggestedAmounts: number[]
  donorCount: number
  matchingConfig: MatchingConfig | null
  createdAt: string
  createdBy: string
}

export interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnail?: string
  caption?: string
}

export interface Donation {
  id: string
  campaignId: string
  donorId: string | null
  donorName: string
  donorEmail: string
  donorAvatar?: string
  amount: number
  currency: string
  isAnonymous: boolean
  isRecurring: boolean
  recurringFrequency?: RecurringFrequency
  message?: string
  status: DonationStatus
  paymentMethod: string
  transactionId: string
  matchedAmount: number
  createdAt: string
}

export interface CampaignUpdate {
  id: string
  campaignId: string
  title: string
  content: string
  media: MediaItem[]
  isPinned: boolean
  publishedAt: string
  authorId: string
  authorName: string
  authorAvatar?: string
}

export interface MatchingConfig {
  id: string
  campaignId: string
  sponsorName: string
  sponsorLogo?: string
  matchRatio: number
  matchCap: number
  matchedSoFar: number
  startDate: string
  endDate: string
  isActive: boolean
}

export interface Donor {
  id: string
  userId: string | null
  name: string
  email: string
  avatar?: string
  tier: DonorTier
  totalDonated: number
  donationCount: number
  firstDonation: string
  lastDonation: string
  isRecurringDonor: boolean
  campaigns: string[]
  showOnWall: boolean
}

export interface DonorStats {
  totalDonors: number
  recurringDonors: number
  averageDonation: number
  retentionRate: number
  tierBreakdown: {
    bronze: number
    silver: number
    gold: number
    platinum: number
  }
}

export interface CampaignStats {
  totalRaised: number
  goalProgress: number
  donorCount: number
  averageDonation: number
  recurringRevenue: number
  matchedTotal: number
  daysRemaining: number | null
  donationTrend: {
    date: string
    amount: number
    count: number
  }[]
}

// Component Props Types

export interface CampaignListProps {
  campaigns: Campaign[]
  onCampaignClick?: (campaignId: string) => void
  onCreateCampaign?: () => void
  showFilters?: boolean
}

export interface CampaignDetailProps {
  campaign: Campaign
  recentDonations: Donation[]
  updates: CampaignUpdate[]
  stats: CampaignStats
  onDonate?: () => void
  onShare?: (platform: string) => void
  onUpdateClick?: (updateId: string) => void
}

export interface DonationFlowProps {
  campaign: Campaign
  suggestedAmounts: number[]
  onSubmit?: (donation: Partial<Donation>) => void
  onCancel?: () => void
}

export interface CampaignCreatorProps {
  associationId: string
  existingCampaign?: Campaign
  onSave?: (campaign: Partial<Campaign>) => void
  onPublish?: (campaign: Partial<Campaign>) => void
  onCancel?: () => void
}

export interface CampaignDashboardProps {
  campaign: Campaign
  stats: CampaignStats
  recentDonations: Donation[]
  onExport?: (format: 'csv' | 'pdf') => void
  onPauseCampaign?: () => void
  onEditCampaign?: () => void
  onPostUpdate?: () => void
}

export interface DonorManagementProps {
  donors: Donor[]
  stats: DonorStats
  onDonorClick?: (donorId: string) => void
  onExport?: () => void
  onSendThankYou?: (donorIds: string[]) => void
}
