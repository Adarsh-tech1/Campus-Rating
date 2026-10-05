/**
 * Metric tile for the owner and admin dashboards.
 *
 * `value` may be a number (formatted with locale separators) or an already
 * formatted short string such as "4.5/5" or a date.
 */
export default function StatCard({ label, value, note, icon: Icon, className = "" }) {
  const displayValue =
    typeof value === "number" ? value.toLocaleString("en") : value;

  return (
    <section
      className={[
        "group relative overflow-hidden rounded-3xl border border-line bg-cream p-7",
        "transition-all duration-500 ease-editorial",
        "hover:-translate-y-1 hover:border-forest/30",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="absolute -right-10 -top-10 size-32 rounded-full bg-gold-mist opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted">
            {label}
          </p>
          <p className="display-tight mt-3 text-6xl text-forest tabular-nums">
            {displayValue}
          </p>
          {note ? <p className="mt-3 text-[0.9375rem] text-muted">{note}</p> : null}
        </div>

        {Icon ? (
          <span
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-forest text-gold"
            aria-hidden="true"
          >
            <Icon className="size-5" strokeWidth={1.5} />
          </span>
        ) : null}
      </div>
    </section>
  );
}