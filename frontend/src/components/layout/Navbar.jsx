import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, KeyRound, LogOut, Menu, X } from "lucide-react";
import useAuth from "../../hooks/useAuth.js";
import { ROLE_HOME, ROLE_LABELS, ROLES } from "../../utils/constants.js";
import Avatar from "../common/Avatar.jsx";
import Badge from "../common/Badge.jsx";
import MobileMenu from "./MobileMenu.jsx";

/**
 * Navigation is role-aware. The logo always returns the user to their own
 * dashboard, so that landing page never needs its own nav entry.
 */
const navByRole = {
  [ROLES.USER]: [
    { to: "/user/stores", label: "Explore" },
    { to: "/user/top-rated", label: "Top Rated" },
    { to: "/user/ratings", label: "My Ratings" },
  ],
  [ROLES.STORE_OWNER]: [
    { to: "/owner", label: "Dashboard", end: true },
    { to: "/owner#my-place", label: "My Store", hash: "#my-place" },
    { to: "/owner/ratings", label: "Ratings" },
  ],
  [ROLES.ADMIN]: [
    { to: "/admin", label: "Dashboard", end: true },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/stores", label: "Stores" },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef(null);
  const items = navByRole[user?.role] || navByRole[ROLES.USER];
  const home = ROLE_HOME[user?.role] || "/";

  useEffect(() => {
    setProfileOpen(false);
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setMobileOpen(false);
      }
      if (
        event.type === "pointerdown" &&
        !profileRef.current?.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", close);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", close);
    };
  }, []);

  const signOut = () => {
    setProfileOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  const navClass = (isActive) =>
    [
      "link-underline py-1.5 text-[0.9375rem] font-medium transition-colors duration-300",
      isActive ? "text-forest" : "text-muted hover:text-forest",
    ].join(" ");

  // A hash link ("/owner#my-place") points at a section of another nav item's
  // page, so NavLink alone would light up both. Hash items therefore use an
  // exact path + hash match instead.
  const isHashItemActive = (item) =>
    location.pathname === item.to.split("#")[0] && location.hash === item.hash;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link
          to={home}
          className="flex shrink-0 items-center gap-3"
          aria-label="Campusly home"
        >
          <span className="relative flex size-10 items-center justify-center rounded-full bg-forest text-ivory">
            <span className="font-display text-lg leading-none">C</span>
            <span
              className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-gold ring-2 ring-ivory"
              aria-hidden="true"
            />
          </span>
          <span className="display-tight text-[1.625rem] text-forest">Campusly</span>
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex"
          aria-label="Main navigation"
        >
          {items.map((item) =>
            item.hash ? (
              <NavLink
                key={item.label}
                to={item.to}
                className={navClass(isHashItemActive(item))}
              >
                {item.label}
              </NavLink>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) => navClass(isActive)}
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <div ref={profileRef} className="relative hidden md:block">
            <button
              type="button"
              className="flex items-center gap-3 rounded-full border border-line bg-cream py-1.5 pl-1.5 pr-3.5 transition-colors duration-300 hover:border-forest/40 hover:bg-white"
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              onClick={() => setProfileOpen((open) => !open)}
            >
              <Avatar name={user?.name || user?.email} size="sm" />
              <span className="flex flex-col items-start leading-tight">
                <span className="max-w-36 truncate text-[0.8125rem] font-semibold text-forest">
                  {user?.name || user?.email || "Account"}
                </span>
                <Badge role={user?.role} />
              </span>
              <ChevronDown
                className={`size-3.5 text-muted transition-transform duration-300 ${
                  profileOpen ? "rotate-180" : ""
                }`}
                strokeWidth={2}
                aria-hidden="true"
              />
            </button>

            {profileOpen ? (
              <div
                role="menu"
                className="absolute right-0 top-[calc(100%+0.75rem)] w-64 overflow-hidden rounded-2xl border border-line bg-cream shadow-[0_28px_60px_-28px_rgba(10,23,18,0.45)]"
              >
                <div className="border-b border-line px-5 py-4">
                  <p className="truncate text-[0.9375rem] font-semibold text-forest">
                    {user?.name || user?.email}
                  </p>
                  <p className="mt-0.5 truncate text-[0.75rem] text-muted">
                    {user?.email}
                  </p>
                  <div className="mt-2.5">
                    <Badge role={user?.role}>
                      {ROLE_LABELS[user?.role] || "Campus member"}
                    </Badge>
                  </div>
                </div>
                <Link
                  role="menuitem"
                  to={`${home}/change-password`}
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-5 py-3.5 text-[0.9375rem] text-forest transition-colors duration-200 hover:bg-ivory-soft"
                >
                  <KeyRound className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  Change password
                </Link>
                <button
                  role="menuitem"
                  type="button"
                  onClick={signOut}
                  className="flex w-full items-center gap-3 border-t border-line px-5 py-3.5 text-left text-[0.9375rem] text-danger transition-colors duration-200 hover:bg-danger-soft"
                >
                  <LogOut className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  Sign out
                </button>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-full border border-line text-forest transition-colors duration-300 hover:border-forest hover:bg-forest hover:text-ivory md:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Menu className="size-5" strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <MobileMenu
        open={mobileOpen}
        items={items}
        user={user}
        home={home}
        onNavigate={() => setMobileOpen(false)}
        onSignOut={signOut}
      />
    </header>
  );
}
