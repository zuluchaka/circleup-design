import { LoanApplications } from './components'
import data from '@/../product/sections/credit-and-lending/data.json'

export default function LoanApplicationsPreview() {
  return (
    <LoanApplications
      applications={data.loanApplications}
      preQualificationOffers={data.preQualificationOffers}
      creditScore={data.creditScore}
      onStartApplication={(type, amount, termMonths, purpose) =>
        console.log('Start application:', { type, amount, termMonths, purpose })
      }
      onUploadDocument={(applicationId, file, documentType) =>
        console.log('Upload document:', applicationId, documentType)
      }
      onRequestGuarantor={(applicationId, memberId, amount) =>
        console.log('Request guarantor:', applicationId, memberId, amount)
      }
      onAcceptTerms={(applicationId) => console.log('Accept terms:', applicationId)}
      onWithdrawApplication={(applicationId) => console.log('Withdraw application:', applicationId)}
    />
  )
}
