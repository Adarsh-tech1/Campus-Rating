import { CircleCheck, TriangleAlert } from "lucide-react";

/**
 * Inline status message used by the auth forms, the admin create-user dialog
 * and the store form, so success and error styling stay identical everywhere.
 */
export default function FormAlert({ tone = "error", children, className = "" }) {
  const isError = tone === "error";
  const Icon = isError ? TriangleAlert : CircleCheck;

  return (
    <p
      role={isError ? "alert" : "status"}
      className={[
        "flex items-start gap-3 rounded-2xl border px-5 py-4 text-[0.9375rem] leading-relaxed",
        isError
          ? "border-danger/25 bg-danger-soft text-danger"
          : "border-success/25 bg-success-soft text-success",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Icon
        className="mt-0.5 size-4 shrink-0"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      {children}
    </p>
  );
}