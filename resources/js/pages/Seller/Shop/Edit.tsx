import '@/../css/Page.css';
import AppLayout from '@/layouts/app/AppLayout';
import { useTranslation } from '@/lib/i18n';
import { Head, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

interface PageProps {
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        if (form.logo) formData.append('logo', form.logo);
        if (form.banner) formData.append('banner', form.banner);

        router.post('/seller/shop', formData, {
            forceFormData: true,
            onSuccess: () => alert(t('Shop updated successfully!')),
        });
    };

    return (
        <AppLayout>
            <Head title={t('Shop Profile')} />

            <div
                className="shop-profile-page"
                style={{
                    maxWidth: 700,
                    margin: '40px auto',
                    padding: '20px',
                    background: '#fff',
                    borderRadius: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
            >
                <h2 style={{ marginBottom: 24 }}>{t('Shop Profile')}</h2>

                <form onSubmit={handleSubmit} className="shop-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: 6, fontWeight: 500 }}>{t('Shop Name')}</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="input-text"
                            style={{ padding: '10px', borderRadius: 6, border: '1px solid #ccc' }}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: 6, fontWeight: 500 }}>{t('Description')}</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="input-textarea"
                            style={{ padding: '10px', borderRadius: 6, border: '1px solid #ccc', minHeight: 100, resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: 6, fontWeight: 500 }}>{t('Shop Logo')}</label>
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange('logo', e.target.files?.[0] || null)} />
                        {previewLogo && (
                            <img
                                src={previewLogo}
                                alt="Logo Preview"
                                style={{ width: 120, height: 120, objectFit: 'cover', marginTop: 10, borderRadius: 8, border: '1px solid #ddd' }}
                            />
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: 6, fontWeight: 500 }}>{t('Shop Banner')}</label>
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange('banner', e.target.files?.[0] || null)} />
                        {previewBanner && (
                            <img
                                src={previewBanner}
                                alt="Banner Preview"
                                style={{
                                    width: '100%',
                                    maxHeight: 200,
                                    objectFit: 'cover',
                                    marginTop: 10,
                                    borderRadius: 8,
                                    border: '1px solid #ddd',
                                }}
                            />
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: 20, padding: '12px 20px', fontSize: 16, borderRadius: 8 }}>
                        {t('Save Changes')}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
