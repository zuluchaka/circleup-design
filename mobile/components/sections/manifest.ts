// Maps `<section-slug>/<screen-slug>` → React component.
// If a key is missing, the dynamic route renders `_stub.tsx` instead, which
// links to the section's planning docs.

import { type ComponentType } from "react";

import { HomepageWelcome } from "./screens/HomepageWelcome";
import { HomepageDiscover } from "./screens/HomepageDiscover";
import { HomepageQuiz, HomepageQuizMidway, HomepageQuizOutcome } from "./screens/HomepageQuiz";
import { HomepagePricing } from "./screens/HomepagePricing";
import { LoginSignup } from "./screens/LoginSignup";
import { LoginVerify } from "./screens/LoginVerify";
import {
  LoginOnboarding,
  LoginOnboardingIdentity,
  LoginOnboardingPrefs,
  LoginOnboardingFirstCircle,
} from "./screens/LoginOnboarding";
import { FederationsAssociations } from "./screens/FederationsAssociations";
import { FederationsConsolidated } from "./screens/FederationsConsolidated";
import { AssociationsDashboard } from "./screens/AssociationsDashboard";
import { MembersDirectory, MembersDirectoryEmpty } from "./screens/MembersDirectory";
import { MembersProfile } from "./screens/MembersProfile";
import { MembersTrust } from "./screens/MembersTrust";
import { MembersInvite } from "./screens/MembersInvite";
import { RoscaMyCircles } from "./screens/RoscaMyCircles";
import { RoscaCircleDetail } from "./screens/RoscaCircleDetail";
import { RoscaContribute } from "./screens/RoscaContribute";
import { RoscaPayouts } from "./screens/RoscaPayouts";
import { RoscaTreasurer } from "./screens/RoscaTreasurer";
import { RoscaCirclePublic } from "./screens/RoscaCirclePublic";
import { RoscaJoinRequest } from "./screens/RoscaJoinRequest";
import { RoscaWaitlist } from "./screens/RoscaWaitlist";
import { RoscaInvitations } from "./screens/RoscaInvitations";
import { RoscaCreate } from "./screens/RoscaCreate";
import { RoscaRenewal } from "./screens/RoscaRenewal";
import { RoscaCycleProgress } from "./screens/RoscaCycleProgress";
import { RoscaCashCollection } from "./screens/RoscaCashCollection";
import { RoscaExceptionAction } from "./screens/RoscaExceptionAction";
import { RoscaPayForMember } from "./screens/RoscaPayForMember";
import { RoscaPositionSwap } from "./screens/RoscaPositionSwap";
import { RoscaBidding } from "./screens/RoscaBidding";
import { RoscaPayoutAdvance } from "./screens/RoscaPayoutAdvance";
import { RoscaAutoPay } from "./screens/RoscaAutoPay";
import { RoscaAnalytics } from "./screens/RoscaAnalytics";
import { RoscaRiskScores } from "./screens/RoscaRiskScores";
import { RoscaDisputes } from "./screens/RoscaDisputes";
import { RoscaDisputeDetail } from "./screens/RoscaDisputeDetail";
import { RoscaEmergencyFund } from "./screens/RoscaEmergencyFund";
import { RoscaSettings } from "./screens/RoscaSettings";
import { RoscaManagement } from "./screens/RoscaManagement";
import { RoscaInvite } from "./screens/RoscaInvite";
import { RoscaParticipants } from "./screens/RoscaParticipants";
import { RoscaMultiShare } from "./screens/RoscaMultiShare";
import { RoscaDocuments } from "./screens/RoscaDocuments";
import { RoscaCircleAccount } from "./screens/RoscaCircleAccount";
import { RoscaAdminMonitoring } from "./screens/RoscaAdminMonitoring";
import { DiscoverHub } from "./screens/DiscoverHub";
import { TreasuryOverview } from "./screens/TreasuryOverview";
import { TreasuryFundDetail } from "./screens/TreasuryFundDetail";
import { TreasuryRequest } from "./screens/TreasuryRequest";
import { TreasuryApprovals } from "./screens/TreasuryApprovals";
import { TreasuryLedger } from "./screens/TreasuryLedger";
import { TreasuryEntryDetail } from "./screens/TreasuryEntryDetail";
import { TreasuryReconciliation } from "./screens/TreasuryReconciliation";
import { TreasuryReports } from "./screens/TreasuryReports";
import { TreasuryAuditReport } from "./screens/TreasuryAuditReport";
import { TreasuryStatements } from "./screens/TreasuryStatements";
import { TreasuryMultiCurrency } from "./screens/TreasuryMultiCurrency";
import { TreasuryInvestments } from "./screens/TreasuryInvestments";
import { TreasuryPostfinanceImport } from "./screens/TreasuryPostfinanceImport";
import { TreasuryExternalAccounts } from "./screens/TreasuryExternalAccounts";
import { GovernanceProposals, GovernanceProposalsEmpty } from "./screens/GovernanceProposals";
import { GovernanceBallot } from "./screens/GovernanceBallot";
import { GovernanceElections } from "./screens/GovernanceElections";
import { GovernanceCommittees } from "./screens/GovernanceCommittees";
import { MessagesHub } from "./screens/MessagesHub";
import { CommsThread } from "./screens/CommsThread";
import { CommsEvents } from "./screens/CommsEvents";
import { CommsQrCheckIn } from "./screens/CommsQrCheckIn";
import { AnnouncementComposer } from "./screens/AnnouncementComposer";
import { EventDetail } from "./screens/EventDetail";
import { AssociationEvents } from "./screens/AssociationEvents";
import { CreateEvent } from "./screens/CreateEvent";
import { InviteAttendees } from "./screens/InviteAttendees";
import { AnalyticsPersonal, AnalyticsPersonalEmpty } from "./screens/AnalyticsPersonal";
import { AnalyticsCircleHealth } from "./screens/AnalyticsCircleHealth";
import { AnalyticsStatements } from "./screens/AnalyticsStatements";
import { CreditScore, CreditScoreLow } from "./screens/CreditScore";
import { CreditAdvance } from "./screens/CreditAdvance";
import { CreditLoan } from "./screens/CreditLoan";
import { CreditBureau } from "./screens/CreditBureau";
import { InsightsFeed, InsightsFeedEmpty } from "./screens/InsightsFeed";
import { AiAssistant } from "./screens/AiAssistant";
import { AiRisk } from "./screens/AiRisk";
import { CommunityFeed } from "./screens/CommunityFeed";
import { CommunityBadges } from "./screens/CommunityBadges";
import { CommunityLeaderboard } from "./screens/CommunityLeaderboard";
import { CommunityReferrals } from "./screens/CommunityReferrals";
import { MultiShareMyShares } from "./screens/MultiShareMyShares";
import { MultiShareRequest } from "./screens/MultiShareRequest";
import { MultiShareMonitor } from "./screens/MultiShareMonitor";
import { PlatformConsole } from "./screens/PlatformConsole";
import { PlatformKyc } from "./screens/PlatformKyc";
import { PlatformSupport } from "./screens/PlatformSupport";
import { PlatformFlags } from "./screens/PlatformFlags";
import {
  CampaignsList,
  CampaignsListEmptyOrganiser,
  CampaignsListEmptyMember,
} from "./screens/CampaignsList";
import { ProjectsCampaignDetail } from "./screens/ProjectsCampaignDetail";
import { ProjectsDonate } from "./screens/ProjectsDonate";
import { ProjectsImpact } from "./screens/ProjectsImpact";
import { LoginSignIn } from "./screens/LoginSignIn";
import { DocumentsLibrary, DocumentsLibraryEmpty } from "./screens/DocumentsLibrary";
import { DocumentsViewer } from "./screens/DocumentsViewer";
import { DocumentsShare } from "./screens/DocumentsShare";
import { FederationsOverview } from "./screens/FederationsOverview";

