import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import { cx } from '@/lib/cx';
import { formatNumber } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from './PromotionPicker.module.css';

const RESULT_LIMIT = 100;

export interface PromotionPickerOption {
    id: number;
    label: string;
    searchText?: string;
}

interface PromotionPickerProps {
    id: string;
    label: string;
    options: PromotionPickerOption[];
    selected: number[];
    onChange: (selected: number[]) => void;
    placeholder: string;
    emptyMessage: string;
    hint?: string;
    error?: string;
}

const normalize = (value: string): string =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/đ/g, 'd')
        .trim();

export default function PromotionPicker({ id, label, options, selected, onChange, placeholder, emptyMessage, hint, error }: PromotionPickerProps) {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');

    const selectedSet = useMemo(() => new Set(selected), [selected]);
    const filteredOptions = useMemo(() => {
        const normalizedQuery = normalize(query);

        if (!normalizedQuery) {
            return options;
        }

        return options.filter((option) => normalize(option.searchText ?? option.label).includes(normalizedQuery));
    }, [options, query]);

    const visibleOptions = filteredOptions.slice(0, RESULT_LIMIT);

    const toggleOption = (optionId: number) => {
        if (selectedSet.has(optionId)) {
            onChange(selected.filter((value) => value !== optionId));
            return;
        }

        onChange([...selected, optionId]);
    };

    return (
        <fieldset className={styles.picker}>
            <legend className="sn-field__label">{label}</legend>

            <Input
                id={`${id}-search`}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                    }
                }}
                placeholder={placeholder}
                aria-label={placeholder}
                leadingIcon={Search}
                autoComplete="off"
            />

            <div className={styles.toolbar}>
                <span>
                    {t('Selected')}: {formatNumber(selected.length)}
                </span>
                {selected.length > 0 && (
                    <button type="button" className={styles.clear} onClick={() => onChange([])}>
                        {t('Clear selection')}
                    </button>
                )}
            </div>

            <div className={styles.list}>
                {visibleOptions.length > 0 ? (
                    visibleOptions.map((option) => {
                        const checked = selectedSet.has(option.id);

                        return (
                            <label key={option.id} className={cx(styles.option, checked && styles.optionChecked)}>
                                <input type="checkbox" className={styles.checkbox} checked={checked} onChange={() => toggleOption(option.id)} />
                                <span className={styles.optionLabel}>{option.label}</span>
                            </label>
                        );
                    })
                ) : (
                    <p className={styles.empty}>{emptyMessage}</p>
                )}
            </div>

            {filteredOptions.length > RESULT_LIMIT && <span className={styles.hint}>{t('First 100 results shown. Search narrows the list.')}</span>}

            {error ? (
                <span className={styles.error} role="alert">
                    {error}
                </span>
            ) : (
                hint && <span className={styles.hint}>{hint}</span>
            )}
        </fieldset>
    );
}
