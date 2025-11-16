import React from "react";
import { router } from "@inertiajs/react";

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationProps {
  links: PaginationLink[];
  filters?: Record<string, string | number | boolean | undefined>;
  preserveState?: boolean;
  preserveScroll?: boolean;
}

export default function Pagination({ links, filters = {}, preserveState = true, preserveScroll = true }: PaginationProps) {
  const handlePageChange = (url: string | null) => {
    if (url) {
      // Remove undefined values from filters to clean up the URL
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== undefined && value !== '')
      );

      router.get(url, cleanFilters, {
        preserveState,
        preserveScroll,
      });
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
        // Robust label processing for previous/next buttons
        let displayLabel = link.label;
        
        // Function to check if this is a previous button
        const isPreviousButton = (label: string): boolean => {
          const normalizedLabel = label.toLowerCase().replace(/&[a-z]+;/g, ''); // Remove HTML entities
          return (
            normalizedLabel.includes('previous') ||
            normalizedLabel.includes('trước') ||
            normalizedLabel.includes('pagination.previous') ||
            label === '&laquo; Previous' ||
            label === '&laquo; Trước' ||
            // Fallback: if it's the first link and has no URL (disabled), it's likely previous
            (index === 0 && !link.url)
          );
        };
        
        // Function to check if this is a next button
        const isNextButton = (label: string): boolean => {
          const normalizedLabel = label.toLowerCase().replace(/&[a-z]+;/g, ''); // Remove HTML entities
          return (
            normalizedLabel.includes('next') ||
            normalizedLabel.includes('sau') ||
            normalizedLabel.includes('pagination.next') ||
            label === 'Next &raquo;' ||
            label === 'Sau &raquo;' ||
            // Fallback: if it's the last link, it's likely next
            (index === links.length - 1)
          );
        };
        
        // Set display label based on button type
        if (isPreviousButton(link.label)) {
          displayLabel = "‹";
        } else if (isNextButton(link.label)) {
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
