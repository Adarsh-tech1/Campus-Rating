import { useState } from "react";
import { Star } from "lucide-react";

/** Read-only star row. */
function StaticStars({ value, size = "md" }) {
  const active = Number(value) || 0;
  const sizes = { sm: "size-3.5", md: "size-4", lg: "size-6" };
  return (
    <span
      className="inline-flex items-center gap-0.5"
      role="img"
      aria-label={`Rated ${active.toFixed(1)} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((step) => (
        <Star
          key={step}
          className={`${sizes[size]} ${
            step <= Math.round(active) ? "fill-gold text-gold" : "text-line"
          }`}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

/** Interactive radio group styled as stars, with hover preview and a keyboard hint. */
function InteractiveStars({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const active = Number(value) || 0;
  const shown = hovered || active;

  return (
    <div
      role="radiogroup"
      aria-label="Choose a rating from 1 to 5"
      className="flex items-center gap-2"
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((step) => {
        const isActive = step <= shown;
        return (
          <button
            key={step}
            type="button"
            role="radio"
            aria-checked={active === step}
            aria-label={`${step} out of 5`}
            onClick={() => onChange?.(step)}
            onMouseEnter={() => setHovered(step)}
            onFocus={() => setHovered(step)}
            onBlur={() => setHovered(0)}
            className="rounded-full p-1.5 transition-transform duration-200 ease-editorial hover:scale-110 active:scale-95"
          >
            <Star
              className={`size-9 transition-colors duration-200 ${
                isActive ? "fill-gold text-gold" : "text-line"
              }`}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}

export default function RatingStars({
  value = 0,
  interactive = false,
  onChange,
  size = "md",
}) {
  if (!interactive) return <StaticStars value={value} size={size} />;
  return <InteractiveStars value={value} onChange={onChange} />;
}
