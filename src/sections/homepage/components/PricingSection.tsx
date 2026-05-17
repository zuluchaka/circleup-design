import type { PricingTier, FeeItem, BillingPeriod } from '@/../product/sections/homepage/types'

const billingLabels: Record<BillingPeriod, string> = {
  forever: 'forever',
  month: '/month',
  year: '/year',
  custom: 'custom',
}

function PricingCard({
  tier,
  onSelect,
  onContactSales,
}: {
  tier: PricingTier
  onSelect?: () => void
  onContactSales?: () => void
}) {
  const isEnterprise = tier.price === null
  const isHighlighted = tier.highlighted

  return (
    <div
      className={`relative rounded-2xl ${
        isHighlighted
          ? 'bg-gradient-to-b from-indigo-600 to-indigo-700 text-white shadow-xl shadow-indigo-500/30 scale-105 z-10'
          : 'bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50'
      }`}
    >
      {/* Popular badge */}
      {isHighlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-block px-4 py-1 bg-amber-400 text-slate-900 text-sm font-semibold rounded-full shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6">
          <h3
            className={`text-xl font-semibold mb-2 ${
              isHighlighted ? 'text-white' : 'text-slate-900 dark:text-white'
            }`}
          >
            {tier.name}
          </h3>
          <p
            className={`text-sm ${
              isHighlighted ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {tier.description}
          </p>
        </div>

        {/* Price */}
        <div className="mb-6">
          {isEnterprise ? (
            <div className="flex items-baseline">
              <span
                className={`text-3xl font-bold ${
                  isHighlighted ? 'text-white' : 'text-slate-900 dark:text-white'
                }`}
              >
                Custom
              </span>
            </div>
          ) : (
            <div className="flex items-baseline">
              <span
                className={`text-4xl font-bold ${
                  isHighlighted ? 'text-white' : 'text-slate-900 dark:text-white'
                }`}
              >
                {tier.price === 0 ? 'Free' : `CHF ${tier.price}`}
              </span>
              {tier.price !== 0 && (
                <span
                  className={`ml-1 text-sm ${
                    isHighlighted ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {billingLabels[tier.billingPeriod]}
                </span>
              )}
            </div>
          )}
          <p
            className={`text-sm mt-2 ${
              isHighlighted ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {tier.platformFee}% platform fee
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={isEnterprise ? onContactSales : onSelect}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
            isHighlighted
              ? 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25'
          }`}
        >
          {tier.ctaText}
        </button>

        {/* Features */}
        <ul className="mt-8 space-y-3">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <svg
                className={`w-5 h-5 flex-shrink-0 ${
                  isHighlighted ? 'text-amber-300' : 'text-emerald-500'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span
                className={`text-sm ${
                  isHighlighted ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* Limitations */}
        {tier.limitations.length > 0 && (
          <ul className="mt-4 pt-4 border-t border-slate-200/20 dark:border-slate-700/30 space-y-2">
            {tier.limitations.map((limitation, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg
                  className={`w-5 h-5 flex-shrink-0 ${
                    isHighlighted ? 'text-indigo-300' : 'text-slate-400 dark:text-slate-500'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
                <span
                  className={`text-sm ${
                    isHighlighted ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-500'
                  }`}
                >
                  {limitation}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function FeeBreakdown({ fees }: { fees: FeeItem[] }) {
  return (
    <div className="mt-16 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 sm:p-8">
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 text-center">
        Complete Fee Transparency
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fees.map((fee) => (
          <div
            key={fee.id}
            className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-slate-900 dark:text-white">{fee.name}</h4>
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {fee.rate}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{fee.description}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              <span className="font-medium">Example:</span> {fee.example}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

interface PricingSectionProps {
  tiers: PricingTier[]
  feeStructure: FeeItem[]
  onSelectTier?: (tierId: string) => void
  onContactSales?: () => void
}

export function PricingSection({
  tiers,
  feeStructure,
  onSelectTier,
  onContactSales,
}: PricingSectionProps) {
  return (
    <section className="py-20 sm:py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-medium rounded-full mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Start free, upgrade when you need more. No hidden fees, ever.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 items-start">
          {tiers.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              onSelect={() => onSelectTier?.(tier.id)}
              onContactSales={onContactSales}
            />
          ))}
        </div>

        {/* Fee breakdown */}
        <FeeBreakdown fees={feeStructure} />

        {/* No credit card note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            No credit card required for free trial. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
