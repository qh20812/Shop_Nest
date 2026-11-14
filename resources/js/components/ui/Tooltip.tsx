import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;
const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
    <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                'z-dropdown rounded-control border border-border bg-warm-porcelain px-2.5 py-1.5 text-body-sm text-ink shadow-soft',
                className,
            )}
            {...props}
        />
    </TooltipPrimitive.Portal>
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

type TooltipProps = {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
};

/**
 * Compatibility wrapper for existing callers. New code can use the exported
 * primitives when it needs full Radix control.
 */
export default function Tooltip({ content, children, position = 'top', delay = 300 }: TooltipProps) {
    const { t } = useTranslation();

    return (
        <TooltipProvider delayDuration={delay}>
            <TooltipRoot>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side={position}>{t(content)}</TooltipContent>
            </TooltipRoot>
        </TooltipProvider>
    );
}

export { TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger };
export type { TooltipProps };
