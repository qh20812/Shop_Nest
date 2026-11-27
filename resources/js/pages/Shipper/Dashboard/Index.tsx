import { Head, router } from '@inertiajs/react';
import { RefreshCw, Truck } from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { useTranslation } from '@/lib/i18n';

export default function Index() {
    const { t } = useTranslation();

    return (
        <WorkspaceLayout>
            <Head title={t('Shipper Dashboard')} />

            <div className="sn-stack">
                <PageHeader
                    breadcrumbs={[
                        { label: t('Shipper Dashboard'), href: '#' },
                        { label: t('Overview'), href: '/shipper/dashboard', current: true },
                    ]}
                    title={t('Shipper Dashboard')}
                />

                <EmptyState
                    icon={Truck}
                    title={t('No deliveries assigned yet')}
                    description={t('Assigned deliveries will appear here.')}
                    actions={
                        <Button size="lg" variant="secondary" leftIcon={RefreshCw} onClick={() => router.reload()}>
                            {t('Reload')}
                        </Button>
                    }
                />
            </div>
        </WorkspaceLayout>
    );
}
