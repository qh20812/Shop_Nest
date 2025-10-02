import React from "react";
import { router } from "@inertiajs/react";

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationProps {
  links: PaginationLink[];
}

export default function Pagination({ links }: PaginationProps) {
  const handlePageChange = (url: string | null) => {
    if (url) {
      router.get(url);
    }
  };

  // Không hiển thị pagination nếu chỉ có 1 trang hoặc không có link
  if (links.length <= 3) {
    return null;
  }

  return (
    <div 
      style={{
        marginTop: "24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        background: "var(--light)",
        padding: "16px",
        borderRadius: "20px"
      }}
    >
      {links.map((link, index) => {
        // Xử lý các label đặc biệt
        let displayLabel = link.label;
        if (link.label.includes("Previous")) {
          displayLabel = "‹";
        } else if (link.label.includes("Next")) {
          displayLabel = "›";
        }

        return (
          <button
            key={index}
            onClick={() => handlePageChange(link.url)}
            disabled={!link.url}
            style={{
              padding: "8px 12px",
              border: "none",
              borderRadius: "8px",
              background: link.active ? "var(--primary)" : "transparent",
              color: link.active ? "var(--light)" : link.url ? "var(--dark)" : "var(--dark-grey)",
              cursor: link.url ? "pointer" : "not-allowed",
              fontWeight: link.active ? "600" : "400",
              fontSize: "14px",
              minWidth: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              if (link.url && !link.active) {
                e.currentTarget.style.background = "var(--grey)";
              }
            }}
            onMouseLeave={(e) => {
              if (link.url && !link.active) {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            {displayLabel}
          </button>
        );
      })}
    </div>
  );
}