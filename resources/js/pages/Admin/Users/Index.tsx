
import React, { useState, useEffect } from "react";
import { Head, usePage, router, Link } from "@inertiajs/react";
import AppLayout from "../../../layouts/app/AppLayout";
import FilterPanel from "@/components/admin/FilterPanel";
import DataTable from "@/components/admin/DataTable";
import Pagination from "@/components/admin/users/Pagination";
import Toast from "@/components/admin/users/Toast";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Avatar from '@/components/ui/Avatar';
import '@/../css/Page.css';
import { useTranslation } from '../../../lib/i18n';

interface Role {
  id: number;
  name: Record<string, string>; // Translation object with locale keys
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  roles: Role[];
}

interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface PageProps {
  users: {
    data: User[];
    links: { url: string | null; label: string; active: boolean }[];
  };
  roles: string[];
  filters: { search?: string; role?: string; status?: string };
  flash?: { success?: string; error?: string };
  auth: {
    user: AuthUser;
  };
  [key: string]: unknown;
}

export default function Index() {
  const { t, locale } = useTranslation();
  const { users, roles, filters, flash, auth } = usePage<PageProps>().props;
  const currentUserId = auth.user.id;

  const [search, setSearch] = useState(filters.search || "");
  const [role, setRole] = useState(filters.role || "");
  const [status, setStatus] = useState(filters.status || "");

  // Toast state
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    userId: number | null;
    userName: string;
  }>({
    isOpen: false,
    userId: null,
    userName: "",
  });

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
    const user = users.data.find(u => u.id === id);
    const userName = user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
    
    setConfirmModal({
      isOpen: true,
      userId: id,
      userName: userName,
    });
  };

  const handleConfirmDelete = () => {
    if (confirmModal.userId) {
      router.delete(`/admin/users/${confirmModal.userId}`);
    }
  };

  const handleCloseModal = () => {
    setConfirmModal({
      isOpen: false,
      userId: null,
      userName: "",
    });
  };

  const handleCloseToast = () => {
    setToast(null);
  };

  // Define columns for DataTable
  const userColumns = [
    {
      header: "ID",
      cell: (user: User) => `#${user.id}`
    },
    {
      header: "Full Name",
      cell: (user: User) => {
        const isCurrentUser = user.id === currentUserId;
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Avatar user={user} />
            <div>
              <p style={{ fontWeight: "500", margin: 0 }}>
                {user.first_name} {user.last_name}
                {isCurrentUser && (
                  <span
                    style={{
                      fontSize: "12px",
                      padding: "2px 6px",
                      borderRadius: "8px",
                      background: "var(--light-success)",
                      color: "var(--success)",
                      fontWeight: "600",
                      marginLeft: "8px",
                    }}
                  >
                    ({t('You')})
                  </span>
                )}
              </p>
            </div>
          </div>
        );
      }
    },
    {
      header: "Email",
      accessorKey: "email" as keyof User
    },
    {
      header: "Role",
      cell: (user: User) => {
        return user.roles.map((role, index) => {
          const roleName = role.name[locale] || role.name['en'];
          return (
            <span
              key={role.id}
              style={{
                fontSize: "10px",
                padding: "4px 8px",
                borderRadius: "12px",
                background: roleName === "Admin" || roleName === "Quản trị viên" ? "var(--light-danger)" : "var(--light-primary)",
                color: roleName === "Admin" || roleName === "Quản trị viên" ? "var(--danger)" : "var(--primary)",
                fontWeight: "600",
                marginRight: index < user.roles.length - 1 ? "4px" : "0"
              }}
            >
              {roleName}
            </span>
          );
        });
      }
    },
    {
      header: "Status",
      cell: (user: User) => (
        <span 
          className={`status ${user.is_active ? "completed" : "pending"}`}
        >
          {user.is_active ? t("Active") : t("Inactive")}
        </span>
      )
    },
    {
      header: "Actions",
      cell: (user: User) => {
        const isCurrentUser = user.id === currentUserId;
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            <Link
              href={`/admin/users/${user.id}/edit`}
              style={{
                padding: "4px 12px",
                borderRadius: "16px",
                background: "var(--light-primary)",
                color: "var(--primary)",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <i className="bx bx-edit"></i>
              {t("Edit")}
            </Link>
            <button
              onClick={() => handleDelete(user.id)}
              disabled={isCurrentUser}
              style={{
                padding: "4px 12px",
                borderRadius: "16px",
                background: isCurrentUser ? "var(--grey)" : "var(--light-danger)",
                color: isCurrentUser ? "var(--dark-grey)" : "var(--danger)",
                border: "none",
                fontSize: "12px",
                fontWeight: "500",
                cursor: isCurrentUser ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                opacity: isCurrentUser ? 0.6 : 1,
              }}
            >
              <i className="bx bx-trash"></i>
              {t("Inactive")}
            </button>
          </div>
        );
      }
    }
  ];

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
      <FilterPanel
        title="User Management"
        breadcrumbs={[
          { label: "Admin", href: "#" },
          { label: "Users", href: "#", active: true },
        ]}
        searchConfig={{
          value: search,
          onChange: setSearch,
          placeholder: "Search by name or email..."
        }}
        filterConfigs={[
          {
            value: role,
            onChange: setRole,
            label: "-- All Roles --",
            options: roles.map(r => ({ value: r, label: r }))
          },
          {
            value: status,
            onChange: setStatus,
            label: "-- All Statuses --",
            options: [
              { value: "1", label: "Active" },
              { value: "0", label: "Inactive" }
            ]
          }
        ]}
        onApplyFilters={applyFilters}
        reportButtonConfig={{
          label: "Download CSV",
          icon: "bx-cloud-download",
          onClick: () => {
            console.log("Download CSV clicked");
          },
        }}
      />

      {/* Bảng dữ liệu */}
      <DataTable
        columns={userColumns}
        data={users.data}
        headerTitle="User List"
        headerIcon="bx-receipt"
        emptyMessage="No users found"
      />

      {/* Phân trang */}
      <Pagination links={users.links} />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title={t("Confirm User Deactivation")}
        message={`${t("Are you sure you want to deactivate user")} "${confirmModal.userName}"? ${t("This action will prevent them from accessing the system.")}`}
      />
    </AppLayout>
  );
}
