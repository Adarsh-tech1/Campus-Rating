// Role pill used next to a person's name in the admin people table and the
// admin user record, so the three roles always look the same.
const ROLE_STYLES = {
  ADMIN: "bg-forest text-ivory",
  STORE_OWNER: "bg-gold-mist text-gold-deep",
  USER: "bg-ivory-soft text-muted",
};

export default function Badge({ role, children }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] ${
        ROLE_STYLES[role] ?? ROLE_STYLES.USER
      }`}
    >
      {children ?? role?.replace("_", " ")}
    </span>
  );
}