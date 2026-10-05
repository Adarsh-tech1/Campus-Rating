export default function PageContainer({
  eyebrow,
  title,
  description,
  action,
  children,
  className = "",
}) {
  const hasHeader = Boolean(eyebrow || title || description || action);

  return (
    <main
      className={`mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:py-20 ${className}`.trim()}
    >
      {hasHeader ? (
        <header className="mb-12 grid gap-8 border-b border-line pb-10 sm:mb-16 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-12">
          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.26em] text-gold-deep">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h1 className="display-tight text-page text-forest">{title}</h1>
            ) : null}
            {description ? (
              <p className="mt-5 max-w-2xl text-[1.125rem] leading-relaxed text-muted">
                {description}
              </p>
            ) : null}
          </div>
          {action ? <div className="sm:justify-self-end">{action}</div> : null}
        </header>
      ) : null}
      {children}
    </main>
  );
}
