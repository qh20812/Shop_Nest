import * as React from 'react';

import styles from './commerce.module.css';

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
            <ol className={styles.stepper}>
                {steps.map((step, index) => {
                    const state = step.state ?? (current === index ? 'active' : current !== undefined && index < current ? 'done' : 'upcoming');

                    return (
                        <React.Fragment key={step.label}>
                            {index > 0 && (
                                <span aria-hidden="true" className={styles.stepperSeparator}>
                                    /
                                </span>
                            )}
                            <li aria-current={state === 'active' ? 'step' : undefined} className={styles.stepperItem} data-state={state}>
                                <span aria-hidden="true" className={styles.stepperMarker} />
                                <span className={styles.stepperLabel}>{step.label}</span>
                                {state === 'active' ? <span aria-hidden="true" className={styles.stepperBar} /> : null}
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
