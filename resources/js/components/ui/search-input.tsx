import { Loader2, Search, X } from 'lucide-react';
import * as React from 'react';

import { cx } from '@/lib/cx';

import Input from './input';

type SearchInputProps = Omit<React.ComponentProps<'input'>, 'size' | 'onSubmit'> & {
    value?: string;
    onSubmit?: (value: string) => void;
    onClear?: () => void;
    loading?: boolean;
    clearable?: boolean;
    size?: 'sm' | 'md' | 'lg';
    surface?: 'content' | 'glass';
    shape?: 'default' | 'pill';
};

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
    (
        {
            className,
            value,
            onSubmit,
            onClear,
            loading = false,
            clearable = true,
            size = 'md',
            surface = 'content',
            shape = 'default',
            onChange,
            ...props
        },
        ref,
    ) => {
        const hasValue = typeof value === 'string' && value.length > 0;

        return (
            <form
                role="search"
                className={cx('sn-search', className)}
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit?.(String(value ?? ''));
                }}
            >
                <Input
                    ref={ref}
                    size={size}
                    surface={surface}
                    shape={shape}
                    type="search"
                    value={value}
                    onChange={onChange}
                    leadingIcon={Search}
                    trailing={
                        loading ? (
                            <Loader2 aria-hidden="true" className="sn-search__spinner" />
                        ) : clearable && hasValue ? (
                            <button type="button" aria-label="Xoá tìm kiếm" className="sn-search__clear" onClick={() => onClear?.()}>
                                <X aria-hidden="true" className="sn-search__icon" />
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
