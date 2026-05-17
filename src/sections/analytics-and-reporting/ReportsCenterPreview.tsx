import { ReportsCenter } from './components'
import data from '@/../product/sections/analytics-and-reporting/data.json'

export default function ReportsCenterPreview() {
  return (
    <ReportsCenter
      scheduledReports={data.scheduledReports}
      reportTypes={data.reportTypes}
      exportFormats={data.exportFormats}
      circleParticipations={data.circleParticipations}
      onCreateReport={() => console.log('Create report')}
      onEditReport={(reportId) => console.log('Edit report:', reportId)}
      onDeleteReport={(reportId) => console.log('Delete report:', reportId)}
      onToggleReportStatus={(reportId) => console.log('Toggle report status:', reportId)}
      onRunReportNow={(reportId) => console.log('Run report now:', reportId)}
    />
  )
}
