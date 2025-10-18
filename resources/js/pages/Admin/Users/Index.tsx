
import React, { useState, useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AppLayout from "../../../layouts/app/AppLayout";
import FilterPanel from "@/components/ui/FilterPanel";
import DataTable from "@/components/ui/DataTable";
import Pagination from "@/components/ui/Pagination";
import Toast from "@/components/admin/users/Toast";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Avatar from '@/components/ui/Avatar';
import ActionButtons, { ActionConfig } from '@/components/ui/ActionButtons';
import '@/../css/Page.css';
import { useTranslation } from '../../../lib/i18n';

interface Role {
  id: number;
  name: Record<string, string>; // Translation object with locale keys
}

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  roles: Role[];
  avatar?: string | null;
  avatar_url?: string | null;
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
  totalUsers: number;
  filters: { search?: string; role?: string; status?: string };
  flash?: { success?: string; error?: string };
  auth: {
    user: AuthUser;
  };
  [key: string]: unknown;
}

export default function Index() {
  const { t, locale } = useTranslation();
  const { users, roles, totalUsers = 0, filters, flash, auth } = usePage<PageProps>().props;
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

  // Auto-apply search filter on typing (debounced)
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      if (search !== filters.search) {
        router.get("/admin/users", {
          search: search || undefined,
          role: role || undefined,
          status: status || undefined
        }, {
          preserveState: true,
          preserveScroll: true,
        });
      }
    }, 500);

    return () => clearTimeout(delayTimer);
  }, [search, filters.search, role, status]);

  const applyFilters = () => {
    router.get("/admin/users", { search, role, status }, { preserveState: true });
  };

  const handleStatusToggle = (id: number) => {
    const user = users.data.find(u => u.id === id);
    const fullName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '';
    const userName = fullName || user?.username || 'Unknown User';
    
    setConfirmModal({
      isOpen: true,
      userId: id,
      userName: userName,
    });
  };

  const handleConfirmStatusToggle = () => {
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
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        const displayName = fullName || user.username || 'Unknown User';
        
        // Normalize avatar_url for this user if backend returned a relative avatar path
        const userForAvatar = { ...user } as User;
        if (userForAvatar.avatar && !userForAvatar.avatar.startsWith('http') && !userForAvatar.avatar.startsWith('/')) {
          userForAvatar.avatar_url = userForAvatar.avatar_url || `/storage/${userForAvatar.avatar}`;
        }

        return (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Avatar user={userForAvatar} />
            <div>
              <p style={{ fontWeight: "500", margin: 0 }}>
                {displayName}
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
        const actions: ActionConfig[] = [
          {
            type: 'link',
            href: `/admin/users/${user.id}/edit`,
            variant: 'primary',
            icon: 'bx bx-edit',
            label: t("Edit")
          }
        ];

        // Add status toggle button based on user's current status
        if (user.is_active) {
          actions.push({
            type: 'button',
            onClick: () => handleStatusToggle(user.id),
            variant: 'danger',
            icon: 'bx bx-lock',
            label: t("Deactivate"),
            disabled: isCurrentUser
          });
        } else {
          actions.push({
            type: 'button',
            onClick: () => handleStatusToggle(user.id),
            variant: 'primary',
            icon: 'bx bx-lock-open',
            label: t("Activate"),
            disabled: isCurrentUser
          });
        }

        return <ActionButtons actions={actions} />;
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
            label: t("-- All Roles --"),
            options: roles.map(r => ({ value: r, label: r }))
          },
          {
            value: status,
            onChange: setStatus,
            label: t("-- All Statuses --"),
            options: [
              { value: "1", label: t("Active") },
              { value: "0", label: t("Inactive") }
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
        headerTitle={`User List (${totalUsers})`}
        headerIcon="bx-receipt"
        emptyMessage="No users found"
      />

      {/* Phân trang */}
      <Pagination links={users.links} />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmStatusToggle}
        title={t("Confirm User Status Change")}
        message={`${t("Are you sure you want to change the status of user")} "${confirmModal.userName}"?`}
      />
    </AppLayout>
  );
}
