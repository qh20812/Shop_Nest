import React, { useState } from "react";
import { router } from "@inertiajs/react";

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

interface UserEditFormProps {
  user: User;
  roles: Role[];
  errors: Record<string, string>;
}

export default function UserEditForm({ user, roles, errors }: UserEditFormProps) {
  const [values, setValues] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    is_active: user.is_active ? 1 : 0,
    roles: user.roles.map((r) => r.id),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = (id: number) => {
    setValues((prev) => {
      const selected = prev.roles.includes(id)
        ? prev.roles.filter((r) => r !== id)
        : [...prev.roles, id];
      return { ...prev, roles: selected };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.put(`/admin/users/${user.id}`, values);
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid var(--grey)",
    borderRadius: "8px",
    background: "var(--light)",
    color: "var(--dark)",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.3s ease",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500" as const,
    color: "var(--dark)",
    fontSize: "14px",
  };

  const fieldStyle = {
    marginBottom: "20px",
  };

  const errorStyle = {
    color: "var(--danger)",
    fontSize: "12px",
    marginTop: "4px",
    display: "block",
  };

  return (
    <div className="bottom-data">
      <div style={{ flexGrow: 1, minWidth: "600px" }}>
        <div className="header">
          <i className="bx bx-edit"></i>
          <h3>Thông tin User</h3>
        </div>
        
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          {/* Thông tin cơ bản */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Họ *</label>
              <input
                type="text"
                name="first_name"
                value={values.first_name}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.first_name ? "var(--danger)" : "var(--grey)",
                }}
                placeholder="Nhập họ"
              />
              {errors.first_name && <span style={errorStyle}>{errors.first_name}</span>}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Tên *</label>
              <input
                type="text"
                name="last_name"
                value={values.last_name}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.last_name ? "var(--danger)" : "var(--grey)",
                }}
                placeholder="Nhập tên"
              />
              {errors.last_name && <span style={errorStyle}>{errors.last_name}</span>}
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              style={{
                ...inputStyle,
                borderColor: errors.email ? "var(--danger)" : "var(--grey)",
              }}
              placeholder="Nhập địa chỉ email"
            />
            {errors.email && <span style={errorStyle}>{errors.email}</span>}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Trạng thái</label>
            <select
              name="is_active"
              value={values.is_active}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Vô hiệu hóa</option>
            </select>
          </div>

          {/* Phân quyền */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Vai trò</label>
            <div 
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
                padding: "16px",
                background: "var(--grey)",
                borderRadius: "8px",
              }}
            >
              {roles.map((role) => (
                <label
                  key={role.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "6px",
                    background: values.roles.includes(role.id) ? "var(--light-primary)" : "transparent",
                    color: values.roles.includes(role.id) ? "var(--primary)" : "var(--dark)",
                    fontWeight: values.roles.includes(role.id) ? "500" : "400",
                    transition: "all 0.3s ease",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={values.roles.includes(role.id)}
                    onChange={() => handleRoleToggle(role.id)}
                    style={{
                      width: "16px",
                      height: "16px",
                      accentColor: "var(--primary)",
                    }}
                  />
                  <span>{role.name}</span>
                </label>
              ))}
            </div>
            {errors.roles && <span style={errorStyle}>{errors.roles}</span>}
          </div>

          {/* Nút hành động */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", paddingTop: "20px" }}>
            <button
              type="button"
              onClick={() => window.history.back()}
              style={{
                padding: "12px 24px",
                border: "1px solid var(--grey)",
                borderRadius: "8px",
                background: "transparent",
                color: "var(--dark)",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--grey)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <i className="bx bx-x" style={{ marginRight: "8px" }}></i>
              Hủy
            </button>
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                background: "var(--primary)",
                color: "var(--light)",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--dark)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--primary)";
              }}
            >
              <i className="bx bx-save" style={{ marginRight: "8px" }}></i>
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}