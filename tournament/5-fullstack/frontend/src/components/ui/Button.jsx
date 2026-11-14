export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  onClick,
  ...props
}) {
  const variantClass = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    accent: "btn-accent",
    danger: "btn-danger"
  }[variant] || "btn-primary";

  const sizeClass = size === "sm" ? "btn-sm" : "";

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className}`.trim()}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? "Saving…" : children}
    </button>
  );
}
