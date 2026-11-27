import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, BadgeCheck, MapPin, Pencil, Trash2 } from 'lucide-react';
import * as React from 'react';

import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { AccountLayout } from '@/components/layout/AccountLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    address: AddressModel;
}

export default function AddressShow() {
    const { t } = useTranslation();
    const { address } = usePage<PageProps>().props;
    const { success, error: showError } = useToast();
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);

    const fullAddress = [address.address, address.ward, address.province, address.country].filter(Boolean).join(', ');

    const handleDelete = () => {
        setDeleting(true);
        router.delete(`/user/addresses/${address.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                success(t('Address deleted'));
            },
            onError: () => showError(t('Could not delete the address')),
            onFinish: () => setDeleting(false),
        });
    };

    return (
        <AccountLayout
            active="addresses"
            breadcrumbs={[{ label: t('Market'), href: '/' }, { label: t('Addresses'), href: '/user/addresses' }, { label: address.name }]}
            eyebrow={t('Address details')}
            title={address.name}
            description={t('Address information used for delivery.')}
            actions={
                <div className={styles.badgeRow}>
                    <Button variant="secondary" size="sm" leftIcon={ArrowLeft} asChild>
                        <Link href="/user/addresses">{t('List')}</Link>
                    </Button>
                    <Button variant="outline" size="sm" leftIcon={Pencil} onClick={() => router.visit(`/user/addresses/${address.id}/edit`)}>
                        {t('Edit')}
                    </Button>
                    <Button variant="ghost" size="sm" leftIcon={Trash2} className={styles.dangerAction} onClick={() => setConfirmOpen(true)}>
                        {t('Delete')}
                    </Button>
                </div>
            }
        >
            <Head title={t('Address :name', { name: address.name })} />

            <Card padding="lg" className={styles.cardNarrow}>
                <div className={styles.addressShowStack}>
                    <div className={styles.addressShowHead}>
                        <span className={styles.addressName}>{address.name}</span>
                        <span className={styles.addressShowPhone}>{address.phone}</span>
                        {address.is_default ? (
                            <Badge tone="success" icon={BadgeCheck}>
                                {t('Default')}
                            </Badge>
                        ) : null}
                    </div>

                    <div className={styles.addressPinBox}>
                        <MapPin aria-hidden="true" className={styles.addressPinIcon} />
                        <div className={styles.addressPinBody}>
                            <span className={styles.addressPinLabel}>{t('Shipping address')}</span>
                            <span className={styles.addressPinValue}>{fullAddress}</span>
                        </div>
                    </div>

                    <dl className={styles.detailGrid}>
                        <div className={styles.detailCell}>
                            <dt className={styles.detailLabel}>{t('Province/City')}</dt>
                            <dd className={styles.detailValue}>{address.province || '-'}</dd>
                        </div>
                        <div className={styles.detailCell}>
                            <dt className={styles.detailLabel}>{t('Ward')}</dt>
                            <dd className={styles.detailValue}>{address.ward || '-'}</dd>
                        </div>
                    </dl>
                </div>
            </Card>

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title={t('Delete this address?')}
                description={t(':address. Deleted addresses cannot be restored.', { address: fullAddress })}
                confirmLabel={t('Delete address')}
                loading={deleting}
                onConfirm={handleDelete}
            />
        </AccountLayout>
    );
}
