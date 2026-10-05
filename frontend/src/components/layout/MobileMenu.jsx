import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, KeyRound, LogOut } from "lucide-react";
import Avatar from "../common/Avatar.jsx";
import Badge from "../common/Badge.jsx";
import { ROLE_LABELS } from "../../utils/constants.js";

/**
 * Full-screen mobile navigation. Mirrors the desktop navbar, including the
 * exact path + hash match so a hash item never lights up alongside another.
 */
export default function MobileMenu({
  open,
  items = [],
  user,
  home,
  onNavigate,
  onSignOut,
}) {
  const location = useLocation();
  const isHashItemActive = (item) =>
    location.pathname === item.to.split("#")[0] && location.hash === item.hash;

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grain border-t border-line bg-forest-deep md:hidden"
        >
          <nav
            className="mx-auto flex min-h-[calc(100dvh-4.5rem)] max-w-7xl flex-col px-5 py-8 sm:px-8"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center gap-4 border-b border-ivory/10 pb-6">
              <Avatar name={user?.name || user?.email} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.9375rem] font-semibold text-ivory">
                  {user?.name || user?.email}
                </p>
                <div className="mt-1.5">
                  <Badge role={user?.role}>
                    {ROLE_LABELS[user?.role] || "Campus member"}
                  </Badge>
                </div>
              </div>
            </div>

            <ul className="mt-4 flex-1">
              {items.map((item, index) => {
                const base =
                  "flex items-center justify-between py-5 text-[1.75rem] transition-colors duration-300";
                const className = ({ isActive }) =>
                  `${base} ${
                    isActive ? "text-gold" : "text-ivory/75 hover:text-ivory"
                  }`;

                return (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.32,
                      delay: 0.05 * index,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="border-b border-ivory/10 last:border-0"
                  >
                    {item.hash ? (
                      <Link
                        to={item.to}
                        onClick={onNavigate}
                        className={className({
                          isActive: isHashItemActive(item),
                        })}
                      >
                        {item.label}
                        <ArrowUpRight
                          className="size-5"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </Link>
                    ) : (
                      <NavLink
                        to={item.to}
                        end={item.end}
                        onClick={onNavigate}
                        className={className}
                      >
                        {item.label}
                        <ArrowUpRight
                          className="size-5"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </NavLink>
                    )}
                  </motion.li>
                );
              })}
            </ul>

            <div className="mt-8 grid gap-2 border-t border-ivory/10 pt-6">
              <Link
                to={`${home}/change-password`}
                onClick={onNavigate}
                className="flex items-center gap-3 py-3 text-[1.0625rem] text-ivory/70 transition-colors duration-300 hover:text-gold"
              >
                <KeyRound className="size-4" strokeWidth={1.75} aria-hidden="true" />
                Change password
              </Link>
              <button
                type="button"
                onClick={onSignOut}
                className="flex items-center gap-3 py-3 text-left text-[1.0625rem] text-danger-soft/80 transition-colors duration-300 hover:text-danger-soft"
              >
                <LogOut className="size-4" strokeWidth={1.75} aria-hidden="true" />
                Sign out
              </button>
            </div>
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
