import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { useTranslation } from "@/lib/i18n";
import ActionButton from "@/Components/ui/ActionButton";
import PrimaryInput from "@/Components/ui/PrimaryInput";

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
  auth: {
    user: AuthUser;
  };
  [key: string]: unknown;
}

interface UserEditFormProps {
  user: User;
  roles: Role[];
  errors: Record<string, string>;
}

export default function UserEditForm({ user, roles, errors }: UserEditFormProps) {
  const { auth } = usePage<PageProps>().props;
  const currentUserId = auth.user.id;
  const isEditingSelf = user.id === currentUserId;

  const [values, setValues] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    is_active: user.is_active ? 1 : 0,
    role_id: user.roles[0]?.id ?? '',
  });

  // State để track hover cho từng role
  const [hoveredRole, setHoveredRole] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.put(`/admin/users/${user.id}`, values);
  };
  
  const { t, locale } = useTranslation();

  return (
    <div className="bottom-data">
      <div style={{ flexGrow: 1, minWidth: "600px" }}>
        <div className="header">
          <i className="bx bx-edit"></i>
          <h3>{t("User Information")}</h3>
        </div>
        
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          {/* Thông tin cơ bản */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <PrimaryInput
              label={t("Last Name")}
              name="first_name"
              value={values.first_name}
              onChange={handleChange}
              error={errors.first_name}
              placeholder={t("Enter your last name")}
              disabled
              required
            />

            <PrimaryInput
              label={t("First Name")}
              name="last_name"
              value={values.last_name}
              onChange={handleChange}
              error={errors.last_name}
              placeholder={t("Enter your first name")}
              disabled
              required
            />
          </div>

          <PrimaryInput
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            placeholder={t("Enter your email")}
            disabled
            required
          />

          <PrimaryInput
            label={t("Status")}
            name="is_active"
            type="select"
            value={values.is_active}
            onChange={handleChange}
            disabled={isEditingSelf}
            options={[
              { value: 1, label: t("Active") },
              { value: 0, label: t("Inactive") }
            ]}
          />

          {/* Phân quyền */}
          <div className="form-group">
            <label className="form-label">{t("Role")} *</label>
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
              {roles.map((role) => {
                const isSelected = values.role_id === role.id;
                const isHovered = hoveredRole === role.id;
                const isDisabled = isEditingSelf || isSelected;
                const roleName = role.name[locale] || role.name['en'];
                return (
                  <label
                    key={role.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: isDisabled ? (isEditingSelf ? "not-allowed" : "default") : "pointer",
                      padding: "8px",
                      borderRadius: "6px",
                      background: isSelected 
                        ? "var(--light-primary)" 
                        : (isHovered && !isSelected && !isEditingSelf) 
                          ? "var(--grey)" 
                          : "transparent",
                      color: isEditingSelf 
                        ? "var(--dark-grey)"
                        : isSelected 
                          ? "var(--primary)" 
                          : "var(--dark)",
                      fontWeight: isSelected ? "600" : "400",
                      border: isSelected ? "2px solid var(--primary)" : "2px solid transparent",
                      transition: "all 0.3s ease",
                      opacity: isEditingSelf ? 0.6 : 1,
                    }}
                    onMouseEnter={() => !isDisabled && setHoveredRole(role.id)}
                    onMouseLeave={() => !isDisabled && setHoveredRole(null)}
                  >
                    <input
                      type="radio"
                      name="role_id"
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => !isEditingSelf && setValues(prev => ({ ...prev, role_id: role.id }))}
                      style={{
                        width: "16px",
                        height: "16px",
                        accentColor: "var(--primary)",
                      }}
                    />
                    <span>{roleName}</span>
                  </label>
                );
              })}
            </div>
            {errors.role_id && <span className="form-error">{errors.role_id}</span>}
          </div>

          {/* Nút hành động */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", paddingTop: "20px" }}>
            <ActionButton
              variant="secondary"
              type="button"
              onClick={() => window.history.back()}
              icon="bx bx-x"
            >
              {t("Cancel")}
            </ActionButton>
            
            <ActionButton
              variant="primary"
              type="submit"
              icon="bx bx-save"
            >
              {t("Update")}
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
}
