export default function Input({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  type = "text",
  placeholder = "",
  required = false,
  disabled = false,
  className = "",
  ...props
}) {
  const inputId = id || name;

  return (
    <div className={`form-field ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="field-label">
          {label} {required && <span aria-hidden="true" style={{ color: "var(--accent)" }}>*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={`input-control ${error ? "has-error" : ""}`}
        {...props}
      />
      {hint && !error && (
        <span id={`${inputId}-hint`} className="field-hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${inputId}-error`} className="error-message" role="alert" aria-live="polite">
          ⚠ {error}
        </span>
      )}
    </div>
  );
}