export const screenManifest: Record<string, ComponentType> = {
  "homepage/welcome": HomepageWelcome,
  "associations/dashboard": AssociationsDashboard,
  "members-and-trust/directory": MembersDirectory,
  "members-and-trust/directory-empty": MembersDirectoryEmpty,
  "members-and-trust/profile": MembersProfile,
  "members-and-trust/trust": MembersTrust,
  "members-and-trust/invite": MembersInvite,
  "rosca-circles/my-circles": RoscaMyCircles,
  "rosca-circles/circle-detail": RoscaCircleDetail,
  "rosca-circles/contribute": RoscaContribute,
  "rosca-circles/payouts": RoscaPayouts,
  "rosca-circles/treasurer": RoscaTreasurer,
  "rosca-circles/circle-public": RoscaCirclePublic,
  "rosca-circles/join-request": RoscaJoinRequest,
  "rosca-circles/waitlist": RoscaWaitlist,
  "rosca-circles/invitations": RoscaInvitations,
  "rosca-circles/create": RoscaCreate,
  "rosca-circles/renewal": RoscaRenewal,
  "rosca-circles/cycle-progress": RoscaCycleProgress,
  "rosca-circles/cash-collection": RoscaCashCollection,
  "rosca-circles/exception-action": RoscaExceptionAction,
  "rosca-circles/pay-for-member": RoscaPayForMember,
  "rosca-circles/position-swap": RoscaPositionSwap,
  "rosca-circles/bidding": RoscaBidding,
  "rosca-circles/payout-advance": RoscaPayoutAdvance,
  "rosca-circles/auto-pay": RoscaAutoPay,
  "rosca-circles/analytics": RoscaAnalytics,
  "rosca-circles/risk-scores": RoscaRiskScores,
  "rosca-circles/disputes": RoscaDisputes,
  "rosca-circles/dispute-detail": RoscaDisputeDetail,
  "rosca-circles/emergency-fund": RoscaEmergencyFund,
  "rosca-circles/settings": RoscaSettings,
  "rosca-circles/management": RoscaManagement,
  "rosca-circles/invite": RoscaInvite,
  "rosca-circles/participants": RoscaParticipants,
  "rosca-circles/multi-share": RoscaMultiShare,
  "rosca-circles/documents": RoscaDocuments,
  "rosca-circles/circle-account": RoscaCircleAccount,
  "rosca-circles/admin-monitoring": RoscaAdminMonitoring,
  "rosca-circles/discover": DiscoverHub,
  "treasury-and-funds/overview": TreasuryOverview,
  "treasury-and-funds/fund-detail": TreasuryFundDetail,
  "treasury-and-funds/request": TreasuryRequest,
  "treasury-and-funds/approvals": TreasuryApprovals,
  "treasury-and-funds/ledger": TreasuryLedger,
  "treasury-and-funds/entry-detail": TreasuryEntryDetail,
  "treasury-and-funds/reconciliation": TreasuryReconciliation,
  "treasury-and-funds/reports": TreasuryReports,
  "treasury-and-funds/audit-report": TreasuryAuditReport,
  "treasury-and-funds/statements": TreasuryStatements,
  "treasury-and-funds/multi-currency": TreasuryMultiCurrency,
  "treasury-and-funds/investments": TreasuryInvestments,
  "treasury-and-funds/postfinance-import": TreasuryPostfinanceImport,
  "treasury-and-funds/external-accounts": TreasuryExternalAccounts,
  "governance-and-voting/proposals": GovernanceProposals,
  "governance-and-voting/proposals-empty": GovernanceProposalsEmpty,
  "governance-and-voting/ballot": GovernanceBallot,
  "governance-and-voting/elections": GovernanceElections,
  "governance-and-voting/committees": GovernanceCommittees,
  "communication-and-events/inbox": MessagesHub,
  "communication-and-events/thread": CommsThread,
  "communication-and-events/events": CommsEvents,
  "communication-and-events/qr": CommsQrCheckIn,
  "communication-and-events/announcement-composer": AnnouncementComposer,
  "communication-and-events/event-detail": EventDetail,
  "communication-and-events/association-events": AssociationEvents,
  "communication-and-events/create-event": CreateEvent,
  "communication-and-events/invite-attendees": InviteAttendees,
  "documents/library": DocumentsLibrary,
  "documents/library-empty": DocumentsLibraryEmpty,
  "documents/viewer": DocumentsViewer,
  "documents/share": DocumentsShare,
  "analytics-and-reporting/personal": AnalyticsPersonal,
  "analytics-and-reporting/personal-empty": AnalyticsPersonalEmpty,
  "analytics-and-reporting/circle-health": AnalyticsCircleHealth,
  "analytics-and-reporting/statements": AnalyticsStatements,
  "credit-and-lending/score": CreditScore,
  "credit-and-lending/score-low": CreditScoreLow,
  "credit-and-lending/advance": CreditAdvance,
  "credit-and-lending/loan": CreditLoan,
  "credit-and-lending/bureau": CreditBureau,
  "ai-insights/feed": InsightsFeed,
  "ai-insights/feed-empty": InsightsFeedEmpty,
  "ai-insights/assistant": AiAssistant,
  "ai-insights/risk": AiRisk,
  "community-and-social/feed": CommunityFeed,
  "community-and-social/badges": CommunityBadges,
  "community-and-social/leaderboard": CommunityLeaderboard,
  "community-and-social/referrals": CommunityReferrals,
  "multi-share/my-shares": MultiShareMyShares,
  "multi-share/request": MultiShareRequest,
  "multi-share/monitor": MultiShareMonitor,
  "platform-administration/console": PlatformConsole,
  "platform-administration/kyc": PlatformKyc,
  "platform-administration/support": PlatformSupport,
  "platform-administration/flags": PlatformFlags,
  "projects-and-fundraising/campaigns": CampaignsList,
  "projects-and-fundraising/campaigns-empty": CampaignsListEmptyOrganiser,
  "projects-and-fundraising/campaigns-empty-member": CampaignsListEmptyMember,
  "projects-and-fundraising/campaign-detail": ProjectsCampaignDetail,
  "projects-and-fundraising/donate": ProjectsDonate,
  "projects-and-fundraising/impact": ProjectsImpact,
  "login/signin": LoginSignIn,
  "login/signup": LoginSignup,
  "login/verify": LoginVerify,
  "login/onboarding": LoginOnboarding,
  "login/onboarding-identity": LoginOnboardingIdentity,
  "login/onboarding-prefs": LoginOnboardingPrefs,
  "login/onboarding-first-circle": LoginOnboardingFirstCircle,
  "homepage/discover": HomepageDiscover,
  "homepage/quiz": HomepageQuiz,
  "homepage/quiz-midway": HomepageQuizMidway,
  "homepage/quiz-outcome": HomepageQuizOutcome,
  "homepage/pricing": HomepagePricing,
  "federations/overview": FederationsOverview,
  "federations/associations": FederationsAssociations,
  "federations/consolidated": FederationsConsolidated,
};
