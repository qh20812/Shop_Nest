import { MoreHorizontal } from 'lucide-react';
import React from 'react';

import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRoot,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconButton } from '@/components/ui/icon-button';
import { renderIcon, type IconProp } from '@/lib/icon';
import { useTranslation } from '@/lib/i18n';

interface ActionItem {
    label: string;
    icon: IconProp;
    onClick: () => void;
    color?: 'primary' | 'success' | 'warning' | 'danger';
    disabled?: boolean;
}

interface ActionDropdownProps {
    actions: ActionItem[];
    trigger?: React.ReactNode;
}

/**
 * Row action menu. Kept as a compatibility wrapper around `DropdownMenu` so
 * Admin pages that still import it get the plain-CSS menu and focus handling.
 */
export default function ActionDropdown({ actions, trigger }: ActionDropdownProps) {
    const { t } = useTranslation();

    return (
        <DropdownMenuRoot>
            <DropdownMenuTrigger asChild>
                {trigger ?? (
                    <IconButton label={t('Open actions')} size="sm">
                        <MoreHorizontal aria-hidden="true" />
                    </IconButton>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {actions.map((action, index) => (
                    <DropdownMenuItem
                        key={`${action.label}-${index}`}
                        disabled={action.disabled}
                        destructive={action.color === 'danger'}
                        onSelect={() => {
                            if (!action.disabled) {
                                action.onClick();
                            }
                        }}
                    >
                        {renderIcon(action.icon)}
                        <span>{t(action.label)}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenuRoot>
    );
}
