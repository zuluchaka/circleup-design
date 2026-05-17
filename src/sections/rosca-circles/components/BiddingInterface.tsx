import { useState, useEffect } from 'react'
import type { BiddingProps, BidStatus } from '@/../product/sections/rosca-circles/types'

const bidStatusColors: Record<BidStatus, string> = {
  winning: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  outbid: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400',
  withdrawn: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export function BiddingInterface({
  circle,
  cycle,
  bids,
  currentUserId,
  biddingEndsAt,
  minimumBid,
  onSubmitBid,
  onWithdrawBid,
}: BiddingProps) {
  const [bidAmount, setBidAmount] = useState(minimumBid)
  const [bidReason, setBidReason] = useState('')
  const [timeRemaining, setTimeRemaining] = useState('')

  const myBid = bids.find((b) => b.participantId === currentUserId)
  const winningBid = bids.find((b) => b.status === 'winning')
  const sortedBids = [...bids].sort((a, b) => b.bidAmount - a.bidAmount)

  // Calculate max payout amount
  const maxPayout = circle.contributionAmount * circle.maxParticipants * (1 - circle.emergencyFundRate / 100)

  // Countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const end = new Date(biddingEndsAt).getTime()
      const now = Date.now()
      const diff = end - now

      if (diff <= 0) {
        setTimeRemaining('Bidding closed')
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      if (hours > 24) {
        const days = Math.floor(hours / 24)
        setTimeRemaining(`${days}d ${hours % 24}h remaining`)
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m remaining`)
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s remaining`)
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [biddingEndsAt])

  const isBiddingOpen = new Date(biddingEndsAt).getTime() > Date.now()

  const handleSubmitBid = () => {
    onSubmitBid?.(bidAmount, bidReason || undefined)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Payout Bidding
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                {circle.name} • Cycle {cycle}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg ${
              isBiddingOpen
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{timeRemaining}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* How Bidding Works */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
              <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-3">
                How Bidding Works
              </h2>
              <ul className="space-y-2 text-sm text-indigo-800 dark:text-indigo-200">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                  <span>Submit a bid indicating how much discount you're willing to take from your payout</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                  <span>Higher bids (larger discounts) win the early payout position</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                  <span>The discount amount goes to the emergency fund, benefiting all members</span>
                </li>
              </ul>
            </div>

            {/* Submit Bid Form */}
            {isBiddingOpen && !myBid && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Submit Your Bid
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Bid Amount (Discount)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        {circle.currency}
                      </span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        min={minimumBid}
                        max={maxPayout * 0.5}
                        className="w-full pl-14 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        Minimum: {circle.currency} {minimumBid.toLocaleString()}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">
                        You'll receive: {circle.currency} {(maxPayout - bidAmount).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Bid slider visualization */}
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-500 dark:text-slate-400">Full Payout</span>
                      <span className="text-slate-500 dark:text-slate-400">50% Discount</span>
                    </div>
                    <input
                      type="range"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      min={minimumBid}
                      max={maxPayout * 0.5}
                      step={10}
                      className="w-full"
                    />
                    <div className="mt-2 text-center">
                      <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                        {((bidAmount / maxPayout) * 100).toFixed(1)}% discount
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Reason (Optional)
                    </label>
                    <textarea
                      value={bidReason}
                      onChange={(e) => setBidReason(e.target.value)}
                      rows={2}
                      placeholder="Why do you need the early payout?"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={handleSubmitBid}
                    className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
                  >
                    Submit Bid
                  </button>
                </div>
              </div>
            )}

            {/* My Bid */}
            {myBid && (
              <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border p-6 ${
                myBid.status === 'winning'
                  ? 'border-emerald-500 dark:border-emerald-400'
                  : 'border-slate-200 dark:border-slate-700'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Your Bid
                  </h2>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${bidStatusColors[myBid.status]}`}>
                    {myBid.status === 'winning' ? 'Currently Winning!' : myBid.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Your Bid</p>
                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {circle.currency} {myBid.bidAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      ({myBid.discountPercent}% discount)
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <p className="text-sm text-slate-500 dark:text-slate-400">You'll Receive</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      {circle.currency} {(maxPayout - myBid.bidAmount).toLocaleString()}
                    </p>
                  </div>
                </div>

                {myBid.reason && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    <span className="font-medium">Your reason:</span> {myBid.reason}
                  </p>
                )}

                {isBiddingOpen && myBid.status !== 'withdrawn' && onWithdrawBid && (
                  <button
                    onClick={() => onWithdrawBid(myBid.id)}
                    className="text-sm text-red-600 dark:text-red-400 hover:underline"
                  >
                    Withdraw Bid
                  </button>
                )}
              </div>
            )}

            {/* All Bids */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                All Bids ({bids.filter((b) => b.status !== 'withdrawn').length})
              </h2>

              {sortedBids.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                  No bids yet. Be the first to bid!
                </p>
              ) : (
                <div className="space-y-3">
                  {sortedBids.map((bid, idx) => (
                    <div
                      key={bid.id}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        bid.status === 'winning'
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-50 dark:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          idx === 0
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                            : 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300'
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {bid.participantName}
                            {bid.participantId === currentUserId && (
                              <span className="ml-2 text-sm text-indigo-600 dark:text-indigo-400">(You)</span>
                            )}
                          </p>
                          {bid.reason && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs">
                              {bid.reason}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {circle.currency} {bid.bidAmount.toLocaleString()}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${bidStatusColors[bid.status]}`}>
                          {bid.discountPercent}% off
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Winner */}
            {winningBid && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Current Winner
                </h3>
                <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
                  {winningBid.participantName}
                </p>
                <p className="text-emerald-700 dark:text-emerald-300">
                  Bid: {circle.currency} {winningBid.bidAmount.toLocaleString()}
                </p>
              </div>
            )}

            {/* Payout Info */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                Payout Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Max Payout</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {circle.currency} {maxPayout.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Minimum Bid</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {circle.currency} {minimumBid.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Cycle</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {cycle} of {circle.duration}
                  </span>
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-700" />
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Bidding Ends</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {new Date(biddingEndsAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-3">
                Bidding Tips
              </h3>
              <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                <li>• Only bid if you truly need the early payout</li>
                <li>• Higher bids are more likely to win</li>
                <li>• You can withdraw your bid before bidding closes</li>
                <li>• The discount helps protect all members through the emergency fund</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
