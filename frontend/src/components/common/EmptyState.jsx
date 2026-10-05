export default function EmptyState({
  title,
  description,
  action,
  icon: Icon,
  eyebrow,
  className = "",
}) {
  return (
    <section
      aria-live="polite"
      className={[
        "relative isolate overflow-hidden rounded-3xl border border-dashed border-line",
        "bg-cream px-6 py-20 text-center sm:px-12",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {Icon ? (
        <span
          className="mx-auto mb-7 flex size-16 items-center justify-center rounded-full bg-forest text-gold"
          aria-hidden="true"
        >
          <Icon className="size-7" strokeWidth={1.25} />
        </span>
      ) : null}
      {eyebrow ? (
        <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-gold-deep">
          {eyebrow}
        </p>
      ) : null}
      <h3 className="display-tight text-section text-ink">{title}</h3>
      {description ? (
        <p className="mx-auto mt-4 max-w-md text-[1.0625rem] leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-9 flex justify-center">{action}</div> : null}
    </section>
  );
}
