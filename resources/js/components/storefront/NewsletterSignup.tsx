import { Send } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';

import styles from './storefront.module.css';

type NewsletterSignupProps = {
    onSubmit?: (email: string) => void | Promise<void>;
    loading?: boolean;
    className?: string;
};

export function NewsletterSignup({ onSubmit, loading = false, className }: NewsletterSignupProps) {
    const { t } = useTranslation();
    const inputId = React.useId();
    const [email, setEmail] = React.useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email.trim()) {
            return;
        }

        onSubmit?.(email.trim());
        setEmail('');
    };

    return (
        <form onSubmit={handleSubmit} className={cx(styles.newsletterForm, className)}>
            <label htmlFor={inputId} className={styles.newsletterLabel}>
                {t('Email')}
            </label>
            <div className={styles.newsletterRow}>
                <Input
                    id={inputId}
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t('Your email')}
                    autoComplete="email"
                    required
                />
                <Button type="submit" loading={loading} rightIcon={Send} className={styles.newsletterButton}>
                    {t('Subscribe')}
                </Button>
            </div>
        </form>
    );
}

export default NewsletterSignup;
