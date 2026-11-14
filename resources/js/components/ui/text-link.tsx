import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type TextLinkProps = Omit<React.ComponentProps<'a'>, 'href'> & {
    href: string;
    external?: boolean;
    tone?: 'muted' | 'accent' | 'ink';
    underline?: boolean;
};

const tones = {
    muted: 'text-ink-muted hover:text-ink',
    accent: 'text-lacquer-red hover:text-lacquer-deep',
    ink: 'text-ink hover:text-lacquer-red',
};

export function TextLink({
    href,
    external = false,
    tone = 'accent',
    underline = true,
    className,
    children,
    ...props
}: TextLinkProps) {
    const classes = cn(
        'inline-flex items-center gap-1 text-body-sm font-medium transition-colors duration-150 ease-nep focus-ring rounded-chip',
        underline && 'underline decoration-1 underline-offset-4',
        tones[tone],
        className,
    );

    if (external) {
        return (
            <a href={href} target="_blank" rel="noreferrer noopener" className={classes} {...props}>
                {children}
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </a>
        );
    }

    return (
        <Link href={href} className={classes} {...(props as unknown as React.ComponentProps<typeof Link>)}>
            {children}
        </Link>
    );
}

export default TextLink;
