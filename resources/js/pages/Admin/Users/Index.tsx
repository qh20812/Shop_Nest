
import React, { useState, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";

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

  // Tự động ẩn toast sau 3 giây
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const applyFilters = () => {
    router.get("/admin/users", { search, role, status }, { preserveState: true });
  };

  const handleDelete = (id: number) => {
    if (confirm("Vô hiệu hoá user này?")) {
      router.delete(`/admin/users/${id}`);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Quản lý Users</h1>

      {/* Toast popup */}
      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white z-50 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Bộ lọc */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="border px-2 py-1 mr-2">
          <option value="">-- Vai trò --</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border px-2 py-1 mr-2">
          <option value="">-- Trạng thái --</option>
          <option value="1">Hoạt động</option>
          <option value="0">Vô hiệu</option>
        </select>
        <button onClick={applyFilters} className="bg-blue-500 text-white px-3 py-1 rounded">
          Lọc
        </button>
      </div>

      {/* Bảng user */}
      <table className="border-collapse border w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Tên</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Roles</th>
            <th className="border px-2 py-1">Trạng thái</th>
            <th className="border px-2 py-1">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.data.length > 0 ? (
            users.data.map((u) => (
              <tr key={u.id}>
                <td className="border px-2 py-1">{u.id}</td>
                <td className="border px-2 py-1">
                  {u.first_name} {u.last_name}
                </td>
                <td className="border px-2 py-1">{u.email}</td>
                <td className="border px-2 py-1">{u.roles.map((r) => r.name).join(", ")}</td>
                <td className="border px-2 py-1">{u.is_active ? "Hoạt động" : "Vô hiệu"}</td>
                <td className="border px-2 py-1">
                  <Link href={`/admin/users/${u.id}/edit`} className="text-blue-600 mr-2">
                    Sửa
                  </Link>
                  <button onClick={() => handleDelete(u.id)} className="text-red-600">
                    Vô hiệu
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Không có user nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Phân trang */}
      <div style={{ marginTop: 16 }}>
        {users.links.map((link, i) => (
          <button
            key={i}
            disabled={!link.url}
            style={{
              marginRight: 4,
              fontWeight: link.active ? "bold" : "normal",
            }}
            onClick={() => link.url && router.get(link.url)}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {flash?.success && (
          <div className="p-2 bg-green-100 text-green-700 rounded">{flash.success}</div>
        )}
        {flash?.error && (
          <div className="p-2 bg-red-100 text-red-700 rounded">{flash.error}</div>
        )}
      </div>
    </div>
  );
}
