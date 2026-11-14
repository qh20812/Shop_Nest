import * as React from 'react';

import { cn } from '@/lib/utils';

type TextareaProps = React.ComponentProps<'textarea'> & {
    invalid?: boolean;
    autoGrow?: boolean;
    maxRows?: number;
    counter?: boolean;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, invalid, autoGrow = false, maxRows = 6, counter = false, maxLength, value, onChange, ...props }, ref) => {
        const innerRef = React.useRef<HTMLTextAreaElement | null>(null);
        const currentLength = typeof value === 'string' ? value.length : 0;

        React.useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

        const resize = React.useCallback(() => {
            const element = innerRef.current;

            if (!element || !autoGrow) {
                return;
            }

            element.style.height = 'auto';
            element.style.height = `${Math.min(element.scrollHeight, maxRows * 24)}px`;
        }, [autoGrow, maxRows]);

        React.useEffect(() => {
            resize();
        }, [resize, value]);

        return (
            <div className="flex w-full flex-col gap-1.5">
                <textarea
                    ref={innerRef}
                    data-slot="textarea"
                    maxLength={maxLength}
                    value={value}
                    onChange={(event) => {
                        onChange?.(event);
                        resize();
                    }}
                    aria-invalid={invalid || props['aria-invalid']}
                    className={cn(
                        'min-h-28 w-full resize-y rounded-control border border-border bg-warm-porcelain px-4 py-3 font-sans text-body-md text-ink transition-[border-color,box-shadow] duration-150 ease-nep placeholder:text-ink-faint focus-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-brick',
                        className,
                    )}
                    {...props}
                />
                {counter && maxLength && (
                    <span className="self-end font-mono text-label-micro text-ink-faint">
                        {currentLength}/{maxLength}
                    </span>
                )}
            </div>
        );
    },
);

Textarea.displayName = 'Textarea';

export { Textarea };
export type { TextareaProps };
export default Textarea;
