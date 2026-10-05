import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Clock, Plus, Sparkles, Star, Store } from "lucide-react";
import { createStore } from "../../api/storeApi.js";
import { getOwnerRatings, getOwnerStore } from "../../api/ownerApi.js";
import Button from "../../components/common/Button.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import Loader from "../../components/common/Loader.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import ActivityList from "../../components/dashboard/ActivityList.jsx";
import SectionHeader from "../../components/dashboard/SectionHeader.jsx";
import PageContainer from "../../components/layout/PageContainer.jsx";
import RatingStars from "../../components/store/RatingStars.jsx";
import StoreFormModal from "../../components/store/StoreFormModal.jsx";
import { formatDate, formatRating, getErrorMessage } from "../../utils/helpers.js";
import { storeImage } from "../../utils/storeImages.js";

export default function OwnerDashboard() {
  const { hash } = useLocation();
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    const [storeResult, ratingsResult] = await Promise.allSettled([
      getOwnerStore(),
      getOwnerRatings(),
    ]);
    if (
      storeResult.status === "rejected" &&
      storeResult.reason?.response?.status !== 404
    ) {
      setError(getErrorMessage(storeResult.reason));
    } else if (ratingsResult.status === "rejected") {
      setError(getErrorMessage(ratingsResult.reason));
    } else {
      setStore(storeResult.status === "fulfilled" ? storeResult.value.data.data.store : null);
      setRatings(ratingsResult.value.data.data.ratings);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    if (!loading && hash === "#my-place") {
      document.getElementById("my-place")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
    }
  }, [hash, loading]);

  const handleCreateStore = async (payload) => {
    setSaving(true);
    setFormError("");
    try {
      await createStore(payload);
      setCreateOpen(false);
      await loadDashboard();
    } catch (requestError) {
      setFormError(getErrorMessage(requestError, "Couldn't add your place."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Owner dashboard">
        <Loader rows={5} label="Loading your dashboard" />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Owner dashboard">
        <ErrorState
          title="Couldn't load your dashboard"
          description={error}
          onRetry={loadDashboard}
        />
      </PageContainer>
    );
  }

  if (!store) {
    return (
      <PageContainer
        eyebrow="Owner studio"
        title="Your place, your people"
        description="Add a store to your account to start reading what the campus says about it."
      >
        <section className="grain relative isolate overflow-hidden rounded-[2rem] bg-forest px-6 py-16 text-center sm:px-12 sm:py-20">
          <img
            src="/images/hero/campus-cafe-night.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 size-full object-cover opacity-25"
          />
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep via-forest/85 to-forest/55"
            aria-hidden="true"
          />
          <span
            className="mx-auto mb-8 flex size-20 items-center justify-center rounded-full bg-forest-mid text-gold"
            aria-hidden="true"
          >
            <Store className="size-9" strokeWidth={1.25} />
          </span>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.26em] text-gold">
            Getting started
          </p>
          <h2 className="display-tight mx-auto mt-5 max-w-2xl text-section text-ivory">
            No store is linked to your account
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[1.125rem] leading-relaxed text-ivory/60">
            Once your place is added, its ratings, average score, and recent feedback
            appear here.
          </p>
          <div className="mt-10 flex justify-center">
            <Button
              variant="gold"
              size="lg"
              icon={Plus}
              onClick={() => setCreateOpen(true)}
            >
              Add your place
            </Button>
          </div>
        </section>
        <StoreFormModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onSubmit={handleCreateStore}
          loading={saving}
          error={formError}
        />
      </PageContainer>
    );
  }

  const average = Number(store.average_rating) || 0;
  const distribution = [5, 4, 3, 2, 1].map((score) => ({
    score,
    count: ratings.filter((rating) => Number(rating.rating) === score).length,
  }));
  const recentRating = ratings[0];
  const highest = Math.max(...distribution.map(({ count }) => count), 0);

  return (
    <PageContainer>
      <section id="my-place" className="grain relative isolate scroll-mt-32 overflow-hidden rounded-[2rem] bg-forest">
        <img
          src={storeImage(store)}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 size-full object-cover opacity-40"
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep via-forest/90 to-forest/60"
          aria-hidden="true"
        />
        <div className="px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.28em] text-gold">
            Your place, your people
          </p>
          <h1 className="display-tight mt-5 max-w-4xl text-[2.75rem] leading-[1] text-ivory sm:text-[3.5rem]">
            {store.name}
          </h1>
          <p className="mt-5 max-w-2xl text-[1.125rem] leading-relaxed text-ivory/65">
            {store.address || "Address not listed"}
            {store.email ? ` · ${store.email}` : ""}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-8 border-t border-ivory/15 pt-8">
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ivory/50">
                Community score
              </p>
              <p className="display-tight mt-2 flex items-end gap-3 text-6xl text-ivory">
                {formatRating(average)}
                <span className="pb-2 text-2xl text-ivory/50">/5</span>
              </p>
            </div>
            <div className="pb-2">
              <RatingStars value={average} size="lg" />
              <p className="mt-2 text-[0.9375rem] text-ivory/55">
                {ratings.length}{" "}
                {ratings.length === 1 ? "rating" : "ratings"} so far
              </p>
            </div>
            <Button
              as={Link}
              to="/owner/ratings"
              variant="gold"
              size="lg"
              iconRight={ArrowRight}
              className="ml-auto"
            >
              All ratings
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total ratings" value={ratings.length} icon={Star} />
        <StatCard
          label="Average score"
          value={`${formatRating(average)}/5`}
          icon={Sparkles}
        />
        <StatCard label="Five star ratings" value={distribution[0].count} icon={Sparkles} />
        <StatCard
          label="Most recent"
          value={recentRating ? formatDate(recentRating.created_at) : "None yet"}
          icon={Clock}
        />
      </section>
      {ratings.length > 0 ? (
        <section className="mt-24">
          <SectionHeader
            eyebrow="Breakdown"
            title="How the campus scored you"
            description="Every rating, grouped by score."
          />
          <ul className="grid gap-4">
            {distribution.map(({ score, count }) => (
              <li key={score} className="flex items-center gap-5">
                <span className="w-16 shrink-0 text-[0.9375rem] text-muted">
                  {score} star{score === 1 ? "" : "s"}
                </span>
                <div
                  className="h-2.5 flex-1 overflow-hidden rounded-full bg-ivory-soft"
                  role="img"
                  aria-label={`${score} star ratings: ${count}`}
                >
                  <div
                    className="h-full rounded-full bg-gold transition-[width] duration-700 ease-editorial"
                    style={{
                      width: highest ? `${(count / highest) * 100}%` : "0%",
                    }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-[0.9375rem] font-medium text-forest tabular-nums">
                  {count}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-24">
        <SectionHeader
          eyebrow="Guestbook"
          title="Recent ratings"
          description="The newest feedback from your community."
          to="/owner/ratings"
          linkLabel="View all"
        />
        {ratings.length ? (
          // Owners cannot open /user/stores/:id, so no store link here.
          <ActivityList items={ratings.slice(0, 5)} linkToStore={false} />
        ) : (
          <p className="text-[1.0625rem] text-muted">
            No ratings yet. Share your page with the campus to get the first one.
          </p>
        )}
      </section>
    </PageContainer>
  );
}
