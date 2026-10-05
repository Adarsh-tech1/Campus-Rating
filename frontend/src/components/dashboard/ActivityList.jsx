import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatDate } from "../../utils/helpers.js";
import Avatar from "../common/Avatar.jsx";
import RatingStars from "../store/RatingStars.jsx";

/**
 * Renders a list of rating rows as small guestbook entries.
 *
 * The optional store link points at /user/stores/:id, which is only reachable
 * by a USER. Owners and admins must therefore render it without `linkToStore`,
 * otherwise clicking it bounces off the role guard.
 */
export default function ActivityList({
  items = [],
  title = "Recent ratings",
  linkToStore = true,
}) {
  if (!items.length) return null;

  return (
    <section aria-label={title}>
      <ol className="grid">
        {items.map((item) => (
          <li
            key={item.id}
            className="group flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-line py-6 transition-colors duration-300 last:border-0 hover:bg-ivory-soft/50 sm:flex-nowrap sm:px-4"
          >
            <Avatar name={item.user_name || item.user_email} size="md" />

            <div className="min-w-0 flex-1">
              <p className="text-[1rem] text-forest">
                <span className="font-semibold">
                  {item.user_name || "A student"}
                </span>{" "}
                <span className="text-muted">rated</span>{" "}
                <span className="font-semibold">{item.store_name}</span>
              </p>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-muted">
                <RatingStars value={item.rating} size="sm" />
                <span className="tabular-nums">
                  {item.rating} / 5
                </span>
                <span aria-hidden="true">·</span>
                <time dateTime={item.created_at}>{formatDate(item.created_at)}</time>
                {item.user_email ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{item.user_email}</span>
                  </>
                ) : null}
              </p>
            </div>

            {linkToStore && item.store_id ? (
              <Link
                to={`/user/stores/${item.store_id}`}
                aria-label={`Open ${item.store_name}`}
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-forest transition-colors duration-300 group-hover:border-forest group-hover:bg-forest group-hover:text-gold"
              >
                <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
