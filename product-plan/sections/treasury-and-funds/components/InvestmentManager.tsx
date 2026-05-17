import { useState } from 'react'
import type { InvestmentManagerProps, Investment, InvestmentInstrument, RiskLevel } from '../types'

function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const riskColors: Record<RiskLevel, { bg: string; text: string }> = {
  very_low: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-400',
  },
  low: {
    bg: 'bg-sky-100 dark:bg-sky-900/30',
    text: 'text-sky-700 dark:text-sky-400',
  },
  medium: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
  },
}

const riskLabels: Record<RiskLevel, string> = {
  very_low: 'Very Low',
  low: 'Low',
  medium: 'Medium',
}

function InvestmentCard({
  investment,
  onWithdraw,
}: {
  investment: Investment
  onWithdraw?: (investmentId: string, amount: number) => void
}) {
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')

  const gain = investment.currentValue - investment.allocatedAmount
  const gainPercent = ((gain / investment.allocatedAmount) * 100).toFixed(2)

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount)
    if (amount > 0 && amount <= investment.currentValue) {
      onWithdraw?.(investment.id, amount)
      setShowWithdraw(false)
      setWithdrawAmount('')
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{investment.instrumentName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${riskColors[investment.riskLevel].bg} ${riskColors[investment.riskLevel].text}`}>
                {riskLabels[investment.riskLevel]} Risk
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {investment.liquidityDays === 1 ? 'Next-day' : `${investment.liquidityDays}-day`} liquidity
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {investment.annualYield.toFixed(2)}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">APY</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Invested</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {formatCurrency(investment.allocatedAmount, investment.currency)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Current Value</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {formatCurrency(investment.currentValue, investment.currency)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
          <span className="text-sm text-slate-600 dark:text-slate-400">Returns</span>
          <span className={`font-semibold ${gain >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {gain >= 0 ? '+' : ''}{formatCurrency(gain, investment.currency)} ({gainPercent}%)
          </span>
        </div>

        {investment.maturityDate && (
          <div className="flex items-center gap-2 mt-4 text-sm text-slate-500 dark:text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Matures: {formatDate(investment.maturityDate)}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 dark:border-slate-700 p-4">
        {!showWithdraw ? (
          <button
            onClick={() => setShowWithdraw(true)}
            className="w-full py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Withdraw
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Amount"
                max={investment.currentValue}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => setWithdrawAmount(investment.currentValue.toString())}
                className="px-3 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
              >
                Max
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleWithdraw}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowWithdraw(false)}
                className="flex-1 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function InstrumentCard({
  instrument,
  onAllocate,
  availableBalance,
}: {
  instrument: InvestmentInstrument
  onAllocate?: (instrumentId: string, amount: number) => void
  availableBalance: number
}) {
  const [showAllocate, setShowAllocate] = useState(false)
  const [allocateAmount, setAllocateAmount] = useState('')

  const canAllocate = availableBalance >= instrument.minimumInvestment

  const handleAllocate = () => {
    const amount = parseFloat(allocateAmount)
    if (amount >= instrument.minimumInvestment && amount <= availableBalance) {
      onAllocate?.(instrument.id, amount)
      setShowAllocate(false)
      setAllocateAmount('')
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">{instrument.name}</h3>
          {instrument.ticker && (
            <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">{instrument.ticker}</span>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {instrument.currentYield.toFixed(2)}%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">APY</p>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
        {instrument.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${riskColors[instrument.riskLevel].bg} ${riskColors[instrument.riskLevel].text}`}>
          {riskLabels[instrument.riskLevel]} Risk
        </span>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400">
          {instrument.liquidityDays === 1 ? 'Next-day' : `${instrument.liquidityDays}-day`} liquidity
        </span>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400">
          Min: {formatCurrency(instrument.minimumInvestment)}
        </span>
      </div>

      {!showAllocate ? (
        <button
          onClick={() => setShowAllocate(true)}
          disabled={!canAllocate}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
        >
          {canAllocate ? 'Invest' : 'Insufficient Balance'}
        </button>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
              Amount (min: {formatCurrency(instrument.minimumInvestment)})
            </label>
            <input
              type="number"
              value={allocateAmount}
              onChange={(e) => setAllocateAmount(e.target.value)}
              min={instrument.minimumInvestment}
              max={availableBalance}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAllocate}
              disabled={parseFloat(allocateAmount) < instrument.minimumInvestment}
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowAllocate(false)}
              className="flex-1 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function InvestmentManager({
  investments,
  instruments,
  availableBalance,
  onAllocate,
  onWithdraw,
  onAdjustAllocation,
}: InvestmentManagerProps) {
  const totalInvested = investments.reduce((sum, inv) => sum + inv.allocatedAmount, 0)
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalGain = totalValue - totalInvested
  const weightedYield = investments.length > 0
    ? investments.reduce((sum, inv) => sum + (inv.annualYield * inv.currentValue), 0) / totalValue
    : 0

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Investment Manager
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Configure and monitor low-risk investment allocations
          </p>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Available to Invest</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatCurrency(availableBalance)}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Invested</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              {formatCurrency(totalInvested)}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Current Value</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatCurrency(totalValue)}
            </p>
            <p className={`text-sm ${totalGain >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {totalGain >= 0 ? '+' : ''}{formatCurrency(totalGain)} returns
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Avg. Yield</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {weightedYield.toFixed(2)}%
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">weighted APY</p>
          </div>
        </div>

        {/* Current Investments */}
        {investments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Your Investments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {investments.map((investment) => (
                <InvestmentCard
                  key={investment.id}
                  investment={investment}
                  onWithdraw={onWithdraw}
                />
              ))}
            </div>
          </div>
        )}

        {/* Available Instruments */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Available Instruments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {instruments.map((instrument) => (
              <InstrumentCard
                key={instrument.id}
                instrument={instrument}
                onAllocate={onAllocate}
                availableBalance={availableBalance}
              />
            ))}
          </div>
        </div>

        {/* Empty State */}
        {investments.length === 0 && instruments.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <svg className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <p className="text-lg font-medium text-slate-900 dark:text-white">No investment options available</p>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Investment instruments will appear here when configured
            </p>
          </div>
        )}

        {/* Risk Disclaimer */}
        <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              All investments carry risk. Past performance is not indicative of future results.
              Investment values may fluctuate. Please review each instrument's terms before investing.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
