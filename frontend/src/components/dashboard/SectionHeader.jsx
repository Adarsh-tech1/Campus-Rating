import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function SectionHeader({ eyebrow, title, description, to, linkLabel }) {
  return (
    <header className="mb-9 flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-gold-deep">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="display-tight text-section text-forest">{title}</h2>
        {description ? (
          <p className="mt-3 text-[1.0625rem] leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {to && linkLabel ? (
        <Link
          className="link-underline inline-flex shrink-0 items-center gap-2 pb-1 text-[0.9375rem] font-semibold text-forest"
          to={to}
        >
          {linkLabel}
          <ArrowRight className="size-4" strokeWidth={2} aria-hidden="true" />
        </Link>
      ) : null}
    </header>
  );
}
