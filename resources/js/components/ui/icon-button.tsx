import * as React from 'react';

import { cx } from '@/lib/cx';

import Tooltip from './tooltip';

type IconButtonVariant = 'ghost' | 'secondary' | 'primary' | 'danger';
type IconButtonSize = 'sm' | 'md' | 'lg';

type IconButtonVariantProps = { variant?: IconButtonVariant; size?: IconButtonSize };

const iconButtonVariants: (props?: IconButtonVariantProps) => string = () => 'sn-icon-btn';

type IconButtonProps = React.ComponentProps<'button'> & {
    variant?: IconButtonVariant;
    size?: IconButtonSize;
    label: string;
    tooltip?: string;
};

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, variant = 'ghost', size = 'md', label, tooltip, type = 'button', ...props }, ref) => {
        const button = (
            <button
                ref={ref}
                type={type}
                data-slot="icon-button"
                data-variant={variant}
                data-size={size}
                aria-label={label}
                title={tooltip ?? label}
                className={cx('sn-icon-btn', className)}
                {...props}
            />
        );

        if (!tooltip) {
            return button;
        }

        return <Tooltip content={tooltip}>{button}</Tooltip>;
    },
);

IconButton.displayName = 'IconButton';

export { IconButton, iconButtonVariants };
export type { IconButtonProps, IconButtonSize, IconButtonVariant };
