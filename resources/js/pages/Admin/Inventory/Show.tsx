import React, { useMemo, useCallback, useEffect, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import AppLayout from "../../../layouts/app/AppLayout";
import DataTable from "@/components/ui/DataTable";
import Toast from "@/components/admin/users/Toast";
import StatusBadge from "@/components/ui/StatusBadge";
import "@/../css/Page.css";
import { useTranslation } from "../../../lib/i18n";

interface Seller {
  id: number;
  name: string | { vi?: string; en?: string };
}

interface Category {
  name: string | { vi?: string; en?: string };
}

interface Brand {
  name: string | { vi?: string; en?: string };
}

interface Product {
  product_id: number;
  name: string | { vi?: string; en?: string };
  seller?: Seller;
  category?: Category;
  brand?: Brand;
}

interface Variant {
  variant_id: number;
  sku: string;
  stock_quantity: number;
}

interface InventoryLog {
  id: number;
  user_name: string;
  type: "in" | "out";
  quantity: number;
  reason: string;
  created_at: string;
}

interface PageProps {
  product: Product;
  variants: Variant[];
  logs: InventoryLog[];
  flash?: { success?: string; error?: string };
}

export default function InventoryShow() {
  const { t } = useTranslation();
  const { product, variants = [], logs = [], flash = {} } = usePage<PageProps>().props;
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (flash?.success) setToast({ type: "success", message: flash.success });
    else if (flash?.error) setToast({ type: "error", message: flash.error });
  }, [flash]);

  const closeToast = () => setToast(null);

  // ✅ Xử lý tên có thể là object {en, vi}
  const getName = useCallback((name: any): string => {
    if (!name) return "-";
    if (typeof name === "string") return name;
    if (typeof name === "object") return name.vi || name.en || "-";
    return "-";
  }, []);

  const variantColumns = useMemo(
    () => [
      { id: "variant_id", header: t("Variant ID"), cell: (v: Variant) => `#${v.variant_id}` },
      { id: "sku", header: t("SKU"), cell: (v: Variant) => v.sku || "-" },
      {
        id: "stock_quantity",
        header: t("Stock Quantity"),
        cell: (v: Variant) => (
          <div
            style={{
              color: v.stock_quantity > 0 ? "var(--primary)" : "var(--danger)",
              fontWeight: 500,
            }}
          >
            {v.stock_quantity}
          </div>
        ),
      },
    ],
    [t]
  );

  const logColumns = useMemo(
    () => [
      { id: "id", header: "#", cell: (l: InventoryLog) => l.id },
      { id: "user", header: t("User"), cell: (l: InventoryLog) => l.user_name },
      {
        id: "type",
        header: t("Type"),
        cell: (l: InventoryLog) => (
          <StatusBadge
            status={l.type === "in" ? "success" : "danger"}
            label={l.type === "in" ? t("Stock In") : t("Stock Out")}
          />
        ),
      },
      { id: "quantity", header: t("Quantity"), cell: (l: InventoryLog) => l.quantity },
      { id: "reason", header: t("Reason"), cell: (l: InventoryLog) => l.reason || "-" },
      { id: "created_at", header: t("Date"), cell: (l: InventoryLog) => l.created_at },
    ],
    [t]
  );

  return (
    <AppLayout>
      <Head title={t("Inventory Details")} />
      {toast && <Toast type={toast.type} message={toast.message} onClose={closeToast} />}

      <div className="page-container">
        <div className="page-header">
          <div className="left">
            <h1 className="page-title">{t("Product Details")}</h1>
            <ul className="breadcrumb">
              <li>
                <a href="/admin/dashboard">{t("Dashboard")}</a>
              </li>
              <li>
                <a href="/admin/inventory">{t("Inventory")}</a>
              </li>
              <li className="active">{getName(product?.name)}</li>
            </ul>
          </div>
        </div>

        {/* Product info */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <i className="bx bx-package" /> {t("Product Information")}
          </div>
          <div className="card-body grid grid-cols-2 gap-4">
            <div>
              <strong>{t("Product Name")}:</strong> {getName(product?.name)}
            </div>
            <div>
              <strong>{t("Seller")}:</strong> {getName(product?.seller?.name)}
            </div>
            <div>
              <strong>{t("Category")}:</strong> {getName(product?.category?.name)}
            </div>
            <div>
              <strong>{t("Brand")}:</strong> {getName(product?.brand?.name)}
            </div>
          </div>
        </div>

        {/* Variants Table */}
        <DataTable
          columns={variantColumns}
          data={variants}
          headerTitle={t("Variants")}
          headerIcon="bx bx-layer"
          emptyMessage={t("No variants found")}
        />

        {/* Logs Table */}
        <DataTable
          columns={logColumns}
          data={logs}
          headerTitle={t("Recent Inventory Logs")}
          headerIcon="bx bx-history"
          emptyMessage={t("No logs found")}
        />
      </div>
    </AppLayout>
  );
}
