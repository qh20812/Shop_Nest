import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cx } from '@/lib/cx';

type InputSize = 'sm' | 'md' | 'lg';
type InputSurface = 'content' | 'glass';
type InputShape = 'default' | 'pill';

const inputVariants: (props?: { size?: InputSize }) => string = () => 'sn-input';

type InputProps = Omit<React.ComponentProps<'input'>, 'size'> & {
    size?: InputSize;
    surface?: InputSurface;
    shape?: InputShape;
    invalid?: boolean;
    leadingIcon?: LucideIcon;
    trailing?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = 'text', size = 'md', surface = 'content', shape = 'default', invalid, leadingIcon: LeadingIcon, trailing, ...props }, ref) => {
        const hasLeading = Boolean(LeadingIcon);
        const hasTrailing = Boolean(trailing);

        const input = (
            <input
                ref={ref}
                type={type}
                data-slot="input"
                data-size={size}
                data-surface={surface}
                data-shape={shape}
                aria-invalid={invalid || props['aria-invalid']}
                className={cx('sn-input', hasLeading && 'sn-input--leading', hasTrailing && 'sn-input--trailing', className)}
                {...props}
            />
        );

        if (!hasLeading && !hasTrailing) {
            return input;
        }

        return (
            <span className="sn-input-wrap">
                {LeadingIcon && <LeadingIcon aria-hidden="true" className="sn-input__icon" />}
                {input}
                {trailing && <span className="sn-input__trailing">{trailing}</span>}
            </span>
        );
    },
);

Input.displayName = 'Input';

export { Input, inputVariants };
export type { InputProps, InputShape, InputSize, InputSurface };
export default Input;
