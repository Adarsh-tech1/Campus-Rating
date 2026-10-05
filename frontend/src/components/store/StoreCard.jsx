import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin, Star } from "lucide-react";
import { formatRating } from "../../utils/helpers.js";
import { storeCategory, storeImage } from "../../utils/storeImages.js";

export default function StoreCard({ store, rank }) {
  const score = Number(store.average_rating) || 0;
  const count = Number(store.rating_count) || 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-cream transition-all duration-500 ease-editorial hover:-translate-y-1 hover:border-forest/35">
      <div className="relative aspect-4/3 overflow-hidden bg-ivory-soft">
        <img
          src={storeImage(store)}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.04]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-forest-deep/45 via-transparent to-transparent"
          aria-hidden="true"
        />

        <span className="absolute left-5 top-5 rounded-full bg-forest px-4 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ivory">
          {storeCategory(store)}
        </span>

        {rank ? (
          <span className="absolute right-5 top-5 flex size-12 items-center justify-center rounded-full bg-gold font-display text-xl text-forest">
            {rank}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="display-tight text-[1.625rem] leading-tight text-forest">
          {store.name}
        </h3>

        <p className="mt-3 flex items-start gap-2 text-[0.9375rem] leading-relaxed text-muted">
          <MapPin
            className="mt-1 size-4 shrink-0 text-muted/70"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <span>{store.address || "Address not listed"}</span>
        </p>

        {store.email ? (
          <p className="mt-2 flex items-center gap-2 truncate text-[0.875rem] text-muted">
            <Mail className="size-3.5 shrink-0 text-muted/70" strokeWidth={1.75} aria-hidden="true" />
            <span className="truncate">{store.email}</span>
          </p>
        ) : null}

        <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
          {count > 0 ? (
            <>
              <span className="flex items-center gap-0.5" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((step) => (
                  <Star
                    key={step}
                    className={`size-4 ${
                      step <= Math.round(score)
                        ? "fill-gold text-gold"
                        : "text-line"
                    }`}
                    strokeWidth={1.5}
                  />
                ))}
              </span>
              <span className="text-[1rem] font-semibold text-forest">
                {formatRating(score)}
              </span>
              <span className="text-[0.8125rem] text-muted">
                ({count} {count === 1 ? "rating" : "ratings"})
              </span>
            </>
          ) : (
            <span className="text-[0.875rem] text-muted">Not yet rated</span>
          )}
        </div>

        {store.user_rating != null ? (
          <p className="mt-3 flex items-center gap-2 text-[0.8125rem] font-medium text-gold-deep">
            <Star className="size-3.5 fill-gold" strokeWidth={1.5} aria-hidden="true" />
            Your rating: {store.user_rating} / 5
          </p>
        ) : null}

        <Link
          to={`/user/stores/${store.id}`}
          className="link-underline mt-auto inline-flex w-fit items-center gap-2 pt-6 text-[0.9375rem] font-semibold text-forest"
        >
          Explore
          <ArrowRight
            className="size-4 transition-transform duration-300 ease-editorial group-hover:translate-x-1"
            strokeWidth={2}
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
