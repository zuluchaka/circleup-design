import { MultiCurrencySettings } from './components'
import sampleData from '@/../product/sections/treasury-and-funds/data.json'
import type { CurrencyPreference, ExchangeRate } from '@/../product/sections/treasury-and-funds/types'

export default function MultiCurrencySettingsPreview() {
  const handleUpdatePreferences = (circleId: string, preferences: Partial<CurrencyPreference>) => {
    console.log('Update preferences:', circleId, preferences)
  }

  const handleSetupAlert = (circleId: string, threshold: number) => {
    console.log('Setup alert:', circleId, threshold)
  }

  const handleConvert = (amount: number, from: string, to: string) => {
    console.log('Convert:', amount, from, to)
    // Find rate and return converted amount
    const rate = sampleData.exchangeRates.find(
      (r) => r.baseCurrency === from && r.targetCurrency === to
    )
    return rate ? amount * rate.rate : amount
  }

  return (
    <MultiCurrencySettings
      preferences={sampleData.currencyPreferences as CurrencyPreference[]}
      exchangeRates={sampleData.exchangeRates as ExchangeRate[]}
      onUpdatePreferences={handleUpdatePreferences}
      onSetupAlert={handleSetupAlert}
      onConvert={handleConvert}
    />
  )
}
