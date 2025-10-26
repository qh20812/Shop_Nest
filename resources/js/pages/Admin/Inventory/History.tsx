import React, { useMemo } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AppLayout from "../../../layouts/app/AppLayout";
import DataTable from "@/components/ui/DataTable";
import FilterPanel from "@/components/ui/FilterPanel";
import Pagination from "@/components/ui/Pagination";
import "@/../css/Page.css";
import { useTranslation } from "../../../lib/i18n";

interface InventoryLog {
  id: number;
  variant_id: number;
  user_name: string;
  type: "in" | "out";
  quantity: number;
  reason: string;
  created_at: string;
}

interface PageProps {
  logs: {
    data: InventoryLog[];
    links: { url: string | null; label: string; active: boolean }[];
  };
  filters: { user?: string; type?: string };
}

export default function InventoryHistory() {
  const { t } = useTranslation();
  const { logs = { data: [], links: [] }, filters = {} } = usePage<PageProps>().props;
  const [user, setUser] = React.useState(filters.user || "");
  const [type, setType] = React.useState(filters.type || "");

  const handleFilter = () => {
    router.get("/admin/inventory/history", { user, type }, { preserveState: true });
  };

  const columns = useMemo(
    () => [
      { id: "id", header: "#", cell: (l: InventoryLog) => l.id },
      { id: "variant", header: t("Variant ID"), cell: (l: InventoryLog) => `#${l.variant_id}` },
      { id: "user", header: t("User"), cell: (l: InventoryLog) => l.user_name },
      { id: "type", header: t("Type"), cell: (l: InventoryLog) => (l.type === "in" ? t("Stock In") : t("Stock Out")) },
      { id: "quantity", header: t("Quantity"), cell: (l: InventoryLog) => l.quantity },
      { id: "reason", header: t("Reason"), cell: (l: InventoryLog) => l.reason || "-" },
      { id: "created_at", header: t("Date"), cell: (l: InventoryLog) => l.created_at },
    ],
    [t]
  );

  return (
    <AppLayout>
      <Head title={t("Inventory History")} />

      <FilterPanel
        title={t("Inventory History")}
        breadcrumbs={[
          { label: t("Dashboard"), href: "/admin/dashboard" },
          { label: t("Inventory"), href: "/admin/inventory" },
          { label: t("History"), href: "/admin/inventory/history", active: true },
        ]}
        searchConfig={{
          value: user,
          onChange: setUser,
          placeholder: t("Search by user name..."),
        }}
        filterConfigs={[
          {
            value: type,
            onChange: setType,
            label: t("-- All Types --"),
            options: [
              { value: "in", label: t("Stock In") },
              { value: "out", label: t("Stock Out") },
            ],
          },
        ]}
        onApplyFilters={handleFilter}
      />

      <DataTable
        columns={columns}
        data={logs.data}
        headerTitle={t("Inventory Logs")}
        headerIcon="bx bx-history"
        emptyMessage={t("No history found")}
      />

      <Pagination links={logs.links} />
    </AppLayout>
  );
}
