import { useEffect, useState } from "react";
import { MapPin, Plus, Search } from "lucide-react";
import { getAdminStores, getUsers } from "../../api/adminApi.js";
import { createStore } from "../../api/storeApi.js";
import Button from "../../components/common/Button.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import Input from "../../components/common/Input.jsx";
import PageContainer from "../../components/layout/PageContainer.jsx";
import StoreFormModal from "../../components/store/StoreFormModal.jsx";
import StoreTable from "../../components/tables/StoreTable.jsx";
import TablePagination from "../../components/tables/TablePagination.jsx";
import useDebounce from "../../hooks/useDebounce.js";
import { PAGE_SIZE } from "../../utils/constants.js";
import { getErrorMessage } from "../../utils/helpers.js";

export default function Stores() {
  const [search, setSearch] = useState("");
  const [address, setAddress] = useState("");
  const [page, setPage] = useState(1);
  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [owners, setOwners] = useState([]);
  const [ownersLoading, setOwnersLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const query = useDebounce(search);
  const addressQuery = useDebounce(address);

  const loadStores = async (requestedPage = page) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getAdminStores({
        page: requestedPage,
        limit: PAGE_SIZE,
        search: query || undefined,
        address: addressQuery || undefined,
        sortBy: "id",
        sortOrder: "desc",
      });
      setStores(data.data.stores);
      setPagination(data.data.pagination);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = async () => {
    setFormError("");
    setModalOpen(true);
    setOwnersLoading(true);
    try {
      const { data } = await getUsers({
        page: 1,
        limit: 100,
        role: "STORE_OWNER",
        sortBy: "name",
        sortOrder: "asc",
      });
      setOwners(data.data.users);
    } catch (requestError) {
      setFormError(getErrorMessage(requestError));
    } finally {
      setOwnersLoading(false);
    }
  };

  const handleCreate = async (payload) => {
    setSaving(true);
    setFormError("");
    try {
      await createStore(payload);
      setModalOpen(false);
      setPage(1);
      await loadStores(1);
    } catch (requestError) {
      setFormError(getErrorMessage(requestError, "Unable to add this place."));
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [query, addressQuery]);
  useEffect(() => {
    loadStores();
  }, [page, query, addressQuery]);

  return (
    <PageContainer
      eyebrow="Admin studio"
      title="Places"
      description="Search the directory, review ownership, or add a new store."
      action={
        <Button icon={Plus} onClick={openCreateModal}>
          Add place
        </Button>
      }
    >
      <form
        className="mb-10 grid gap-6 rounded-3xl border border-line bg-cream p-6 sm:grid-cols-2 sm:p-7"
        onSubmit={(event) => event.preventDefault()}
        role="search"
        aria-label="Filter places"
      >
        <Input
          label="Search by name or email"
          icon={Search}
          type="search"
          placeholder="Campus Coffee Bar"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Input
          label="Filter by address"
          icon={MapPin}
          type="search"
          placeholder="Union Street"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
      </form>

      {error ? (
        <ErrorState
          title="Couldn't load places"
          description={error}
          onRetry={() => loadStores()}
        />
      ) : (
        <section aria-label="Place results">
          <StoreTable stores={stores} loading={loading} />
          <TablePagination
            pagination={pagination}
            onChange={setPage}
            itemLabel="places"
          />
        </section>
      )}

      <StoreFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        loading={saving}
        error={formError}
        owners={owners}
        ownersLoading={ownersLoading}
        ownerRequired
      />
    </PageContainer>
  );
}
