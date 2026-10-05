import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StarOff, ArrowRight } from "lucide-react";
import { getStores } from "../../api/storeApi.js";
import Button from "../../components/common/Button.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import Loader from "../../components/common/Loader.jsx";
import PageContainer from "../../components/layout/PageContainer.jsx";
import RatingStars from "../../components/store/RatingStars.jsx";
import { formatRating, getErrorMessage } from "../../utils/helpers.js";

export default function MyRatings() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadRatings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const firstResponse = await getStores({
        page: 1,
        limit: 100,
        sortBy: "id",
        sortOrder: "desc",
      });
      const firstPage = firstResponse.data.data;
      const remainingPages = Array.from(
        { length: Math.max(0, firstPage.pagination.totalPages - 1) },
        (_, index) => index + 2,
      );
      const remainingResponses = await Promise.all(
        remainingPages.map((page) =>
          getStores({
            page,
            limit: 100,
            sortBy: "id",
            sortOrder: "desc",
          }),
        ),
      );
      const pages = [firstPage, ...remainingResponses.map(({ data }) => data.data)];
      const ratedStores = pages
        .flatMap((page) => page.stores)
        .filter((store) => store.user_rating != null);

      setStores(ratedStores);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    loadRatings();
  }, [loadRatings]);

  return (
    <PageContainer
      eyebrow="Your activity"
      title="My ratings"
      description="Every place you have rated, and how it scored."
    >
      {loading ? (
        <Loader rows={4} label="Loading your ratings" />
      ) : error ? (
        <ErrorState
          title="Your ratings are unavailable"
          description={error}
          onRetry={loadRatings}
        />
      ) : stores.length ? (
        <ul className="grid gap-5">
          {stores.map((store, index) => (
            <li
              key={store.id}
              className="animate-rise"
              style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
            >
              <Link
                to={`/user/stores/${store.id}`}
                className="group flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-line bg-cream p-6 transition-all duration-500 ease-editorial hover:-translate-y-1 hover:border-forest/35 sm:p-7"
              >
                <div className="min-w-0 flex-1">
                  <h2 className="display-tight text-[1.5rem] leading-snug text-forest">
                    {store.name}
                  </h2>
                  <p className="mt-2 text-[0.9375rem] text-muted">
                    {store.address || "Address not listed"}
                  </p>
                  <p className="mt-1 text-[0.875rem] text-muted">
                    Community rating: {formatRating(store.average_rating)} / 5
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-5 rounded-2xl border border-line bg-ivory px-6 py-4">
                  <div className="text-right">
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted">
                      Your rating
                    </p>
                    <p className="display-tight mt-1 text-4xl text-forest">
                      {Number(store.user_rating)}
                      <span className="text-lg text-muted">/5</span>
                    </p>
                  </div>
                  <RatingStars value={store.user_rating} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={StarOff}
          eyebrow="Nothing yet"
          title="No ratings yet"
          description="Rate a place and it will show up here so you can track your taste over time."
          action={
            <Button as={Link} to="/user/stores" size="lg" iconRight={ArrowRight}>
              Explore places
            </Button>
          }
        />
      )}
    </PageContainer>
  );
}
