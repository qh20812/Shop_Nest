import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import * as React from 'react';

import { cx } from '@/lib/cx';

type TextLinkProps = Omit<React.ComponentProps<'a'>, 'href'> & {
    href: string;
    external?: boolean;
    tone?: 'muted' | 'accent' | 'ink';
    underline?: boolean;
};

export function TextLink({ href, external = false, tone = 'accent', underline = true, className, children, ...props }: TextLinkProps) {
    const classes = cx('sn-text-link', className);
    const dataProps = { 'data-tone': tone, 'data-underline': underline ? 'true' : undefined } as const;

    if (external) {
        return (
            <a href={href} target="_blank" rel="noreferrer noopener" className={classes} {...dataProps} {...props}>
                {children}
                <ArrowUpRight aria-hidden="true" className="sn-text-link__icon" />
            </a>
        );
    }

    return (
        <Link href={href} className={classes} {...dataProps} {...(props as unknown as React.ComponentProps<typeof Link>)}>
            {children}
        </Link>
    );
}

export default TextLink;
