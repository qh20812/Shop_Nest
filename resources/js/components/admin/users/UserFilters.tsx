import React from "react";
import { useTranslation } from "@/lib/i18n";
import Header from "../Header";

interface UserFiltersProps {
    search: string;
    role: string;
    status: string;
    roles: string[];
    onSearchChange: (value: string) => void;
    onRoleChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onApplyFilters: () => void;
}

export default function UserFilters({
    search,
    role,
    status,
    roles,
    onSearchChange,
    onRoleChange,
    onStatusChange,
    onApplyFilters,
}: UserFiltersProps) {
    const { t } = useTranslation();
    return (
        <>
            {/* Header với tiêu đề và breadcrumb */}
            <Header
                title={t("User Management")}
                breadcrumbs={[
                    { label: t("Admin"), href: "#" },
                    { label: t("Users"), href: "#", active: true },
                ]}
                reportButton={{
                    label: t("Download CSV"),
                    icon: "bx-cloud-download",
                    onClick: () => {
                        console.log("Download CSV clicked");
                    },
                }}
            />
                               
            {/* Bộ lọc */}
            <div style={{ marginTop: "24px", marginBottom: "24px" }}>
                <div
                    style={{
                        background: "var(--light)",
                        padding: "24px",
                        borderRadius: "20px",
                        display: "flex",
                        gap: "16px",
                        alignItems: "center",
                        flexWrap: "wrap"
                    }}
                >
                    {/* Tìm kiếm */}
                    <div className="form-input" style={{ minWidth: "300px", height: "40px", display: "flex" }}>
                        <input
                            type="text"
                            placeholder={t("Search by name or email...")}
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            style={{
                                flexGrow: 1,
                                padding: "0 16px",
                                height: "100%",
                                border: "none",
                                background: "var(--grey)",
                                borderRadius: "36px 0 0 36px",
                                outline: "none",
                                width: "100%",
                                color: "var(--dark)",
                            }}
                        />
                        <button
                            type="button"
                            onClick={onApplyFilters}
                            style={{
                                width: "80px",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                background: "var(--primary)",
                                color: "var(--light)",
                                fontSize: "18px",
                                border: "none",
                                outline: "none",
                                borderRadius: "0 36px 36px 0",
                                cursor: "pointer"
                            }}
                        >
                            <i className="bx bx-search"></i>
                        </button>
                    </div>

                    {/* Lọc theo vai trò */}
                    <select
                        value={role}
                        onChange={(e) => onRoleChange(e.target.value)}
                        style={{
                            padding: "8px 16px",
                            border: "1px solid var(--grey)",
                            borderRadius: "20px",
                            background: "var(--light)",
                            color: "var(--dark)",
                            outline: "none",
                            cursor: "pointer",
                        }}
                    >
                        <option value="">-- {t("All Roles")} --</option>
                        {roles.map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>

                    {/* Lọc theo trạng thái */}
                    <select
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value)}
                        style={{
                            padding: "8px 16px",
                            border: "1px solid var(--grey)",
                            borderRadius: "20px",
                            background: "var(--light)",
                            color: "var(--dark)",
                            outline: "none",
                            cursor: "pointer",
                        }}
                    >
                        <option value="">-- {t("All Statuses")} --</option>
                        <option value="1">{t("Active")}</option>
                        <option value="0">{t("Inactive")}</option>
                    </select>
                </div>
            </div>
        </>
    );
}