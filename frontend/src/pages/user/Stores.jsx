import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getStores } from "../../api/storeApi.js";
import Pagination from "../../components/common/Pagination.jsx";
import PageContainer from "../../components/layout/PageContainer.jsx";
import StoreGrid from "../../components/store/StoreGrid.jsx";
import StoreSearch from "../../components/store/StoreSearch.jsx";
import useDebounce from "../../hooks/useDebounce.js";
import { PAGE_SIZE } from "../../utils/constants.js";
import { getErrorMessage } from "../../utils/helpers.js";

export default function Stores({ mode = "explore" }) {
  const [searchParams] = useSearchParams();
  const topRated = mode === "top";
  const searchParam = searchParams.get("search") || "";

  const [search, setSearch] = useState(searchParam);
  const [address, setAddress] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [page, setPage] = useState(1);
  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const debouncedSearch = useDebounce(search);
  const debouncedAddress = useDebounce(address);

  // Keep in step with ?search= in the URL so searching from the hero or the
  // footer also works while this page is already open.
  useEffect(() => {
    setSearch(searchParam);
  }, [searchParam]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedAddress, sortBy]);

  const loadStores = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getStores({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        address: debouncedAddress || undefined,
        sortBy,
        // "Top rated" and "Recently added" are most-useful-first; names read
        // best A to Z.
        sortOrder: sortBy === "name" ? "asc" : "desc",
      });
      setStores(data.data.stores);
      setPagination(data.data.pagination);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, [page, debouncedSearch, debouncedAddress, sortBy]);

  return (
    <PageContainer
      eyebrow={topRated ? "Community standings" : "The campus guide"}
      title={
        topRated
          ? "The places the campus rates highest"
          : "Find somewhere worth returning to"
      }
      description={
        topRated
          ? "Ordered by average community rating, most loved first."
          : "Search by name, email, or address to find what is close by."
      }
    >
      <StoreSearch
        search={search}
        onSearch={setSearch}
        address={address}
        onAddress={setAddress}
        sortBy={sortBy}
        onSort={setSortBy}
      />

      <StoreGrid
        stores={stores}
        loading={loading}
        error={error}
        onRetry={loadStores}
        ranked={topRated}
      />

      <div className="mt-14 flex flex-col items-center gap-6 border-t border-line pt-10">
        <p className="text-[0.9375rem] text-muted">
          {pagination?.totalStores ?? 0}{" "}
          {pagination?.totalStores === 1 ? "place" : "places"} found
          {page > 1 ? ` · page ${page} of ${pagination?.totalPages ?? 1}` : ""}
        </p>
        {pagination?.totalPages > 1 ? (
          <Pagination
            page={page}
            totalPages={pagination.totalPages}
            onChange={setPage}
          />
        ) : null}
      </div>
    </PageContainer>
  );
}
