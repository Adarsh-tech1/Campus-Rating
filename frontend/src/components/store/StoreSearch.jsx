import { useState } from "react";
import { MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import Input from "../common/Input.jsx";

const SORT_OPTIONS = [
  { value: "rating", label: "Top rated" },
  { value: "name", label: "Name A–Z" },
  { value: "id", label: "Newest" },
];

export default function StoreSearch({
  search,
  onSearch,
  address,
  onAddress,
  sortBy,
  onSort,
}) {
  const [filtersOpen, setFiltersOpen] = useState(Boolean(address));

  return (
    <section
      aria-label="Search and filter places"
      className="mb-12 rounded-3xl border border-line bg-cream p-6 sm:p-8"
    >
      <Input
        label="Search places"
        placeholder="Name, email, or address"
        value={search}
        onChange={(event) => onSearch(event.target.value)}
        icon={Search}
      />

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <span
          className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-forest"
          id="sort-label"
        >
          Sort by
        </span>
        <div
          role="group"
          aria-labelledby="sort-label"
          className="inline-flex flex-wrap gap-1 rounded-full border border-line bg-ivory p-1"
        >
          {SORT_OPTIONS.map((option) => {
            const selected = sortBy === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => onSort(option.value)}
                className={[
                  "rounded-full px-5 py-2.5 text-[0.875rem] font-medium transition-colors duration-300 ease-editorial",
                  selected
                    ? "bg-forest text-ivory"
                    : "text-muted hover:bg-ivory-soft hover:text-forest",
                ].join(" ")}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          aria-expanded={filtersOpen}
          aria-controls="address-filter"
          onClick={() => setFiltersOpen((open) => !open)}
          className={[
            "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[0.875rem] font-medium",
            "transition-colors duration-300 ease-editorial",
            filtersOpen
              ? "border-forest bg-gold-mist text-forest"
              : "border-line text-muted hover:border-forest hover:text-forest",
          ].join(" ")}
        >
          <SlidersHorizontal className="size-4" strokeWidth={1.75} aria-hidden="true" />
          {filtersOpen ? "Hide address" : "Filter by address"}
        </button>

        {address ? (
          <button
            type="button"
            onClick={() => onAddress("")}
            className="inline-flex items-center gap-2 rounded-full bg-gold-mist px-4 py-2.5 text-[0.875rem] font-medium text-gold-deep transition-colors duration-300 hover:bg-gold hover:text-forest"
          >
            <MapPin className="size-4" strokeWidth={1.75} aria-hidden="true" />
            {address}
            <X className="size-4" strokeWidth={2} aria-hidden="true" />
            <span className="sr-only">Clear address filter</span>
          </button>
        ) : null}
      </div>

      {filtersOpen ? (
        <div id="address-filter" className="mt-7 animate-fade">
          <Input
            label="Address"
            placeholder="Neighbourhood or address"
            value={address}
            onChange={(event) => onAddress(event.target.value)}
            icon={MapPin}
          />
        </div>
      ) : null}
    </section>
  );
}
