import React, { useMemo } from "react";
import { Head, usePage } from "@inertiajs/react";
import AppLayout from "../../../layouts/app/AppLayout";
import DataTable from "@/components/ui/DataTable";
import FilterPanel from "@/components/ui/FilterPanel";
import "@/../css/Page.css";
import { useTranslation } from "../../../lib/i18n";

interface StockReport {
  category: string;
  brand: string;
  total_variants: number;
  total_stock: number;
  low_stock: number;
  out_of_stock: number;
}

interface PageProps {
  reports: StockReport[];
}

export default function InventoryReport() {
  const { t } = useTranslation();
  const { reports = [] } = usePage<PageProps>().props;

  const columns = useMemo(
    () => [
      { id: "category", header: t("Category"), cell: (r: StockReport) => r.category },
      { id: "brand", header: t("Brand"), cell: (r: StockReport) => r.brand },
      { id: "total_variants", header: t("Variants"), cell: (r: StockReport) => r.total_variants },
      { id: "total_stock", header: t("Total Stock"), cell: (r: StockReport) => r.total_stock },
      { id: "low_stock", header: t("Low Stock"), cell: (r: StockReport) => r.low_stock },
      { id: "out_of_stock", header: t("Out of Stock"), cell: (r: StockReport) => r.out_of_stock },
    ],
    [t]
  );

  return (
    <AppLayout>
      <Head title={t("Inventory Report")} />

      <FilterPanel
        title={t("Inventory Report")}
        breadcrumbs={[
          { label: t("Dashboard"), href: "/admin/dashboard" },
          { label: t("Inventory"), href: "/admin/inventory" },
          { label: t("Report"), href: "/admin/inventory/report", active: true },
        ]}
        searchConfig={{
          value: "",
          onChange: () => {},
          placeholder: t("Search..."),
        }}
        onApplyFilters={() => {}}
      />

      <DataTable
        columns={columns}
        data={reports}
        headerTitle={t("Stock Summary")}
        headerIcon="bx bx-bar-chart"
        emptyMessage={t("No report data found")}
      />
    </AppLayout>
  );
}
