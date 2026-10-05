const VARIANTS = {
  primary: "bg-forest text-ivory hover:bg-forest-deep active:bg-forest-deep",
  gold: "bg-gold text-forest hover:bg-gold-bright active:bg-gold-bright",
  outline:
    "border border-line bg-transparent text-ink hover:border-forest hover:bg-ivory-soft active:bg-ivory-soft",
  soft: "bg-ivory-soft text-ink hover:bg-line/60 active:bg-line/70",
  ghost: "bg-transparent text-muted hover:bg-ivory-soft hover:text-ink",
};

const SIZES = {
  sm: "h-10 gap-1.5 px-4 text-[0.8125rem]",
  md: "h-12 gap-2 px-6 text-[0.9375rem]",
  lg: "h-14 gap-2.5 px-8 text-base",
};

export default function Button({
  children,
  as: Component = "button",
  type = "button",
  loading = false,
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
  icon: Icon,
  iconRight: IconRight,
  ...props
}) {
  const isButton = Component === "button";
  return (
    <Component
      {...(isButton ? { type, disabled: disabled || loading } : {})}
      className={[
        "group/btn relative inline-flex select-none items-center justify-center overflow-hidden",
        "font-semibold tracking-[-0.01em] whitespace-nowrap",
        "transition-[background-color,border-color,color,transform] duration-300 ease-editorial",
        "active:scale-[0.985] disabled:pointer-events-none disabled:opacity-45",
        VARIANTS[variant] ?? VARIANTS.primary,
        SIZES[size] ?? SIZES.md,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-busy={loading || undefined}
      aria-disabled={disabled || loading || undefined}
      {...props}
    >
      {loading ? (
        <span
          className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : Icon ? (
        <Icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
      ) : null}
      <span className={loading ? "opacity-70" : undefined}>{children}</span>
      {IconRight ? (
        <IconRight
          className="size-4 shrink-0 transition-transform duration-300 ease-editorial group-hover/btn:translate-x-1"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      ) : null}
    </Component>
  );
}
