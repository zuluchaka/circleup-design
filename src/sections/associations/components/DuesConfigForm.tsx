import { useState, useEffect } from 'react'
import { useAssociationLedger } from '../../hooks/useAssociationLedger'
import type { DuesConfigFrequency } from '@/../product/sections/associations/types'

interface DuesConfigFormProps {
  associationId: string
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
    </div>
  )
}

export function DuesConfigForm({ associationId }: DuesConfigFormProps) {
  const { duesConfig, loading, error, loadDuesConfig, saveDuesConfig } = useAssociationLedger(associationId)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState<DuesConfigFrequency>('monthly')
  const [dueDay, setDueDay] = useState('1')
  const [gracePeriodDays, setGracePeriodDays] = useState('7')
  const [lateFeeAmount, setLateFeeAmount] = useState('0')
  const [lateFeePercentage, setLateFeePercentage] = useState('0')
  const [currency, setCurrency] = useState('CHF')
  const [active, setActive] = useState(true)

  useEffect(() => {
    loadDuesConfig()
  }, [loadDuesConfig])

  useEffect(() => {
    if (duesConfig) {
      setAmount(duesConfig.amount.toString())
      setFrequency(duesConfig.frequency)
      setDueDay(duesConfig.dueDay.toString())
      setGracePeriodDays(duesConfig.gracePeriodDays.toString())
      setLateFeeAmount(duesConfig.lateFeeAmount.toString())
      setLateFeePercentage(duesConfig.lateFeePercentage.toString())
      setCurrency(duesConfig.currency)
      setActive(duesConfig.active)
    }
  }, [duesConfig])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)
    try {
      await saveDuesConfig({
        amount: parseFloat(amount),
        frequency,
        due_day: parseInt(dueDay, 10),
        grace_period_days: parseInt(gracePeriodDays, 10),
        late_fee_amount: parseFloat(lateFeeAmount),
        late_fee_percentage: parseFloat(lateFeePercentage),
        currency,
        active,
      })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Failed to save config')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <button onClick={() => loadDuesConfig()} className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800">
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Dues Configuration</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        {duesConfig ? 'Update your association dues settings.' : 'Set up dues collection for your association.'}
      </p>

      {saveSuccess && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
          <p className="text-sm text-emerald-700 dark:text-emerald-400">Configuration saved successfully.</p>
        </div>
      )}

      {saveError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-400">{saveError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount</label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Frequency</label>
          <select
            value={frequency}
            onChange={e => setFrequency(e.target.value as DuesConfigFrequency)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Due Day (1-28)</label>
          <input
            type="number"
            min="1"
            max="28"
            required
            value={dueDay}
            onChange={e => setDueDay(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Grace Period (days)</label>
          <input
            type="number"
            min="0"
            required
            value={gracePeriodDays}
            onChange={e => setGracePeriodDays(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Late Fee Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={lateFeeAmount}
              onChange={e => setLateFeeAmount(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Late Fee Percentage (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={lateFeePercentage}
              onChange={e => setLateFeePercentage(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Currency</label>
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="CHF">CHF</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActive(!active)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              active ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              active ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {active ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {duesConfig ? 'Update Configuration' : 'Create Configuration'}
          </button>
        </div>
      </form>
    </div>
  )
}
