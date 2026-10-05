/**
 * Curated imagery for store cards.
 *
 * Store records have no image field, so each store is matched to a bundled
 * editorial photo from its name/address. Matching is keyword-first and falls
 * back to a stable hash so the same store always shows the same photo.
 */

const CATEGORY_IMAGES = {
  coffee: [
    "/images/stores/coffee-pour.jpg",
    "/images/stores/coffee-counter.jpg",
    "/images/stores/cafe-books.jpg",
  ],
  food: [
    "/images/stores/healthy-bowl.jpg",
    "/images/stores/friends-table.jpg",
    "/images/stores/pancake-stack.jpg",
    "/images/stores/amber-bar.jpg",
  ],
  books: [
    "/images/stores/library-shelves.jpg",
    "/images/stores/bookstore.jpg",
  ],
  study: [
    "/images/stores/study-lounge.jpg",
    "/images/stores/cafe-work.jpg",
  ],
};

const KEYWORDS = {
  coffee: [
    "coffee", "cafe", "café", "espresso", "latte", "roastery", "roaster",
    "brew", "tea", "bean", "mocha", "cappuccino",
  ],
  books: [
    "library", "book", "bookstore", "bookshop", "reading", "archive", "press",
    "textbook", "novel",
  ],
  study: [
    "study", "workspace", "cowork", "co-work", "desk", "commons", "lab",
    "academic", "tutor", "learning", "hall",
  ],
  food: [
    "food", "kitchen", "restaurant", "grill", "deli", "bistro", "pizza",
    "burger", "noodle", "ramen", "taco", "bakery", "sandwich", "brunch",
    "diner", "bar", "pub", "brewery", "wine", "eats", "canteen", "tuck",
  ],
};

const CATEGORY_LABELS = {
  coffee: "Coffee",
  food: "Food",
  books: "Books",
  study: "Study space",
};

const FALLBACK = "/images/stores/friends-table.jpg";

function hash(value) {
  return [...String(value)].reduce(
    (total, char) => (total * 31 + char.charCodeAt(0)) % 100003,
    7,
  );
}

function detectCategory(store) {
  const haystack = [store?.name, store?.address, store?.email]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  for (const [category, words] of Object.entries(KEYWORDS)) {
    if (words.some((word) => haystack.includes(word))) return category;
  }
  return null;
}

/** Human label for the card badge, e.g. "Coffee" or "Study space". */
export function storeCategory(store) {
  const category = detectCategory(store);
  return category ? CATEGORY_LABELS[category] : "Campus place";
}

/** Returns a bundled image path for the given store record. */
export function storeImage(store) {
  if (!store) return FALLBACK;
  if (store.image) return store.image;

  const seed = store.id ?? store.name ?? "campus";
  const bucket = CATEGORY_IMAGES[detectCategory(store)];
  if (!bucket) return FALLBACK;

  return bucket[hash(seed) % bucket.length];
}
