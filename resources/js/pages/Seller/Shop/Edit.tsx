import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import Header from '@/components/ui/header';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/Contexts/ToastContext';
import { useTranslation } from '@/lib/i18n';
import { Head, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

import styles from '../seller.module.css';

interface PageProps extends Record<string, unknown> {
    shop: {
        id: number;
        name: string;
        description?: string | null;
        logo?: string | null;
        banner?: string | null;
    };
}

export default function ShopEdit() {
    const { t } = useTranslation();
    const { success: showSuccess } = useToast();
    const { shop } = usePage<PageProps>().props;

    const [form, setForm] = useState({
        name: shop.name,
        description: shop.description || '',
        logo: null as File | null,
        banner: null as File | null,
    });

    const [previewLogo, setPreviewLogo] = useState(shop.logo ? `/storage/${shop.logo}` : null);
    const [previewBanner, setPreviewBanner] = useState(shop.banner ? `/storage/${shop.banner}` : null);

    const handleFileChange = (field: 'logo' | 'banner', file: File | null) => {
        setForm({ ...form, [field]: file });
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (field === 'logo') setPreviewLogo(reader.result as string);
                else setPreviewBanner(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        if (form.logo) formData.append('logo', form.logo);
        if (form.banner) formData.append('banner', form.banner);

        router.post('/seller/shop', formData, {
            forceFormData: true,
            onSuccess: () => showSuccess(t('Shop updated successfully!')),
        });
    };

    return (
        <WorkspaceLayout>
            <Head title={t('Shop Profile')} />

            <Header
                title={t('Shop Profile')}
                breadcrumbs={[
                    { label: t('Seller Dashboard'), href: '/seller/dashboard' },
                    { label: t('Shop Profile'), href: '/seller/shop', active: true },
                ]}
            />

            <form onSubmit={handleSubmit} className={styles.stack}>
                <Card variant="flat" padding="md" className={styles.shopCard}>
                    <div className={styles.formSection}>
                        <FormField label={t('Shop Name')} required>
                            <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
                        </FormField>

                        <FormField label={t('Description')}>
                            <Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} autoGrow />
                        </FormField>

                        <FormField label={t('Shop Logo')} hint={t('Square image shown in shop listings.')}>
                            <input
                                type="file"
                                accept="image/*"
                                className={styles.fileInput}
                                onChange={(event) => handleFileChange('logo', event.target.files?.[0] || null)}
                            />
                        </FormField>

                        {previewLogo && (
                            <div className={styles.shopPreview}>
                                <img src={previewLogo} alt={t('Logo preview')} className={styles.shopLogo} />
                            </div>
                        )}

                        <FormField label={t('Shop Banner')} hint={t('Wide image shown at the top of the shop page.')}>
                            <input
                                type="file"
                                accept="image/*"
                                className={styles.fileInput}
                                onChange={(event) => handleFileChange('banner', event.target.files?.[0] || null)}
                            />
                        </FormField>

                        {previewBanner && (
                            <div className={styles.shopPreview}>
                                <img src={previewBanner} alt={t('Banner preview')} className={styles.shopBanner} />
                            </div>
                        )}
                    </div>
                </Card>

                <div className={styles.actions}>
                    <Button type="submit" variant="primary">
                        {t('Save Changes')}
                    </Button>
                </div>
            </form>
        </WorkspaceLayout>
    );
}
