import { initials } from "../../utils/helpers.js";

const SIZES = {
  xs: "size-7 text-[0.625rem]",
  sm: "size-9 text-[0.6875rem]",
  md: "size-11 text-xs",
  lg: "size-16 text-sm",
  xl: "size-24 text-xl",
};

// Deterministic tone so a given name always renders the same colour.
const TONES = [
  "bg-gold-mist text-gold-deep",
  "bg-forest-mid text-ivory",
  "bg-success-soft text-success",
  "bg-ivory-soft text-ink",
  "bg-line/50 text-forest",
];

function toneFor(name = "") {
  const total = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return TONES[total % TONES.length];
}

export default function Avatar({ name = "", size = "md", className = "", ...props }) {
  const dimension = SIZES[size] ?? SIZES.md;

  return (
    <span
      aria-hidden="true"
      className={[
        dimension,
        "inline-flex shrink-0 select-none items-center justify-center rounded-full",
        "border border-forest/10 font-semibold uppercase tracking-[0.06em]",
        toneFor(name),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {initials(name)}
    </span>
  );
}