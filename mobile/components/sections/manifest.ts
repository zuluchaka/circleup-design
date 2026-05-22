// Maps `<section-slug>/<screen-slug>` → React component.
// If a key is missing, the dynamic route renders `_stub.tsx` instead, which
// links to the section's planning docs.

import type { ComponentType } from "react";

import { HomepageWelcome } from "./screens/HomepageWelcome";
import { AssociationsDashboard } from "./screens/AssociationsDashboard";
import { MembersDirectory } from "./screens/MembersDirectory";
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
import { GovernanceProposals } from "./screens/GovernanceProposals";
import { CommsInbox } from "./screens/CommsInbox";
import { EventDetail } from "./screens/EventDetail";
import { AssociationEvents } from "./screens/AssociationEvents";
import { CreateEvent } from "./screens/CreateEvent";
import { InviteAttendees } from "./screens/InviteAttendees";
import { AnalyticsPersonal } from "./screens/AnalyticsPersonal";
import { CreditScore } from "./screens/CreditScore";
import { InsightsFeed } from "./screens/InsightsFeed";
import { CampaignsList } from "./screens/CampaignsList";
import { LoginSignIn } from "./screens/LoginSignIn";
import { DocumentsLibrary } from "./screens/DocumentsLibrary";
import { FederationsOverview } from "./screens/FederationsOverview";

export const screenManifest: Record<string, ComponentType> = {
  "homepage/welcome": HomepageWelcome,
  "associations/dashboard": AssociationsDashboard,
  "members-and-trust/directory": MembersDirectory,
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
  "communication-and-events/inbox": CommsInbox,
  "communication-and-events/event-detail": EventDetail,
  "communication-and-events/association-events": AssociationEvents,
  "communication-and-events/create-event": CreateEvent,
  "communication-and-events/invite-attendees": InviteAttendees,
  "documents/library": DocumentsLibrary,
  "analytics-and-reporting/personal": AnalyticsPersonal,
  "credit-and-lending/score": CreditScore,
  "ai-insights/feed": InsightsFeed,
  "projects-and-fundraising/campaigns": CampaignsList,
  "login/signin": LoginSignIn,
  "federations/overview": FederationsOverview,
};
