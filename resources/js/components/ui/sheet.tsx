import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const SheetRoot = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;

const SheetOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay ref={ref} className={cn('fixed inset-0 z-modal bg-overlay', className)} {...props} />
));

SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

type SheetSide = 'right' | 'left' | 'bottom';

const sideClasses: Record<SheetSide, string> = {
    right: 'inset-y-0 right-0 h-full w-full max-w-md border-l',
    left: 'inset-y-0 left-0 h-full w-full max-w-md border-r',
    bottom: 'inset-x-0 bottom-0 max-h-[85dvh] w-full rounded-t-sheet border-t',
};

const SheetContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
        side?: SheetSide;
    }
>(({ className, children, side = 'right', ...props }, ref) => (
    <DialogPrimitive.Portal>
        <SheetOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                'fixed z-modal overflow-y-auto border-border bg-warm-porcelain p-6 shadow-modal focus:outline-none',
                sideClasses[side],
                className,
            )}
            {...props}
        >
            {children}
            <DialogPrimitive.Close
                aria-label="Đóng"
                className="absolute right-4 top-4 flex size-control-sm items-center justify-center rounded-chip text-ink-muted transition-colors hover:bg-raw-linen hover:text-ink focus-ring"
            >
                <X aria-hidden="true" className="size-4" />
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
));

SheetContent.displayName = DialogPrimitive.Content.displayName;

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return <div className={cn('flex flex-col gap-1.5 pr-8', className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return <div className={cn('mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />;
}

const SheetTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title ref={ref} className={cn('text-headline-3 text-ink', className)} {...props} />
));

SheetTitle.displayName = DialogPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description ref={ref} className={cn('text-body-sm text-ink-muted', className)} {...props} />
));

SheetDescription.displayName = DialogPrimitive.Description.displayName;

type SheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    side?: SheetSide;
    title?: React.ReactNode;
    description?: React.ReactNode;
    footer?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
};

function Sheet({ open, onOpenChange, side = 'right', title, description, footer, children, className }: SheetProps) {
    return (
        <SheetRoot open={open} onOpenChange={onOpenChange}>
            <SheetContent side={side} className={className}>
                {(title || description) && (
                    <SheetHeader>
                        {title && <SheetTitle>{title}</SheetTitle>}
                        {description && <SheetDescription>{description}</SheetDescription>}
                    </SheetHeader>
                )}
                {children}
                {footer && <SheetFooter>{footer}</SheetFooter>}
            </SheetContent>
        </SheetRoot>
    );
}

export {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetOverlay,
    SheetRoot,
    SheetTitle,
    SheetTrigger,
};
export type { SheetProps, SheetSide };
