import React, { useState } from 'react';
import PrimaryInput from '../../ui/PrimaryInput';
import ActionButton from '../../ui/ActionButton';
import RichTextEditor from '../../ui/RichTextEditor';
import { useTranslation } from '../../../lib/i18n';

interface BrandFormData {
    _method?: string;
    name: string;
    description: string;
    logo: File | null;
    is_active: boolean;
}

interface BrandFormProps {
    data: BrandFormData;
    setData: (key: keyof BrandFormData, value: string | boolean | File | null) => void;
    errors: Record<string, string>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel?: string;
}

export default function BrandForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel = 'Save Brand'
}: BrandFormProps) {
    const { t } = useTranslation();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('logo', file);
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setLogoPreview(e.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            setLogoPreview(null);
        }
    };

    const handleCancel = () => {
        window.history.back();
    };

    return (
        <div className="bottom-data">
            <div style={{ flexGrow: 1, minWidth: "600px" }}>
                <div className="header">
                    <i className="bx bx-store"></i>
                    <h3>{t("Brand Information")}</h3>
                </div>

                <form onSubmit={onSubmit} style={{ marginTop: "20px" }}>
                    {/* Basic Information */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px", marginBottom: "20px" }}>
                        <PrimaryInput
                            label={t("Brand Name")}
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                            placeholder={t("Enter brand name")}
                            required
                        />

                        <RichTextEditor
                            label={t("Description")}
                            value={data.description}
                            onChange={(value) => setData('description', value)}
                            error={errors.description}
                            placeholder={t("Enter brand description...")}
                            height="120px"
                        />

                        <PrimaryInput
                            label={t("Status")}
                            name="is_active"
                            type="select"
                            value={data.is_active ? '1' : '0'}
                            onChange={(e) => setData('is_active', e.target.value === '1')}
                            error={errors.is_active}
                            required
                            options={[
                                { value: '1', label: t('Active') },
                                { value: '0', label: t('Inactive') }
                            ]}
                        />
                    </div>

                    {/* Logo Upload Section */}
                    <div style={{ marginBottom: "20px" }}>
                        <div className="form-group">
                            <label className="form-label">{t("Brand Logo")}</label>
                            <input
                                type="file"
                                accept="image/png,image/jpg,image/jpeg,image/webp"
                                onChange={handleLogoChange}
                                className={`form-input-field ${errors.logo ? 'error' : ''}`}
                            />
                            {errors.logo && <div className="form-error">{errors.logo}</div>}
                        </div>

                        {/* Logo Preview */}
                        <div style={{ marginTop: "12px" }}>
                            {logoPreview ? (
                                <img
                                    src={logoPreview}
                                    alt={t("Logo Preview")}
                                    style={{
                                        width: '200px',
                                        height: '150px',
                                        objectFit: 'contain',
                                        border: '1px solid var(--grey)',
                                        borderRadius: '8px',
                                        padding: '8px'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '200px',
                                    height: '150px',
                                    backgroundColor: '#f5f5f5',
                                    border: '2px dashed #ddd',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#999'
                                }}>
                                    {t('No logo selected')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <ActionButton
                            type="button"
                            variant="secondary"
                            onClick={handleCancel}
                            disabled={processing}
                        >
                            {t('Cancel')}
                        </ActionButton>
                        <ActionButton
                            type="submit"
                            variant="primary"
                            disabled={processing}
                            loading={processing}
                        >
                            {t(submitLabel)}
                        </ActionButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
