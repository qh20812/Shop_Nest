import { Head, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

import { AccountLayout } from '@/components/layout/AccountLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { LiveStatus } from '@/components/wallet/LiveStatus';
import { RecentTopups } from '@/components/wallet/RecentTopups';
import { TopupSlip } from '@/components/wallet/TopupSlip';
import { TransactionLedger } from '@/components/wallet/TransactionLedger';
import type { WalletLayout, WalletStateResponse } from '@/components/wallet/types';
import styles from '@/components/wallet/wallet.module.css';
import { WalletBalance } from '@/components/wallet/WalletBalance';
import { useWalletState } from '@/hooks/useWalletState';
import { useTranslation } from '@/lib/i18n';

type PageProps = WalletStateResponse & {
    layout: WalletLayout;
    workspace_home: string | null;
} & Record<string, unknown>;

export default function Index() {
    const { t } = useTranslation();
    const props = usePage<PageProps>().props;
    const { layout, workspace_home: workspaceHome } = props;

    const initial = useMemo(
        () => ({
            wallet: props.wallet,
            activeTopup: props.activeTopup,
            recentTopups: props.recentTopups,
            transactions: props.transactions,
            filters: props.filters,
            typeOptions: props.typeOptions,
            bank: props.bank,
            limits: props.limits,
            presets: props.presets,
            server_time: props.server_time,
        }),
        [
            props.wallet,
            props.activeTopup,
            props.recentTopups,
            props.transactions,
            props.filters,
            props.typeOptions,
            props.bank,
            props.limits,
            props.presets,
            props.server_time,
        ],
    );

    const walletLive = useWalletState(initial);
    const state = walletLive.state;

    const liveStatus = (
        <LiveStatus
            lastUpdatedAt={walletLive.lastUpdatedAt}
            refreshing={walletLive.refreshing}
            failed={walletLive.failed}
            onRefresh={walletLive.refresh}
        />
    );

    const body = (
        <div className={styles.layout}>
            <div className={styles.main}>
                <WalletBalance wallet={state.wallet} />
                <TransactionLedger transactions={state.transactions} filters={state.filters} typeOptions={state.typeOptions} />
            </div>

            <div className={styles.side}>
                <TopupSlip
                    topup={state.activeTopup}
                    limits={state.limits}
                    presets={state.presets}
                    walletActive={state.wallet.status === 'active'}
                    onChanged={walletLive.applyTopup}
                />
                <RecentTopups topups={state.recentTopups} />
            </div>
        </div>
    );

    if (layout === 'workspace') {
        return (
            <WorkspaceLayout>
                <div className={styles.page}>
                    <Head title={t('Wallet')} />
                    <PageHeader
                        breadcrumbs={[
                            { label: t('Dashboard'), href: workspaceHome ?? '/' },
                            { label: t('Wallet'), current: true },
                        ]}
                        title={t('Wallet')}
                        description={t('Wallet description')}
                        actions={liveStatus}
                    />
                    {body}
                </div>
            </WorkspaceLayout>
        );
    }

    return (
        <AccountLayout
            active="wallet"
            breadcrumbs={[
                { label: t('Market'), href: '/' },
                { label: t('Wallet'), current: true },
            ]}
            title={t('Wallet')}
            description={t('Wallet description')}
            actions={liveStatus}
        >
            <div className={styles.page}>
                <Head title={t('Wallet')} />
                {body}
            </div>
        </AccountLayout>
    );
}
