import { router } from '@inertiajs/react';
import { Image, Settings, Tags } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import FormField from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { Select } from '@/components/ui/select';
import StatusBadge from '@/components/ui/status-badge';
import { formatDate } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from './CategoryForm.module.css';

export interface CategoryParentOption {
    category_id: number;
    name: string;
    depth: number;
    is_active: boolean;
}

interface CategoryFormProps {
    data: {
        name: { en: string; vi: string };
        description: { en: string; vi: string };
        parent_category_id: number | string | null;
        is_active: boolean;
        image?: File | null;
        image_url?: string;
    };
    setData: (key: string, value: unknown) => void;
    errors: Record<string, string>;
    processing: boolean;
    parentCategories: CategoryParentOption[];
    onSubmit: (e: React.FormEvent) => void;
    submitLabel?: string;
    createdAt?: string | null;
}

export default function CategoryForm({
    data,
    setData,
    errors,
    processing,
    parentCategories,
    onSubmit,
    submitLabel = 'Save Category',
    createdAt,
}: CategoryFormProps) {
    const { t } = useTranslation();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setData('image', file);
        setImagePreview(URL.createObjectURL(file));
    };

    const selectedParent = parentCategories.find((category) => String(category.category_id) === String(data.parent_category_id ?? ''));
    const parentLabel = selectedParent ? `${selectedParent.name}${selectedParent.is_active ? '' : ` (${t('Inactive')})`}` : t('No Parent Category');
    const previewSource = imagePreview || data.image_url || null;

    return (
        <div className={styles.layout}>
            <div className={styles.panel}>
                <form className={styles.form} onSubmit={onSubmit}>
                    <section className={styles.section} aria-labelledby="category-information">
                        <div className={styles.sectionHead}>
                            <h2 id="category-information" className={styles.sectionTitle}>
                                <Tags aria-hidden="true" className={styles.sectionIcon} />
                                {t('Category Information')}
                            </h2>
                        </div>

                        <div className={styles.fieldGrid}>
                            <FormField label={t('Category Name (English)')} htmlFor="category-name-en" required error={errors['name.en']}>
                                <Input
                                    id="category-name-en"
                                    name="name_en"
                                    value={data.name.en}
                                    onChange={(event) => setData('name', { ...data.name, en: event.target.value })}
                                    invalid={Boolean(errors['name.en'])}
                                    required
                                />
                            </FormField>

                            <FormField label={t('Category Name (Vietnamese)')} htmlFor="category-name-vi" required error={errors['name.vi']}>
                                <Input
                                    id="category-name-vi"
                                    name="name_vi"
                                    value={data.name.vi}
                                    onChange={(event) => setData('name', { ...data.name, vi: event.target.value })}
                                    invalid={Boolean(errors['name.vi'])}
                                    required
                                />
                            </FormField>
                        </div>

                        <div className={styles.descriptionStack}>
                            <RichTextEditor
                                label={t('Description (English)')}
                                value={data.description.en}
                                onChange={(value) => setData('description', { ...data.description, en: value })}
                                error={errors['description.en']}
                                placeholder={t('Enter description in English...')}
                                height="200px"
                            />

                            <RichTextEditor
                                label={t('Description (Vietnamese)')}
                                value={data.description.vi}
                                onChange={(value) => setData('description', { ...data.description, vi: value })}
                                error={errors['description.vi']}
                                placeholder={t('Enter description in Vietnamese...')}
                                height="200px"
                            />
                        </div>
                    </section>

                    <section className={styles.section} aria-labelledby="category-settings">
                        <div className={styles.sectionHead}>
                            <h2 id="category-settings" className={styles.sectionTitle}>
                                <Settings aria-hidden="true" className={styles.sectionIcon} />
                                {t('Settings')}
                            </h2>
                        </div>

                        <div className={styles.fieldGrid}>
                            <FormField label={t('Parent Category')} htmlFor="category-parent" error={errors.parent_category_id}>
                                <Select
                                    id="category-parent"
                                    name="parent_category_id"
                                    value={String(data.parent_category_id ?? '')}
                                    onChange={(event) => setData('parent_category_id', event.target.value || null)}
                                >
                                    <option value="">{t('No Parent Category')}</option>
                                    {parentCategories.map((category) => {
                                        const isCurrent = String(category.category_id) === String(data.parent_category_id ?? '');
                                        const prefix = '\u00A0\u00A0'.repeat(category.depth);
                                        const suffix = category.is_active ? '' : ` (${t('Inactive')})`;

                                        return (
                                            <option
                                                key={category.category_id}
                                                value={category.category_id}
                                                disabled={!category.is_active && !isCurrent}
                                            >
                                                {`${prefix}${category.name}${suffix}`}
                                            </option>
                                        );
                                    })}
                                </Select>
                            </FormField>

                            <FormField label={t('Status')} htmlFor="category-status" required error={errors.is_active}>
                                <Select
                                    id="category-status"
                                    name="is_active"
                                    value={data.is_active ? '1' : '0'}
                                    onChange={(event) => setData('is_active', event.target.value === '1')}
                                >
                                    <option value="1">{t('Active')}</option>
                                    <option value="0">{t('Inactive')}</option>
                                </Select>
                            </FormField>
                        </div>
                    </section>

                    <div className={styles.footer}>
                        <Button type="button" variant="secondary" disabled={processing} onClick={() => router.get('/admin/categories')}>
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
                        {t('Category Image')}
                    </h2>

                    <FormField
                        label={t('Category Image')}
                        htmlFor="category-image"
                        error={errors.image}
                        hint={t('JPG, PNG or WebP. Square images work best.')}
                    >
                        <input
                            id="category-image"
                            name="image"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            className={styles.fileInput}
                        />
                    </FormField>

                    <div className={styles.previewFrame}>
                        {previewSource ? (
                            <img src={previewSource} alt={t('Category Image')} className={styles.previewImage} />
                        ) : (
                            <span className={styles.previewEmpty}>{t('No image selected')}</span>
                        )}
                    </div>

                    {previewSource && <span className={styles.previewLabel}>{imagePreview ? t('New Image Preview') : t('Current Image')}</span>}
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
                        <div className={styles.fact}>
                            <dt className={styles.factLabel}>{t('Parent Category')}</dt>
                            <dd className={styles.factValue}>{parentLabel}</dd>
                        </div>
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
