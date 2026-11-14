import { Loader2, Search, X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import Input from './input';

type SearchInputProps = Omit<React.ComponentProps<'input'>, 'size' | 'onSubmit'> & {
    value?: string;
    onSubmit?: (value: string) => void;
    onClear?: () => void;
    loading?: boolean;
    clearable?: boolean;
    size?: 'sm' | 'md' | 'lg';
};

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className, value, onSubmit, onClear, loading = false, clearable = true, size = 'md', onChange, ...props }, ref) => {
        const hasValue = typeof value === 'string' && value.length > 0;

        return (
            <form
                role="search"
                className={cn('w-full', className)}
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit?.(String(value ?? ''));
                }}
            >
                <Input
                    ref={ref}
                    size={size}
                    type="search"
                    value={value}
                    onChange={onChange}
                    leadingIcon={Search}
                    trailing={
                        loading ? (
                            <Loader2 aria-hidden="true" className="size-4 animate-spin text-ink-muted" />
                        ) : clearable && hasValue ? (
                            <button
                                type="button"
                                aria-label="Xoá tìm kiếm"
                                className="flex size-control-sm items-center justify-center rounded-chip text-ink-muted transition-colors hover:bg-lacquer-wash hover:text-ink focus-ring"
                                onClick={() => {
                                    onClear?.();
                                }}
                            >
                                <X aria-hidden="true" className="size-4" />
                            </button>
                        ) : null
                    }
                    {...props}
                />
            </form>
        );
    },
);

SearchInput.displayName = 'SearchInput';

export { SearchInput };
export type { SearchInputProps };
export default SearchInput;
