import { Link } from '@inertiajs/react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, type LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cx } from '@/lib/cx';

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
            data-slot="dropdown-menu"
            className={cx('sn-dropdown', className)}
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
        selected?: boolean;
    }
>(({ className, inset, destructive, selected, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
        ref={ref}
        data-inset={inset ? 'true' : undefined}
        data-destructive={destructive ? 'true' : undefined}
        data-selected={selected ? 'true' : undefined}
        className={cx('sn-dropdown__item', className)}
        {...props}
    />
));

DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuLabel = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => <DropdownMenuPrimitive.Label ref={ref} className={cx('sn-dropdown__label', className)} {...props} />);

DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => <DropdownMenuPrimitive.Separator ref={ref} className={cx('sn-dropdown__separator', className)} {...props} />);

DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

type DropdownMenuItemConfig = {
    label: React.ReactNode;
    icon?: LucideIcon;
    onSelect?: () => void;
    href?: string;
    destructive?: boolean;
    disabled?: boolean;
    selected?: boolean;
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
                            {item.selected && (
                                <span className="sn-dropdown__check">
                                    <Check aria-hidden="true" />
                                </span>
                            )}
                        </>
                    );

                    return (
                        <React.Fragment key={`${String(item.label)}-${index}`}>
                            {item.separatorBefore && <DropdownMenuSeparator />}
                            {item.href ? (
                                <DropdownMenuItem
                                    asChild
                                    destructive={item.destructive}
                                    disabled={item.disabled}
                                    selected={item.selected}
                                >
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
                                    selected={item.selected}
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
