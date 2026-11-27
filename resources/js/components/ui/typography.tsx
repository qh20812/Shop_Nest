import * as React from 'react';

import { cx } from '@/lib/cx';

type HeadingSize = 'display-xl' | 'display-lg' | 'headline-1' | 'headline-2' | 'headline-3';
type HeadingTone = 'ink' | 'muted' | 'faint' | 'accent';

/**
 * Compatibility helpers for code that imported the old variant factories.
 * Size and tone are `data-*` attributes on `.sn-heading` / `.sn-text`.
 */
const headingVariants: (props?: { size?: HeadingSize; tone?: HeadingTone }) => string = () => 'sn-heading';

type HeadingProps = Omit<React.ComponentProps<'h2'>, 'color'> & {
    level?: 1 | 2 | 3 | 4;
    size?: HeadingSize;
    tone?: HeadingTone;
    serif?: boolean;
};

export function Heading({ level = 2, size = 'headline-2', tone = 'ink', serif = false, className, ...props }: HeadingProps) {
    const Comp = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';

    return <Comp data-size={size} data-tone={tone} data-serif={serif ? 'true' : undefined} className={cx('sn-heading', className)} {...props} />;
}

type TextSize = 'body-lg' | 'body-md' | 'body-sm' | 'label-code';
type TextTone = 'ink' | 'muted' | 'faint' | 'accent' | 'success' | 'warning' | 'danger';

const textVariants: (props?: { size?: TextSize; tone?: TextTone }) => string = () => 'sn-text';

type TextProps = Omit<React.ComponentProps<'p'>, 'color'> & {
    as?: 'p' | 'span' | 'div';
    size?: TextSize;
    tone?: TextTone;
};

export function Text({ as: Comp = 'p', size = 'body-md', tone = 'ink', className, ...props }: TextProps) {
    return <Comp data-size={size} data-tone={tone} className={cx('sn-text', className)} {...props} />;
}

type EyebrowProps = React.ComponentProps<'span'> & {
    tone?: 'muted' | 'accent' | 'faint';
};

export function Eyebrow({ tone = 'muted', className, ...props }: EyebrowProps) {
    return <span data-tone={tone} className={cx('sn-eyebrow', className)} {...props} />;
}

type MetaTextProps = React.ComponentProps<'span'> & {
    tone?: 'muted' | 'faint' | 'ink' | 'accent';
};

export function MetaText({ tone = 'muted', className, ...props }: MetaTextProps) {
    return <span data-tone={tone} className={cx('sn-meta', className)} {...props} />;
}

export { headingVariants, textVariants };
export type { EyebrowProps, HeadingProps, HeadingSize, HeadingTone, MetaTextProps, TextProps, TextSize, TextTone };
