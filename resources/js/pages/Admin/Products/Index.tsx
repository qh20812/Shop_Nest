import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '../../../layouts/app/AppLayout';
import FilterPanel from '@/Components/ui/FilterPanel';
import DataTable from '@/Components/ui/DataTable';
import Pagination from '@/Components/ui/Pagination';
import Toast from '@/Components/admin/users/Toast';
import ConfirmationModal from '@/Components/ui/ConfirmationModal';
import ActionButtons, { ActionConfig } from '@/Components/ui/ActionButtons';
import StatusBadge from '@/Components/ui/StatusBadge';
import ProductInfoCell from '@/Components/admin/products/ProductInfoCell';
import '@/../css/Page.css';
import { useTranslation } from '../../../lib/i18n';

interface Category {
    category_id: number;
    name: string;
}

interface Brand {
    brand_id: number;
    name: string;
}

interface Product {
    product_id: number;
    name: string;
    category: { name: string };
    brand: { name: string };
    seller: { username: string; first_name: string; last_name: string };
    status: number;
    images?: Array<{ image_url: string; is_primary: boolean }>;
    variants?: Array<{ price: number }>;
    variants_count: number;
    variants_sum_stock_quantity: number;
}

interface PageProps {
    products: {
        data: Product[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    categories: Category[];
    brands: Brand[];
    filters: { search?: string; category_id?: string; brand_id?: string; status?: string };
    totalProducts: number;
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

export default function Index() {
    const { t } = useTranslation();
    const { products = { data: [], links: [] }, categories = [], brands = [], filters = {}, totalProducts = 0, flash = {} } = usePage<PageProps>().props;



    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [brandId, setBrandId] = useState(filters.brand_id || '');
    const [status, setStatus] = useState(filters.status || '');

    // Helper function to get localized category name
    const getCategoryName = (category: Category): string => {
        return category.name || 'Unnamed Category';
    };

    // Helper function to get localized product name
    const getProductName = React.useCallback((product: Product): string => {
        return product.name || 'Unnamed Product';
    }, []);

    // Helper function to get localized product category name from product
    const getProductCategoryName = React.useCallback((product: Product): string => {
        return product.category?.name || t('No Category');
    }, [t]);

    // Toast state
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Confirmation modal state
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        productId: number | null;
        productName: string;
        action: 'approve' | 'reject' | 'deactivate' | 'activate' | null;
        title: string;
        message: string;
    }>({
        isOpen: false,
        productId: null,
        productName: "",
        action: null,
        title: "",
        message: "",
    });

    // Listen for flash messages from backend
    useEffect(() => {
        if (flash?.success) {
            setToast({ type: "success", message: flash.success });
        } else if (flash?.error) {
            setToast({ type: "error", message: flash.error });
        }
    }, [flash]);

    // Auto-apply search filter on typing (debounced)
    // Auto search (debounce 500ms)
useEffect(() => {
    const delayTimer = setTimeout(() => {
        router.get('/admin/products', {
            search: search || undefined,
            category_id: categoryId || undefined,
            brand_id: brandId || undefined,
            status: status ? Number(status) : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    }, 500);

    return () => clearTimeout(delayTimer);
}, [search, categoryId, brandId, status]);


    const applyFilters = () => {
        router.get('/admin/products', { search, category_id: categoryId, brand_id: brandId, status }, { preserveState: true });
    };

    const handleStatusAction = React.useCallback((product: Product, action: 'approve' | 'reject' | 'deactivate' | 'activate') => {
        const productName = getProductName(product);
        const actionMessages = {
            approve: {
                title: t("Confirm Approve Product"),
                message: `${t("Are you sure you want to approve product")} "${productName}"? ${t("This will make it active and visible to customers.")}`
            },
            reject: {
                title: t("Confirm Reject Product"),
                message: `${t("Are you sure you want to reject product")} "${productName}"? ${t("This will mark it as inactive.")}`
            },
            deactivate: {
                title: t("Confirm Deactivate Product"),
                message: `${t("Are you sure you want to deactivate product")} "${productName}"? ${t("This will hide it from customers.")}`
            },
            activate: {
                title: t("Confirm Activate Product"),
                message: `${t("Are you sure you want to activate product")} "${productName}"? ${t("This will make it visible to customers again.")}`
            }
        };

        setConfirmModal({
            isOpen: true,
            productId: product.product_id,
            productName: productName,
            action,
            title: actionMessages[action].title,
            message: actionMessages[action].message,
        });
    }, [t, getProductName, setConfirmModal]);

    const handleConfirmAction = () => {
        if (!confirmModal.productId || !confirmModal.action) return;

        const statusMap = {
            approve: 2,    // active
            reject: 3,     // inactive
            deactivate: 3, // inactive
            activate: 2,   // active
        };

        router.patch(`/admin/products/${confirmModal.productId}/status`, {
            status: statusMap[confirmModal.action]
        });
    };

    const handleCloseModal = () => {
        setConfirmModal({
            isOpen: false,
            productId: null,
            productName: "",
            action: null,
            title: "",
            message: "",
        });
    };

    const handleCloseToast = () => {
        setToast(null);
    };

    // Helper functions
    const getProductStatus = React.useCallback((status: number | string) => {
        if (status === 1 || status === "1") return "pending";
    if (status === 2 || status === "2") return "active";
    if (status === 3 || status === "3") return "inactive";

    // **Nếu backend trả chữ**
    if (status === "pending") return "pending";
    if (status === "active") return "active";
    if (status === "inactive") return "inactive";

    return "pending";
        
    }, []);

    const getProductPrice = React.useCallback((product: Product) => {
        if (!product.variants || product.variants.length === 0) {
            return t("No variants");
        }

        const prices = product.variants.map(v => v.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        if (minPrice === maxPrice) {
            return `${minPrice.toLocaleString()} VND`;
        }
        return `${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()} VND`;
    }, [t]);

    const getSellerName = React.useCallback((seller: Product['seller']) => {
        return `${seller.first_name} ${seller.last_name}`.trim() || seller.username;
    }, []);

    // Define columns for DataTable with useMemo for performance optimization
    const productColumns = React.useMemo(() => [
        {
            id: 'product_info',
            header: t("Product"),
            cell: (product: Product) => <ProductInfoCell product={product} />
        },
        {
            id: 'category_name',
            header: t("Category"),
            cell: (product: Product) => (
                <div style={{ color: "var(--dark)" }}>
                    {getProductCategoryName(product)}
                </div>
            )
        },
        {
            id: 'seller_info',
            header: t("Seller"),
            cell: (product: Product) => (
                <div style={{ color: "var(--dark)" }}>
                    {getSellerName(product.seller)}
                </div>
            )
        },
        {
            id: 'brand_name',
            header: t("Brand"),
            cell: (product: Product) => (
                <div style={{ color: "var(--dark)" }}>
                    {product.brand.name}
                </div>
            )
        },
        {
            id: 'price_range',
            header: t("Price"),
            cell: (product: Product) => (
                <div style={{ 
                    fontWeight: "500", 
                    color: "var(--primary)",
                    fontSize: "14px"
                }}>
                    {getProductPrice(product)}
                </div>
            )
        },
        {
            id: 'stock_quantity',
            header: t("Stock"),
            cell: (product: Product) => (
                <div style={{ 
                    padding: "4px 8px", 
                    background: product.variants_sum_stock_quantity > 0 ? "var(--light-success)" : "var(--light-danger)", 
                    color: product.variants_sum_stock_quantity > 0 ? "var(--success)" : "var(--danger)", 
                    borderRadius: "12px", 
                    fontSize: "12px",
                    fontWeight: "500",
                    textAlign: "center"
                }}>
                    {product.variants_sum_stock_quantity || 0} {t("units")}
                </div>
            )
        },
        {
            id: 'status',
            header: t("Status"),
            cell: (product: Product) => (
                <StatusBadge status={getProductStatus(product.status)} />
            )
        },
        {
            id: 'actions',
            header: t("Actions"),
            cell: (product: Product) => {
                const actions: ActionConfig[] = [];
                
                if (product.status === 1) {
                    // Pending - show Approve and Reject
                    actions.push(
                        {
                            type: 'button',
                            onClick: () => handleStatusAction(product, 'approve'),
                            variant: 'primary',
                            icon: 'bx bx-check',
                            label: t('Approve')
                        },
                        {
                            type: 'button',
                            onClick: () => handleStatusAction(product, 'reject'),
                            variant: 'danger',
                            icon: 'bx bx-x',
                            label: t('Reject')
                        }
                    );
                } else if (product.status === 2) {
                    // Active - show View and Deactivate
                    actions.push(
                        {
                            type: 'link',
                            href: `/admin/products/${product.product_id}`,
                            variant: 'primary',
                            icon: 'bx bx-show',
                            label: t('View')
                        },
                        {
                            type: 'button',
                            onClick: () => handleStatusAction(product, 'deactivate'),
                            variant: 'danger',
                            icon: 'bx bx-hide',
                            label: t('Deactivate')
                        }
                    );
                } else if (product.status === 3) {
                    // Inactive - show View and Activate
                    actions.push(
                        {
                            type: 'link',
                            href: `/admin/products/${product.product_id}`,
                            variant: 'primary',
                            icon: 'bx bx-show',
                            label: t('View')
                        },
                        {
                            type: 'button',
                            onClick: () => handleStatusAction(product, 'activate'),
                            variant: 'primary',
                            icon: 'bx bx-show',
                            label: t('Activate')
                        }
                    );
                }
                
                return <ActionButtons actions={actions} />;
            }
        }
    ], [t, getProductCategoryName, getSellerName, getProductStatus, getProductPrice, handleStatusAction]);

    return (
        <AppLayout>
            <Head title={t("Product Management")} />
            
            {/* Toast notification */}
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={handleCloseToast}
                />
            )}

            {/* Header và Bộ lọc */}
            <FilterPanel
                title={t("Product Management")}
                breadcrumbs={[
                    { label: t("Dashboard"), href: "/admin/dashboard" },
                    { label: t("Products"), href: "/admin/products", active: true }
                ]}
                searchConfig={{
                    value: search,
                    onChange: setSearch,
                    placeholder: t("Search by product name or SKU...")
                }}
                filterConfigs={[
                    {
                        value: categoryId,
                        onChange: setCategoryId,
                        label: t("-- All Categories --"),
                        options: categories.map(category => ({
                            value: category.category_id,
                            label: getCategoryName(category)
                        }))
                    },
                    {
                        value: brandId,
                        onChange: setBrandId,
                        label: t("-- All Brands --"),
                        options: brands.map(brand => ({
                            value: brand.brand_id,
                            label: brand.name
                        }))
                    },
                    {
                        value: status,
                        onChange: setStatus,
                        label: t("-- All Statuses --"),
                        options: [
                            { value: "1", label: t("Pending Approval") },
                            { value: "2", label: t("Active") },
                            { value: "3", label: t("Inactive") }
                        ]
                    }
                ]}
                
            />

            {/* Bảng dữ liệu */}
            <DataTable
                columns={productColumns}
                data={products.data}
                headerTitle={`${t("Product List")} (${totalProducts})`}
                headerIcon="bx-package"
                emptyMessage={t("No products found")}
            />

            {/* Phân trang */}
            <Pagination links={products.links} />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmAction}
                title={confirmModal.title}
                message={confirmModal.message}
            />
        </AppLayout>
    );
}