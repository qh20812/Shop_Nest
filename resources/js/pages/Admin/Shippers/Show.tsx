import { Head, router, usePage } from '@inertiajs/react';
import { Car, FileText, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';

import DocumentViewer from '@/components/admin/shippers/DocumentViewer';
import ShipperInfoCard from '@/components/admin/shippers/ShipperInfoCard';
import Toast from '@/components/admin/users/Toast';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import Header from '@/components/ui/header';
import { useTranslation } from '@/lib/i18n';

import styles from '@/components/admin/admin.module.css';

interface Role {
    id: number;
    name: {
        en: string;
        vi: string;
    };
}

interface ShipperProfile {
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    id_card_number: string;
    id_card_front_url: string;
    id_card_back_url: string;
    driver_license_number: string;
    driver_license_front_url: string;
    vehicle_type: string;
    license_plate: string;
    created_at: string;
    updated_at: string;
}

interface Shipper {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    phone_number: string;
    is_active: boolean;
    created_at: string;
    shipper_profile: ShipperProfile;
    roles: Role[];
}

interface PageProps {
    shipper: Shipper;
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

const statusTone = (status: ShipperProfile['status']) => {
    if (status === 'approved') return 'success' as const;
    if (status === 'pending') return 'warning' as const;
    if (status === 'suspended') return 'accent' as const;
    return 'danger' as const;
};

export default function Show() {
    const { t } = useTranslation();
    const { shipper, flash } = usePage<PageProps>().props;
    const viewHint = t('Click to view');

    const [isUpdating, setIsUpdating] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [documentViewer, setDocumentViewer] = useState<{ isOpen: boolean; imageUrl: string; documentName: string }>({
        isOpen: false,
        imageUrl: '',
        documentName: '',
    });
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        action: 'approved' | 'rejected' | 'suspended' | null;
        title: string;
        message: string;
    }>({ isOpen: false, action: null, title: '', message: '' });

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        }
    }, [flash]);

    const openStatusConfirm = (status: 'approved' | 'rejected' | 'suspended') => {
        const statusText = t(ucfirst(status));
        setConfirmModal({
            isOpen: true,
            action: status,
            title: `${statusText} ${t('Shipper')}`,
            message: t('Are you sure you want to update this shipper status?'),
        });
    };

    const handleConfirmAction = () => {
        if (!confirmModal.action) {
            return;
        }

        setIsUpdating(true);
        router.patch(
            `/admin/shippers/${shipper.id}/status`,
            { status: confirmModal.action },
            {
                onFinish: () => {
                    setIsUpdating(false);
                    setConfirmModal({ isOpen: false, action: null, title: '', message: '' });
                },
            },
        );
    };

    const openDocumentViewer = (imageUrl: string, documentName: string) => {
        setDocumentViewer({ isOpen: true, imageUrl, documentName });
    };

    const fullName = `${shipper.first_name} ${shipper.last_name}`.trim() || shipper.username;

    return (
        <WorkspaceLayout>
            <Head title={`${t('Shipper')}: ${shipper.first_name} ${shipper.last_name}`} />

            <Header
                title={t('Shipper Details')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Shippers'), href: '/admin/shippers' },
                    { label: fullName, href: `/admin/shippers/${shipper.id}`, active: true },
                ]}
                reportButton={{
                    label: t('Back to List'),
                    icon: UserRound,
                    onClick: () => router.visit('/admin/shippers'),
                }}
            />

            <div className={styles.stack}>
                <ShipperInfoCard
                    title={t('Personal Information')}
                    icon={UserRound}
                    actionButtons={
                        <>
                            {shipper.shipper_profile.status === 'pending' && (
                                <>
                                    <Button
                                        type="button"
                                        variant="primary"
                                        size="sm"
                                        onClick={() => openStatusConfirm('approved')}
                                        disabled={isUpdating}
                                    >
                                        {t('Approve')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => openStatusConfirm('rejected')}
                                        disabled={isUpdating}
                                    >
                                        {t('Reject')}
                                    </Button>
                                </>
                            )}
                            {shipper.shipper_profile.status === 'approved' && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => openStatusConfirm('suspended')}
                                    disabled={isUpdating}
                                >
                                    {t('Suspend')}
                                </Button>
                            )}
                        </>
                    }
                >
                    <div className={styles.detailGrid}>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t('Full Name')}</span>
                            <span className={styles.detailValue}>{fullName}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t('Email')}</span>
                            <span className={styles.detailValue}>{shipper.email}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t('Phone Number')}</span>
                            <span className={styles.detailValue}>{shipper.phone_number || '-'}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t('ID Card Number')}</span>
                            <span className={styles.detailValue}>{shipper.shipper_profile.id_card_number}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t('Driver License Number')}</span>
                            <span className={styles.detailValue}>{shipper.shipper_profile.driver_license_number}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t('Status')}</span>
                            <span>
                                <Badge tone={statusTone(shipper.shipper_profile.status)}>{t(ucfirst(shipper.shipper_profile.status))}</Badge>
                            </span>
                        </div>
                    </div>
                </ShipperInfoCard>

                <ShipperInfoCard title={t('Vehicle Details')} icon={Car}>
                    <div className={styles.detailGrid}>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t('Vehicle Type')}</span>
                            <span className={styles.detailValue}>{shipper.shipper_profile.vehicle_type}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>{t('License Plate')}</span>
                            <span className={styles.detailValue}>{shipper.shipper_profile.license_plate}</span>
                        </div>
                    </div>
                </ShipperInfoCard>

                <ShipperInfoCard title={t('Submitted Documents')} icon={FileText}>
                    <div className={styles.documentGrid}>
                        <div className={styles.documentItem}>
                            <span className={styles.documentLabel}>{t('ID Card (Front)')}</span>
                            <button
                                type="button"
                                className={styles.documentButton}
                                onClick={() => openDocumentViewer(shipper.shipper_profile.id_card_front_url, t('ID Card (Front)'))}
                            >
                                <img src={shipper.shipper_profile.id_card_front_url} alt={t('ID Card (Front)')} />
                                <span className={styles.documentHint}>{viewHint}</span>
                            </button>
                        </div>

                        <div className={styles.documentItem}>
                            <span className={styles.documentLabel}>{t('ID Card (Back)')}</span>
                            <button
                                type="button"
                                className={styles.documentButton}
                                onClick={() => openDocumentViewer(shipper.shipper_profile.id_card_back_url, t('ID Card (Back)'))}
                            >
                                <img src={shipper.shipper_profile.id_card_back_url} alt={t('ID Card (Back)')} />
                                <span className={styles.documentHint}>{viewHint}</span>
                            </button>
                        </div>

                        <div className={styles.documentItem}>
                            <span className={styles.documentLabel}>{t("Driver's License")}</span>
                            <button
                                type="button"
                                className={styles.documentButton}
                                onClick={() => openDocumentViewer(shipper.shipper_profile.driver_license_front_url, t("Driver's License"))}
                            >
                                <img src={shipper.shipper_profile.driver_license_front_url} alt={t("Driver's License")} />
                                <span className={styles.documentHint}>{viewHint}</span>
                            </button>
                        </div>
                    </div>
                </ShipperInfoCard>
            </div>

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, action: null, title: '', message: '' })}
                onConfirm={handleConfirmAction}
                title={confirmModal.title}
                message={confirmModal.message}
            />

            {documentViewer.isOpen && (
                <DocumentViewer
                    imageUrl={documentViewer.imageUrl}
                    documentName={documentViewer.documentName}
                    onClose={() => setDocumentViewer({ isOpen: false, imageUrl: '', documentName: '' })}
                />
            )}
        </WorkspaceLayout>
    );
}

const ucfirst = (value: string) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : value);
