import React from 'react';

import { Tabs } from '@/components/ui/tabs';
import { useTranslation } from '@/lib/i18n';

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

const QuickFilter: React.FC<QuickFilterProps> = ({ options, activeValue, onChange, className }) => {
    const { t } = useTranslation();

    if (!options.length) {
        return null;
    }

    return (
        <Tabs
            variant="filter"
            className={className}
            items={options.map((option) => ({ value: option.value, label: t(option.label) }))}
            value={activeValue ?? ''}
            onValueChange={onChange}
            ariaLabel={t('Quick filters')}
        />
    );
};

export default QuickFilter;
