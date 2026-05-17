import { useState } from 'react'
import type { MultiCurrencySettingsProps, CurrencyPreference, ExchangeRate } from '@/../product/sections/treasury-and-funds/types'

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '\u20AC',
  GBP: '\u00A3',
  CHF: 'CHF',
  JPY: '\u00A5',
  CAD: 'C$',
  AUD: 'A$',
}

const currencyNames: Record<string, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  CHF: 'Swiss Franc',
  JPY: 'Japanese Yen',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ExchangeRateCard({ rate }: { rate: ExchangeRate }) {
  const isPositive = rate.change24h >= 0

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
          {rate.targetCurrency}
        </div>
        <div>
          <p className="font-medium text-slate-900 dark:text-white">
            {rate.baseCurrency}/{rate.targetCurrency}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Updated {formatDate(rate.updatedAt)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-slate-900 dark:text-white">
          {rate.rate.toFixed(4)}
        </p>
        <p className={`text-sm font-medium ${
          isPositive
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-red-600 dark:text-red-400'
        }`}>
          {isPositive ? '+' : ''}{rate.change24h.toFixed(2)}%
        </p>
      </div>
    </div>
  )
}

function CirclePreferenceCard({
  preference,
  exchangeRates: _exchangeRates,
  onUpdate,
  onSetupAlert,
}: {
  preference: CurrencyPreference
  exchangeRates: ExchangeRate[]
  onUpdate?: (circleId: string, prefs: Partial<CurrencyPreference>) => void
  onSetupAlert?: (circleId: string, threshold: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [payoutMode, setPayoutMode] = useState(preference.payoutMode)
  const [enableMulti, setEnableMulti] = useState(preference.enableMultiCurrency)
  const [alertThreshold, setAlertThreshold] = useState(
    preference.exchangeRateAlertThreshold?.toString() || ''
  )

  const handleSave = () => {
    onUpdate?.(preference.circleId, {
      payoutMode,
      enableMultiCurrency: enableMulti,
      exchangeRateAlertThreshold: alertThreshold ? parseFloat(alertThreshold) : null,
    })
    if (alertThreshold) {
      onSetupAlert?.(preference.circleId, parseFloat(alertThreshold))
    }
    setEditing(false)
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{preference.circleName}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Base: {currencyNames[preference.baseCurrency]} ({preference.baseCurrency})
            </p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>

        {!editing ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">Payout Currency</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {currencySymbols[preference.payoutCurrency]} {preference.payoutCurrency}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">Payout Mode</span>
              <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${
                preference.payoutMode === 'fixed'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
                {preference.payoutMode === 'fixed' ? 'Fixed' : 'Floating'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">Multi-Currency</span>
              <span className={`text-sm font-medium ${
                preference.enableMultiCurrency
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}>
                {preference.enableMultiCurrency ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            {preference.alternativeCurrencies && preference.alternativeCurrencies.length > 0 && (
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Alternative Currencies</span>
                <div className="flex gap-1">
                  {preference.alternativeCurrencies.map((curr) => (
                    <span key={curr} className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded">
                      {curr}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {preference.exchangeRateAlertThreshold && (
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500 dark:text-slate-400">Rate Alert</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {preference.exchangeRateAlertThreshold}% change
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Payout Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPayoutMode('fixed')}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    payoutMode === 'fixed'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Fixed
                </button>
                <button
                  onClick={() => setPayoutMode('floating')}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    payoutMode === 'floating'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Floating
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {payoutMode === 'fixed'
                  ? 'Payouts in the base currency only'
                  : 'Payouts converted at current exchange rate'}
              </p>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableMulti}
                  onChange={(e) => setEnableMulti(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Enable multi-currency payouts
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Exchange Rate Alert (% change)
              </label>
              <input
                type="number"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
                placeholder="e.g., 2.5"
                step="0.5"
                min="0.5"
                max="10"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
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

function CurrencyConverter({
  exchangeRates,
  onConvert: _onConvert,
}: {
  exchangeRates: ExchangeRate[]
  onConvert?: (amount: number, from: string, to: string) => number
}) {
  const [amount, setAmount] = useState('100')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')

  const findRate = () => {
    const rate = exchangeRates.find(
      (r) => r.baseCurrency === fromCurrency && r.targetCurrency === toCurrency
    )
    return rate?.rate || 0
  }

  const convertedAmount = parseFloat(amount || '0') * findRate()
  const currencies = [...new Set(exchangeRates.flatMap((r) => [r.baseCurrency, r.targetCurrency]))]

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Currency Converter</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">Amount</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => {
              const temp = fromCurrency
              setFromCurrency(toCurrency)
              setToCurrency(temp)
            }}
            className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        <div>
          <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">Converted</label>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {currencySymbols[toCurrency]}{convertedAmount.toFixed(2)}
              </p>
            </div>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
          1 {fromCurrency} = {findRate().toFixed(4)} {toCurrency}
        </p>
      </div>
    </div>
  )
}

export function MultiCurrencySettings({
  preferences,
  exchangeRates,
  onUpdatePreferences,
  onSetupAlert,
  onConvert,
}: MultiCurrencySettingsProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Multi-Currency Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Configure payout currency preferences and view exchange rates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Exchange Rates */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Current Exchange Rates
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {exchangeRates.map((rate, idx) => (
                  <ExchangeRateCard key={idx} rate={rate} />
                ))}
              </div>
              {exchangeRates.length === 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                  <p className="text-slate-500 dark:text-slate-400">No exchange rates available</p>
                </div>
              )}
            </div>

            {/* Circle Preferences */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Circle Currency Settings
              </h2>
              <div className="space-y-4">
                {preferences.map((pref) => (
                  <CirclePreferenceCard
                    key={pref.id}
                    preference={pref}
                    exchangeRates={exchangeRates}
                    onUpdate={onUpdatePreferences}
                    onSetupAlert={onSetupAlert}
                  />
                ))}
              </div>
              {preferences.length === 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                  <p className="text-slate-500 dark:text-slate-400">No circles configured</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CurrencyConverter exchangeRates={exchangeRates} onConvert={onConvert} />

            {/* Info Card */}
            <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-indigo-800 dark:text-indigo-200">About Payout Modes</p>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                    <strong>Fixed:</strong> Payouts are always in the circle's base currency.
                  </p>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                    <strong>Floating:</strong> Payouts can be received in alternative currencies at current exchange rates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
