import Pagination from "../common/Pagination.jsx";

export default function TablePagination({ pagination, onChange, itemLabel = "results" }) {
  if (!pagination) return null;
  const total = pagination.totalUsers ?? pagination.totalStores ?? 0;
  const start = total ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const end = Math.min(pagination.page * pagination.limit, total);

  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-line pt-7">
      <p className="text-[0.9375rem] text-muted">
        Showing <span className="tabular-nums">{start}</span>–
        <span className="tabular-nums">{end}</span> of{" "}
        <span className="tabular-nums">{total}</span> {itemLabel}
      </p>
      <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={onChange} />
    </div>
  );
}
