import { Link } from "react-router-dom";

/**
 * Ivory form column for Login and Register. The brand panel is hidden on small
 * screens, so this carries the logo on its own there.
 */
export default function AuthPanel({ children }) {
  return (
    <main className="flex items-center justify-center px-5 py-14 sm:px-10 sm:py-20">
      <div className="w-full max-w-md">
        <Link
          to="/login"
          className="mb-12 flex w-fit items-center gap-3 lg:hidden"
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
        {children}
      </div>
    </main>
  );
}