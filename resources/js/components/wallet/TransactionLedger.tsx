import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import FormField from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import { cx } from '@/lib/cx';
import { formatDate, formatTime, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import type { Paginated, WalletFilters, WalletTransaction } from './types';
import { transactionTypeKeys } from './wallet-status';

import styles from './wallet.module.css';

interface TransactionLedgerProps {
    transactions: Paginated<WalletTransaction>;
    filters: WalletFilters;
    typeOptions: Record<string, string>;
}

export function TransactionLedger({ transactions, filters, typeOptions }: TransactionLedgerProps) {
    const { t } = useTranslation();
    const [type, setType] = useState(filters.type);
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setType(filters.type);
        setFrom(filters.from);
        setTo(filters.to);
    }, [filters.type, filters.from, filters.to]);

    useEffect(() => {
        const removeStart = router.on('start', () => setLoading(true));
        const removeFinish = router.on('finish', () => setLoading(false));

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    const hasFilters = Boolean(filters.type || filters.from || filters.to);

    const visit = (nextType: string, nextFrom: string, nextTo: string) => {
        router.get(
            '/wallet',
            {
                type: nextType || undefined,
                from: nextFrom || undefined,
                to: nextTo || undefined,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const columns = [
        {
            key: 'time',
            header: t('Time'),
            width: '8.5rem',
            cell: (transaction: WalletTransaction) => (
                <>
                    <span className={styles.typeTime}>{formatDate(transaction.created_at)}</span>
                    <span className={styles.typeTime}>{formatTime(transaction.created_at)}</span>
                </>
            ),
        },
        {
            key: 'type',
            header: t('Type'),
            cell: (transaction: WalletTransaction) => (
                <span className={styles.typeLabel}>{t(transactionTypeKeys[transaction.type] ?? transaction.type)}</span>
            ),
        },
        {
            key: 'description',
            header: t('Description'),
            cell: (transaction: WalletTransaction) => (
                <span className={styles.description} title={transaction.description ?? undefined}>
                    {transaction.description ?? '-'}
                </span>
            ),
        },
        {
            key: 'amount',
            header: t('Amount'),
            align: 'right' as const,
            cell: (transaction: WalletTransaction) => (
                <span className={cx(styles.amount, transaction.direction === 'credit' && styles.amountCredit)}>
                    {transaction.direction === 'credit' ? '+' : '-'} {formatVnd(transaction.amount)}
                </span>
            ),
        },
        {
            key: 'balance',
            header: t('Balance after'),
            align: 'right' as const,
            className: styles.hideSm,
            cell: (transaction: WalletTransaction) => <span className={styles.balanceAfter}>{formatVnd(transaction.balance_after)}</span>,
        },
    ];

    return (
        <section id="lich-su" className={styles.ledger} aria-labelledby="wallet-ledger-title">
            <div className={styles.ledgerHead}>
                <h2 id="wallet-ledger-title" className={styles.ledgerTitle}>
                    {t('Transaction history')}
                </h2>

                <form
                    className={styles.filters}
                    onSubmit={(event) => {
                        event.preventDefault();
                        visit(type, from, to);
                    }}
                >
                    <FormField label={t('Transaction type')} htmlFor="wallet-filter-type">
                        <Select id="wallet-filter-type" value={type} onChange={(event) => setType(event.target.value)}>
                            <option value="">{t('All types')}</option>
                            {Object.entries(typeOptions).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {t(label)}
                                </option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label={t('From date')} htmlFor="wallet-filter-from">
                        <Input id="wallet-filter-from" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
                    </FormField>

                    <FormField label={t('To date')} htmlFor="wallet-filter-to">
                        <Input id="wallet-filter-to" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
                    </FormField>

                    <div className={styles.filterActions}>
                        <Button type="submit" variant="secondary" leftIcon={Search} loading={loading}>
                            {t('Filter')}
                        </Button>
                        {hasFilters && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setType('');
                                    setFrom('');
                                    setTo('');
                                    visit('', '', '');
                                }}
                            >
                                {t('Clear filters')}
                            </Button>
                        )}
                    </div>
                </form>
            </div>

            {transactions.total === 0 && !hasFilters ? (
                <EmptyState
                    title={t('No transactions yet')}
                    description={t('Top up to start using the wallet.')}
                    actions={
                        <Button asChild variant="secondary" size="sm">
                            <a href="#nap-tien">{t('Top up')}</a>
                        </Button>
                    }
                />
            ) : (
                <Table
                    columns={columns}
                    data={transactions.data}
                    rowKey="transaction_id"
                    density="compact"
                    loading={loading}
                    empty={
                        <span className={styles.tableEmpty}>{hasFilters ? t('No transactions match the filters.') : t('No transactions yet')}</span>
                    }
                />
            )}

            {transactions.last_page > 1 && (
                <Pagination links={transactions.links} filters={{ type: filters.type, from: filters.from, to: filters.to }} />
            )}
        </section>
    );
}

export default TransactionLedger;
