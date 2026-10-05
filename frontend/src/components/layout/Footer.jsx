import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import { ROLE_HOME, ROLES } from "../../utils/constants.js";

export default function Footer() {
  const { user } = useAuth();
  const home = ROLE_HOME[user?.role] || "/login";
  const year = new Date().getFullYear();

  return (
    <footer id="about" className="grain mt-auto bg-forest-deep text-ivory">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative flex size-10 items-center justify-center rounded-full bg-ivory text-forest">
              <span className="font-display text-lg leading-none">C</span>
              <span
                className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-gold ring-2 ring-forest-deep"
                aria-hidden="true"
              />
            </span>
            <span className="display-tight text-[1.75rem] text-ivory">Campusly</span>
          </div>
          <p className="mt-5 max-w-sm text-[1.0625rem] leading-relaxed text-ivory/60">
            The campus guide for finding good places to eat, study, and settle in —
            rated by the people who actually go there.
          </p>
          <span className="mt-7 block h-px w-16 bg-gold" aria-hidden="true" />
        </div>

        <nav aria-label="Footer navigation" className="grid gap-3 self-start">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-gold">
            Explore
          </p>
          {user?.role === ROLES.USER ? (
            <>
              <FooterLink to="/user/stores">All places</FooterLink>
              <FooterLink to="/user/top-rated">Top rated</FooterLink>
              <FooterLink to="/user/ratings">My ratings</FooterLink>
            </>
          ) : null}
          {user?.role === ROLES.STORE_OWNER ? (
            <>
              <FooterLink to="/owner">Dashboard</FooterLink>
              <FooterLink to="/owner/ratings">Ratings</FooterLink>
            </>
          ) : null}
          {user?.role === ROLES.ADMIN ? (
            <>
              <FooterLink to="/admin">Dashboard</FooterLink>
              <FooterLink to="/admin/users">People</FooterLink>
              <FooterLink to="/admin/stores">Places</FooterLink>
            </>
          ) : null}
        </nav>

        <div className="grid gap-3 self-start">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-gold">
            Account
          </p>
          <FooterLink to={`${home}/change-password`}>
            Change password
          </FooterLink>
          <FooterLink to={home}>Back to dashboard</FooterLink>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 sm:px-8">
          <p className="text-[0.75rem] uppercase tracking-[0.2em] text-ivory/40">
            © {year} Campusly
          </p>
          <p className="text-[0.75rem] uppercase tracking-[0.2em] text-ivory/40">
            Rated by campus, for campus
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link
      className="link-underline w-fit text-[1rem] text-ivory/65 transition-colors duration-300 hover:text-gold"
      to={to}
    >
      {children}
    </Link>
  );
}
