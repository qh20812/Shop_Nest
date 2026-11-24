import { Tags } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import FormField from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { Select } from '@/components/ui/select';
import { useTranslation } from '@/lib/i18n';

import styles from '../forms.module.css';

interface Category {
    category_id: number;
    name: { en: string; vi: string };
    description?: { en?: string; vi?: string };
    parent_category_id?: number | null;
    is_active: boolean;
    image_url?: string;
}

interface CategoryFormProps {
    data: {
        name: { en: string; vi: string };
        description: { en: string; vi: string };
        parent_category_id: number | string;
        is_active: boolean;
        image?: File | null;
        image_url?: string;
    };
    setData: (key: string, value: unknown) => void;
    errors: Record<string, string>;
    processing: boolean;
    parentCategories: Category[];
    onSubmit: (e: React.FormEvent) => void;
    submitLabel?: string;
}

export default function CategoryForm({
    data,
    setData,
    errors,
    processing,
    parentCategories,
    onSubmit,
    submitLabel = 'Save Category',
}: CategoryFormProps) {
    const { t } = useTranslation();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleCancel = () => {
        window.location.href = '/admin/categories';
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setData('image', file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    return (
        <section className={styles.panel}>
            <div className={styles.panelHead}>
                <h2 className={styles.panelTitle}>
                    <Tags aria-hidden="true" className={styles.panelIcon} />
                    {t('Category Information')}
                </h2>
            </div>

            <form onSubmit={onSubmit} className={styles.formGrid}>
                <FormField label={t('Category Name (English)')} htmlFor="category-name-en" required error={errors['name.en']}>
                    <Input
                        id="category-name-en"
                        name="name_en"
                        value={data.name.en}
                        onChange={(event) => setData('name', { ...data.name, en: event.target.value })}
                        invalid={Boolean(errors['name.en'])}
                    />
                </FormField>

                <FormField label={t('Category Name (Vietnamese)')} htmlFor="category-name-vi" required error={errors['name.vi']}>
                    <Input
                        id="category-name-vi"
                        name="name_vi"
                        value={data.name.vi}
                        onChange={(event) => setData('name', { ...data.name, vi: event.target.value })}
                        invalid={Boolean(errors['name.vi'])}
                    />
                </FormField>

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

                <FormField label={t('Parent Category')} htmlFor="category-parent" error={errors.parent_category_id}>
                    <Select
                        id="category-parent"
                        name="parent_category_id"
                        value={String(data.parent_category_id ?? '')}
                        onChange={(event) => setData('parent_category_id', event.target.value || null)}
                    >
                        <option value="">{t('No Parent Category')}</option>
                        {parentCategories.map((category) => (
                            <option key={category.category_id} value={category.category_id}>
                                {category.name.en}
                            </option>
                        ))}
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

                <div className={styles.fileField}>
                    <span className={styles.fileLabel}>{t('Category Image')}</span>
                    <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        className={styles.fileInput}
                        accept="image/*"
                        aria-label={t('Category Image')}
                    />
                    {errors.image && <span className={styles.fileError}>{errors.image}</span>}

                    <div className={styles.preview}>
                        {imagePreview ? (
                            <>
                                <span className={styles.previewLabel}>{t('New Image Preview')}</span>
                                <img src={imagePreview} alt={t('Preview')} className={`${styles.previewImage} ${styles.previewImageCover}`} />
                            </>
                        ) : data.image_url ? (
                            <>
                                <span className={styles.previewLabel}>{t('Current Image')}</span>
                                <img src={data.image_url} alt={t('Current Image')} className={`${styles.previewImage} ${styles.previewImageCover}`} />
                            </>
                        ) : (
                            <div className={styles.previewEmpty}>{t('No image selected')}</div>
                        )}
                    </div>
                </div>

                <div className={styles.footer}>
                    <Button type="button" variant="secondary" onClick={handleCancel} disabled={processing}>
                        {t('Cancel')}
                    </Button>
                    <Button type="submit" variant="primary" loading={processing}>
                        {processing ? t('Saving...') : t(submitLabel)}
                    </Button>
                </div>
            </form>
        </section>
    );
}
