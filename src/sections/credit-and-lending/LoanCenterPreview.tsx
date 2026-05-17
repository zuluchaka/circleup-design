import { LoanCenter } from './components'
import data from '@/../product/sections/credit-and-lending/data.json'

export default function LoanCenterPreview() {
  return (
    <LoanCenter
      loans={data.loans}
      scheduledPayments={data.scheduledPayments}
      onViewLoan={(loanId) => console.log('View loan:', loanId)}
      onMakePayment={(loanId, amount) => console.log('Make payment:', loanId, amount)}
      onCalculateEarlyRepayment={(loanId) => console.log('Calculate early repayment:', loanId)}
      onRequestRestructuring={(loanId) => console.log('Request restructuring:', loanId)}
      onRefinance={(loanId) => console.log('Refinance:', loanId)}
    />
  )
}
