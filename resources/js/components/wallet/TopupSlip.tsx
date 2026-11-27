import axios from 'axios';
import { useEffect, useMemo, useState, type FormEvent } from 'react';

import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import FormField from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { formatDate, formatNumber, formatTime, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import { CopyButton } from './CopyButton';
import type { WalletLimits, WalletTopup } from './types';
import { topupStatusKeys, topupStatusTones } from './wallet-status';

import styles from './wallet.module.css';

interface TopupSlipProps {
    topup: WalletTopup | null;
    limits: WalletLimits;
    presets: number[];
    walletActive: boolean;
    onChanged: (topup: WalletTopup | null) => void;
}

function readError(error: unknown, fallback: string): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;

        return data?.errors?.amount?.[0] ?? data?.errors?.reason?.[0] ?? data?.message ?? fallback;
    }

    return fallback;
}

export function TopupSlip({ topup, limits, presets, walletActive, onChanged }: TopupSlipProps) {
    const { t } = useTranslation();
    const [amountDigits, setAmountDigits] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState<'create' | 'transfer' | 'cancel' | null>(null);
    const [qrFailed, setQrFailed] = useState(false);
    const [confirmCancel, setConfirmCancel] = useState(false);
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        setQrFailed(false);
    }, [topup?.topup_id]);

    useEffect(() => {
        const timer = window.setInterval(() => setNow(Date.now()), 30000);

        return () => window.clearInterval(timer);
    }, []);

    const parsedAmount = amountDigits === '' ? 0 : Number(amountDigits);
    const minLabel = formatVnd(limits.min);
    const maxLabel = formatVnd(limits.max);

    const remaining = useMemo(() => {
        if (!topup || topup.status !== 'pending') {
            return null;
        }

        const milliseconds = new Date(topup.expires_at).getTime() - now;

        if (!Number.isFinite(milliseconds) || milliseconds <= 0) {
            return null;
        }

        const totalMinutes = Math.ceil(milliseconds / 60000);

        return {
            hours: Math.floor(totalMinutes / 60),
            minutes: totalMinutes % 60,
        };
    }, [topup, now]);

    const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (busy) {
            return;
        }

        if (!walletActive) {
            setError(t('Contact support to reopen your wallet.'));

            return;
        }

        if (!Number.isFinite(parsedAmount) || parsedAmount < limits.min || parsedAmount > limits.max) {
            setError(t('Top-up amount error', { min: minLabel, max: maxLabel }));

            return;
        }

        setBusy('create');
        setError(null);

        try {
            const { data } = await axios.post('/wallet/topups', { amount: parsedAmount });
            setAmountDigits('');
            setQrFailed(false);
            onChanged(data.topup as WalletTopup);
        } catch (requestError) {
            setError(readError(requestError, t('Unable to create the top-up code.')));
        } finally {
            setBusy(null);
        }
    };

    const handleTransferred = async () => {
        if (!topup || busy) {
            return;
        }

        setBusy('transfer');
        setError(null);

        try {
            const { data } = await axios.post(`/wallet/topups/${topup.topup_id}/transferred`);
            onChanged(data.topup as WalletTopup);
        } catch (requestError) {
            setError(readError(requestError, t('Unable to update the top-up.')));
        } finally {
            setBusy(null);
        }
    };

    const handleCancel = async () => {
        if (!topup || busy) {
            return;
        }

        setConfirmCancel(false);
        setBusy('cancel');
        setError(null);

        try {
            await axios.post(`/wallet/topups/${topup.topup_id}/cancel`);
            onChanged(null);
        } catch (requestError) {
            setError(readError(requestError, t('Unable to update the top-up.')));
        } finally {
            setBusy(null);
        }
    };

    const showDetails = topup !== null && (topup.status === 'pending' || topup.status === 'transferred');

    return (
        <section id="nap-tien" className={styles.slip} aria-labelledby="wallet-slip-title">
            <div className={styles.slipHead}>
                <h2 id="wallet-slip-title" className={styles.slipTitle}>
                    {t('Top up')}
                </h2>
                {showDetails && <Badge tone={topupStatusTones[topup.status]}>{t(topupStatusKeys[topup.status])}</Badge>}
            </div>

            {showDetails ? (
                <div className={styles.detailGrid}>
                    <div className={styles.codeBlock}>
                        <p className={styles.codeLabel}>{t('Top-up code')}</p>
                        <div className={styles.codeRow}>
                            <p className={styles.codeValue}>{topup.code}</p>
                            <CopyButton value={topup.code} label={t('Copy transfer code')} />
                        </div>
                    </div>

                    <div className={styles.amountLine}>
                        <span className={styles.codeLabel}>{t('Transfer amount')}</span>
                        <p className={styles.amountValue}>{formatVnd(topup.amount_declared)}</p>
                    </div>

                    {topup.status === 'pending' && (
                        <>
                            {topup.bank.configured ? (
                                <dl className={styles.bankList}>
                                    {topup.bank.bank_name && (
                                        <div className={styles.bankRow}>
                                            <dt className={styles.bankLabel}>{t('Bank')}</dt>
                                            <dd className={styles.bankValue}>{topup.bank.bank_name}</dd>
                                            <span aria-hidden="true" />
                                        </div>
                                    )}
                                    <div className={styles.bankRow}>
                                        <dt className={styles.bankLabel}>{t('Account number')}</dt>
                                        <dd className={styles.bankValue}>{topup.bank.account_no}</dd>
                                        <CopyButton value={topup.bank.account_no} label={t('Copy account number')} />
                                    </div>
                                    <div className={styles.bankRow}>
                                        <dt className={styles.bankLabel}>{t('Account holder')}</dt>
                                        <dd className={styles.bankValue}>{topup.bank.account_name}</dd>
                                        <CopyButton value={topup.bank.account_name} label={t('Copy account holder')} />
                                    </div>
                                </dl>
                            ) : (
                                <Alert tone="warning" description={t('Bank transfer is not configured')} />
                            )}

                            {topup.qr_url && !qrFailed && (
                                <div className={styles.qr}>
                                    <img
                                        className={styles.qrImage}
                                        src={topup.qr_url}
                                        alt={`${t('QR code')} ${topup.code}`}
                                        width={200}
                                        height={200}
                                        onError={() => setQrFailed(true)}
                                    />
                                </div>
                            )}

                            {topup.qr_url && qrFailed && <Alert tone="warning" description={t('QR unavailable')} />}
                        </>
                    )}

                    {topup.status === 'pending' && remaining && (
                        <p className={styles.countdown}>
                            <span>
                                {t('Expires in')}{' '}
                                <span className={styles.countdownStrong}>
                                    {remaining.hours > 0
                                        ? `${remaining.hours} ${t('hours')} ${remaining.minutes} ${t('minutes')}`
                                        : `${remaining.minutes} ${t('minutes')}`}
                                </span>
                            </span>
                            <span>{`${t('Expires at')} ${formatDate(topup.expires_at)} ${formatTime(topup.expires_at)}`}</span>
                        </p>
                    )}

                    {error && <Alert tone="danger" description={error} />}

                    {topup.status === 'transferred' ? (
                        <p className={styles.slipNote}>{t('The admin will match your transfer. This page refreshes every 10 seconds.')}</p>
                    ) : (
                        <div className={styles.actions}>
                            <Button
                                type="button"
                                variant="primary"
                                className={styles.actionButton}
                                loading={busy === 'transfer'}
                                onClick={handleTransferred}
                            >
                                {t('I have transferred')}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                className={styles.actionButton}
                                loading={busy === 'cancel'}
                                onClick={() => setConfirmCancel(true)}
                            >
                                {t('Cancel code')}
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <form className={styles.slipForm} onSubmit={handleCreate} noValidate>
                    <p className={styles.slipNote}>
                        {t('Transfer the exact amount with the code in the memo. The code is valid for :hours hours.', {
                            hours: limits.ttl_hours,
                        })}
                    </p>

                    <div className={styles.presets}>
                        {presets.map((preset) => (
                            <button
                                key={preset}
                                type="button"
                                className={styles.preset}
                                aria-pressed={parsedAmount === preset}
                                disabled={!walletActive}
                                onClick={() => {
                                    setAmountDigits(String(preset));
                                    setError(null);
                                }}
                            >
                                {formatNumber(preset)}
                            </button>
                        ))}
                    </div>

                    <FormField
                        label={t('Amount')}
                        htmlFor="wallet-topup-amount"
                        error={error ?? undefined}
                        hint={t('Top-up amount range', { min: minLabel, max: maxLabel })}
                    >
                        <Input
                            id="wallet-topup-amount"
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            value={amountDigits === '' ? '' : formatNumber(parsedAmount)}
                            onChange={(event) => {
                                setAmountDigits(event.target.value.replace(/\D/g, '').slice(0, 9));
                                setError(null);
                            }}
                            trailing={<span>₫</span>}
                            disabled={!walletActive}
                        />
                    </FormField>

                    <Button type="submit" variant="primary" className={styles.submitButton} loading={busy === 'create'} disabled={!walletActive}>
                        {t('Create top-up code')}
                    </Button>
                </form>
            )}

            <ConfirmationModal
                isOpen={confirmCancel}
                onClose={() => setConfirmCancel(false)}
                onConfirm={handleCancel}
                title={t('Cancel this top-up code?')}
                message={t('The code stops working and you can create a new one.')}
            />
        </section>
    );
}
