import { useEffect } from "react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast || !toast.message) return null;

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      <div className={`toast ${toast.type || "success"}`}>
        <span>{toast.type === "error" ? "⚠" : "✓"}</span>
        <div style={{ flex: 1 }}>{toast.message}</div>
        <button
          onClick={onClose}
          aria-label="Dismiss notification"
          style={{
            background: "transparent",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            fontWeight: "bold",
            padding: "0.2rem"
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
