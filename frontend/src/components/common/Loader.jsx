export default function Loader({ label = "Loading", fullPage = false, rows = 0 }) {
  const spinner =
    "size-5 animate-spin rounded-full border-2 border-line border-t-forest";

  if (fullPage) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-5"
      >
        <span className="size-9 animate-spin rounded-full border-2 border-line border-t-gold" aria-hidden="true" />
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.24em] text-muted">
          {label}
        </p>
      </div>
    );
  }

  if (rows > 0) {
    return (
      <div role="status" aria-live="polite" className="grid gap-4">
        <span className="sr-only">{label}</span>
        {Array.from({ length: rows }, (_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="h-32 animate-pulse rounded-2xl border border-line bg-ivory-soft/70"
            style={{ animationDelay: `${index * 90}ms` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite" className="flex items-center gap-3 py-6">
      <span className={spinner} aria-hidden="true" />
      <span className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-muted">
        {label}
      </span>
    </div>
  );
}
