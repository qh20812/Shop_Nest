import React, { useState } from 'react'
import { router } from '@inertiajs/react'
import GenericDropdown from './GenericDropdown'

export default function CurrencyDropdown({ currency }: { currency: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const options = [
    { value: 'VND', label: 'VND', icon: '₫' },
    { value: 'USD', label: 'USD', icon: '$' }
  ]

  const handleCurrencyChange = async (newCurrency: string) => {
    setIsLoading(true)
    try {
      await router.post('/currency', { currency: newCurrency })
    } catch (error) {
      console.error('Currency change failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GenericDropdown
      currentValue={currency}
      options={options}
      onChange={handleCurrencyChange}
      placeholder="Select Currency"
      buttonIcon="bi bi-cash"
      ariaLabel={`Select currency. Current: ${currency}`}
      isLoading={isLoading}
    />
  )
}