import React, { useState, useEffect, useRef, useCallback } from 'react'

interface DropdownOption {
  value: string
  label: string
  icon?: string
}

interface GenericDropdownProps {
  currentValue: string
  options: DropdownOption[]
  onChange: (value: string) => void
  placeholder: string
  buttonIcon: string
  ariaLabel: string
  isLoading?: boolean
}

export default function GenericDropdown({
  currentValue,
  options,
  onChange,
  placeholder,
  buttonIcon,
  ariaLabel,
  isLoading = false
}: GenericDropdownProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleChange = useCallback(async (newValue: string) => {
    if (newValue === currentValue) {
      setShowMenu(false)
      setFocusedIndex(-1)
      setSearchTerm('')
      return
    }

    try {
      await onChange(newValue)
      setShowMenu(false)
      setFocusedIndex(-1)
      setSearchTerm('')
    } catch (error) {
      console.error('Dropdown change failed:', error)
    }
  }, [currentValue, onChange])

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMenu(false)
        setFocusedIndex(-1)
        setSearchTerm('')
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowMenu(false)
        setFocusedIndex(-1)
        setSearchTerm('')
        buttonRef.current?.focus()
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showMenu])

  // Focus trap for arrow key navigation
  useEffect(() => {
    if (!showMenu) return

    const handleArrowKeys = (event: KeyboardEvent) => {
      if (!['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) return

      event.preventDefault()

      const maxIndex = filteredOptions.length - 1

      if (event.key === 'ArrowDown') {
        setFocusedIndex(prev => prev < maxIndex ? prev + 1 : 0)
      } else if (event.key === 'ArrowUp') {
        setFocusedIndex(prev => prev > 0 ? prev - 1 : maxIndex)
      } else if ((event.key === 'Enter' || event.key === ' ') && focusedIndex >= 0) {
        handleChange(filteredOptions[focusedIndex].value)
      }
    }

    const handleTypeAhead = (event: KeyboardEvent) => {
      if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
        setSearchTerm(prev => prev + event.key)
        // Reset search after 1 second
        setTimeout(() => setSearchTerm(''), 1000)
      }
    }

    document.addEventListener('keydown', handleArrowKeys)
    document.addEventListener('keydown', handleTypeAhead)

    return () => {
      document.removeEventListener('keydown', handleArrowKeys)
      document.removeEventListener('keydown', handleTypeAhead)
    }
  }, [showMenu, focusedIndex, filteredOptions, handleChange])

  // Focus first option when menu opens
  useEffect(() => {
    if (showMenu && filteredOptions.length > 0) {
      setFocusedIndex(0)
    }
  }, [showMenu, filteredOptions.length])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setShowMenu(!showMenu)
      setFocusedIndex(-1)
      setSearchTerm('')
    } else if (event.key === 'ArrowDown' && !showMenu) {
      event.preventDefault()
      setShowMenu(true)
      setFocusedIndex(0)
    }
  }

  const currentOption = options.find(option => option.value === currentValue)

  return (
    <div className="generic-dropdown" ref={dropdownRef}>
      <button
        ref={buttonRef}
        className="generic-current"
        onClick={() => {
          setShowMenu(!showMenu)
          setFocusedIndex(-1)
          setSearchTerm('')
        }}
        onKeyDown={handleKeyDown}
        aria-expanded={showMenu}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        type="button"
        disabled={isLoading}
      >
        <i className={buttonIcon} aria-hidden="true"></i>
        <span className="generic-text">
          {currentOption?.label || placeholder}
        </span>
        <i className={`bi bi-chevron-down chevron-icon ${showMenu ? 'rotated' : ''}`} aria-hidden="true"></i>
        {isLoading && <i className="bi bi-arrow-clockwise loading-spinner" aria-hidden="true"></i>}
      </button>
      {showMenu && (
        <div
          ref={menuRef}
          className="generic-menu"
          role="listbox"
          aria-label={`${placeholder} options`}
          aria-activedescendant={focusedIndex >= 0 ? `option-${focusedIndex}` : undefined}
        >
          {filteredOptions.map((option, index) => (
            <button
              key={option.value}
              id={`option-${index}`}
              onClick={() => handleChange(option.value)}
              className={`generic-option ${currentValue === option.value ? 'active' : ''} ${focusedIndex === index ? 'focused' : ''}`}
              role="option"
              aria-selected={currentValue === option.value}
              disabled={isLoading}
              type="button"
            >
              {option.icon && <span className="option-icon" aria-hidden="true">{option.icon}</span>}
              <span className="option-label">{option.label}</span>
            </button>
          ))}
          {filteredOptions.length === 0 && searchTerm && (
            <div className="generic-no-results" role="status" aria-live="polite">
              No options found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}
