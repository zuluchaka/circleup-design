import { useState } from 'react'
import {
  FileText, Upload, Clock, CheckCircle, AlertCircle, XCircle,
  ChevronRight, Users, CreditCard, Sparkles, Lock, ArrowRight
} from 'lucide-react'
import type {
  LoanApplication, PreQualificationOffer, CreditScore,
  LoanType, ApplicationDocument, GuarantorRequest
} from '../types'

export interface LoanApplicationsProps {
  applications: LoanApplication[]
  preQualificationOffers: PreQualificationOffer[]
  creditScore: CreditScore
  onStartApplication?: (type: LoanType, amount: number, termMonths: number, purpose: string) => void
  onUploadDocument?: (applicationId: string, file: File, documentType: string) => void
  onRequestGuarantor?: (applicationId: string, memberId: string, amount: number) => void
  onAcceptTerms?: (applicationId: string) => void
  onWithdrawApplication?: (applicationId: string) => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-CH', { style: 'currency', currency: 'CHF' }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    draft: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-400', icon: <FileText className="w-3.5 h-3.5" /> },
    submitted: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-400', icon: <Clock className="w-3.5 h-3.5" /> },
    under_review: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', icon: <Clock className="w-3.5 h-3.5" /> },
    approved: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: <CheckCircle className="w-3.5 h-3.5" /> },
    declined: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: <XCircle className="w-3.5 h-3.5" /> },
    withdrawn: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-500 dark:text-slate-500', icon: <XCircle className="w-3.5 h-3.5" /> },
  }

  const style = styles[status] || styles.draft
  const displayStatus = status.replace(/_/g, ' ')

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      {style.icon}
      <span className="capitalize">{displayStatus}</span>
    </span>
  )
}

function DocumentRow({ doc }: { doc: ApplicationDocument }) {
  const statusStyles: Record<string, { icon: React.ReactNode; text: string }> = {
    pending: { icon: <Clock className="w-4 h-4 text-amber-500" />, text: 'Pending review' },
    verified: { icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, text: 'Verified' },
    rejected: { icon: <XCircle className="w-4 h-4 text-red-500" />, text: 'Rejected' },
  }

  const style = statusStyles[doc.status] || statusStyles.pending

  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-600">
          <FileText className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">{doc.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{doc.fileName}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {style.icon}
        <span className="text-xs text-slate-500 dark:text-slate-400">{style.text}</span>
      </div>
    </div>
  )
}

