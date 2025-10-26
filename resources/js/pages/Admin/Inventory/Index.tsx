import "@/../css/Page.css";
import Toast from "@/components/admin/users/Toast";
import ActionButtons, { ActionConfig } from "@/components/ui/ActionButtons";
import DataTable from "@/components/ui/DataTable";
import FilterPanel from "@/components/ui/FilterPanel";
import Pagination from "@/components/ui/Pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import { Head, router, usePage } from "@inertiajs/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import AppLayout from "../../../layouts/app/AppLayout";
import { useTranslation } from "../../../lib/i18n";

interface Seller {
  id: number;
  name: string;
}

interface Category {
  category_id: number;
  name: string | { vi?: string; en?: string };
}

interface Brand {
  brand_id: number;
  name: string | { vi?: string; en?: string };
}

interface Product {
  product_id: number;
  name?: string | { vi?: string; en?: string };
  seller?: Seller | null;
  category?: Category | null;
  brand?: Brand | null;
}

interface Variant {
  variant_id: number;
  sku?: string;
  stock_quantity: number;
  product?: Product | null;
}

interface PageProps {
  variants: {
    data: Variant[];
    links: { url: string | null; label: string; active: boolean }[];
  };
  filters: {
    search?: string;
    seller_id?: string;
    category_id?: string;
    brand_id?: string;
    stock_status?: string;
  };
  sellers: Seller[];
  categories: Category[];
  brands: Brand[];
  stockStatuses: { value: string; label: string }[];
  totalVariants: number;
  flash?: { success?: string; error?: string };
  [key: string]: unknown;
}

export default function InventoryIndex() {
  const { t } = useTranslation();
  const {
    variants = { data: [], links: [] },
    filters = {},
    sellers = [],
    categories = [],
    brands = [],
    stockStatuses = [],
    totalVariants = 0,
    flash = {},
  } = usePage<PageProps>().props;

  const [search, setSearch] = useState(filters.search || "");
  const [sellerId, setSellerId] = useState(filters.seller_id || "");
  const [categoryId, setCategoryId] = useState(filters.category_id || "");
  const [brandId, setBrandId] = useState(filters.brand_id || "");
  const [stockStatus, setStockStatus] = useState(filters.stock_status || "");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (flash?.success) setToast({ type: "success", message: flash.success });
    else if (flash?.error) setToast({ type: "error", message: flash.error });
  }, [flash]);

  // ✅ always converts localized names (object or string) to text
  const getName = useCallback((name: any): string => {
    if (!name) return "-";
    if (typeof name === "string") return name;
    if (typeof name === "object") return name.vi || name.en || "-";
    return "-";
  }, []);

  const getStockBadge = useCallback(
    (qty: number) => {
      if (qty > 10)
        return (
          <div className="badge-stock badge-stock--in">
            {qty} {t("units")}
          </div>
        );
      if (qty > 0)
        return (
          <div className="badge-stock badge-stock--low">
            {qty} {t("units")}
          </div>
        );
      return <div className="badge-stock badge-stock--out">{t("Out of Stock")}</div>;
    },
    [t]
  );

  const applyFilters = () => {
    router.get(
      "/admin/inventory",
      {
        search,
        seller_id: sellerId,
        category_id: categoryId,
        brand_id: brandId,
        stock_status: stockStatus,
      },
      { preserveState: true }
    );
  };

  const inventoryColumns = useMemo(
    () => [
      {
        id: "variant_id",
        header: t("Variant ID"),
        cell: (v: Variant) => <div>#{v.variant_id}</div>,
      },
      {
        id: "product",
        header: t("Product"),
        cell: (v: Variant) => <div>{getName(v.product?.name) || t("Unnamed Product")}</div>,
      },
      {
        id: "seller",
        header: t("Seller"),
        cell: (v: Variant) => <div>{getName(v.product?.seller?.name) || t("No Seller")}</div>,
      },
      {
        id: "category",
        header: t("Category"),
        cell: (v: Variant) => <div>{getName(v.product?.category?.name) || t("No Category")}</div>,
      },
      {
        id: "brand",
        header: t("Brand"),
        cell: (v: Variant) => <div>{getName(v.product?.brand?.name) || t("No Brand")}</div>,
      },
      {
        id: "stock_quantity",
        header: t("Stock"),
        cell: (v: Variant) => getStockBadge(v.stock_quantity),
      },
      {
        id: "status",
        header: t("Status"),
        cell: (v: Variant) => (
          <StatusBadge
            status={
              v.stock_quantity > 10 ? "active" : v.stock_quantity > 0 ? "pending" : "inactive"
            }
          />
        ),
      },
      {
        id: "actions",
        header: t("Actions"),
        cell: (v: Variant) => {
          const actions: ActionConfig[] = [
            {
              type: "link",
              href: `/admin/inventory/${v.product?.product_id ?? 0}`,
              icon: "bx bx-show",
              label: t("Show"),
              variant: "primary",
            },
            {
              type: "link",
              href: `/admin/inventory/${v.product?.product_id ?? 0}/history`,
              icon: "bx bx-history",
              label: t("History"),
              variant: "secondary",
            },
          ];
          return <ActionButtons actions={actions} />;
        },
      },
    ],
    [t, getName, getStockBadge]
  );

  return (
    <AppLayout>
      <Head title={t("Inventory Management")} />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <FilterPanel
        title={t("Inventory Management")}
        breadcrumbs={[
          { label: t("Dashboard"), href: "/admin/dashboard" },
          { label: t("Inventory"), href: "/admin/inventory", active: true },
        ]}
        searchConfig={{
          value: search,
          onChange: setSearch,
          placeholder: t("Search by product or SKU..."),
        }}
        filterConfigs={[
          {
            value: sellerId,
            onChange: setSellerId,
            label: t("-- All Sellers --"),
            options: sellers.map((s) => ({ value: s.id, label: s.name })),
          },
          {
            value: categoryId,
            onChange: setCategoryId,
            label: t("-- All Categories --"),
            options: categories.map((c) => ({
              value: c.category_id,
              label: getName(c.name),
            })),
          },
          {
            value: brandId,
            onChange: setBrandId,
            label: t("-- All Brands --"),
            options: brands.map((b) => ({
              value: b.brand_id,
              label: getName(b.name),
            })),
          },
          {
            value: stockStatus,
            onChange: setStockStatus,
            label: t("-- All Statuses --"),
            options: stockStatuses.map((s) => ({
              value: s.value,
              label: s.label,
            })),
          },
        ]}
        onApplyFilters={applyFilters}
      />

      <DataTable
        columns={inventoryColumns}
        data={variants.data}
        headerTitle={`${t("Inventory List")} (${totalVariants})`}
        headerIcon="bx-box"
        emptyMessage={t("No variants found")}
      />

      <Pagination links={variants.links} />
    </AppLayout>
  );
}
