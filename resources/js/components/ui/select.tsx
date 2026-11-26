import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { cx } from '@/lib/cx';

type SelectOption = {
    value: string;
    label: string;
    disabled?: boolean;
};

type SelectSize = 'sm' | 'md' | 'lg';
type SelectSurface = 'content' | 'glass';
type SelectShape = 'default' | 'pill';

type SelectProps = Omit<React.ComponentProps<'select'>, 'size'> & {
    size?: SelectSize;
    surface?: SelectSurface;
    shape?: SelectShape;
    invalid?: boolean;
    options?: SelectOption[];
    placeholder?: string;
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, size = 'md', surface = 'content', shape = 'default', invalid, options, placeholder, children, ...props }, ref) => {
        return (
            <span className="sn-select-wrap">
                <select
                    ref={ref}
                    data-slot="select"
                    data-size={size}
                    data-surface={surface}
                    data-shape={shape}
                    aria-invalid={invalid || props['aria-invalid']}
                    className={cx('sn-select', className)}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options?.map((option) => (
                        <option key={option.value} value={option.value} disabled={option.disabled}>
                            {option.label}
                        </option>
                    ))}
                    {children}
                </select>
                <ChevronDown aria-hidden="true" className="sn-select__icon" />
            </span>
        );
    },
);

Select.displayName = 'Select';

export { Select };
export type { SelectOption, SelectProps, SelectShape, SelectSize, SelectSurface };
export default Select;
