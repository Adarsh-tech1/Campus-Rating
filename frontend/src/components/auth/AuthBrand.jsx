import { Link } from "react-router-dom";

const DEFAULT_PROMISES = [
  {
    title: "Honest ratings",
    body: "Every score comes from a signed-in campus member, with no paid placement.",
  },
  {
    title: "Built for campus",
    body: "Search by name, email, or neighbourhood to find what is close by.",
  },
  {
    title: "Owners welcome",
    body: "Store owners can add their place and follow what students say about it.",
  },
];

/**
 * Immersive dark-green panel shared by Login and Register so the two pages
 * read as one product. Hidden below `lg` so the form keeps the full width on
 * small screens.
 */
export default function AuthBrand({
  image,
  eyebrow,
  heading,
  body,
  promises = DEFAULT_PROMISES,
}) {
  return (
    <aside className="grain relative isolate hidden overflow-hidden bg-forest lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="drift absolute inset-0 -z-20 size-full object-cover opacity-35"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-forest-deep via-forest/92 to-forest/70"
        aria-hidden="true"
      />

      <Link to="/login" className="flex w-fit items-center gap-3">
        <span className="relative flex size-10 items-center justify-center rounded-full bg-ivory text-forest">
          <span className="font-display text-lg leading-none">C</span>
          <span
            className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-gold ring-2 ring-forest"
            aria-hidden="true"
          />
        </span>
        <span className="display-tight text-[1.75rem] text-ivory">Campusly</span>
      </Link>

      <div className="max-w-lg">
        <p className="mb-5 text-[0.6875rem] font-semibold uppercase tracking-[0.28em] text-gold">
          {eyebrow}
        </p>
        <h1 className="display-tight text-[3.25rem] leading-[1.02] text-ivory xl:text-[3.75rem]">
          {heading}
        </h1>
        <p className="mt-7 text-[1.125rem] leading-relaxed text-ivory/65">
          {body}
        </p>
      </div>

      <ul className="grid gap-6">
        {promises.map((item) => (
          <li
            key={item.title}
            className="flex gap-4 border-t border-ivory/15 pt-6"
          >
            <span
              className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold"
              aria-hidden="true"
            />
            <div>
              <p className="font-display text-[1.25rem] text-ivory">{item.title}</p>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ivory/50">
                {item.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}