import { Store } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import FormField from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { Select } from '@/components/ui/select';
import { useTranslation } from '@/lib/i18n';

import styles from '../forms.module.css';

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

export default function BrandForm({ data, setData, errors, processing, onSubmit, submitLabel = 'Save Brand' }: BrandFormProps) {
    const { t } = useTranslation();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setData('logo', file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => setLogoPreview(loadEvent.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            setLogoPreview(null);
        }
    };

    const handleCancel = () => {
        window.history.back();
    };

    return (
        <section className={styles.panel}>
            <div className={styles.panelHead}>
                <h2 className={styles.panelTitle}>
                    <Store aria-hidden="true" className={styles.panelIcon} />
                    {t('Brand Information')}
                </h2>
            </div>

            <form onSubmit={onSubmit} className={styles.formGridSingle}>
                <FormField label={t('Brand Name')} htmlFor="brand-name" required error={errors.name}>
                    <Input
                        id="brand-name"
                        name="name"
                        value={data.name}
                        onChange={(event) => setData('name', event.target.value)}
                        placeholder={t('Enter brand name')}
                        invalid={Boolean(errors.name)}
                    />
                </FormField>

                <RichTextEditor
                    label={t('Description')}
                    value={data.description}
                    onChange={(value) => setData('description', value)}
                    error={errors.description}
                    placeholder={t('Enter brand description...')}
                    height="300px"
                />

                <FormField label={t('Status')} htmlFor="brand-status" required error={errors.is_active}>
                    <Select
                        id="brand-status"
                        name="is_active"
                        value={data.is_active ? '1' : '0'}
                        onChange={(event) => setData('is_active', event.target.value === '1')}
                    >
                        <option value="1">{t('Active')}</option>
                        <option value="0">{t('Inactive')}</option>
                    </Select>
                </FormField>

                <div className={styles.fileField}>
                    <span className={styles.fileLabel}>{t('Brand Logo')}</span>
                    <input
                        type="file"
                        accept="image/png,image/jpg,image/jpeg,image/webp"
                        onChange={handleLogoChange}
                        className={styles.fileInput}
                        aria-label={t('Brand Logo')}
                    />
                    {errors.logo && <span className={styles.fileError}>{errors.logo}</span>}

                    <div className={styles.preview}>
                        {logoPreview ? (
                            <img src={logoPreview} alt={t('Logo Preview')} className={styles.previewImage} />
                        ) : (
                            <div className={styles.previewEmpty}>{t('No logo selected')}</div>
                        )}
                    </div>
                </div>

                <div className={styles.footer}>
                    <Button type="button" variant="secondary" onClick={handleCancel} disabled={processing}>
                        {t('Cancel')}
                    </Button>
                    <Button type="submit" variant="primary" loading={processing}>
                        {t(submitLabel)}
                    </Button>
                </div>
            </form>
        </section>
    );
}
