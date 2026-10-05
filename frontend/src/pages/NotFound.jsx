import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";
import useAuth from "../hooks/useAuth.js";
import { ROLE_HOME, ROLES } from "../utils/constants.js";

export default function NotFound() {
  const { user } = useAuth();
  const home = ROLE_HOME[user?.role] || "/login";

  return (
    <main className="relative isolate flex min-h-[75vh] items-center justify-center overflow-hidden px-5 py-24">
      <div
        className="pointer-events-none absolute -left-32 top-1/4 size-[28rem] rounded-full bg-gold-mist/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-1/4 size-[22rem] rounded-full bg-forest-mid/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl text-center">
        <span
          className="mx-auto mb-8 flex size-16 items-center justify-center rounded-full bg-forest text-gold"
          aria-hidden="true"
        >
          <Compass className="size-7" strokeWidth={1.25} />
        </span>

        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.28em] text-gold-deep">
          Error 404
        </p>
        <h1 className="display-tight mt-4 text-page text-forest">
          This page is off the map
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-[1.125rem] leading-relaxed text-muted">
          The address you followed doesn’t match anything in the Campusly guide. It
          may have moved, or the link may be out of date.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to={home}
            className="inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 text-[0.9375rem] font-semibold text-ivory transition-colors duration-300 hover:bg-forest-deep"
          >
            <ArrowLeft className="size-4" strokeWidth={2} aria-hidden="true" />
            Return to Campusly
          </Link>
          {/* Browsing places is a member-only area, so this is hidden for
              owners and admins, who the role guard would redirect anyway. */}
          {user?.role === ROLES.USER ? (
            <Link
              to="/user/stores"
              className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-[0.9375rem] font-semibold text-forest transition-colors duration-300 hover:border-forest hover:bg-ivory-soft"
            >
              Browse places
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}
