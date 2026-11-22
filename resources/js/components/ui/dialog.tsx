import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import * as React from 'react';

import { cx } from '@/lib/cx';

const DialogRoot = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay ref={ref} data-slot="dialog-overlay" className={cx('sn-scrim', className)} {...props} />
));

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const contentSizes = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
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
        <DialogPrimitive.Content ref={ref} data-slot="dialog" data-size={contentSizes[size]} className={cx('sn-dialog', className)} {...props}>
            {children}
            {showClose && (
                <DialogPrimitive.Close aria-label="Đóng" className="sn-dialog__close">
                    <X aria-hidden="true" />
                </DialogPrimitive.Close>
            )}
        </DialogPrimitive.Content>
    </DialogPortal>
));

DialogContent.displayName = DialogPrimitive.Content.displayName;

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return <div className={cx('sn-dialog__header', className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return <div className={cx('sn-dialog__footer', className)} {...props} />;
}

const DialogTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
    ({ className, ...props }, ref) => <DialogPrimitive.Title ref={ref} className={cx('sn-dialog__title', className)} {...props} />,
);

DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => <DialogPrimitive.Description ref={ref} className={cx('sn-dialog__description', className)} {...props} />);

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
