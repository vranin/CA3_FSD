export default function Select({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  options = [],
  error,
  hint,
  required = false,
  disabled = false,
  className = "",
  ...props
}) {
  const selectId = id || name;

  return (
    <div className={`form-field ${className}`.trim()}>
      {label && (
        <label htmlFor={selectId} className="field-label">
          {label} {required && <span aria-hidden="true" style={{ color: "var(--accent)" }}>*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
        className={`select-control ${error ? "has-error" : ""}`}
        {...props}
      >
        {options.map((opt) => {
          const val = typeof opt === "object" ? opt.value : opt;
          const labelText = typeof opt === "object" ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {labelText}
            </option>
          );
        })}
      </select>
      {hint && !error && (
        <span id={`${selectId}-hint`} className="field-hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${selectId}-error`} className="error-message" role="alert" aria-live="polite">
          ⚠ {error}
        </span>
      )}
    </div>
  );
}
