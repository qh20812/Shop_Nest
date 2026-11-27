import { router } from '@inertiajs/react';
import { Image, Settings, Store } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import FormField from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { Select } from '@/components/ui/select';
import StatusBadge from '@/components/ui/status-badge';
import { formatDate, formatNumber } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from './BrandForm.module.css';

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
    currentLogoUrl?: string | null;
    createdAt?: string | null;
    productsCount?: number | null;
}

export default function BrandForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel = 'Save Brand',
    currentLogoUrl,
    createdAt,
    productsCount,
}: BrandFormProps) {
    const { t } = useTranslation();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (logoPreview) {
                URL.revokeObjectURL(logoPreview);
            }
        };
    }, [logoPreview]);

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;

        if (!file) {
            setData('logo', null);
            setLogoPreview(null);
            return;
        }

        setData('logo', file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const previewSource = logoPreview || currentLogoUrl || null;

    return (
        <div className={styles.layout}>
            <div className={styles.panel}>
                <form className={styles.form} onSubmit={onSubmit}>
                    <section className={styles.section} aria-labelledby="brand-information">
                        <div className={styles.sectionHead}>
                            <h2 id="brand-information" className={styles.sectionTitle}>
                                <Store aria-hidden="true" className={styles.sectionIcon} />
                                {t('Brand Information')}
                            </h2>
                        </div>

                        <FormField label={t('Brand Name')} htmlFor="brand-name" required error={errors.name}>
                            <Input
                                id="brand-name"
                                name="name"
                                value={data.name}
                                onChange={(event) => setData('name', event.target.value)}
                                placeholder={t('Enter brand name')}
                                invalid={Boolean(errors.name)}
                                required
                            />
                        </FormField>

                        <RichTextEditor
                            label={t('Description')}
                            value={data.description}
                            onChange={(value) => setData('description', value)}
                            error={errors.description}
                            placeholder={t('Enter brand description...')}
                            height="240px"
                        />
                    </section>

                    <section className={styles.section} aria-labelledby="brand-settings">
                        <div className={styles.sectionHead}>
                            <h2 id="brand-settings" className={styles.sectionTitle}>
                                <Settings aria-hidden="true" className={styles.sectionIcon} />
                                {t('Settings')}
                            </h2>
                        </div>

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
                    </section>

                    <div className={styles.footer}>
                        <Button type="button" variant="secondary" disabled={processing} onClick={() => router.get('/admin/brands')}>
                            {t('Cancel')}
                        </Button>
                        <Button type="submit" variant="primary" loading={processing}>
                            {processing ? t('Saving...') : t(submitLabel)}
                        </Button>
                    </div>
                </form>
            </div>

            <aside className={styles.rail}>
                <section className={styles.railSection}>
                    <h2 className={styles.railTitle}>
                        <Image aria-hidden="true" className={styles.sectionIcon} />
                        {t('Brand Logo')}
                    </h2>

                    <FormField
                        label={t('Brand Logo')}
                        htmlFor="brand-logo"
                        error={errors.logo}
                        hint={t('PNG, JPG or WebP. Transparent backgrounds work best. Max 1 MB.')}
                    >
                        <input
                            id="brand-logo"
                            name="logo"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleLogoChange}
                            className={styles.fileInput}
                        />
                    </FormField>

                    <div className={styles.previewFrame}>
                        {previewSource ? (
                            <img src={previewSource} alt={t('Logo Preview')} className={styles.previewImage} />
                        ) : (
                            <span className={styles.previewEmpty}>{t('No logo selected')}</span>
                        )}
                    </div>

                    {previewSource && <span className={styles.previewLabel}>{logoPreview ? t('New Logo Preview') : t('Current Logo')}</span>}
                </section>

                <section className={styles.railSection}>
                    <h2 className={styles.railTitle}>{t('Summary')}</h2>
                    <dl className={styles.facts}>
                        <div className={styles.fact}>
                            <dt className={styles.factLabel}>{t('Status')}</dt>
                            <dd className={styles.factValue}>
                                <StatusBadge status={data.is_active ? 'active' : 'inactive'} />
                            </dd>
                        </div>
                        {typeof productsCount === 'number' && (
                            <div className={styles.fact}>
                                <dt className={styles.factLabel}>{t('Products')}</dt>
                                <dd className={styles.factValue}>{formatNumber(productsCount)}</dd>
                            </div>
                        )}
                        {createdAt && (
                            <div className={styles.fact}>
                                <dt className={styles.factLabel}>{t('Created Date')}</dt>
                                <dd className={styles.factValue}>{formatDate(createdAt)}</dd>
                            </div>
                        )}
                    </dl>
                </section>
            </aside>
        </div>
    );
}
