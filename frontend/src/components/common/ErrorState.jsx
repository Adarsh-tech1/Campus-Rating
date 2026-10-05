import { RefreshCw, TriangleAlert } from "lucide-react";
import Button from "./Button.jsx";

export default function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  retryLabel = "Try again",
  className = "",
}) {
  return (
    <section
      role="alert"
      className={[
        "grid justify-items-center gap-5 rounded-3xl border border-danger/25",
        "bg-danger-soft px-6 py-16 text-center sm:px-12",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className="flex size-14 items-center justify-center rounded-full bg-danger/10 text-danger"
        aria-hidden="true"
      >
        <TriangleAlert className="size-6" strokeWidth={1.5} />
      </span>
      <div>
        <h3 className="display-tight text-2xl text-ink">{title}</h3>
        {description ? (
          <p className="mx-auto mt-2 max-w-md text-[0.9375rem] leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {onRetry ? (
        <Button variant="outline" icon={RefreshCw} onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </section>
  );
}