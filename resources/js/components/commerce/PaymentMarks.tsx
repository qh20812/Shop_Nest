import { Banknote } from 'lucide-react';

import { cn } from '@/lib/utils';

type PaymentMethod = 'visa' | 'mastercard' | 'jcb' | 'stripe' | 'cod';

type PaymentMarksProps = {
    methods?: PaymentMethod[];
    className?: string;
};

const labels: Record<PaymentMethod, string> = {
    visa: 'VISA',
    mastercard: '',
    jcb: 'JCB',
    stripe: 'stripe',
    cod: 'COD',
};

function MastercardMark() {
    return (
        <span className="relative inline-flex h-3.5 w-6 items-center" aria-hidden="true">
            <span className="absolute left-0 size-3.5 rounded-pill bg-brick" />
            <span className="absolute right-0 size-3.5 rounded-pill bg-turmeric" />
        </span>
    );
}

export function PaymentMarks({ methods = ['visa', 'mastercard', 'jcb', 'stripe'], className }: PaymentMarksProps) {
    return (
        <span className={cn('inline-flex flex-wrap items-center gap-1.5', className)} aria-label="Phương thức thanh toán">
            {methods.map((method) => (
                <span
                    key={method}
                    className="inline-flex h-7 min-w-11 items-center justify-center rounded-chip border border-border bg-warm-porcelain px-2 font-mono text-label-micro font-semibold text-ink-muted"
                    title={method === 'cod' ? 'Thanh toán khi nhận hàng' : method}
                >
                    {method === 'mastercard' ? <MastercardMark /> : method === 'cod' ? <Banknote className="size-4" /> : labels[method]}
                </span>
            ))}
        </span>
    );
}

export type { PaymentMarksProps, PaymentMethod };
export default PaymentMarks;
