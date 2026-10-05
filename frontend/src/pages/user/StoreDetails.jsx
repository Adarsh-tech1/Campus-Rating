import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { addRating } from "../../api/ratingApi.js";
import { getStore, getStores } from "../../api/storeApi.js";
import FormAlert from "../../components/auth/FormAlert.jsx";
import Button from "../../components/common/Button.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Loader from "../../components/common/Loader.jsx";
import PageContainer from "../../components/layout/PageContainer.jsx";
import RatingModal from "../../components/store/RatingModal.jsx";
import RatingStars from "../../components/store/RatingStars.jsx";
import SectionHeader from "../../components/dashboard/SectionHeader.jsx";
import StoreGrid from "../../components/store/StoreGrid.jsx";
import { formatRating, getErrorMessage } from "../../utils/helpers.js";
import { storeCategory, storeImage } from "../../utils/storeImages.js";

export default function StoreDetails() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [relatedStores, setRelatedStores] = useState([]);

  const loadStore = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getStore(id);
      setStore(data.data.store);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  useEffect(() => {
    let active = true;
    getStores({ page: 1, limit: 4, sortBy: "rating", sortOrder: "desc" })
      .then(({ data }) => {
        const otherStores = data.data.stores.filter(
          (place) => Number(place.id) !== Number(id),
        );
        if (active) setRelatedStores(otherStores.slice(0, 3));
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [id]);

  // NOTE: The API exposes `user_rating` (the score) but never the rating's own
  // id, and PUT /ratings/:id is keyed on that id. Until the backend returns it,
  // an existing rating can be shown but not edited.
  const submitRating = async (rating) => {
    setSaving(true);
    setNotice("");
    setError("");
    try {
      await addRating({ store_id: Number(id), rating });
      setRatingOpen(false);
      setNotice("Your rating was submitted.");
      await loadStore();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Loader label="Loading place details" />
      </PageContainer>
    );
  }

  if (error && !store) {
    return (
      <PageContainer>
        <EmptyState
          title="Place unavailable"
          description={error}
          action={
            <Link className="link-underline text-ink" to="/user/stores">
              Back to places
            </Link>
          }
        />
      </PageContainer>
    );
  }

  if (!store) return null;

  const score = Number(store.average_rating) || 0;
  const count = Number(store.rating_count) || 0;
  const hasRated = store.user_rating != null;

  return (
    <>
      <PageContainer>
        <Link
          to="/user/stores"
          className="link-underline mb-10 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-muted"
        >
          <ArrowLeft className="size-4" strokeWidth={2} aria-hidden="true" />
          All places
        </Link>

        <div className="grain relative isolate overflow-hidden rounded-[2rem] bg-forest">
          <img
            src={storeImage(store)}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 size-full object-cover opacity-50"
          />
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep via-forest/85 to-forest/40"
            aria-hidden="true"
          />
          <div className="px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
            <span className="inline-block rounded-full bg-forest-mid px-4 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-gold">
              {storeCategory(store)}
            </span>
            <h1 className="display-tight mt-6 max-w-4xl text-[2.75rem] leading-[1] text-ivory sm:text-[3.5rem]">
              {store.name}
            </h1>
            <p className="mt-5 flex items-start gap-2.5 text-[1.125rem] leading-relaxed text-ivory/70">
              <MapPin
                className="mt-1.5 size-5 shrink-0 text-gold"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              {store.address || "Address not listed"}
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start lg:gap-16">
          <div>
            <SectionHeader title="Details" />
            <dl className="grid gap-8 sm:grid-cols-2">
              <div>
                <dt className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted">
                  Contact email
                </dt>
                <dd className="text-[1.0625rem] text-forest">
                  {store.email ? (
                    <a className="link-underline" href={`mailto:${store.email}`}>
                      {store.email}
                    </a>
                  ) : (
                    <span className="text-muted">Not listed</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted">
                  Address
                </dt>
                <dd className="text-[1.0625rem] leading-relaxed text-forest">
                  {store.address || <span className="text-muted">Not listed</span>}
                </dd>
              </div>
            </dl>

            <div className="mt-12 rounded-3xl border border-line bg-cream p-7 sm:p-9">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">
                Community rating
              </p>
              <div className="mt-4 flex items-end gap-5">
                <p className="display-tight text-7xl leading-none text-forest">
                  {formatRating(score)}
                </p>
                <div className="pb-2">
                  <RatingStars value={score} size="lg" />
                  <p className="mt-2 text-[0.9375rem] text-muted">
                    {count} {count === 1 ? "rating" : "ratings"} from the campus
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-32">
            <div className="rounded-3xl border border-line bg-cream p-7 sm:p-9">
              <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">
                {hasRated ? "Your rating" : "Add your voice"}
              </p>
              <h2 className="display-tight text-3xl text-forest">{store.name}</h2>

              {hasRated ? (
                <div className="mt-7 rounded-2xl border border-line bg-ivory p-5">
                  <RatingStars value={store.user_rating} size="lg" />
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                    You rated this {store.user_rating} out of 5. Ratings cannot be
                    changed once submitted.
                  </p>
                </div>
              ) : (
                <p className="mt-5 text-[1rem] leading-relaxed text-muted">
                  Been here? Tell the rest of campus what you think — one tap, and it
                  helps the next person.
                </p>
              )}

              {notice ? (
                <FormAlert tone="success" className="mt-6">
                  {notice}
                </FormAlert>
              ) : null}

              {error ? <FormAlert className="mt-6">{error}</FormAlert> : null}

              {hasRated ? null : (
                <Button
                  className="mt-7 w-full"
                  size="lg"
                  variant="gold"
                  iconRight={Star}
                  onClick={() => setRatingOpen(true)}
                >
                  Rate this place
                </Button>
              )}
            </div>
          </div>
        </div>

        <section className="mt-24">
          <SectionHeader
            eyebrow="Keep exploring"
            title="Related places"
            description="Other spots students rate highly."
          />
          <StoreGrid stores={relatedStores} />
        </section>
      </PageContainer>

      <RatingModal
        open={ratingOpen}
        store={store}
        onClose={() => setRatingOpen(false)}
        onSubmit={submitRating}
        loading={saving}
      />
    </>
  );
}
