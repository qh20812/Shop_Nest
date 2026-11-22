import * as React from 'react';

import { cx } from '@/lib/cx';

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
            <div className="sn-textarea-wrap">
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
                    className={cx('sn-textarea', className)}
                    {...props}
                />
                {counter && maxLength && (
                    <span className="sn-field__counter">
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
