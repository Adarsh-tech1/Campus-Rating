import { ChevronDown } from "lucide-react";

export default function Select({
  label,
  id,
  error,
  hint,
  options = [],
  className = "",
  containerClassName = "",
  ...props
}) {
  const selectId =
    id || label?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const describedBy =
    error || hint ? `${selectId}-${error ? "error" : "hint"}` : undefined;

  return (
    <div className={`grid gap-2 ${containerClassName}`.trim()}>
      {label ? (
        <label
          htmlFor={selectId}
          className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-forest"
        >
          {label}
        </label>
      ) : null}
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={[
            "peer h-12 w-full appearance-none rounded-xl border bg-cream",
            "pl-4 pr-11 text-[0.9375rem] text-ink",
            "transition-[border-color,box-shadow,background-color] duration-300 ease-editorial",
            "focus:border-forest focus:bg-white focus:outline-none focus:ring-4 focus:ring-forest/10",
            error
              ? "border-danger/60 focus:border-danger focus:ring-danger/12"
              : "border-line hover:border-muted",
            "disabled:cursor-not-allowed disabled:bg-ivory-soft disabled:text-muted",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        >
          {options.map((option) =>
            typeof option === "string" ? (
              <option key={option} value={option}>
                {option}
              </option>
            ) : (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ),
          )}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted transition-colors duration-300 peer-focus:text-forest"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </div>
      {error ? (
        <p
          id={`${selectId}-error`}
          role="alert"
          className="text-[0.8125rem] leading-snug text-danger"
        >
          {error}
        </p>
      ) : hint ? (
        <p
          id={`${selectId}-hint`}
          className="text-[0.8125rem] leading-snug text-muted"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}