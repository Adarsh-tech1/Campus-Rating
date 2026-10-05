import { useCallback, useEffect, useState } from "react";
import { StarOff } from "lucide-react";
import { getOwnerRatings } from "../../api/ownerApi.js";
import EmptyState from "../../components/common/EmptyState.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import Loader from "../../components/common/Loader.jsx";
import PageContainer from "../../components/layout/PageContainer.jsx";
import RatingStars from "../../components/store/RatingStars.jsx";
import { formatDate, getErrorMessage } from "../../utils/helpers.js";

export default function OwnerRatings() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadRatings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getOwnerRatings();
      setRatings(data.data.ratings);
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
      eyebrow="Owner dashboard"
      title="All ratings"
      description="Every rating the campus has left on your place, newest first."
    >
      {loading ? (
        <Loader rows={6} label="Loading ratings" />
      ) : error ? (
        <ErrorState
          title="Couldn't load ratings"
          description={error}
          onRetry={loadRatings}
        />
      ) : ratings.length ? (
        <>
          <div className="mb-9 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
            <p className="text-[0.9375rem] text-muted">
              {ratings.length} {ratings.length === 1 ? "rating" : "ratings"}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[0.9375rem] text-muted">Average</span>
              <RatingStars
                value={
                  ratings.reduce((sum, item) => sum + Number(item.rating), 0) /
                  ratings.length
                }
                size="lg"
              />
            </div>
          </div>

          <ul className="grid gap-4">
            {ratings.map((rating, index) => (
              <li
                key={rating.id}
                className="animate-rise"
                style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
              >
                <article className="flex flex-wrap items-start justify-between gap-6 rounded-3xl border border-line bg-cream p-6 transition-all duration-500 ease-editorial hover:-translate-y-1 hover:border-forest/35 sm:p-7">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <h2 className="display-tight text-[1.375rem] leading-snug text-forest">
                        {rating.user_name}
                      </h2>
                      <RatingStars value={rating.rating} size="sm" />
                    </div>
                    <p className="mt-1.5 text-[0.9375rem] text-muted">
                      {rating.user_email}
                    </p>
                    <p className="mt-2 text-[0.875rem] text-muted">
                      {rating.store_name}
                    </p>
                  </div>

                  <div className="shrink-0 rounded-2xl border border-line bg-ivory px-5 py-3 text-right">
                    <p className="display-tight text-3xl text-forest">
                      {Number(rating.rating)}
                      <span className="text-base text-muted">/5</span>
                    </p>
                    <time
                      className="mt-0.5 block text-[0.75rem] text-muted"
                      dateTime={rating.created_at}
                    >
                      {formatDate(rating.created_at)}
                    </time>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <EmptyState
          icon={StarOff}
          eyebrow="Nothing yet"
          title="No ratings yet"
          description="Ratings for your store will appear here as soon as the community starts sharing feedback."
        />
      )}
    </PageContainer>
  );
}
