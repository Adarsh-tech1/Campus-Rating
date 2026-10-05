import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getStores } from "../../api/storeApi.js";
import Button from "../../components/common/Button.jsx";
import PageContainer from "../../components/layout/PageContainer.jsx";
import Hero from "../../components/dashboard/Hero.jsx";
import SectionHeader from "../../components/dashboard/SectionHeader.jsx";
import StoreGrid from "../../components/store/StoreGrid.jsx";
import { getErrorMessage } from "../../utils/helpers.js";

export default function UserDashboard() {
  const [favorites, setFavorites] = useState([]);
  const [trending, setTrending] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [favoriteResponse, recentResponse] = await Promise.all([
        getStores({ page: 1, limit: 5, sortBy: "rating", sortOrder: "desc" }),
        getStores({ page: 1, limit: 8, sortBy: "id", sortOrder: "desc" }),
      ]);
      const favoriteData = favoriteResponse.data.data;
      const recentData = recentResponse.data.data;
      setFavorites(favoriteData.stores);
      setTotal(favoriteData.pagination.totalStores);
      const favoriteIds = new Set(favoriteData.stores.map((store) => store.id));
      setTrending(recentData.stores.filter((store) => !favoriteIds.has(store.id)).slice(0, 3));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <PageContainer>
      <Hero storeCount={total} />

      <section>
        <SectionHeader
          eyebrow="Community favorites"
          title="Places the campus rates highest"
          description="Ordered by average rating across every review."
          to="/user/top-rated"
          linkLabel="See top rated"
        />
        <StoreGrid stores={favorites} loading={loading} error={error} onRetry={load} />
      </section>

      {!loading && trending.length > 0 ? (
        <section className="mt-24">
          <SectionHeader
            eyebrow="Just added"
            title="Recently added places"
            description="New entries to the guide."
            to="/user/stores"
            linkLabel="View all places"
          />
          <StoreGrid stores={trending} />
        </section>
      ) : null}

      <aside className="grain mt-24 overflow-hidden rounded-[2rem] bg-forest px-6 py-12 sm:px-12 sm:py-16">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.26em] text-gold">
          Missing a favourite?
        </p>
        <h2 className="display-tight mt-4 max-w-2xl text-section text-ivory">
          Know somewhere we don&rsquo;t?
        </h2>
        <p className="mt-5 max-w-2xl text-[1.125rem] leading-relaxed text-ivory/60">
          Places are added by store owners and administrators. If a favourite spot is
          missing, rate the places that are listed — or ask the owner to claim their
          page.
        </p>
        <div className="mt-9 flex flex-wrap gap-4">
          <Button
            as={Link}
            to="/user/stores"
            variant="gold"
            size="lg"
            iconRight={ArrowRight}
          >
            Browse all places
          </Button>
          <Button
            as={Link}
            to="/user/ratings"
            variant="outline"
            size="lg"
            className="border-ivory/30 text-ivory hover:border-ivory hover:bg-ivory/10"
          >
            See my ratings
          </Button>
        </div>
      </aside>
    </PageContainer>
  );
}
