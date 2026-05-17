import { PayoutAdvances } from './components'
import data from '@/../product/sections/credit-and-lending/data.json'

export default function PayoutAdvancesPreview() {
  return (
    <PayoutAdvances
      advances={data.payoutAdvances}
      upcomingPayouts={data.upcomingPayouts}
      paymentMethods={data.paymentMethods}
      onRequestAdvance={(payoutId, amount) => console.log('Request advance:', payoutId, amount)}
      onViewAdvance={(advanceId) => console.log('View advance:', advanceId)}
      onCalculateEarlyRepayment={(advanceId) => console.log('Calculate early repayment:', advanceId)}
      onUpdateRepaymentSettings={(advanceId, settings) => console.log('Update repayment settings:', advanceId, settings)}
    />
  )
}
