import { ChevronLeft, ChevronRight } from "lucide-react";

function pageWindow(page, totalPages) {
  const width = 5;
  const start = Math.max(1, Math.min(page - 2, totalPages - width + 1));
  return Array.from({ length: Math.min(width, totalPages) }, (_, i) => start + i);
}

export default function Pagination({ page = 1, totalPages = 1, onChange }) {
  if (totalPages <= 1) return null;
  const pages = pageWindow(page, totalPages);

  const step = (delta) => () => {
    const next = Math.min(Math.max(page + delta, 1), totalPages);
    if (next !== page) onChange(next);
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-1.5"
    >
      <button
        type="button"
        onClick={step(-1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="flex size-11 items-center justify-center rounded-full border border-line text-forest transition-all duration-300 ease-editorial hover:border-forest hover:bg-forest hover:text-ivory disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
      </button>

      {pages[0] > 1 ? (
        <>
          <PageButton page={1} current={page} onChange={onChange} />
          {pages[0] > 2 ? <span className="px-1 text-muted">…</span> : null}
        </>
      ) : null}

      {pages.map((item) => (
        <PageButton key={item} page={item} current={page} onChange={onChange} />
      ))}

      {pages[pages.length - 1] < totalPages ? (
        <>
          {pages[pages.length - 1] < totalPages - 1 ? (
            <span className="px-1 text-muted">…</span>
          ) : null}
          <PageButton page={totalPages} current={page} onChange={onChange} />
        </>
      ) : null}

      <button
        type="button"
        onClick={step(1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="flex size-11 items-center justify-center rounded-full border border-line text-forest transition-all duration-300 ease-editorial hover:border-forest hover:bg-forest hover:text-ivory disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
      </button>
    </nav>
  );
}

function PageButton({ page, current, onChange }) {
  const isCurrent = page === current;
  return (
    <button
      type="button"
      onClick={() => onChange(page)}
      aria-current={isCurrent ? "page" : undefined}
      aria-label={`Go to page ${page}`}
      className={[
        "flex size-11 items-center justify-center rounded-full text-[0.9375rem] transition-all duration-300 ease-editorial",
        isCurrent
          ? "bg-forest font-semibold text-ivory"
          : "text-muted hover:bg-ivory-soft hover:text-forest",
      ].join(" ")}
    >
      {page}
    </button>
  );
}
