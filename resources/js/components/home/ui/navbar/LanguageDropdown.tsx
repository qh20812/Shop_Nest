import React, { useState } from 'react'
import { router } from '@inertiajs/react'
import GenericDropdown from './GenericDropdown'

export default function LanguageDropdown({ locale }: { locale: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const options = [
    { value: 'vi', label: 'Tiếng Việt', icon: '🇻🇳' },
    { value: 'en', label: 'English', icon: '🇺🇸' }
  ]

  const handleLanguageChange = async (newLocale: string) => {
    setIsLoading(true)
    try {
      await router.post('/language', { locale: newLocale })
    } catch (error) {
      console.error('Language change failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GenericDropdown
      currentValue={locale}
      options={options}
      onChange={handleLanguageChange}
      placeholder="Select Language"
      buttonIcon="bi bi-translate"
      ariaLabel={`Select language. Current: ${locale === 'vi' ? 'Tiếng Việt' : 'English'}`}
      isLoading={isLoading}
    />
  )
}