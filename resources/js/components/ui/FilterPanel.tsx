import React from "react";
import { Link } from "@inertiajs/react";
import { useTranslation } from "@/lib/i18n";
import Header from "./Header";

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

interface SearchConfig {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

interface FilterDropdownConfig {
  value: string;
  onChange: (value: string) => void;
  label: string; // The default option label, e.g., "-- All Roles --"
  options: { value: string | number; label: string }[];
}

interface ActionButtonConfig {
  href: string;
  label: string;
  icon: string;
  color: 'primary' | 'success' | 'danger';
}

interface FilterPanelProps {
  title: string;
  breadcrumbs: Breadcrumb[];
  onApplyFilters: () => void;
  searchConfig?: SearchConfig;
  filterConfigs?: FilterDropdownConfig[];
  buttonConfigs?: ActionButtonConfig[];
  reportButtonConfig?: {
    label: string;
    icon: string;
    onClick: () => void;
  };
}

export default function FilterPanel({
  title,
  breadcrumbs,
  onApplyFilters,
  searchConfig,
  filterConfigs = [],
  buttonConfigs = [],
  reportButtonConfig,
}: FilterPanelProps) {
  const { t } = useTranslation();

  // Helper function to get CSS variable for button colors
  const getButtonColorStyle = (color: 'primary' | 'success' | 'danger') => {
    switch (color) {
      case 'primary':
        return 'var(--primary)';
      case 'success':
        return 'var(--success)';
      case 'danger':
        return 'var(--danger)';
      default:
        return 'var(--primary)';
    }
  };

  return (
    <>
      {/* Header với tiêu đề và breadcrumb */}
      <Header
        title={t(title)}
        breadcrumbs={breadcrumbs.map(crumb => ({
          ...crumb,
          label: t(crumb.label)
        }))}
        reportButton={reportButtonConfig}
      />

      {/* Bộ lọc */}
      <div style={{ marginTop: "24px", marginBottom: "24px"}}>
        <div
          style={{
            background: "var(--light)",
            padding: "24px",
            borderRadius: "20px",
            display: "grid",
            gap: "16px",
            alignItems: "center",
            gridTemplateColumns: "4fr 1fr 1fr 1fr",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Tìm kiếm - Only render if searchConfig is provided */}
          {searchConfig && (
            <div className="form-input" style={{ minWidth: "300px", height: "40px", display: "flex" }}>
              <input
                type="text"
                placeholder={t(searchConfig.placeholder)}
                value={searchConfig.value}
                onChange={(e) => searchConfig.onChange(e.target.value)}
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
          )}

          {/* Dynamic Filter Dropdowns */}
          {filterConfigs.map((filterConfig, index) => (
            <select
              key={index}
              value={filterConfig.value}
              onChange={(e) => filterConfig.onChange(e.target.value)}
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
              <option value="">{t(filterConfig.label)}</option>
              {filterConfig.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.label)}
                </option>
              ))}
            </select>
          ))}

          {/* Action Buttons */}
          {buttonConfigs.map((buttonConfig, index) => (
            <Link
              key={index}
              href={buttonConfig.href}
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "20px",
                background: getButtonColorStyle(buttonConfig.color),
                color: "var(--light)",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <i className={`bx ${buttonConfig.icon}`}></i>
              {t(buttonConfig.label)}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
