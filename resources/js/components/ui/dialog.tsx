import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const DialogRoot = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
const DialogPortal = DialogPrimitive.Portal;

const overlayClasses = 'fixed inset-0 z-modal bg-overlay';

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay ref={ref} className={cn(overlayClasses, className)} {...props} />
));

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const contentSizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
};

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
        size?: keyof typeof contentSizes;
        showClose?: boolean;
        showOverlay?: boolean;
    }
>(({ className, children, size = 'md', showClose = true, showOverlay = true, ...props }, ref) => (
    <DialogPortal>
        {showOverlay && <DialogOverlay />}
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                'fixed left-1/2 top-1/2 z-modal w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-surface border border-border bg-warm-porcelain p-6 shadow-modal focus:outline-none',
                contentSizes[size],
                className,
            )}
            {...props}
        >
            {children}
            {showClose && (
                <DialogPrimitive.Close
                    aria-label="Đóng"
                    className="absolute right-4 top-4 flex size-control-sm items-center justify-center rounded-chip text-ink-muted transition-colors hover:bg-raw-linen hover:text-ink focus-ring"
                >
                    <X aria-hidden="true" className="size-4" />
                </DialogPrimitive.Close>
            )}
        </DialogPrimitive.Content>
    </DialogPortal>
));

DialogContent.displayName = DialogPrimitive.Content.displayName;

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return <div className={cn('flex flex-col gap-1.5 pr-8', className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return <div className={cn('mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />;
}

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title ref={ref} className={cn('text-headline-3 text-ink', className)} {...props} />
));

DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description ref={ref} className={cn('text-body-sm text-ink-muted', className)} {...props} />
));

DialogDescription.displayName = DialogPrimitive.Description.displayName;

type DialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: React.ReactNode;
    description?: React.ReactNode;
    footer?: React.ReactNode;
    size?: keyof typeof contentSizes;
    className?: string;
    children?: React.ReactNode;
};

function Dialog({ open, onOpenChange, title, description, footer, size = 'md', className, children }: DialogProps) {
    return (
        <DialogRoot open={open} onOpenChange={onOpenChange}>
            <DialogContent size={size} className={className}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                {children}
                {footer && <DialogFooter>{footer}</DialogFooter>}
            </DialogContent>
        </DialogRoot>
    );
}

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
};
export type { DialogProps };
