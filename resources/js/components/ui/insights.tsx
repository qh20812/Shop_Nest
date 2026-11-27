import * as React from 'react';

import { renderIcon, type IconProp } from '@/lib/icon';

import styles from './insights.module.css';

interface InsightItem {
    icon: IconProp;
    value: string | number;
    label: string;
    tooltip?: string;
}

interface InsightsProps {
    items: InsightItem[];
    columns?: 3 | 4;
    className?: string;
}

/**
 * KPI strip. Keeps the legacy `items` shape so Admin can stay on Boxicons
 * strings until Phase 8 while Seller passes Lucide components.
 */
export default function Insights({ items, columns = 4, className }: InsightsProps) {
    return (
        <ul data-columns={columns === 3 ? '3' : '4'} className={className ? `${styles.list} ${className}` : styles.list}>
            {items.map((item, index) => (
                <li key={index} title={item.tooltip} className={styles.item}>
                    <span className={styles.iconWrap}>{renderIcon(item.icon)}</span>
                    <span className={styles.info}>
                        <span className={styles.value}>{item.value}</span>
                        <span className={styles.label}>{item.label}</span>
                    </span>
                </li>
            ))}
        </ul>
    );
}
