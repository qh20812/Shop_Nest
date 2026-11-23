import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { Switch } from '@/components/ui/switch';
import { cx } from '@/lib/cx';

import styles from './commerce.module.css';

type PreferenceRowProps = {
    title: React.ReactNode;
    description?: React.ReactNode;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    icon?: LucideIcon;
    disabled?: boolean;
    className?: string;
};

export function PreferenceRow({ title, description, checked, onCheckedChange, icon: Icon, disabled, className }: PreferenceRowProps) {
    return (
        <div className={cx(styles.preferenceRow, className)}>
            <div className={styles.preferenceMain}>
                {Icon ? (
                    <span className={styles.preferenceIcon}>
                        <Icon aria-hidden="true" />
                    </span>
                ) : null}
                <div className={styles.preferenceBody}>
                    <span className={styles.preferenceTitle}>{title}</span>
                    {description ? <span className={styles.preferenceDescription}>{description}</span> : null}
                </div>
            </div>
            <Switch
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
                aria-label={typeof title === 'string' ? title : undefined}
            />
        </div>
    );
}

export type { PreferenceRowProps };
export default PreferenceRow;
