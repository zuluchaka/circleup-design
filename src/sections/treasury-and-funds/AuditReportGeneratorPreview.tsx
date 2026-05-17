import { AuditReportGenerator } from './components'
import sampleData from '@/../product/sections/treasury-and-funds/data.json'
import type { Fund, AuditReport, ReportConfig, ReportSchedule } from '@/../product/sections/treasury-and-funds/types'

export default function AuditReportGeneratorPreview() {
  const handleGenerateReport = (config: ReportConfig) => {
    console.log('Generate report:', config)
  }

  const handleDownloadReport = (reportId: string) => {
    console.log('Download report:', reportId)
  }

  const handleScheduleReport = (config: ReportConfig, schedule: ReportSchedule) => {
    console.log('Schedule report:', config, schedule)
  }

  return (
    <AuditReportGenerator
      funds={sampleData.funds as Fund[]}
      reports={sampleData.auditReports as AuditReport[]}
      onGenerateReport={handleGenerateReport}
      onDownloadReport={handleDownloadReport}
      onScheduleReport={handleScheduleReport}
    />
  )
}
