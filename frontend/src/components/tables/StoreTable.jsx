import { Store } from "lucide-react";
import EmptyState from "../common/EmptyState.jsx";
import ErrorState from "../common/ErrorState.jsx";
import Loader from "../common/Loader.jsx";
import RatingStars from "../store/RatingStars.jsx";
import { formatRating } from "../../utils/helpers.js";
import { storeImage } from "../../utils/storeImages.js";

export default function StoreTable({ stores = [], loading, error }) {
  if (loading) return <Loader rows={5} label="Loading places" />;
  if (error) {
    return <ErrorState title="Couldn't load places" description={error} />;
  }
  if (!stores.length) {
    return (
      <EmptyState
        icon={Store}
        eyebrow="No matches"
        title="No places found"
        description="Try changing your search, or add a new store."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-line bg-cream">
      <table className="w-full min-w-[46rem] border-collapse text-left">
        <caption className="sr-only">
          Listed stores, with contact email, owner, address, and rating
        </caption>
        <thead>
          <tr className="border-b border-line bg-ivory-soft/50">
            {["Place", "Contact", "Owner ID", "Address", "Rating"].map((heading) => (
              <th
                key={heading}
                scope="col"
                className="px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => {
            const count = Number(store.rating_count) || 0;
            return (
              <tr
                key={store.id}
                className="border-b border-line/70 transition-colors duration-300 last:border-0 hover:bg-ivory-soft/40"
              >
                <th scope="row" className="px-6 py-4 font-normal">
                  <span className="flex items-center gap-4">
                    <img
                      src={storeImage(store)}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="size-12 shrink-0 rounded-xl object-cover"
                    />
                    <span className="font-semibold text-forest">{store.name}</span>
                  </span>
                </th>
                <td className="px-6 py-4 text-[0.9375rem] text-muted">
                  {store.email ? (
                    <a href={`mailto:${store.email}`} className="link-underline">
                      {store.email}
                    </a>
                  ) : (
                    "No email listed"
                  )}
                </td>
                <td className="px-6 py-4 text-[0.9375rem] text-muted tabular-nums">
                  {store.owner_id ?? (
                    <span className="rounded-full bg-gold-mist px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-gold-deep">
                      Unassigned
                    </span>
                  )}
                </td>
                <td className="max-w-[16rem] truncate px-6 py-4 text-[0.9375rem] text-muted">
                  {store.address || "—"}
                </td>
                <td className="px-6 py-4">
                  {count > 0 ? (
                    <span className="flex items-center gap-2.5">
                      <RatingStars value={store.average_rating} size="sm" />
                      <span className="whitespace-nowrap text-[0.9375rem] font-medium text-forest tabular-nums">
                        {formatRating(store.average_rating)} ({count})
                      </span>
                    </span>
                  ) : (
                    <span className="text-[0.9375rem] text-muted">Not yet rated</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
