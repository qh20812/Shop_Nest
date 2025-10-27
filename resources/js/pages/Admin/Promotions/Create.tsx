import React, { useEffect, useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '../../../layouts/app/AppLayout';
import Header from '@/Components/ui/Header';
import ActionButton from '@/Components/ui/ActionButton';
import Toast from '@/Components/admin/users/Toast';
import { useTranslation } from '@/lib/i18n';
import '@/../css/Page.css';

interface Product {
  product_id: number;
  name: string;
  sku: string;
  price: number;
}

interface Category {
  category_id: number;
  name: string;
}

interface PageProps {
  products: Product[];
  categories: Category[];
  promotionTypes: Record<string, string>;
  flash?: { success?: string; error?: string };
  errors: Record<string, string>;
  [key: string]: unknown;
}

type FormState = {
  name: string;
  description: string;
  type: string;
  value: string;
  minimum_order_value: string;
  max_discount_amount: string;
  starts_at: string;
  expires_at: string;
  usage_limit_per_user: string;
  product_ids: number[];
  category_ids: number[];
  auto_apply_new_products: boolean;
  is_active: boolean;
};

export default function Create() {
  const { t } = useTranslation();
  const { products = [], categories = [], promotionTypes = {}, flash } = usePage<PageProps>().props;
  const [showErrorToast, setShowErrorToast] = useState(false);

  useEffect(() => {
    if (flash?.error) {
      setShowErrorToast(true);
    }
  }, [flash?.error]);

  const firstType = Object.keys(promotionTypes)[0] ?? 'percentage';

  const { data, setData, post, processing, errors } = useForm<FormState>({
    name: '',
    description: '',
    type: firstType,
    value: '',
    minimum_order_value: '',
    max_discount_amount: '',
    starts_at: '',
    expires_at: '',
    usage_limit_per_user: '',
    product_ids: [],
    category_ids: [],
    auto_apply_new_products: false,
    is_active: true,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    post('/admin/promotions');
  };

  const handleMultiSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    key: 'product_ids' | 'category_ids',
  ) => {
    const values = Array.from(event.target.selectedOptions, (option) => Number(option.value));
    setData(key, values);
  };

  const handleCancel = () => {
    router.get('/admin/promotions');
  };

  return (
    <AppLayout>
      <Head title={t('Create Promotion')} />

      {flash?.error && showErrorToast && (
        <Toast type="error" message={flash.error} onClose={() => setShowErrorToast(false)} />
      )}

      <Header
        title={t('Create Promotion')}
        breadcrumbs={[
          { label: t('Dashboard'), href: '/admin/dashboard' },
          { label: t('Promotions'), href: '/admin/promotions' },
          { label: t('Create'), href: '/admin/promotions/create', active: true },
        ]}
      />

      <form className="promotion-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2 className="form-section-title">{t('General Information')}</h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="name">{t('Promotion Name')}</label>
              <input
                id="name"
                className={`form-input-field ${errors.name ? 'error' : ''}`}
                value={data.name}
                onChange={(event) => setData('name', event.target.value)}
                placeholder={t('Enter promotion name')}
                required
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="type">{t('Promotion Type')}</label>
              <select
                id="type"
                className={`form-input-field ${errors.type ? 'error' : ''}`}
                value={data.type}
                onChange={(event) => setData('type', event.target.value)}
              >
                {Object.entries(promotionTypes).map(([key, label]) => (
                  <option key={key} value={key}>
                    {t(label)}
                  </option>
                ))}
              </select>
              {errors.type && <div className="form-error">{errors.type}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="value">{t('Discount Value')}</label>
              <input
                id="value"
                type="number"
                min="0"
                step="0.01"
                className={`form-input-field ${errors.value ? 'error' : ''}`}
                value={data.value}
                onChange={(event) => setData('value', event.target.value)}
                required
              />
              {errors.value && <div className="form-error">{errors.value}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="minimum_order_value">{t('Minimum Order Value')}</label>
              <input
                id="minimum_order_value"
                type="number"
                min="0"
                step="0.01"
                className={`form-input-field ${errors.minimum_order_value ? 'error' : ''}`}
                value={data.minimum_order_value}
                onChange={(event) => setData('minimum_order_value', event.target.value)}
              />
              {errors.minimum_order_value && (
                <div className="form-error">{errors.minimum_order_value}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="max_discount_amount">{t('Maximum Discount Amount')}</label>
              <input
                id="max_discount_amount"
                type="number"
                min="0"
                step="0.01"
                className={`form-input-field ${errors.max_discount_amount ? 'error' : ''}`}
                value={data.max_discount_amount}
                onChange={(event) => setData('max_discount_amount', event.target.value)}
              />
              {errors.max_discount_amount && (
                <div className="form-error">{errors.max_discount_amount}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">{t('Description')}</label>
            <textarea
              id="description"
              className={`form-input-field form-textarea ${errors.description ? 'error' : ''}`}
              value={data.description}
              onChange={(event) => setData('description', event.target.value)}
              placeholder={t('Describe the promotion...')}
            />
            {errors.description && <div className="form-error">{errors.description}</div>}
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">{t('Scheduling and Budget')}</h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="starts_at">{t('Start Date')}</label>
              <input
                id="starts_at"
                type="date"
                className={`form-input-field ${errors.starts_at ? 'error' : ''}`}
                value={data.starts_at}
                onChange={(event) => setData('starts_at', event.target.value)}
                required
              />
              {errors.starts_at && <div className="form-error">{errors.starts_at}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="expires_at">{t('End Date')}</label>
              <input
                id="expires_at"
                type="date"
                className={`form-input-field ${errors.expires_at ? 'error' : ''}`}
                value={data.expires_at}
                onChange={(event) => setData('expires_at', event.target.value)}
                required
              />
              {errors.expires_at && <div className="form-error">{errors.expires_at}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="usage_limit_per_user">{t('Usage Limit Per User')}</label>
              <input
                id="usage_limit_per_user"
                type="number"
                min="0"
                className={`form-input-field ${errors.usage_limit_per_user ? 'error' : ''}`}
                value={data.usage_limit_per_user}
                onChange={(event) => setData('usage_limit_per_user', event.target.value)}
              />
              {errors.usage_limit_per_user && (
                <div className="form-error">{errors.usage_limit_per_user}</div>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">{t('Targeting')}</h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="product_ids">{t('Select Products')}</label>
              <select
                id="product_ids"
                multiple
                className={`form-input-field form-multi-select ${errors.product_ids ? 'error' : ''}`}
                value={data.product_ids.map(String)}
                onChange={(event) => handleMultiSelectChange(event, 'product_ids')}
              >
                {products.map((product) => (
                  <option key={product.product_id} value={product.product_id}>
                    {`${product.name} (${product.sku})`}
                  </option>
                ))}
              </select>
              {errors.product_ids && <div className="form-error">{errors.product_ids}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category_ids">{t('Select Categories')}</label>
              <select
                id="category_ids"
                multiple
                className={`form-input-field form-multi-select ${errors.category_ids ? 'error' : ''}`}
                value={data.category_ids.map(String)}
                onChange={(event) => handleMultiSelectChange(event, 'category_ids')}
              >
                {categories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_ids && <div className="form-error">{errors.category_ids}</div>}
            </div>
          </div>

          <div className="form-group">
            <div className="form-checkbox">
              <input
                id="auto_apply_new_products"
                type="checkbox"
                checked={data.auto_apply_new_products}
                onChange={(event) => setData('auto_apply_new_products', event.target.checked)}
              />
              <label htmlFor="auto_apply_new_products">{t('Auto Apply New Products')}</label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <ActionButton type="button" variant="secondary" onClick={handleCancel}>
            {t('Cancel')}
          </ActionButton>
          <ActionButton type="submit" variant="primary" loading={processing}>
            {processing ? t('Saving...') : t('Create')}
          </ActionButton>
        </div>
      </form>
    </AppLayout>
  );
}
