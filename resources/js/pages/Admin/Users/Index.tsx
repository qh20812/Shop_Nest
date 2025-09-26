
import React, { useState, useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AppLayout from "../../../layouts/app/AppLayout";
import UserFilters from "@/components/admin/users/UserFilters";
import UserTable from "@/components/admin/users/UserTable";
import Pagination from "@/components/admin/users/Pagination";
import Toast from "@/components/admin/users/Toast";
import '@/../css/Page.css';
import { useTranslation } from '../../../lib/i18n';

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  roles: Role[];
}

interface PageProps {
  users: {
    data: User[];
    links: { url: string | null; label: string; active: boolean }[];
  };
  roles: string[];
  filters: { search?: string; role?: string; status?: string };
  flash?: { success?: string; error?: string };
  [key: string]: unknown;
}

export default function Index() {
  const { t } = useTranslation();
  const { users, roles, filters, flash } = usePage<PageProps>().props;

  const [search, setSearch] = useState(filters.search || "");
  const [role, setRole] = useState(filters.role || "");
  const [status, setStatus] = useState(filters.status || "");

  // Toast state
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Khi có flash từ backend thì hiển thị toast
  useEffect(() => {
    if (flash?.success) {
      setToast({ type: "success", message: flash.success });
    } else if (flash?.error) {
      setToast({ type: "error", message: flash.error });
    }
  }, [flash]);

  const applyFilters = () => {
    router.get("/admin/users", { search, role, status }, { preserveState: true });
  };

  const handleDelete = (id: number) => {
    if (confirm(t("Do you really want to disable this user?"))) {
      router.delete(`/admin/users/${id}`);
    }
  };

  const handleCloseToast = () => {
    setToast(null);
  };

  return (
    <AppLayout>
      <Head title={t("User Management")} />
      {/* Toast notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={handleCloseToast}
        />
      )}

      {/* Header và Bộ lọc */}
      <UserFilters
        search={search}
        role={role}
        status={status}
        roles={roles}
        onSearchChange={setSearch}
        onRoleChange={setRole}
        onStatusChange={setStatus}
        onApplyFilters={applyFilters}
      />

      {/* Bảng dữ liệu */}
      <UserTable
        users={users.data}
        onDelete={handleDelete}
      />

      {/* Phân trang */}
      <Pagination links={users.links} />
    </AppLayout>
  );
}
