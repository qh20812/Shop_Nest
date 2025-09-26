import React, { useEffect } from "react";

interface ToastProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export default function Toast({ type, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastIcon = () => {
    if (type === "success") {
      return "bx bx-check-circle";
    }
    return "bx bx-error-circle";
  };

  const getToastColor = () => {
    if (type === "success") {
      return {
        background: "var(--light-success)",
        color: "var(--success)",
        border: "1px solid var(--success)"
      };
    }
    return {
      background: "var(--light-danger)",
      color: "var(--danger)",
      border: "1px solid var(--danger)"
    };
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 9999,
        ...getToastColor(),
        padding: "16px 20px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        minWidth: "300px",
        maxWidth: "500px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        animation: "slideInRight 0.3s ease-out"
      }}
    >
      <i className={getToastIcon()} style={{ fontSize: "20px" }}></i>
      <span style={{ fontWeight: "500", flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "inherit",
          fontSize: "16px",
          padding: "0",
          display: "flex",
          alignItems: "center"
        }}
      >
        <i className="bx bx-x"></i>
      </button>
    </div>
  );
}