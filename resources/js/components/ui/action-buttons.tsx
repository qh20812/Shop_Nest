import { Link } from '@inertiajs/react';
import * as React from 'react';

import { renderIcon, type IconProp } from '@/lib/icon';
import { useTranslation } from '@/lib/i18n';

import { Button } from './button';

import styles from './action-buttons.module.css';

// Defines a single action button
interface ActionConfig {
    type: 'link' | 'button';
    label: string;
    href?: string; // Required if type is 'link'
    onClick?: () => void; // Required if type is 'button'
    icon: IconProp;
    variant: 'primary' | 'danger';
    disabled?: boolean;
}

interface ActionButtonsProps {
    actions: ActionConfig[];
}

/**
 * Legacy row-action group. Sold as `Button` pairs so pages never ship
 * hand-rolled chips; icon accepts a Lucide component or a Boxicons string.
 */
export default function ActionButtons({ actions }: ActionButtonsProps) {
    const { t } = useTranslation();

    return (
        <div className={styles.group}>
            {actions.map((action, index) => {
                const variant = action.variant === 'danger' ? 'ghost' : 'secondary';
                const className = action.variant === 'danger' ? styles.danger : undefined;

                if (action.type === 'link') {
                    return (
                        <Button key={index} asChild variant={variant} size="sm" className={className}>
                            <Link href={action.href ?? '#'}>
                                {renderIcon(action.icon)}
                                {t(action.label)}
                            </Link>
                        </Button>
                    );
                }

                return (
                    <Button
                        key={index}
                        type="button"
                        variant={variant}
                        size="sm"
                        className={className}
                        disabled={action.disabled}
                        onClick={action.onClick}
                    >
                        {renderIcon(action.icon)}
                        {t(action.label)}
                    </Button>
                );
            })}
        </div>
    );
}

export type { ActionConfig };
