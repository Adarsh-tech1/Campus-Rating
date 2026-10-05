import { useEffect, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { createUser, getUsers } from "../../api/adminApi.js";
import FormAlert from "../../components/auth/FormAlert.jsx";
import Button from "../../components/common/Button.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import Input from "../../components/common/Input.jsx";
import Modal from "../../components/common/Modal.jsx";
import PageContainer from "../../components/layout/PageContainer.jsx";
import Select from "../../components/common/Select.jsx";
import TablePagination from "../../components/tables/TablePagination.jsx";
import UserTable from "../../components/tables/UserTable.jsx";
import useDebounce from "../../hooks/useDebounce.js";
import { PAGE_SIZE } from "../../utils/constants.js";
import { getErrorMessage } from "../../utils/helpers.js";

const blankUser = {
  name: "",
  email: "",
  address: "",
  password: "",
  role: "USER",
};

export default function Users() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(blankUser);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const debouncedSearch = useDebounce(search);

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getUsers({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        role: role || undefined,
        sortBy: "created_at",
        sortOrder: "desc",
      });
      setUsers(data.data.users);
      setPagination(data.data.pagination);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, role]);
  useEffect(() => {
    loadUsers();
  }, [page, debouncedSearch, role]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      await createUser({ ...form, address: form.address || undefined });
      setModalOpen(false);
      setForm(blankUser);
      setPage(1);
      await loadUsers();
    } catch (requestError) {
      setFormError(
        getErrorMessage(requestError, "Unable to create this account."),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer
      eyebrow="Admin studio"
      title="People"
      description="Search accounts, filter by role, or add a new one."
      action={
        <Button
          icon={UserPlus}
          onClick={() => {
            setFormError("");
            setModalOpen(true);
          }}
        >
          Add person
        </Button>
      }
    >
      <form
        className="mb-10 grid gap-6 rounded-3xl border border-line bg-cream p-6 sm:grid-cols-2 sm:p-7"
        onSubmit={(event) => event.preventDefault()}
        role="search"
        aria-label="Filter people"
      >
        <Input
          label="Search people"
          icon={Search}
          type="search"
          placeholder="Name or email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select
          label="Filter by role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          options={[
            { value: "", label: "All roles" },
            { value: "USER", label: "Campus member" },
            { value: "STORE_OWNER", label: "Store owner" },
            { value: "ADMIN", label: "Administrator" },
          ]}
        />
      </form>

      {error ? (
        <ErrorState
          title="Couldn't load people"
          description={error}
          onRetry={loadUsers}
        />
      ) : (
        <section aria-label="People results">
          <UserTable users={users} loading={loading} />
          <TablePagination
            pagination={pagination}
            onChange={setPage}
            itemLabel="people"
          />
        </section>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create an account"
        eyebrow="Admin studio"
      >
        {formError ? <FormAlert className="mb-7">{formError}</FormAlert> : null}
        <form className="grid gap-6" onSubmit={handleCreate}>
          <Input
            label="Full name"
            minLength={20}
            maxLength={60}
            required
            value={form.name}
            onChange={(event) =>
              setForm({ ...form, name: event.target.value })
            }
          />
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
          />
          <Input
            label="Address"
            as="textarea"
            rows={2}
            maxLength={400}
            value={form.address}
            onChange={(event) =>
              setForm({ ...form, address: event.target.value })
            }
          />
          <Input
            label="Temporary password"
            type="password"
            minLength={8}
            maxLength={16}
            required
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
            hint="8–16 characters, with an uppercase letter and a special character."
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(event) =>
              setForm({ ...form, role: event.target.value })
            }
            options={[
              { value: "USER", label: "Campus member" },
              { value: "STORE_OWNER", label: "Store owner" },
              { value: "ADMIN", label: "Administrator" },
            ]}
          />
          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving} icon={UserPlus}>
              Create account
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
