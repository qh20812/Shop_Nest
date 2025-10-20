import React, { useEffect, useMemo, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import ImageCarousel, { ProductImage } from '@/components/product-detail/ImageCarousel';
import ProductInfo from '@/components/product-detail/ProductInfo';
import VariantSelector, { VariantAttribute } from '@/components/product-detail/VariantSelector';
import QuantitySelector from '@/components/product-detail/QuantitySelector';
import ActionButtons from '@/components/product-detail/ActionButtons';
import ProductTabs from '@/components/product-detail/ProductTabs';
import ReviewList, { RatingSummary, ReviewItem, ReviewPagination } from '@/components/product-detail/ReviewList';
import RelatedProducts, { RelatedProductItem } from '@/components/product-detail/RelatedProducts';
import HomeLayout from '@/layouts/app/HomeLayout';
import '@/../css/Home.css';

interface VariantAttributeValue {
  attribute_id: number;
  attribute_value_id: number;
  attribute_name: string;
  value: string;
}

interface ProductVariantPayload {
  variant_id: number;
  sku: string;
  price: number;
  discount_price: number | null;
  final_price: number;
  stock_quantity: number;
  available_quantity: number;
  reserved_quantity: number;
  attribute_values: VariantAttributeValue[];
}

interface SpecificationItem {
  label: string;
  value: string;
}

interface ProductPayload {
  id: number;
  name: string;
  description: string;
  category: { id: number; name: string } | null;
  brand: { id: number; name: string } | null;
  images: ProductImage[];
  variants: ProductVariantPayload[];
  attributes: VariantAttribute[];
  default_variant_id: number | null;
  min_price: number;
  max_price: number;
  specifications: SpecificationItem[];
  rating: RatingSummary;
  sold_count: number;
}

interface ReviewsPayload {
  data: ReviewItem[];
  meta: ReviewPagination & { per_page: number; total: number };
}

interface PageProps {
  product: ProductPayload;
  reviews: ReviewsPayload;
  relatedProducts: RelatedProductItem[];
  cartItems: unknown[];
  [key: string]: unknown;
}

type TabKey = 'description' | 'specifications' | 'reviews';

function getCsrfToken(): string {
  const element = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
  return element?.content ?? '';
}

function buildAttributeMap(variant?: ProductVariantPayload): Record<number, number> {
  if (!variant) {
    return {};
  }

  return variant.attribute_values.reduce<Record<number, number>>((carry, attributeValue) => {
    carry[attributeValue.attribute_id] = attributeValue.attribute_value_id;
    return carry;
  }, {});
}

export default function Detail() {
  const { product, reviews, relatedProducts } = usePage<PageProps>().props;

  const [activeTab, setActiveTab] = useState<TabKey>('description');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState<'add' | 'buy' | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const initialVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return undefined;
    }

    const defaultMatch = product.default_variant_id
      ? product.variants.find((variant) => variant.variant_id === product.default_variant_id)
      : undefined;

    const firstAvailable = product.variants.find((variant) => {
      const available = variant.available_quantity ?? variant.stock_quantity;
      return available > 0;
    });

    return defaultMatch ?? firstAvailable ?? product.variants[0];
  }, [product.variants, product.default_variant_id]);

  const [selectedAttributes, setSelectedAttributes] = useState<Record<number, number>>(() => buildAttributeMap(initialVariant));
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    setSelectedAttributes(buildAttributeMap(initialVariant));
    setQuantity(1);
    setCurrentImageIndex(0);
  }, [initialVariant]);

  const selectedVariant = useMemo(() => {
    if (!product.attributes || product.attributes.length === 0) {
      return product.variants[0];
    }

    if (Object.keys(selectedAttributes).length !== product.attributes.length) {
      return undefined;
    }

    return product.variants.find((variant) =>
      variant.attribute_values.every((attributeValue) =>
        selectedAttributes[attributeValue.attribute_id] === attributeValue.attribute_value_id,
      ),
    );
  }, [product.attributes, product.variants, selectedAttributes]);

  useEffect(() => {
    if (!selectedVariant) {
      setQuantity(1);
      return;
    }

    const available = selectedVariant.available_quantity ?? selectedVariant.stock_quantity ?? 0;
    if (available <= 0) {
      setQuantity(1);
      return;
    }

    setQuantity((current) => Math.max(1, Math.min(current, available)));
  }, [selectedVariant]);

  const isOptionAvailable = (attributeId: number, valueId: number) => {
    return product.variants.some((variant) => {
      const matchesValue = variant.attribute_values.some(
        (attributeValue) => attributeValue.attribute_id === attributeId && attributeValue.attribute_value_id === valueId,
      );

      if (!matchesValue) {
        return false;
      }

      const availableQuantity = variant.available_quantity ?? variant.stock_quantity ?? 0;
      if (availableQuantity <= 0) {
        return false;
      }

      return Object.entries(selectedAttributes).every(([selectedAttributeId, selectedValueId]) => {
        const attributeKey = Number(selectedAttributeId);
        if (attributeKey === attributeId) {
          return true;
        }

        return variant.attribute_values.some((attributeValue) =>
          attributeValue.attribute_id === attributeKey && attributeValue.attribute_value_id === selectedValueId,
        );
      });
    });
  };

  const maxQuantity = selectedVariant ? selectedVariant.available_quantity ?? selectedVariant.stock_quantity ?? 0 : 0;
  const isInStock = maxQuantity > 0;
  const selectedPrice = selectedVariant ? selectedVariant.final_price : null;
  const selectedOriginalPrice = selectedVariant && selectedVariant.discount_price ? selectedVariant.price : null;

  const stockIndicator = selectedVariant
    ? isInStock
      ? `Còn ${maxQuantity} sản phẩm`
      : 'Biến thể này đã hết hàng'
    : 'Vui lòng chọn đầy đủ biến thể';

  const handleSelectAttribute = (attributeId: number, valueId: number) => {
    setSelectedAttributes((previous) => ({
      ...previous,
      [attributeId]: valueId,
    }));
    setStatusMessage(null);
  };

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
  };

  const performAction = async (endpoint: 'add-to-cart' | 'buy-now', type: 'add' | 'buy') => {
    if (!selectedVariant) {
      setStatusMessage({ type: 'error', message: 'Vui lòng chọn đầy đủ biến thể sản phẩm.' });
      return;
    }

    if (!isInStock) {
      setStatusMessage({ type: 'error', message: 'Biến thể này đã hết hàng.' });
      return;
    }

    setLoading(type);
    setStatusMessage(null);

    try {
      const response = await fetch(`/product/${product.id}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),
        },
        body: JSON.stringify({
          variant_id: selectedVariant.variant_id,
          quantity,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.success) {
        const message = payload?.message || 'Không thể xử lý yêu cầu lúc này.';
        setStatusMessage({ type: 'error', message });
        return;
      }

      setStatusMessage({ type: 'success', message: payload.message || 'Thao tác thành công.' });

      if (type === 'add') {
        router.reload({ only: ['cartItems'] });
      }

      if (type === 'buy' && payload.redirect) {
        window.location.href = payload.redirect;
      }
    } catch {
      setStatusMessage({ type: 'error', message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
    } finally {
      setLoading(null);
    }
  };

  const handleReviewPageChange = (page: number) => {
    setActiveTab('reviews');
    router.visit(`/product/${product.id}`, {
      method: 'get',
      data: { page },
      only: ['reviews'],
      preserveScroll: true,
      preserveState: true,
    });
  };

  return (
    <HomeLayout>
      <div className="product-detail-wrapper">
        <div className="product-detail-container">
          <ImageCarousel
            images={product.images}
            currentIndex={currentImageIndex}
            onSelect={setCurrentImageIndex}
          />
          <div className="product-detail-main">
            <ProductInfo
              name={product.name}
              brandName={product.brand?.name}
              categoryName={product.category?.name}
              rating={product.rating}
              soldCount={product.sold_count}
              minPrice={product.min_price}
              maxPrice={product.max_price}
              selectedPrice={selectedPrice}
              selectedOriginalPrice={selectedOriginalPrice}
            />

            {statusMessage && (
              <div className={`product-status ${statusMessage.type}`}>{statusMessage.message}</div>
            )}

            <VariantSelector
              attributes={product.attributes}
              selected={selectedAttributes}
              onSelect={handleSelectAttribute}
              isOptionAvailable={isOptionAvailable}
            />

            <div className="stock-indicator">{stockIndicator}</div>

            <QuantitySelector
              quantity={quantity}
              onChange={handleQuantityChange}
              max={Math.max(1, maxQuantity)}
              disabled={!isInStock}
            />

            <ActionButtons
              onAddToCart={() => performAction('add-to-cart', 'add')}
              onBuyNow={() => performAction('buy-now', 'buy')}
              disabled={!selectedVariant}
              loading={loading}
              isInStock={isInStock}
            />
          </div>
        </div>

        <div className="product-detail-tabs">
          <ProductTabs activeTab={activeTab} onChange={setActiveTab} reviewCount={product.rating.count}>
            {activeTab === 'description' && (
              <div className="tab-panel">
                {product.description ? (
                  <div
                    className="product-description"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                ) : (
                  <p>Chưa có mô tả cho sản phẩm này.</p>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="tab-panel">
                {product.specifications.length === 0 ? (
                  <p>Thông tin đang được cập nhật.</p>
                ) : (
                  <table className="spec-table">
                    <tbody>
                      {product.specifications.map((item) => (
                        <tr key={item.label}>
                          <th>{item.label}</th>
                          <td>{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-panel">
                <ReviewList
                  reviews={reviews.data}
                  ratingSummary={product.rating}
                  pagination={{ current_page: reviews.meta.current_page, last_page: reviews.meta.last_page }}
                  onPageChange={handleReviewPageChange}
                />
              </div>
            )}
          </ProductTabs>
        </div>

        <RelatedProducts products={relatedProducts} />
      </div>
    </HomeLayout>
  );
}
