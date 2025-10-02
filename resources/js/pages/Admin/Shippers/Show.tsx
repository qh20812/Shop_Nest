import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from "../../../layouts/app/AppLayout";
import Header from "@/components/ui/Header";
import Toast from "@/components/admin/users/Toast";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import ActionButton from '@/components/ui/ActionButton';
import DocumentViewer from '@/components/admin/shippers/DocumentViewer';
import ShipperInfoCard from '@/components/admin/shippers/ShipperInfoCard';
import StatusBadge from '@/components/ui/StatusBadge';
import '@/../css/Page.css';
import { useTranslation } from '../../../lib/i18n';

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

export default function Show() {
    const { t } = useTranslation();
    const { shipper, flash } = usePage<PageProps>().props;

    const [isUpdating, setIsUpdating] = useState(false);
    
    // Toast state
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Document viewer state
    const [documentViewer, setDocumentViewer] = useState<{
        isOpen: boolean;
        imageUrl: string;
        documentName: string;
    }>({
        isOpen: false,
        imageUrl: "",
        documentName: "",
    });

    // Confirmation modal state
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        action: 'approved' | 'rejected' | 'suspended' | null;
        title: string;
        message: string;
    }>({
        isOpen: false,
        action: null,
        title: "",
        message: "",
    });

    // When there's flash from backend, show toast
    useEffect(() => {
        if (flash?.success) {
            setToast({ type: "success", message: flash.success });
        } else if (flash?.error) {
            setToast({ type: "error", message: flash.error });
        }
    }, [flash]);

    // Helper function to get translated status text for confirmation modals
    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return t('Pending');
            case 'approved': return t('Approved');
            case 'rejected': return t('Rejected');
            case 'suspended': return t('Suspended');
            default: return status;
        }
    };

    const handleStatusUpdate = (status: 'approved' | 'rejected' | 'suspended') => {
        const statusText = getStatusText(status);
        setConfirmModal({
            isOpen: true,
            action: status,
            title: `${statusText} ${t('Shipper')}`,
            message: t(`Are you sure you want to ${status} this shipper? This action will update their status.`),
        });
    };

    const handleConfirmAction = () => {
        if (confirmModal.action) {
            setIsUpdating(true);
            router.patch(`/admin/shippers/${shipper.id}/status`, {
                status: confirmModal.action,
            }, {
                onFinish: () => {
                    setIsUpdating(false);
                    handleCloseModal();
                },
            });
        }
    };

    const handleCloseModal = () => {
        setConfirmModal({
            isOpen: false,
            action: null,
            title: "",
            message: "",
        });
    };

    const handleCloseToast = () => {
        setToast(null);
    };

    const openDocumentViewer = (imageUrl: string, documentName: string) => {
        setDocumentViewer({
            isOpen: true,
            imageUrl,
            documentName,
        });
    };

    const closeDocumentViewer = () => {
        setDocumentViewer({
            isOpen: false,
            imageUrl: "",
            documentName: "",
        });
    };

    return (
        <AppLayout>
            <Head title={`${t('Shipper')}: ${shipper.first_name} ${shipper.last_name}`} />
            
            <Header
                title={t('Shipper Details')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: "/admin/dashboard" },
                    { label: t('Shippers'), href: "/admin/shippers" },
                    { label: `${shipper.first_name} ${shipper.last_name}`, href: `/admin/shippers/${shipper.id}`, active: true },
                ]}
                reportButton={{
                    label: t('Back to List'),
                    icon: 'bx bx-arrow-back',
                    onClick: () => router.visit('/admin/shippers')
                }}
            />

            <div className="bottom-data">
                {/* Personal Information Card */}
                <ShipperInfoCard 
                    title={t('Personal Information')} 
                    icon="bx bx-user"
                    actionButtons={
                        <>
                            {shipper.shipper_profile.status === 'pending' && (
                                <>
                                    <ActionButton
                                        variant="primary"
                                        onClick={() => handleStatusUpdate('approved')}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? t('Updating...') : t('Approve')}
                                    </ActionButton>
                                    <ActionButton
                                        variant="danger"
                                        onClick={() => handleStatusUpdate('rejected')}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? t('Updating...') : t('Reject')}
                                    </ActionButton>
                                </>
                            )}
                            {shipper.shipper_profile.status === 'approved' && (
                                <ActionButton
                                    variant="danger"
                                    onClick={() => handleStatusUpdate('suspended')}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? t('Updating...') : t('Suspend')}
                                </ActionButton>
                            )}
                        </>
                    }
                >
                    <div style={{ padding: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>{t('Full Name')}</label>
                                <p style={{ margin: 0 }}>{shipper.first_name} {shipper.last_name}</p>
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>{t('Email')}</label>
                                <p style={{ margin: 0 }}>{shipper.email}</p>
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>{t('Phone Number')}</label>
                                <p style={{ margin: 0 }}>{shipper.phone_number}</p>
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>{t('ID Card Number')}</label>
                                <p style={{ margin: 0 }}>{shipper.shipper_profile.id_card_number}</p>
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>{t('Driver License Number')}</label>
                                <p style={{ margin: 0 }}>{shipper.shipper_profile.driver_license_number}</p>
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>{t('Status')}</label>
                                <StatusBadge status={shipper.shipper_profile.status} />
                            </div>
                        </div>
                    </div>
                </ShipperInfoCard>

                {/* Vehicle Information Card */}
                <ShipperInfoCard title={t('Vehicle Details')} icon="bx bx-car">
                    <div style={{ padding: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>{t('Vehicle Type')}</label>
                                <p style={{ margin: 0 }}>{shipper.shipper_profile.vehicle_type}</p>
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>{t('License Plate')}</label>
                                <p style={{ margin: 0 }}>{shipper.shipper_profile.license_plate}</p>
                            </div>
                        </div>
                    </div>
                </ShipperInfoCard>

                {/* Documents Card */}
                <ShipperInfoCard title={t('Submitted Documents')} icon="bx bx-file">
                    <div style={{ padding: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            <div>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>{t('ID Card (Front)')}</label>
                                <div
                                    onClick={() => openDocumentViewer(shipper.shipper_profile.id_card_front_url, t('ID Card (Front)'))}
                                    style={{ cursor: 'pointer', position: 'relative' }}
                                >
                                    <img
                                        src={shipper.shipper_profile.id_card_front_url}
                                        alt="ID Card Front"
                                        style={{ 
                                            width: '100%', 
                                            height: '120px', 
                                            objectFit: 'cover', 
                                            borderRadius: '8px',
                                            border: '1px solid var(--grey)',
                                            transition: 'opacity 0.2s'
                                        }}
                                        onMouseOver={(e) => { (e.target as HTMLImageElement).style.opacity = '0.8'; }}
                                        onMouseOut={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        background: 'rgba(0, 0, 0, 0.7)',
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        opacity: 0,
                                        transition: 'opacity 0.2s',
                                        pointerEvents: 'none'
                                    }} className="hover-text">
                                        {t('Click to view')}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>{t('ID Card (Back)')}</label>
                                <div
                                    onClick={() => openDocumentViewer(shipper.shipper_profile.id_card_back_url, t('ID Card (Back)'))}
                                    style={{ cursor: 'pointer', position: 'relative' }}
                                >
                                    <img
                                        src={shipper.shipper_profile.id_card_back_url}
                                        alt="ID Card Back"
                                        style={{ 
                                            width: '100%', 
                                            height: '120px', 
                                            objectFit: 'cover', 
                                            borderRadius: '8px',
                                            border: '1px solid var(--grey)',
                                            transition: 'opacity 0.2s'
                                        }}
                                        onMouseOver={(e) => { (e.target as HTMLImageElement).style.opacity = '0.8'; }}
                                        onMouseOut={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        background: 'rgba(0, 0, 0, 0.7)',
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        opacity: 0,
                                        transition: 'opacity 0.2s',
                                        pointerEvents: 'none'
                                    }} className="hover-text">
                                        {t('Click to view')}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>{t("Driver's License")}</label>
                                <div
                                    onClick={() => openDocumentViewer(shipper.shipper_profile.driver_license_front_url, t("Driver's License"))}
                                    style={{ cursor: 'pointer', position: 'relative' }}
                                >
                                    <img
                                        src={shipper.shipper_profile.driver_license_front_url}
                                        alt="Driver's License"
                                        style={{ 
                                            width: '100%', 
                                            height: '120px', 
                                            objectFit: 'cover', 
                                            borderRadius: '8px',
                                            border: '1px solid var(--grey)',
                                            transition: 'opacity 0.2s'
                                        }}
                                        onMouseOver={(e) => { (e.target as HTMLImageElement).style.opacity = '0.8'; }}
                                        onMouseOut={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        background: 'rgba(0, 0, 0, 0.7)',
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        opacity: 0,
                                        transition: 'opacity 0.2s',
                                        pointerEvents: 'none'
                                    }} className="hover-text">
                                        {t('Click to view')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ShipperInfoCard>
            </div>

            {/* Toast Notification */}
            {toast && (
                <Toast 
                    type={toast.type} 
                    message={toast.message} 
                    onClose={handleCloseToast} 
                />
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmAction}
                title={confirmModal.title}
                message={confirmModal.message}
            />

            {/* Document Viewer Modal */}
            {documentViewer.isOpen && (
                <DocumentViewer
                    imageUrl={documentViewer.imageUrl}
                    documentName={documentViewer.documentName}
                    onClose={closeDocumentViewer}
                />
            )}
        </AppLayout>
    );
}