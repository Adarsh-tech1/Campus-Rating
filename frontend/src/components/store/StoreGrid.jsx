import { SearchX } from "lucide-react";
import Button from "../common/Button.jsx";
import EmptyState from "../common/EmptyState.jsx";
import ErrorState from "../common/ErrorState.jsx";
import Loader from "../common/Loader.jsx";
import StoreCard from "./StoreCard.jsx";

export default function StoreGrid({ stores = [], loading, error, onRetry, ranked = false }) {
  if (loading) return <Loader rows={6} label="Loading places" />;
  if (error) {
    return (
      <ErrorState
        title="Couldn't load places"
        description={error}
        onRetry={onRetry}
      />
    );
  }
  if (!stores.length) {
    return (
      <EmptyState
        icon={SearchX}
        title="No places found"
        description="Try another search or change the filters."
        action={
          onRetry ? (
            <Button variant="outline" onClick={onRetry}>
              Reset search
            </Button>
          ) : null
        }
      />
    );
  }

  return (
    <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {stores.map((store, index) => (
        <li
          key={store.id}
          className="animate-rise"
          style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
        >
          <StoreCard store={store} rank={ranked ? index + 1 : undefined} />
        </li>
      ))}
    </ul>
  );
}
