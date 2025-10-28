import React, { useState } from 'react'

interface QuickActionItem {
  id: string
  icon: string
  label: string
  onClick?: () => void
  href?: string
  disabled?: boolean
  loading?: boolean
}

interface QuickActionsProps {
  actions: QuickActionItem[]
  className?: string
}

export default function QuickActions({ actions, className = '' }: QuickActionsProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const handleActionClick = async (action: QuickActionItem) => {
    if (action.disabled || loadingStates[action.id]) return

    if (action.onClick) {
      setLoadingStates(prev => ({ ...prev, [action.id]: true }))
      try {
        await action.onClick()
      } catch (error) {
        console.error(`Error executing action ${action.id}:`, error)
      } finally {
        setLoadingStates(prev => ({ ...prev, [action.id]: false }))
      }
    }
  }

  return (
    <div className={`quick-action ${className}`} role="navigation" aria-label="Quick actions">
      {actions.map((action) => {
        const isLoading = loadingStates[action.id] || action.loading
        const isDisabled = action.disabled || isLoading

        const buttonContent = (
          <>
            <i className={`bi ${action.icon} quick-action-icon ${action.icon.split('-')[1] ? `icon-${action.icon.split('-')[1]}` : ''}`}></i>
            <span>{action.label}</span>
            {isLoading && (
              <div className="action-loading-spinner" aria-hidden="true">
                <div className="spinner"></div>
              </div>
            )}
          </>
        )

        if (action.href && !isDisabled) {
          return (
            <a
              key={action.id}
              href={action.href}
              className="quick-action-btn"
              aria-label={action.label}
              role="button"
            >
              {buttonContent}
            </a>
          )
        }

        return (
          <button
            key={action.id}
            className="quick-action-btn"
            onClick={() => handleActionClick(action)}
            disabled={isDisabled}
            aria-label={action.label}
            aria-describedby={isLoading ? `loading-${action.id}` : undefined}
          >
            {buttonContent}
            {isLoading && (
              <span id={`loading-${action.id}`} className="sr-only">
                Đang xử lý...
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}