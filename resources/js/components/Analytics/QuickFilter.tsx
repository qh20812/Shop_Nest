import React from 'react';
import { useTranslation } from '@/lib/i18n';
import '@/../css/Page.css';

export interface QuickFilterOption {
  label: string;
  value: string;
}

export interface QuickFilterProps {
  options: QuickFilterOption[];
  activeValue?: string;
  onChange: (value: string) => void;
  className?: string;
}

const QuickFilter: React.FC<QuickFilterProps> = ({ options, activeValue, onChange, className = '' }) => {
  const { t } = useTranslation();

  if (!options.length) {
    return null;
  }

  return (
    <div className={`analytics-quick-filter ${className}`.trim()} role="group" aria-label={t('Quick filters')}>
      {options.map((option) => {
        const isActive = activeValue === option.value;

        return (
          <button
            key={option.value}
            type="button"
            className={`analytics-quick-filter__button ${isActive ? 'active' : ''}`}
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
          >
            {t(option.label)}
          </button>
        );
      })}
    </div>
  );
};

export default QuickFilter;
