import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Store, StarIcon, UsersIcon } from "lucide-react";
import { getAdminStats, getAdminStores, getUsers } from "../../api/adminApi.js";
import Avatar from "../../components/common/Avatar.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import Loader from "../../components/common/Loader.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import SectionHeader from "../../components/dashboard/SectionHeader.jsx";
import PageContainer from "../../components/layout/PageContainer.jsx";
import RatingStars from "../../components/store/RatingStars.jsx";
import { ROLES } from "../../utils/constants.js";
import { formatDate, formatRating, getErrorMessage } from "../../utils/helpers.js";
import { storeImage } from "../../utils/storeImages.js";

const RECENT_LIMIT = 5;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [owners, setOwners] = useState(0);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentStores, setRecentStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statsResponse, ownersResponse, usersResponse, storesResponse] =
        await Promise.all([
          getAdminStats(),
          // The stats endpoint returns global totals only, so the owner count
          // comes from a filtered people query (limit 1 keeps it cheap).
          getUsers({ page: 1, limit: 1, role: ROLES.STORE_OWNER }),
          getUsers({
            page: 1,
            limit: RECENT_LIMIT,
            sortBy: "created_at",
            sortOrder: "desc",
          }),
          getAdminStores({
            page: 1,
            limit: RECENT_LIMIT,
            sortBy: "rating",
            sortOrder: "desc",
          }),
        ]);

      setStats(statsResponse.data.data.stats);
      setOwners(Number(ownersResponse.data.data.pagination.totalUsers) || 0);
      setRecentUsers(usersResponse.data.data.users);
      setRecentStores(storesResponse.data.data.stores);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <PageContainer
      eyebrow="Admin studio"
      title="Platform overview"
      description="A live look at how the Campusly guide is being used."
    >
      {loading ? (
        <Loader rows={4} label="Loading statistics" />
      ) : error ? (
        <ErrorState
          title="Couldn't load statistics"
          description={error}
          onRetry={loadStats}
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total users"
              value={stats.total_users}
              icon={UsersIcon}
              note="Registered accounts"
            />
            <StatCard
              label="Total owners"
              value={owners}
              icon={StarIcon}
              note="Store owner accounts"
            />
            <StatCard
              label="Total stores"
              value={stats.total_stores}
              icon={Store}
              note="Listed in the guide"
            />
            <StatCard
              label="Total ratings"
              value={stats.total_ratings}
              icon={Star}
              note="Submitted by the community"
            />
          </div>

          <div className="mt-24 grid gap-16 lg:grid-cols-2 lg:gap-12">

            <section>
              <SectionHeader
                eyebrow="Recent"
                title="Recent users"
                description="The newest accounts on Campusly."
                to="/admin/users"
                linkLabel="All people"
              />
              <ul className="grid">
                {recentUsers.map((person) => (
                  <li key={person.id}>
                    <Link
                      to={`/admin/users/${person.id}`}
                      className="flex items-center gap-4 border-b border-line py-4 transition-colors duration-300 last:border-0 hover:bg-ivory-soft/50"
                    >
                      <Avatar name={person.name} size="md" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[1rem] font-semibold text-forest">
                          {person.name}
                        </span>
                        <span className="block truncate text-[0.875rem] text-muted">
                          {person.email}
                        </span>
                      </span>
                      <span className="hidden text-[0.8125rem] text-muted sm:block">
                        {formatDate(person.created_at)}
                      </span>
                      <Badge role={person.role} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <SectionHeader
                eyebrow="Top rated"
                title="Recent stores"
                description="The highest rated places in the guide."
                to="/admin/stores"
                linkLabel="All places"
              />
              <ul className="grid">
                {recentStores.map((place) => (
                  <li
                    key={place.id}
                    className="flex items-center gap-4 border-b border-line py-4 last:border-0"
                  >
                    <img
                      src={storeImage(place)}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="size-12 shrink-0 rounded-xl object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[1rem] font-semibold text-forest">
                        {place.name}
                      </span>
                      <span className="block truncate text-[0.875rem] text-muted">
                        {place.address || "Address not listed"}
                      </span>
                    </span>
                    {Number(place.average_rating) > 0 ? (
                      <span className="flex shrink-0 items-center gap-2">
                        <RatingStars value={place.average_rating} size="sm" />
                        <span className="text-[0.9375rem] font-semibold text-forest tabular-nums">
                          {formatRating(place.average_rating)}
                        </span>
                      </span>
                    ) : (
                      <span className="shrink-0 text-[0.8125rem] text-muted">
                        Unrated
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="grain mt-24 overflow-hidden rounded-[2rem] bg-forest px-6 py-12 sm:px-12 sm:py-16">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.26em] text-gold">
                  Ratings &amp; statistics
                </p>
                <h2 className="display-tight mt-4 max-w-xl text-section text-ivory">
                  How the guide is scoring
                </h2>
                <p className="mt-5 max-w-xl text-[1.125rem] leading-relaxed text-ivory/60">
                  {stats.total_ratings > 0
                    ? `${stats.total_ratings} ${
                        stats.total_ratings === 1 ? "rating has" : "ratings have"
                      } been left across ${stats.total_stores} listed ${
                        stats.total_stores === 1 ? "place" : "places"
                      }.`
                    : "No ratings have been submitted yet. Share the guide with the campus to get the first ones in."}
                </p>
              </div>
              <Button as={Link} to="/admin/stores" variant="gold" size="lg">
                Review places
              </Button>
            </div>
          </section>
        </>
      )}
    </PageContainer>
  );
}
