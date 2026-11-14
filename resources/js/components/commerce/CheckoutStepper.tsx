import { Check } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type CheckoutStep = {
    label: string;
    state?: 'done' | 'active' | 'upcoming';
};

type CheckoutStepperProps = {
    steps: CheckoutStep[];
    current?: number;
    className?: string;
};

export function CheckoutStepper({ steps, current, className }: CheckoutStepperProps) {
    return (
        <nav aria-label="Tiến trình mua hàng" className={className}>
            <ol className="flex flex-wrap items-center gap-3 border-b border-border pb-4">
                {steps.map((step, index) => {
                    const state = step.state ?? (current === index ? 'active' : current !== undefined && index < current ? 'done' : 'upcoming');

                    return (
                        <React.Fragment key={step.label}>
                            {index > 0 && (
                                <span aria-hidden="true" className="font-mono text-label-code text-border">
                                    /
                                </span>
                            )}
                            <li
                                aria-current={state === 'active' ? 'step' : undefined}
                                className={cn(
                                    'inline-flex items-center gap-2',
                                    state === 'active' && 'text-ink',
                                    state === 'done' && 'text-ink-muted',
                                    state === 'upcoming' && 'text-ink-faint',
                                )}
                            >
                                {state === 'done' ? (
                                    <Check aria-hidden="true" className="size-4 text-jade" />
                                ) : (
                                    <span className="font-mono text-label-code">0{index + 1}.</span>
                                )}
                                <span className={cn('text-body-sm', state === 'active' && 'font-semibold')}>{step.label}</span>
                                {state === 'active' && <span aria-hidden="true" className="ml-2 h-0.5 w-8 bg-lacquer-red" />}
                            </li>
                        </React.Fragment>
                    );
                })}
            </ol>
        </nav>
    );
}

export type { CheckoutStep, CheckoutStepperProps };
export default CheckoutStepper;
