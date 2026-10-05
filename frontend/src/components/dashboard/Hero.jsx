import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search, ShieldCheck, Sparkles, Star } from "lucide-react";

const TRUST = [
  { icon: Star, label: "Community rated" },
  { icon: Sparkles, label: "Top places" },
  { icon: ShieldCheck, label: "Honest reviews" },
];

export default function Hero({ storeCount = 0 }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const submitSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    navigate(`/user/stores${params.size ? `?${params}` : ""}`);
  };

  return (
    <section className="grain relative isolate mb-20 overflow-hidden rounded-[2rem] bg-forest sm:mb-28">
      <img
        src="/images/hero/cafeteria-table.jpg"
        alt=""
        aria-hidden="true"
        className="drift absolute inset-0 -z-20 size-full object-cover opacity-45"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-forest-deep via-forest/90 to-forest/55"
        aria-hidden="true"
      />

      <div className="px-6 py-16 sm:px-12 sm:py-24 lg:px-16 lg:py-28">
        <p className="mb-6 text-[0.6875rem] font-semibold uppercase tracking-[0.28em] text-gold">
          Your campus, well found
        </p>

        <h2 className="display-tight max-w-4xl text-hero text-ivory">
          Discover.
          <br />
          Rate.
          <br />
          <span className="text-gold-bright">Recommend.</span>
        </h2>

        <p className="mt-8 max-w-xl text-[1.125rem] leading-relaxed text-ivory/65">
          Find trusted campus cafés, food spots, bookstores and local favorites —
          rated by the people who know them best.
        </p>

        <form
          className="mt-11 flex max-w-2xl flex-col gap-3 sm:flex-row"
          onSubmit={submitSearch}
        >
          <label className="relative flex-1">
            <span className="sr-only">Search campus places</span>
            <Search
              className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-forest/45"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <input
              type="search"
              className="h-16 w-full rounded-full border border-transparent bg-ivory pl-14 pr-6 text-[1rem] text-forest placeholder:text-muted transition-[border-color,box-shadow] duration-300 focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/30"
              placeholder="Search names, addresses, or email"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <button
            type="submit"
            className="group inline-flex h-16 shrink-0 items-center justify-center gap-2 rounded-full bg-gold px-8 text-[1rem] font-semibold text-forest transition-colors duration-300 ease-editorial hover:bg-gold-bright"
          >
            Search
            <ArrowRight
              className="size-5 transition-transform duration-300 ease-editorial group-hover:translate-x-1"
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
        </form>

        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-ivory/15 pt-8">
          {TRUST.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-2.5 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-ivory/55"
            >
              <Icon className="size-4 text-gold" strokeWidth={1.5} aria-hidden="true" />
              {label}
            </span>
          ))}
          <span className="text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-gold">
            {storeCount} {storeCount === 1 ? "place" : "places"} listed
          </span>
        </div>
      </div>
    </section>
  );
}
