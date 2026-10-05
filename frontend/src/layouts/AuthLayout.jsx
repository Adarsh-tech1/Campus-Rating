import { Outlet } from "react-router-dom";

/**
 * Two-column shell for the credential pages. Each route renders its own
 * <AuthBrand /> (dark green, hidden on mobile) followed by an <AuthPanel />
 * (ivory form column), so both screens share one layout with no duplicated
 * grid markup.
 */
export default function AuthLayout() {
  return (
    <div className="grid min-h-dvh bg-ivory lg:grid-cols-[1.05fr_1fr]">
      <Outlet />
    </div>
  );
}
