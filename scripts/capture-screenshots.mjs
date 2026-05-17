import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
import path from 'path'

const BASE = 'http://localhost:3002'

const TARGETS = {
  'associations': [
    'AnnouncementsDashboardPreview',
    'AssociationCirclesViewPreview',
    'AssociationFinanceViewPreview',
    'AssociationLedgerDashboardPreview',
    'ComplianceDocumentCenterPreview',
    'DuesConfigFormPreview',
    'DuesDisputeFormPreview',
    'FinancialOverviewPreview',
    'HealthScorecardPreview',
    'LedgerReportViewerPreview',
    'MemberDuesHistoryPreview',
    'MemberImportWizardPreview',
    'MigrationDashboardPreview',
    'MultiAssociationDashboardPreview',
    'MyAssociationsDashboardPreview',
    'OrganizerPerformancePreview',
    'PresidentContractReviewPreview',
    'PresidentDashboardWidgetsPreview',
    'PresidentNotificationCenterPreview',
    'PresidentOnboardingWizardPreview',
    'PresidentSuccessionPreview',
    'SubscriptionManagementPreview',
    'TransactionApprovalsListPreview',
    'TreasurerMemberLedgerDashboardPreview',
  ],
  'communication-and-events': [
    'AdminEventsOverviewPreview',
    'AgendaEditorPreview',
    'AgendaViewPreview',
    'AttendanceHistoryPreview',
    'AttendanceSheetPreview',
    'AttendeeTrackerPreview',
    'ChatViewPreview',
    'CircleAttendancePatternsPreview',
    'CircleEventManagerPreview',
    'ConflictCheckerPreview',
    'ConsolidatedCalendarPreview',
    'EventEditorPreview',
    'EventGalleryPreview',
    'EventNotificationConfigPreview',
    'EventTranslationEditorPreview',
    'EventsDashboardPreview',
    'LiveMeetingTrackerPreview',
    'MeetingRSVPPreview',
    'MinutesEditorPreview',
    'MinutesReviewPreview',
    'MinutesViewPreview',
    'PastEventsViewPreview',
    'ProspectingDashboardPreview',
    'QRCheckinPreview',
    'QuorumIndicatorPreview',
    'RSVPDashboardPreview',
    'RecurringEventSetupPreview',
    'SurveyBuilderPreview',
    'SurveyResponsePreview',
    'VoteRecorderPreview',
    'WaitlistManagerPreview',
  ],
  'documents': [
    'AgreementSigningPreview',
    'AssociationDocumentsViewPreview',
    'CircleDocumentsPreview',
    'DocumentLibraryPreview',
    'DocumentTemplatesPreview',
    'DocumentUploadPreview',
    'DocumentViewerPreview',
  ],
  'federations': [
    'AlertPanelPreview',
    'ElectionManagerPreview',
    'EventsAnnouncementsPreview',
    'FinancialDashboardPreview',
    'LeadershipDirectoryPreview',
    'MemberDirectoryPreview',
    'PolicyManagerPreview',
    'ReportsCenterPreview',
  ],
  'members-and-trust': [
    'MyProfilePagePreview',
    'TrustScoreGaugePreview',
  ],
  'multi-share': [
    'CircleDashboardPreview',
    'ContributionPaymentPreview',
    'PersonalShareSummaryPreview',
    'PlatformAdminDashboardPreview',
    'ShareHistoryTimelinePreview',
  ],
  'platform-administration': [
    'ComplianceDashboardPreview',
    'ConfigurationPanelPreview',
    'DisputeCenterPreview',
    'FeatureFlagsPreview',
    'SupportInboxPreview',
    'SystemHealthPreview',
    'TransactionMonitorPreview',
  ],
  'treasury-and-funds': [
    'FinancialReportPanelPreview',
    'PostfinanceImportFlowPreview',
  ],
}

function toKebab(name) {
  if (name.endsWith('Preview')) name = name.slice(0, -7)
  return name
    .replace(/(.)([A-Z][a-z]+)/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

const tasks = []
for (const [section, previews] of Object.entries(TARGETS)) {
  mkdirSync(`product/sections/${section}`, { recursive: true })
  for (const preview of previews) {
    tasks.push({
      section,
      preview,
      kebab: toKebab(preview),
      url: `${BASE}/sections/${section}/screen-designs/${preview}/fullscreen`,
      out: path.join('product', 'sections', section, `${toKebab(preview)}.png`),
    })
  }
}

console.log(`Capturing ${tasks.length} screenshots…`)

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const page = await context.newPage()

let ok = 0, fail = 0
for (const t of tasks) {
  try {
    await page.goto(t.url, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(400)
    // Detect "Screen design not found"
    const notFound = await page.locator('text=Screen design not found').count()
    if (notFound > 0) {
      console.log(`  ✗ ${t.section}/${t.preview} — not found`)
      fail++
      continue
    }
    await page.screenshot({ path: t.out, fullPage: true, type: 'png' })
    ok++
    if (ok % 10 === 0) console.log(`  ${ok}/${tasks.length} captured`)
  } catch (e) {
    console.log(`  ✗ ${t.section}/${t.preview} — ${e.message.split('\n')[0]}`)
    fail++
  }
}

await browser.close()
console.log(`Done: ${ok} captured, ${fail} failed`)
process.exit(fail > 0 ? 1 : 0)
