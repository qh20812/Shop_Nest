import { Head, Link, router, usePage } from '@inertiajs/react';
import { MapPin, Plus } from 'lucide-react';
import * as React from 'react';

import { AddressCard } from '@/components/commerce/AddressCard';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { AccountLayout } from '@/components/layout/AccountLayout';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/components/ui/toast';
import { useTranslation } from '@/lib/i18n';

import styles from '../customer.module.css';

interface AddressModel {
    id: number;
    name: string;
    phone: string;
    address: string;
    ward: string;
    province: string;
    country: string;
    is_default: boolean;
}

interface PageProps extends Record<string, unknown> {
    addresses?: AddressModel[];
}

export default function AddressIndex() {
    const { t } = useTranslation();
    const { addresses = [] } = usePage<PageProps>().props;
    const { success, error: showError } = useToast();
    const [pendingDelete, setPendingDelete] = React.useState<AddressModel | null>(null);
    const [deleting, setDeleting] = React.useState(false);
    const [busyId, setBusyId] = React.useState<number | null>(null);

    const handleSetDefault = (address: AddressModel) => {
        setBusyId(address.id);
        router.patch(
            `/user/addresses/${address.id}/default`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => success(t('Default address updated')),
                onError: () => showError(t('Could not set the default address')),
                onFinish: () => setBusyId(null),
            },
        );
    };

    const handleDelete = () => {
        if (!pendingDelete) {
            return;
        }

        setDeleting(true);
        router.delete(`/user/addresses/${pendingDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                success(t('Address deleted'));
                setPendingDelete(null);
            },
            onError: () => showError(t('Could not delete the address')),
            onFinish: () => setDeleting(false),
        });
    };

    return (
        <AccountLayout
            active="addresses"
            breadcrumbs={[{ label: t('Market'), href: '/' }, { label: t('Account') }, { label: t('Addresses') }]}
            eyebrow={t('Account')}
            title={t('Shipping addresses')}
            description={t('Manage delivery addresses and choose a default for your next checkout.')}
            count={t(':count addresses', { count: addresses.length })}
            actions={
                <Button leftIcon={Plus} asChild>
                    <Link href="/user/addresses/create">{t('Add address')}</Link>
                </Button>
            }
        >
            <Head title={t('Shipping addresses')} />

            {addresses.length === 0 ? (
                <EmptyState
                    icon={MapPin}
                    title={t('No addresses yet')}
                    description={t('Add your first address to check out faster next time.')}
                    actions={
                        <Button leftIcon={Plus} asChild>
                            <Link href="/user/addresses/create">{t('Add address')}</Link>
                        </Button>
                    }
                />
            ) : (
                <div className={styles.addressGrid}>
                    {addresses.map((address) => (
                        <AddressCard
                            key={address.id}
                            address={address}
                            busy={busyId === address.id || deleting}
                            onEdit={() => router.visit(`/user/addresses/${address.id}/edit`)}
                            onSetDefault={() => handleSetDefault(address)}
                            onDelete={() => setPendingDelete(address)}
                        />
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setPendingDelete(null);
                    }
                }}
                title={t('Delete this address?')}
                description={
                    pendingDelete
                        ? t(':name, :address, :ward, :province. Deleted addresses cannot be restored.', {
                              name: pendingDelete.name,
                              address: pendingDelete.address,
                              ward: pendingDelete.ward,
                              province: pendingDelete.province,
                          })
                        : ''
                }
                confirmLabel={t('Delete address')}
                loading={deleting}
                onConfirm={handleDelete}
            />
        </AccountLayout>
    );
}
