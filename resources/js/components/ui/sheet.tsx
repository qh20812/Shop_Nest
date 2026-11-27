import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import * as React from 'react';

import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';

const SheetRoot = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;

const SheetOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => <DialogPrimitive.Overlay ref={ref} data-slot="sheet-overlay" className={cx('sn-scrim', className)} {...props} />);

SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

type SheetSide = 'right' | 'left' | 'bottom';

const SheetContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
        side?: SheetSide;
    }
>(({ className, children, side = 'right', ...props }, ref) => {
    const { t } = useTranslation();

    return (
        <DialogPrimitive.Portal>
            <SheetOverlay />
            <DialogPrimitive.Content ref={ref} data-slot="sheet" data-side={side} className={cx('sn-sheet', className)} {...props}>
                {children}
                <DialogPrimitive.Close aria-label={t('Close')} className="sn-sheet__close">
                    <X aria-hidden="true" />
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    );
});

SheetContent.displayName = DialogPrimitive.Content.displayName;

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return <div className={cx('sn-sheet__header', className)} {...props} />;
}

function SheetBody({ className, ...props }: React.ComponentProps<'div'>) {
    return <div className={cx('sn-sheet__body', className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return <div className={cx('sn-sheet__footer', className)} {...props} />;
}

const SheetTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
    ({ className, ...props }, ref) => <DialogPrimitive.Title ref={ref} className={cx('sn-sheet__title', className)} {...props} />,
);

SheetTitle.displayName = DialogPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => <DialogPrimitive.Description ref={ref} className={cx('sn-sheet__description', className)} {...props} />);

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
                <SheetBody>{children}</SheetBody>
                {footer && <SheetFooter>{footer}</SheetFooter>}
            </SheetContent>
        </SheetRoot>
    );
}

export { Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetOverlay, SheetRoot, SheetTitle, SheetTrigger };
export type { SheetProps, SheetSide };
