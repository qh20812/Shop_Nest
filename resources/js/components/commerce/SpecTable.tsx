import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cx } from '@/lib/cx';

import styles from './commerce.module.css';

type SpecRow = {
    label: string;
    value: React.ReactNode;
    icon?: LucideIcon;
};

type SpecTableProps = {
    rows: SpecRow[];
    className?: string;
};

export function SpecTable({ rows, className }: SpecTableProps) {
    return (
        <div className={cx(styles.specTable, className)}>
            <dl>
                {rows.map((row) => {
                    const Icon = row.icon;

                    return (
                        <div key={row.label} className={styles.specRow}>
                            <dt className={styles.specLabel}>
                                {Icon && <Icon aria-hidden="true" className={styles.specIcon} />}
                                {row.label}
                            </dt>
                            <dd className={styles.specValue}>{row.value}</dd>
                        </div>
                    );
                })}
            </dl>
        </div>
    );
}

export type { SpecRow, SpecTableProps };
export default SpecTable;
