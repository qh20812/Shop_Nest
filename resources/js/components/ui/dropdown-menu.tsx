import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const DropdownMenuRoot = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                'z-dropdown min-w-48 overflow-hidden rounded-control border border-border bg-warm-porcelain p-1 text-ink shadow-float',
                className,
            )}
            {...props}
        />
    </DropdownMenuPrimitive.Portal>
));

DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
        inset?: boolean;
        destructive?: boolean;
    }
>(({ className, inset, destructive, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
        ref={ref}
        className={cn(
            'relative flex cursor-pointer select-none items-center gap-2 rounded-chip px-3 py-2 text-body-sm text-ink outline-none transition-colors focus:bg-lacquer-wash data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
            inset && 'pl-9',
            destructive && 'text-brick focus:bg-brick-soft',
            className,
        )}
        {...props}
    />
));

DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuLabel = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
        ref={ref}
        className={cn('px-3 py-2 font-sans text-label-micro uppercase tracking-[0.12em] text-ink-faint', className)}
        {...props}
    />
));

DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
));

DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

type DropdownMenuItemConfig = {
    label: React.ReactNode;
    icon?: LucideIcon;
    onSelect?: () => void;
    href?: string;
    destructive?: boolean;
    disabled?: boolean;
    separatorBefore?: boolean;
};

type DropdownMenuProps = {
    trigger: React.ReactNode;
    items: DropdownMenuItemConfig[];
    align?: 'start' | 'center' | 'end';
    className?: string;
};

function DropdownMenu({ trigger, items, align = 'end', className }: DropdownMenuProps) {
    return (
        <DropdownMenuRoot>
            <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
            <DropdownMenuContent align={align} className={className}>
                {items.map((item, index) => {
                    const Icon = item.icon;

                    const content = (
                        <>
                            {Icon && <Icon aria-hidden="true" />}
                            <span>{item.label}</span>
                        </>
                    );

                    return (
                        <React.Fragment key={`${String(item.label)}-${index}`}>
                            {item.separatorBefore && <DropdownMenuSeparator />}
                            {item.href ? (
                                <DropdownMenuItem asChild destructive={item.destructive} disabled={item.disabled}>
                                    {isExternal(item.href) ? (
                                        <a href={item.href} target="_blank" rel="noreferrer noopener">
                                            {content}
                                        </a>
                                    ) : (
                                        <Link href={item.href}>{content}</Link>
                                    )}
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem
                                    destructive={item.destructive}
                                    disabled={item.disabled}
                                    onSelect={item.onSelect}
                                >
                                    {content}
                                </DropdownMenuItem>
                            )}
                        </React.Fragment>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenuRoot>
    );
}

function isExternal(href: string): boolean {
    return /^https?:\/\//.test(href);
}

export {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRoot,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
};
export type { DropdownMenuItemConfig, DropdownMenuProps };
