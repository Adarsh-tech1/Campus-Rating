import { GraduationCap, ShieldCheck, Store } from "lucide-react";
import { ROLE_LABELS, ROLES } from "../../utils/constants.js";

/**
 * Mirrors REGISTER_ROLES in backend/src/validators/authValidator.js — the API
 * rejects anything outside this list, so it must never be offered here.
 */
export const ROLE_OPTIONS = [
  {
    value: ROLES.USER,
    label: ROLE_LABELS.USER,
    headline: "User",
    description: "Discover places and rate your favorites.",
    icon: GraduationCap,
  },
  {
    value: ROLES.STORE_OWNER,
    label: ROLE_LABELS.STORE_OWNER,
    headline: "Store Owner",
    description: "Add your store and see customer ratings.",
    icon: Store,
  },
  {
    value: ROLES.ADMIN,
    label: ROLE_LABELS.ADMIN,
    headline: "Admin",
    description: "Manage the Campusly platform.",
    icon: ShieldCheck,
  },
];

export default function RolePicker({ value, onChange }) {
  return (
    <fieldset className="grid gap-3">
      <legend className="mb-1 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-forest">
        Account type
      </legend>
      <div className="grid gap-3">
        {ROLE_OPTIONS.map(({ value: optionValue, headline, description, icon: Icon }) => {
          const selected = value === optionValue;
          return (
            <label
              key={optionValue}
              className={[
                "group flex cursor-pointer items-start gap-4 rounded-2xl border p-4",
                "transition-all duration-300 ease-editorial",
                selected
                  ? "border-forest bg-cream shadow-[inset_0_0_0_1px_var(--color-forest)]"
                  : "border-line bg-ivory/40 hover:border-muted hover:bg-cream",
              ].join(" ")}
            >
              <input
                type="radio"
                name="role"
                value={optionValue}
                checked={selected}
                onChange={() => onChange(optionValue)}
                className="sr-only"
              />
              <span
                className={[
                  "flex size-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                  selected
                    ? "bg-forest text-gold"
                    : "bg-ivory-soft text-muted group-hover:text-forest",
                ].join(" ")}
                aria-hidden="true"
              >
                <Icon className="size-5" strokeWidth={1.5} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="text-[1rem] font-semibold text-forest">
                    {headline}
                  </span>
                  <span
                    className={[
                      "ml-auto flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                      selected ? "border-forest bg-forest" : "border-line",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    {selected ? (
                      <span className="size-1.5 rounded-full bg-gold" />
                    ) : null}
                  </span>
                </span>
                <span className="mt-1 block text-[0.875rem] leading-relaxed text-muted">
                  {description}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}