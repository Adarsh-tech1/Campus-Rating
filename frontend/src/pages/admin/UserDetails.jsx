import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, UserX } from "lucide-react";
import { getUser } from "../../api/adminApi.js";
import Avatar from "../../components/common/Avatar.jsx";
import Badge from "../../components/common/Badge.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Loader from "../../components/common/Loader.jsx";
import ActivityList from "../../components/dashboard/ActivityList.jsx";
import SectionHeader from "../../components/dashboard/SectionHeader.jsx";
import PageContainer from "../../components/layout/PageContainer.jsx";
import StoreTable from "../../components/tables/StoreTable.jsx";
import { formatDate, getErrorMessage } from "../../utils/helpers.js";

export default function UserDetails() {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    getUser(id)
      .then(({ data }) => setRecord(data.data))
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <PageContainer title="Person details">
        <Loader rows={4} label="Loading account" />
      </PageContainer>
    );
  if (error || !record?.user)
    return (
      <PageContainer>
        <EmptyState
          icon={UserX}
          eyebrow="Not found"
          title="Account not found"
          description={error || "This person may have been removed."}
          action={
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-[0.9375rem] font-semibold text-ivory transition-colors duration-300 hover:bg-forest-deep"
            >
              <ArrowLeft className="size-4" strokeWidth={2} aria-hidden="true" />
              Back to people
            </Link>
          }
        />
      </PageContainer>
    );

  const { user, stores = [], ratings = [] } = record;
  return (
    <PageContainer
      eyebrow="Admin studio"
      title={user.name}
      description="Full account record, linked stores, and received ratings."
      action={
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-[0.9375rem] font-semibold text-forest transition-colors duration-300 hover:border-forest hover:bg-ivory-soft"
        >
          <ArrowLeft className="size-4" strokeWidth={2} aria-hidden="true" />
          Back to people
        </Link>
      }
    >
      <section className="flex flex-wrap items-center gap-7 rounded-[2rem] border border-line bg-cream p-7 sm:p-9">
        <Avatar name={user.name} size="xl" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="display-tight text-[2.25rem] text-forest">{user.name}</h2>
            <Badge role={user.role} />
          </div>
          <a
            href={`mailto:${user.email}`}
            className="link-underline mt-2 inline-block text-[1.0625rem] text-muted"
          >
            {user.email}
          </a>
        </div>
      </section>

      <dl className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3">
        {[
          { label: "Account ID", value: user.id },
          { label: "Address", value: user.address || "Not listed" },
          { label: "Joined", value: formatDate(user.created_at) },
        ].map((item) => (
          <div key={item.label} className="bg-cream px-7 py-6">
            <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted">
              {item.label}
            </dt>
            <dd className="mt-2 truncate text-[1.0625rem] text-forest">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      {user.role === "STORE_OWNER" ? (
        <section className="mt-20">
          <SectionHeader
            eyebrow="Ownership"
            title="Their stores"
            description="Places currently linked to this owner."
          />
          <StoreTable stores={stores} />
        </section>
      ) : null}

      {user.role === "STORE_OWNER" ? (
        <section className="mt-20">
          <SectionHeader
            eyebrow="Feedback"
            title="Ratings for their stores"
            description="Every rating left across the places they own."
          />
          {ratings.length ? (
            <ActivityList
              items={ratings}
              title="Ratings for their stores"
              linkToStore={false}
            />
          ) : (
            <p className="text-[1.0625rem] text-muted">
              No ratings have been submitted.
            </p>
          )}
        </section>
      ) : null}
    </PageContainer>
  );
}
