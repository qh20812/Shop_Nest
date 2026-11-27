import axios from 'axios';
import { useEffect, useState } from 'react';

import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import FormField from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AdminTopup } from '@/components/wallet/types';
import { topupStatusKeys, topupStatusTones } from '@/components/wallet/wallet-status';
import { formatDate, formatNumber, formatTime, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from './WalletTopups.module.css';

interface TopupReviewDialogProps {
    topup: AdminTopup | null;
    onClose: () => void;
    onSuccess: (topup: AdminTopup, statusCounts: Record<string, number>) => void;
}

function readError(error: unknown, fallback: string): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;

        return data?.errors?.amount_received?.[0] ?? data?.errors?.reason?.[0] ?? data?.message ?? fallback;
    }

    return fallback;
}

export function TopupReviewDialog({ topup, onClose, onSuccess }: TopupReviewDialogProps) {
    const { t } = useTranslation();
    const [amountDigits, setAmountDigits] = useState('');
    const [reason, setReason] = useState('');
    const [rejectOpen, setRejectOpen] = useState(false);
    const [busy, setBusy] = useState<'approve' | 'reject' | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [rejectError, setRejectError] = useState<string | null>(null);

    const topupId = topup?.topup_id ?? null;
    const declaredAmount = topup?.amount_declared ?? 0;

    useEffect(() => {
        setAmountDigits(topupId ? String(Math.round(declaredAmount)) : '');
        setReason('');
        setRejectOpen(false);
        setError(null);
        setRejectError(null);
        setBusy(null);
    }, [topupId, declaredAmount]);

    const actionable = Boolean(topup && (topup.status === 'pending' || topup.status === 'transferred'));
    const parsedAmount = amountDigits === '' ? 0 : Number(amountDigits);
    const difference = topup && Number.isFinite(parsedAmount) ? parsedAmount - topup.amount_declared : 0;

    const handleApprove = async () => {
        if (!topup || busy) {
            return;
        }

        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            setError(t('Enter the credited amount.'));

            return;
        }

        setBusy('approve');
        setError(null);

        try {
            const { data } = await axios.post(`/admin/wallet-topups/${topup.topup_id}/approve`, { amount_received: parsedAmount });
            onSuccess(data.topup as AdminTopup, data.statusCounts as Record<string, number>);
            onClose();
        } catch (requestError) {
            setError(readError(requestError, t('Unable to update the top-up.')));
        } finally {
            setBusy(null);
        }
    };

    const handleReject = async () => {
        if (!topup || busy) {
            return;
        }

        if (reason.trim() === '') {
            setRejectError(t('Reject reason'));

            return;
        }

        setRejectError(null);
        setBusy('reject');
        setError(null);

        try {
            const { data } = await axios.post(`/admin/wallet-topups/${topup.topup_id}/reject`, { reason: reason.trim() });
            onSuccess(data.topup as AdminTopup, data.statusCounts as Record<string, number>);
            onClose();
        } catch (requestError) {
            setError(readError(requestError, t('Unable to update the top-up.')));
        } finally {
            setBusy(null);
        }
    };

    return (
        <Dialog
            open={topup !== null}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
            title={t('Review top-up :code', { code: topup?.code ?? '' })}
            size="md"
        >
            {topup && (
                <div className={styles.dialogBody}>
                    {topup.status === 'pending' && <Alert tone="warning" description={t('The user has not reported the transfer yet.')} />}
                    {!actionable && <Alert tone="info" description={t('This request is already processed.')} />}
                    {error && <Alert tone="danger" description={error} />}

                    <div>
                        <Badge tone={topupStatusTones[topup.status]}>{t(topupStatusKeys[topup.status])}</Badge>
                    </div>

                    <dl className={styles.dialogSummary}>
                        <div className={styles.dialogRow}>
                            <dt className={styles.dialogLabel}>{t('User')}</dt>
                            <dd className={styles.dialogValue}>
                                {topup.user?.username ?? '-'}
                                {topup.user?.email ? ` (${topup.user.email})` : ''}
                            </dd>
                        </div>
                        <div className={styles.dialogRow}>
                            <dt className={styles.dialogLabel}>{t('Declared amount')}</dt>
                            <dd className={styles.dialogValue}>{formatVnd(topup.amount_declared)}</dd>
                        </div>
                        <div className={styles.dialogRow}>
                            <dt className={styles.dialogLabel}>{t('Reported transferred at')}</dt>
                            <dd className={styles.dialogValue}>
                                {topup.transferred_at ? `${formatDate(topup.transferred_at)} ${formatTime(topup.transferred_at)}` : '-'}
                            </dd>
                        </div>
                        <div className={styles.dialogRow}>
                            <dt className={styles.dialogLabel}>{t('Expires at')}</dt>
                            <dd className={styles.dialogValue}>{`${formatDate(topup.expires_at)} ${formatTime(topup.expires_at)}`}</dd>
                        </div>
                        <div className={styles.dialogRow}>
                            <dt className={styles.dialogLabel}>{t('Current balance')}</dt>
                            <dd className={styles.dialogValue}>{topup.wallet_balance !== null ? formatVnd(topup.wallet_balance) : '-'}</dd>
                        </div>
                    </dl>

                    {actionable && (
                        <>
                            <FormField
                                label={t('Credited amount')}
                                htmlFor="wallet-topup-received"
                                hint={t('Wallet will increase by this exact amount.')}
                            >
                                <Input
                                    id="wallet-topup-received"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="off"
                                    value={amountDigits === '' ? '' : formatNumber(parsedAmount)}
                                    onChange={(event) => {
                                        setAmountDigits(event.target.value.replace(/\D/g, '').slice(0, 9));
                                        setError(null);
                                    }}
                                    trailing={<span>₫</span>}
                                />
                            </FormField>

                            {difference !== 0 && (
                                <p className={styles.difference}>
                                    {t('Difference from declared')}:{' '}
                                    <span className={styles.differenceStrong}>
                                        {difference > 0 ? '+' : '-'} {formatVnd(Math.abs(difference))}
                                    </span>
                                </p>
                            )}

                            <div className={styles.dialogActions}>
                                <Button
                                    type="button"
                                    variant="primary"
                                    className={styles.actionButton}
                                    loading={busy === 'approve'}
                                    onClick={handleApprove}
                                >
                                    {t('Confirm approval')}
                                </Button>

                                {!rejectOpen ? (
                                    <button
                                        type="button"
                                        className={styles.rejectToggle}
                                        onClick={() => {
                                            setRejectOpen(true);
                                            setRejectError(null);
                                        }}
                                    >
                                        {t('Reject this top-up')}
                                    </button>
                                ) : (
                                    <div className={styles.rejectBlock}>
                                        <FormField
                                            label={t('Reject reason')}
                                            htmlFor="wallet-topup-reason"
                                            hint={t('The user sees this reason.')}
                                            error={rejectError ?? undefined}
                                        >
                                            <Textarea
                                                id="wallet-topup-reason"
                                                rows={3}
                                                maxLength={500}
                                                value={reason}
                                                onChange={(event) => {
                                                    setReason(event.target.value);
                                                    setRejectError(null);
                                                    setError(null);
                                                }}
                                            />
                                        </FormField>
                                        <div className={styles.rejectActions}>
                                            <Button type="button" variant="destructive" loading={busy === 'reject'} onClick={handleReject}>
                                                {t('Reject')}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {!actionable && (
                        <div className={styles.dialogActions}>
                            <Button type="button" variant="secondary" className={styles.actionButton} onClick={onClose}>
                                {t('Close')}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </Dialog>
    );
}

export default TopupReviewDialog;
