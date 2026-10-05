import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

export default function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  size = "md",
}) {
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocused.current = document.activeElement;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose?.();
      }
      if (event.key !== "Tab") return;

      // Keep focus inside the dialog while it is open.
      const focusable = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      panelRef.current?.querySelector("[data-autofocus]")?.focus?.();
    }, 60);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  const widths = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
  };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6">
          <motion.div
            className="fixed inset-0 bg-forest-deep/70 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.34, ease: EASE }}
            className={[
              "relative my-auto w-full overflow-hidden rounded-3xl border border-forest/20",
              "bg-ivory shadow-[0_40px_90px_-30px_rgba(10,23,18,0.6)]",
              widths[size] ?? widths.md,
            ].join(" ")}
          >
            <header className="grain flex items-start justify-between gap-6 bg-forest px-6 py-6 sm:px-8">
              <div className="min-w-0">
                {eyebrow ? (
                  <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-gold">
                    {eyebrow}
                  </p>
                ) : null}
                <h2
                  id="modal-title"
                  className="display-tight text-2xl text-ivory sm:text-[1.75rem]"
                >
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="-mr-1 -mt-1 flex size-9 shrink-0 items-center justify-center rounded-full text-ivory/60 transition-colors duration-300 hover:bg-ivory/10 hover:text-ivory"
              >
                <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </button>
            </header>

            <div className="max-h-[65vh] overflow-y-auto px-6 py-7 sm:px-8">
              {children}
            </div>

            {footer ? (
              <footer className="border-t border-line bg-ivory-soft/60 px-6 py-5 sm:px-8">
                {footer}
              </footer>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
