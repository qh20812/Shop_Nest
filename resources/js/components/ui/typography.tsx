import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const headingVariants = cva('font-sans text-balance', {
    variants: {
        size: {
            'display-xl': 'font-display text-display-xl text-ink',
            'display-lg': 'font-display text-display-lg text-ink',
            'headline-1': 'text-headline-1',
            'headline-2': 'text-headline-2',
            'headline-3': 'text-headline-3',
        },
        tone: {
            ink: 'text-ink',
            muted: 'text-ink-muted',
            faint: 'text-ink-faint',
            accent: 'text-lacquer-red',
        },
    },
    defaultVariants: {
        size: 'headline-2',
        tone: 'ink',
    },
});

type HeadingSize = NonNullable<VariantProps<typeof headingVariants>['size']>;
type HeadingTone = NonNullable<VariantProps<typeof headingVariants>['tone']>;

type HeadingProps = Omit<React.ComponentProps<'h2'>, 'color'> & {
    level?: 1 | 2 | 3 | 4;
    size?: HeadingSize;
    tone?: HeadingTone;
    serif?: boolean;
};

export function Heading({ level = 2, size = 'headline-2', tone = 'ink', serif = false, className, ...props }: HeadingProps) {
    const Comp = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';

    return <Comp className={cn(headingVariants({ size, tone }), serif && 'font-display', className)} {...props} />;
}

const textVariants = cva('font-sans', {
    variants: {
        size: {
            'body-lg': 'text-body-lg',
            'body-md': 'text-body-md',
            'body-sm': 'text-body-sm',
            'label-code': 'font-mono text-label-code',
        },
        tone: {
            ink: 'text-ink',
            muted: 'text-ink-muted',
            faint: 'text-ink-faint',
            accent: 'text-lacquer-red',
            success: 'text-jade',
            warning: 'text-turmeric',
            danger: 'text-brick',
        },
    },
    defaultVariants: {
        size: 'body-md',
        tone: 'ink',
    },
});

type TextProps = Omit<React.ComponentProps<'p'>, 'color'> &
    VariantProps<typeof textVariants> & {
        as?: 'p' | 'span' | 'div';
    };

export function Text({ as: Comp = 'p', size = 'body-md', tone = 'ink', className, ...props }: TextProps) {
    return <Comp className={cn(textVariants({ size, tone }), className)} {...props} />;
}

type EyebrowProps = React.ComponentProps<'span'> & {
    tone?: 'muted' | 'accent' | 'faint';
};

export function Eyebrow({ tone = 'muted', className, ...props }: EyebrowProps) {
    const tones = {
        muted: 'text-ink-muted',
        accent: 'text-lacquer-red',
        faint: 'text-ink-faint',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-2 text-label-micro font-semibold uppercase tracking-[0.12em]',
                tones[tone],
                className,
            )}
            {...props}
        />
    );
}

type MetaTextProps = React.ComponentProps<'span'> & {
    tone?: 'muted' | 'faint' | 'ink' | 'accent';
};

export function MetaText({ tone = 'muted', className, ...props }: MetaTextProps) {
    const tones = {
        muted: 'text-ink-muted',
        faint: 'text-ink-faint',
        ink: 'text-ink',
        accent: 'text-lacquer-red',
    };

    return <span className={cn('font-mono text-label-code', tones[tone], className)} {...props} />;
}

export { headingVariants, textVariants };
