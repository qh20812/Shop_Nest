import { useTranslation } from '@/lib/i18n';

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
    const { t } = useTranslation();
    return (
        <nav aria-label={t('Checkout progress')} className={className}>
            <ol className={styles.stepper}>
                {steps.map((step, index) => {
                    const state = step.state ?? (current === index ? 'active' : current !== undefined && index < current ? 'done' : 'upcoming');

                    return (
                        <li key={step.label} aria-current={state === 'active' ? 'step' : undefined} className={styles.stepperItem} data-state={state}>
                            <span aria-hidden="true" className={styles.stepperMarker} />
                            <span className={styles.stepperLabel}>{step.label}</span>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export type { CheckoutStep, CheckoutStepperProps };
export default CheckoutStepper;
