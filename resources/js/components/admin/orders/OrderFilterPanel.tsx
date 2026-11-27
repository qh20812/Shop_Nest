import FormField from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/lib/i18n';

import styles from './Orders.module.css';

interface OrderFilterPanelProps {
    fromDate: string;
    toDate: string;
    onFromDateChange: (value: string) => void;
    onToDateChange: (value: string) => void;
}

export default function OrderFilterPanel({ fromDate, toDate, onFromDateChange, onToDateChange }: OrderFilterPanelProps) {
    const { t } = useTranslation();

    return (
        <div className={styles.dateGrid}>
            <FormField label={t('From')} htmlFor="order-from-date">
                <Input id="order-from-date" type="date" value={fromDate} onChange={(event) => onFromDateChange(event.target.value)} surface="glass" />
            </FormField>

            <FormField label={t('To')} htmlFor="order-to-date">
                <Input id="order-to-date" type="date" value={toDate} onChange={(event) => onToDateChange(event.target.value)} surface="glass" />
            </FormField>
        </div>
    );
}
