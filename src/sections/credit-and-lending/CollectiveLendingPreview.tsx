import { CollectiveLending } from './components'
import data from '@/../product/sections/credit-and-lending/data.json'

export default function CollectiveLendingPreview() {
  return (
    <CollectiveLending
      collectiveLoans={data.collectiveLoans}
      votes={data.collectiveLoanVotes}
      onVote={(loanId, vote, comment) => console.log('Vote:', loanId, vote, comment)}
      onViewLoan={(loanId) => console.log('View loan:', loanId)}
      onRequestCollectiveLoan={(circleId, amount, termMonths, purpose) =>
        console.log('Request collective loan:', { circleId, amount, termMonths, purpose })
      }
    />
  )
}
