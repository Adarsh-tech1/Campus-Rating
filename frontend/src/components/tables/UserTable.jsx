import { Link } from "react-router-dom";
import { ArrowRight, UsersIcon } from "lucide-react";
import Avatar from "../common/Avatar.jsx";
import Badge from "../common/Badge.jsx";
import EmptyState from "../common/EmptyState.jsx";
import ErrorState from "../common/ErrorState.jsx";
import Loader from "../common/Loader.jsx";
import { formatDate } from "../../utils/helpers.js";

export default function UserTable({ users = [], loading, error }) {
  if (loading) return <Loader rows={5} label="Loading people" />;
  if (error) {
    return <ErrorState title="Couldn't load people" description={error} />;
  }
  if (!users.length) {
    return (
      <EmptyState
        icon={UsersIcon}
        eyebrow="No matches"
        title="No people match"
        description="Try another search term, or clear the role filter."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-line bg-cream">
      <table className="w-full min-w-[52rem] border-collapse text-left">
        <caption className="sr-only">
          Registered Campusly accounts, with role, address, and join date
        </caption>
        <thead>
          <tr className="border-b border-line bg-ivory-soft/50">
            {["Name", "Email", "Role", "Address", "Joined", ""].map(
              (heading, index) => (
                <th
                  key={heading || index}
                  scope="col"
                  className="px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted"
                >
                  {heading ? (
                    <span className={index === 5 ? "sr-only" : undefined}>
                      {heading}
                    </span>
                  ) : (
                    <span className="sr-only">View details</span>
                  )}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-line/70 transition-colors duration-300 last:border-0 hover:bg-ivory-soft/40"
            >
              <th scope="row" className="px-6 py-4 font-normal">
                <span className="flex items-center gap-3">
                  <Avatar name={user.name} size="sm" />
                  <span className="font-semibold text-forest">{user.name}</span>
                </span>
              </th>
              <td className="px-6 py-4 text-[0.9375rem] text-muted">
                <a href={`mailto:${user.email}`} className="link-underline">
                  {user.email}
                </a>
              </td>
              <td className="px-6 py-4">
                <Badge role={user.role} />
              </td>
              <td className="max-w-[16rem] truncate px-6 py-4 text-[0.9375rem] text-muted">
                {user.address || "—"}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-[0.9375rem] text-muted">
                {formatDate(user.created_at)}
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  to={`/admin/users/${user.id}`}
                  aria-label={`View details for ${user.name}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[0.875rem] font-semibold text-forest transition-colors duration-300 hover:border-forest hover:bg-forest hover:text-gold"
                >
                  Open
                  <ArrowRight className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
