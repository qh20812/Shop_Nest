import React, { useMemo, useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import '@/../css/Page.css';

export type AnalyticsFilterValue = string | number | null | undefined;

export type AnalyticsFilterState = Record<string, AnalyticsFilterValue>;

export interface AnalyticsFiltersProps {
  filters: AnalyticsFilterState;
  onFilterChange: (filters: AnalyticsFilterState) => void;
  availableOptions?: Record<string, Array<{ id: number | string; name: string }>>;
  title?: string;
  description?: string;
  quickRanges?: Array<{ label: string; value: string }>;
  isCollapsible?: boolean;
  defaultCollapsed?: boolean;
  onReset?: () => void;
  children?: React.ReactNode;
}

function isDateKey(key: string): boolean {
  const lowered = key.toLowerCase();
  return lowered.includes('date') || lowered.endsWith('from') || lowered.endsWith('to');
}

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  filters,
  onFilterChange,
  availableOptions = {},
  title,
  description,
  quickRanges,
  isCollapsible = true,
  defaultCollapsed = false,
  onReset,
  children,
}) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const optionKeys = useMemo(() => Object.keys(availableOptions), [availableOptions]);
  const filterEntries = useMemo(
    () => Object.entries(filters) as Array<[string, AnalyticsFilterValue]>,
    [filters]
  );

  const handleUpdate = (key: string, value: AnalyticsFilterValue) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    handleUpdate(name, value);
  };

  const handleQuickRange = (value: string) => {
    handleUpdate('period', value);
  };

  const resetHandler = () => {
    if (onReset) {
      onReset();
      return;
    }

    const clearedFilters: AnalyticsFilterState = {};
    Object.keys(filters).forEach((key) => {
      clearedFilters[key] = '';
    });

    onFilterChange(clearedFilters);
  };

  const renderFilterControl = (key: string, value: AnalyticsFilterValue) => {
    if (optionKeys.includes(key)) {
      const options = availableOptions[key] ?? [];
      return (
        <label key={key} className="analytics-filters__field">
          <span className="analytics-filters__label">{t(key)}</span>
          <select name={key} value={value ?? ''} onChange={handleInputChange} className="analytics-filters__select">
            <option value="">{t('All')}</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </label>
      );
    }

    if (isDateKey(key)) {
      return (
        <label key={key} className="analytics-filters__field">
          <span className="analytics-filters__label">{t(key)}</span>
          <input
            type="date"
            name={key}
            value={value ?? ''}
            onChange={handleInputChange}
            className="analytics-filters__input"
          />
        </label>
      );
    }

    if (typeof value === 'number') {
      return (
        <label key={key} className="analytics-filters__field">
          <span className="analytics-filters__label">{t(key)}</span>
          <input
            type="number"
            name={key}
            value={value ?? ''}
            onChange={(event) => {
              const nextValue = event.target.value;
              handleUpdate(key, nextValue === '' ? '' : Number(nextValue));
            }}
            className="analytics-filters__input"
          />
        </label>
      );
    }

    return (
      <label key={key} className="analytics-filters__field">
        <span className="analytics-filters__label">{t(key)}</span>
        <input
          type="text"
          name={key}
          value={value ?? ''}
          onChange={(event) => handleUpdate(key, event.target.value)}
          className="analytics-filters__input"
        />
      </label>
    );
  };

  const periodRaw = filters['period'];
  const periodValue = typeof periodRaw === 'string' ? periodRaw : '';

  return (
    <section className="analytics-filters">
      <div className="analytics-filters__header">
        <div className="analytics-filters__titles">
          <h3>{title ? t(title) : t('Filters')}</h3>
          {description ? <p>{description}</p> : null}
        </div>

        <div className="analytics-filters__actions">
          {quickRanges && quickRanges.length > 0 ? (
            <div className="analytics-filters__quick">
              {quickRanges.map((range) => (
                <button
                  key={range.value}
                  type="button"
                  className={`analytics-filters__quick-button ${periodValue === range.value ? 'active' : ''}`}
                  onClick={() => handleQuickRange(range.value)}
                >
                  {t(range.label)}
                </button>
              ))}
            </div>
          ) : null}

          <button type="button" className="analytics-filters__reset" onClick={resetHandler}>
            <i className="bx bx-rotate-left"></i>
            {t('Reset')}
          </button>

          {isCollapsible ? (
            <button
              type="button"
              className="analytics-filters__toggle"
              onClick={() => setCollapsed((prev) => !prev)}
              aria-expanded={!collapsed}
            >
              <i className={`bx ${collapsed ? 'bx-chevron-down' : 'bx-chevron-up'}`}></i>
            </button>
          ) : null}
        </div>
      </div>

      {!collapsed ? (
        <div className="analytics-filters__content">
          <div className="analytics-filters__grid">
            {filterEntries.map(([key, value]) => renderFilterControl(key, value))}
          </div>

          {children ? <div className="analytics-filters__custom">{children}</div> : null}
        </div>
      ) : null}
    </section>
  );
};

export default AnalyticsFilters;
