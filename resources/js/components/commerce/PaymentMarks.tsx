import { Banknote } from 'lucide-react';

import { cx } from '@/lib/cx';

import styles from './commerce.module.css';

type PaymentMethod = 'visa' | 'mastercard' | 'jcb' | 'stripe' | 'cod';

type PaymentMarksProps = {
    methods?: PaymentMethod[];
    className?: string;
};

const labels: Record<PaymentMethod, string> = {
    visa: 'VISA',
    mastercard: 'Mastercard',
    jcb: 'JCB',
    stripe: 'stripe',
    cod: 'COD',
};

const titles: Record<PaymentMethod, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    jcb: 'JCB',
    stripe: 'Stripe',
    cod: 'Thanh toán khi nhận hàng',
};

export function PaymentMarks({ methods = ['visa', 'mastercard', 'jcb', 'stripe'], className }: PaymentMarksProps) {
    return (
        <span className={cx(styles.paymentMarks, className)} aria-label="Phương thức thanh toán">
            {methods.map((method) => (
                <span key={method} className={styles.paymentMark} title={titles[method]}>
                    {method === 'cod' ? <Banknote aria-hidden="true" className={styles.paymentMarkIcon} /> : labels[method]}
                </span>
            ))}
        </span>
    );
}

export type { PaymentMarksProps, PaymentMethod };
export default PaymentMarks;
