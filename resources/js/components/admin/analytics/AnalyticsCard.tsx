import { TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';

import styles from './analytics.module.css';

export type AnalyticsCardColor = 'blue' | 'green' | 'red' | 'yellow' | 'neutral';

export interface AnalyticsCardProps {
    title: string;
    value: string | number | React.ReactNode;
    change?: number | null;
    changeLabel?: string;
    /** Kept for API compatibility; the KPI is neutral in Phase 8. */
    icon?: string;
    /** Kept for API compatibility; colour variants are no longer rendered. */
    color?: AnalyticsCardColor;
    tooltip?: string;
    compact?: boolean;
    footer?: React.ReactNode;
    className?: string;
    valueFormatter?: (value: string | number) => React.ReactNode;
    as?: 'li' | 'div';
}

const defaultNumberFormatter = new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0,
});

function formatChange(change: number): string {
    if (Number.isNaN(change)) {
        return '0%';
    }

    return `${Math.abs(change).toFixed(Math.abs(change) < 1 ? 2 : 1)}%`;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
    title,
    value,
    change,
    changeLabel,
    tooltip,
    footer,
    className = '',
    valueFormatter,
    as: ComponentTag = 'li',
}) => {
    const hasChange = typeof change === 'number' && Number.isFinite(change);
    const trendUp = hasChange ? (change as number) >= 0 : true;
    const TrendIcon = trendUp ? TrendingUp : TrendingDown;

    const resolvedValue = typeof value === 'number' ? (valueFormatter ? valueFormatter(value) : defaultNumberFormatter.format(value)) : value;

    return (
        <ComponentTag className={`${styles.card} ${className}`.trim()} title={tooltip}>
            <span className={styles.cardTitle}>{title}</span>
            <span className={styles.cardValue}>{resolvedValue}</span>

            {hasChange && (
                <span className={`${styles.cardChange} ${trendUp ? styles.changeUp : styles.changeDown}`}>
                    <TrendIcon aria-hidden="true" className={styles.changeIcon} />
                    {formatChange(change as number)}
                    {changeLabel ? <span className={styles.changeLabel}>{changeLabel}</span> : null}
                </span>
            )}

            {footer ? <div className={styles.cardFooter}>{footer}</div> : null}
        </ComponentTag>
    );
};

export default AnalyticsCard;
