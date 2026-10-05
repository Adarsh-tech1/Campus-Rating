import { useState } from "react";
import { Check } from "lucide-react";
import Button from "../common/Button.jsx";
import Modal from "../common/Modal.jsx";
import RatingStars from "./RatingStars.jsx";

const LABELS = {
  1: "Not for me",
  2: "Could be better",
  3: "It's good",
  4: "Really good",
  5: "A new favorite",
};

/**
 * Create a rating. The backend exposes `user_rating` but not the rating id that
 * PUT /ratings/:id needs, so an existing rating is shown read-only and this
 * dialog only handles the first rating.
 */
export default function RatingModal({ open, store, onClose, onSubmit, loading }) {
  const [rating, setRating] = useState(0);

  const reset = () => {
    setRating(0);
    onClose?.();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!rating) return;
    await onSubmit(rating);
    setRating(0);
  };

  return (
    <Modal
      open={open}
      onClose={reset}
      title="Rate this place"
      eyebrow={store?.name}
      size="sm"
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={reset}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="rating-form"
            loading={loading}
            disabled={!rating}
            variant="gold"
            icon={Check}
          >
            Submit rating
          </Button>
        </div>
      }
    >
      <form id="rating-form" className="grid gap-7" onSubmit={handleSubmit}>
        <div className="flex justify-center py-2">
          <RatingStars value={rating} interactive onChange={setRating} />
        </div>
        <p
          aria-live="polite"
          className="border-t border-line pt-5 text-center text-[1rem] text-muted"
        >
          {rating ? (
            <>
              <span className="font-display text-2xl text-forest">
                {LABELS[rating]}
              </span>
              <span className="text-muted"> · {rating} out of 5</span>
            </>
          ) : (
            <span className="text-muted">Pick a rating from 1 to 5 stars.</span>
          )}
        </p>
      </form>
    </Modal>
  );
}
