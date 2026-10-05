export default function Input({
  label,
  id,
  error,
  hint,
  as = "input",
  className = "",
  containerClassName = "",
  icon: Icon,
  trailing,
  ...props
}) {
  const inputId =
    id || label?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const Control = as;
  const describedBy =
    error || hint ? `${inputId}-${error ? "error" : "hint"}` : undefined;

  return (
    <div className={`grid gap-2 ${containerClassName}`.trim()}>
      {label ? (
        <label
          htmlFor={inputId}
          className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-forest"
        >
          {label}
        </label>
      ) : null}
      <div className="relative flex items-center">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute left-4 size-4 text-muted transition-colors duration-300 peer-focus:text-forest"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        ) : null}
        <Control
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={[
            "peer w-full rounded-xl border bg-cream text-[0.9375rem] text-ink",
            "px-4 py-3 transition-[border-color,box-shadow,background-color] duration-300 ease-editorial",
            "placeholder:text-muted/70",
            "focus:border-forest focus:bg-white focus:outline-none",
            "focus:ring-4 focus:ring-forest/10",
            Icon ? "pl-11" : "",
            trailing ? "pr-24" : "",
            error
              ? "border-danger/60 focus:border-danger focus:ring-danger/12"
              : "border-line hover:border-muted",
            "disabled:cursor-not-allowed disabled:bg-ivory-soft disabled:text-muted",
            Control === "textarea" ? "min-h-24 resize-y leading-relaxed" : "h-12",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {trailing ? <div className="absolute right-3">{trailing}</div> : null}
      </div>
      {error ? (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="text-[0.8125rem] leading-snug text-danger"
        >
          {error}
        </p>
      ) : hint ? (
        <p
          id={`${inputId}-hint`}
          className="text-[0.8125rem] leading-snug text-muted"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
