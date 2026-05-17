import { Statements } from './components'
import data from '@/../product/sections/analytics-and-reporting/data.json'

export default function StatementsPreview() {
  return (
    <Statements
      statements={data.statements}
      reportTypes={data.reportTypes}
      exportFormats={data.exportFormats}
      onGenerateStatement={(type, startDate, endDate, format) =>
        console.log('Generate statement:', { type, startDate, endDate, format })
      }
      onDownloadStatement={(statementId) => console.log('Download statement:', statementId)}
      onDeleteStatement={(statementId) => console.log('Delete statement:', statementId)}
      onShareStatement={(statementId, email) => console.log('Share statement:', statementId, email)}
    />
  )
}
