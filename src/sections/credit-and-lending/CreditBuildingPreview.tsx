import { CreditBuilding } from './components'
import data from '@/../product/sections/credit-and-lending/data.json'

export default function CreditBuildingPreview() {
  return (
    <CreditBuilding
      bureauStatus={data.creditBureauStatus}
      partnerBanks={data.partnerBanks}
      creditScore={data.creditScore}
      onOptIn={() => console.log('Opt in to credit bureau')}
      onOptOut={() => console.log('Opt out of credit bureau')}
      onExportDocumentation={() => console.log('Export documentation')}
      onRequestBankIntroduction={(bankId) => console.log('Request bank introduction:', bankId)}
    />
  )
}
