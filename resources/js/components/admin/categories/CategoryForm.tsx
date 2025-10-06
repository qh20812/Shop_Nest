import React, { useState } from 'react';
import PrimaryInput from '../../ui/PrimaryInput';
import ActionButton from '../../ui/ActionButton';
import RichTextEditor from '../../ui/RichTextEditor';
import { useTranslation } from '../../../lib/i18n';

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
    submitLabel = 'Save Category'
}: CategoryFormProps) {
    const { t } = useTranslation();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleCancel = () => {
        window.location.href = '/admin/categories';
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    return (
        <div className="bottom-data">
            <div className="orders">
                <div className="header">
                    <i className="bx bx-edit"></i>
                    <h3>{t('Category Information')}</h3>
                </div>
                <form onSubmit={onSubmit} style={{ padding: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        {/* English Name */}
                        <div>
                            <PrimaryInput
                                label={t('Category Name (English)')}
                                name="name_en"
                                value={data.name.en}
                                onChange={(e) => setData('name', { ...data.name, en: e.target.value })}
                                error={errors['name.en']}
                                required
                            />
                        </div>

                        {/* Vietnamese Name */}
                        <div>
                            <PrimaryInput
                                label={t('Category Name (Vietnamese)')}
                                name="name_vi"
                                value={data.name.vi}
                                onChange={(e) => setData('name', { ...data.name, vi: e.target.value })}
                                error={errors['name.vi']}
                                required
                            />
                        </div>

                        {/* English Description */}
                        <div>
                            <RichTextEditor
                                label={t('Description (English)')}
                                value={data.description.en}
                                onChange={(value) => setData('description', { ...data.description, en: value })}
                                error={errors['description.en']}
                                placeholder={t('Enter description in English...')}
                                height="120px"
                            />
                        </div>

                        {/* Vietnamese Description */}
                        <div>
                            <RichTextEditor
                                label={t('Description (Vietnamese)')}
                                value={data.description.vi}
                                onChange={(value) => setData('description', { ...data.description, vi: value })}
                                error={errors['description.vi']}
                                placeholder={t('Enter description in Vietnamese...')}
                                height="120px"
                            />
                        </div>

                        {/* Parent Category */}
                        <div>
                            <PrimaryInput
                                label={t('Parent Category')}
                                name="parent_category_id"
                                type="select"
                                value={data.parent_category_id}
                                onChange={(e) => setData('parent_category_id', e.target.value || null)}
                                error={errors.parent_category_id}
                                options={[
                                    { value: '', label: t('No Parent Category') },
                                    ...parentCategories.map((category) => ({
                                        value: category.category_id,
                                        label: category.name.en
                                    }))
                                ]}
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <PrimaryInput
                                label={t('Status')}
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
                    </div>

                    {/* Category Image Section */}
                    <div style={{ marginBottom: '20px' }}>
                        <div>
                            <label className="form-label">{t('Category Image')}</label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleImageChange}
                                className={`form-input-field ${errors.image ? 'error' : ''}`}
                                accept="image/*"
                            />
                            {errors.image && <div className="input-error">{errors.image}</div>}
                        </div>
                        
                        {/* Image Preview */}
                        <div style={{ marginTop: '10px' }}>
                            {imagePreview ? (
                                <div>
                                    <p style={{ marginBottom: '5px', fontSize: '14px', color: '#666' }}>
                                        {t('New Image Preview')}:
                                    </p>
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        style={{ 
                                            width: '200px', 
                                            height: '150px', 
                                            objectFit: 'cover', 
                                            borderRadius: '8px',
                                            border: '1px solid #ddd'
                                        }} 
                                    />
                                </div>
                            ) : data.image_url ? (
                                <div>
                                    <p style={{ marginBottom: '5px', fontSize: '14px', color: '#666' }}>
                                        {t('Current Image')}:
                                    </p>
                                    <img 
                                        src={data.image_url} 
                                        alt="Current category" 
                                        style={{ 
                                            width: '200px', 
                                            height: '150px', 
                                            objectFit: 'cover', 
                                            borderRadius: '8px',
                                            border: '1px solid #ddd'
                                        }} 
                                    />
                                </div>
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
                                    {t('No image selected')}
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
                        >
                            {processing ? t('Saving...') : t(submitLabel)}
                        </ActionButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