function GuarantorRequestRow({ request }: { request: GuarantorRequest }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
          {request.memberName.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">{request.memberName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Guarantee: {formatCurrency(request.guaranteeAmount)}
          </p>
        </div>
      </div>
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
        request.status === 'accepted'
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
          : request.status === 'declined'
          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      }`}>
        {request.status}
      </span>
    </div>
  )
}

function PreQualificationCard({
  offer,
  creditScore,
  onApply,
}: {
  offer: PreQualificationOffer
  creditScore: number
  onApply: () => void
}) {
  const isQualified = offer.status === 'qualified'
  const scoreGap = offer.minCreditScore - creditScore

  const typeIcons: Record<string, React.ReactNode> = {
    payout_advance: <Sparkles className="w-5 h-5" />,
    personal_loan: <CreditCard className="w-5 h-5" />,
    business_loan: <FileText className="w-5 h-5" />,
    partner_credit_card: <CreditCard className="w-5 h-5" />,
  }

  return (
    <div className={`p-5 rounded-2xl border-2 transition-all ${
      isQualified
        ? 'bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-600'
        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-75'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${
          isQualified
            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
        }`}>
          {typeIcons[offer.type] || <CreditCard className="w-5 h-5" />}
        </div>
        {isQualified ? (
          <span className="text-xs font-medium px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">
            Pre-qualified
          </span>
        ) : (
          <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-full flex items-center gap-1">
            <Lock className="w-3 h-3" />
            +{scoreGap} pts needed
          </span>
        )}
      </div>

      <h3 className={`text-lg font-semibold mb-1 ${
        isQualified ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
      }`}>
        {offer.title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{offer.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Up to</span>
          <span className={`font-semibold ${isQualified ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
            {formatCurrency(offer.maxAmount)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Rate</span>
          <span className={`font-medium ${isQualified ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
            {offer.feeRange}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Term</span>
          <span className={`font-medium ${isQualified ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
            {offer.termRange}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{offer.qualificationMessage}</p>

      {isQualified ? (
        <button
          onClick={onApply}
          className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          Apply Now
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          disabled
          className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-xl font-medium cursor-not-allowed"
        >
          Not Yet Eligible
        </button>
      )}
    </div>
  )
}

function ApplicationCard({
  application,
  onAcceptTerms,
  onWithdraw,
}: {
  application: LoanApplication
  onAcceptTerms?: () => void
  onWithdraw?: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 capitalize">
                {application.type} Loan Application
              </span>
              <StatusBadge status={application.status} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{application.purpose}</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(application.requestedAmount)}
          </p>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <Clock className="w-4 h-4" />
          <span>Submitted {formatDate(application.submittedAt)}</span>
          {application.estimatedDecisionDate && (
            <>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span>Decision by {formatDate(application.estimatedDecisionDate)}</span>
            </>
          )}
        </div>

        {/* Proposed Terms */}
        {application.proposedTerms && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 mb-4">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 mb-3">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Proposed Terms Available</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-emerald-600 dark:text-emerald-500">Approved Amount</p>
                <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">
                  {formatCurrency(application.proposedTerms.approvedAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-emerald-600 dark:text-emerald-500">Interest Rate</p>
                <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">
                  {application.proposedTerms.interestRate}%
                </p>
              </div>
              <div>
                <p className="text-xs text-emerald-600 dark:text-emerald-500">Term</p>
                <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">
                  {application.proposedTerms.termMonths} months
                </p>
              </div>
              <div>
                <p className="text-xs text-emerald-600 dark:text-emerald-500">Monthly Payment</p>
                <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">
                  {formatCurrency(application.proposedTerms.monthlyPayment)}
                </p>
              </div>
            </div>
            <button
              onClick={onAcceptTerms}
              className="mt-4 w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
            >
              Accept Terms
            </button>
          </div>
        )}

        {/* Expand/Collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          {isExpanded ? 'Hide details' : 'Show details'}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-200 dark:border-slate-700 p-5 space-y-6">
          {/* Documents */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Documents</h4>
              <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1">
                <Upload className="w-4 h-4" />
                Upload
              </button>
            </div>
            <div className="space-y-2">
              {application.documents.map(doc => (
                <DocumentRow key={doc.id} doc={doc} />
              ))}
            </div>
          </div>

          {/* Guarantor Requests */}
          {application.guarantorRequests.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Guarantors</h4>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Add Guarantor
                </button>
              </div>
              <div className="space-y-2">
                {application.guarantorRequests.map(request => (
                  <GuarantorRequestRow key={request.id} request={request} />
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={onWithdraw}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700"
            >
              Withdraw Application
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function LoanApplications({
  applications,
  preQualificationOffers,
  creditScore,
  onStartApplication,
  onUploadDocument,
  onRequestGuarantor,
  onAcceptTerms,
  onWithdrawApplication,
}: LoanApplicationsProps) {
  const activeApplications = applications.filter(a =>
    !['approved', 'declined', 'withdrawn'].includes(a.status)
  )
  const qualifiedOffers = preQualificationOffers.filter(o => o.status === 'qualified')
  const unqualifiedOffers = preQualificationOffers.filter(o => o.status !== 'qualified')

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Loan Applications</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Apply for loans backed by your circle participation history
        </p>
      </div>

      {/* Active Applications */}
      {activeApplications.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Your Applications</h2>
          <div className="space-y-4">
            {activeApplications.map(app => (
              <ApplicationCard
                key={app.id}
                application={app}
                onAcceptTerms={() => onAcceptTerms?.(app.id)}
                onWithdraw={() => onWithdrawApplication?.(app.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pre-Qualification Offers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Available Products</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Based on your credit score of {creditScore.score}
            </p>
          </div>
        </div>

        {qualifiedOffers.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              You're pre-qualified for
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {qualifiedOffers.map(offer => (
                <PreQualificationCard
                  key={offer.id}
                  offer={offer}
                  creditScore={creditScore.score}
                  onApply={() => onStartApplication?.(
                    offer.type === 'payout_advance' ? 'personal' :
                    offer.type === 'business_loan' ? 'business' : 'personal',
                    offer.maxAmount,
                    12,
                    ''
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {unqualifiedOffers.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Unlock with a higher score
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {unqualifiedOffers.map(offer => (
                <PreQualificationCard
                  key={offer.id}
                  offer={offer}
                  creditScore={creditScore.score}
                  onApply={() => {}}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
