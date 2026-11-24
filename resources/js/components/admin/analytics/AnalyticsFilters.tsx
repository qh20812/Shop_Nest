import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import FormField from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tabs } from '@/components/ui/tabs';
import { useTranslation } from '@/lib/i18n';

import styles from './analytics.module.css';

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
    const filterEntries = useMemo(() => Object.entries(filters) as Array<[string, AnalyticsFilterValue]>, [filters]);

    const handleUpdate = (key: string, value: AnalyticsFilterValue) => {
        onFilterChange({
            ...filters,
            [key]: value,
        });
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

    const periodRaw = filters['period'];
    const periodValue = typeof periodRaw === 'string' ? periodRaw : '';

    const renderFilterControl = (key: string, value: AnalyticsFilterValue) => {
        if (optionKeys.includes(key)) {
            const options = availableOptions[key] ?? [];

            return (
                <FormField key={key} label={t(key)} htmlFor={`analytics-filter-${key}`}>
                    <Select
                        id={`analytics-filter-${key}`}
                        name={key}
                        value={String(value ?? '')}
                        onChange={(event) => handleUpdate(key, event.target.value)}
                    >
                        <option value="">{t('All')}</option>
                        {options.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </Select>
                </FormField>
            );
        }

        if (isDateKey(key)) {
            return (
                <FormField key={key} label={t(key)} htmlFor={`analytics-filter-${key}`}>
                    <Input
                        id={`analytics-filter-${key}`}
                        type="date"
                        name={key}
                        value={String(value ?? '')}
                        onChange={(event) => handleUpdate(key, event.target.value)}
                    />
                </FormField>
            );
        }

        if (typeof value === 'number') {
            return (
                <FormField key={key} label={t(key)} htmlFor={`analytics-filter-${key}`}>
                    <Input
                        id={`analytics-filter-${key}`}
                        type="number"
                        name={key}
                        value={value}
                        onChange={(event) => handleUpdate(key, event.target.value === '' ? '' : Number(event.target.value))}
                    />
                </FormField>
            );
        }

        return (
            <FormField key={key} label={t(key)} htmlFor={`analytics-filter-${key}`}>
                <Input
                    id={`analytics-filter-${key}`}
                    type="text"
                    name={key}
                    value={String(value ?? '')}
                    onChange={(event) => handleUpdate(key, event.target.value)}
                />
            </FormField>
        );
    };

    return (
        <section className={styles.filters}>
            <div className={styles.filtersHead}>
                <div className={styles.filtersTitles}>
                    <h3 className={styles.filtersTitle}>{title ? t(title) : t('Filters')}</h3>
                    {description ? <p className={styles.filtersDescription}>{description}</p> : null}
                </div>

                <div className={styles.filtersActions}>
                    {quickRanges && quickRanges.length > 0 ? (
                        <Tabs
                            variant="filter"
                            items={quickRanges.map((range) => ({ value: range.value, label: t(range.label) }))}
                            value={periodValue}
                            onValueChange={(value) => handleUpdate('period', value)}
                            ariaLabel={t('Quick filters')}
                        />
                    ) : null}

                    <Button type="button" variant="ghost" size="sm" onClick={resetHandler}>
                        <RotateCcw aria-hidden="true" />
                        {t('Reset')}
                    </Button>

                    {isCollapsible ? (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setCollapsed((prev) => !prev)}
                            aria-expanded={!collapsed}
                            aria-label={collapsed ? t('Show filters') : t('Hide filters')}
                        >
                            {collapsed ? <ChevronDown aria-hidden="true" /> : <ChevronUp aria-hidden="true" />}
                        </Button>
                    ) : null}
                </div>
            </div>

            {!collapsed ? (
                <>
                    <div className={styles.filtersGrid}>{filterEntries.map(([key, value]) => renderFilterControl(key, value))}</div>
                    {children ? <div className={styles.filtersCustom}>{children}</div> : null}
                </>
            ) : null}
        </section>
    );
};

export default AnalyticsFilters;
