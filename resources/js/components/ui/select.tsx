import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type SelectOption = {
    value: string;
    label: string;
    disabled?: boolean;
};

type SelectProps = Omit<React.ComponentProps<'select'>, 'size'> & {
    size?: 'sm' | 'md' | 'lg';
    invalid?: boolean;
    options?: SelectOption[];
    placeholder?: string;
};

const sizeClasses = {
    sm: 'h-control-sm text-body-sm',
    md: 'h-control-md text-body-md',
    lg: 'h-control-lg text-body-md',
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, size = 'md', invalid, options, placeholder, children, ...props }, ref) => {
        return (
            <div className="relative w-full">
                <select
                    ref={ref}
                    data-slot="select"
                    aria-invalid={invalid || props['aria-invalid']}
                    className={cn(
                        'w-full appearance-none rounded-control border border-border bg-warm-porcelain pl-4 pr-10 font-sans text-ink transition-[border-color,box-shadow] duration-150 ease-nep focus-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-brick',
                        sizeClasses[size],
                        className,
                    )}
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
                <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
                />
            </div>
        );
    },
);

Select.displayName = 'Select';

export { Select };
export type { SelectOption, SelectProps };
export default Select;
