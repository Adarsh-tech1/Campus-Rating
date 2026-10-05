# Campusly frontend

React and Vite frontend for the Campus Rating API.

## Run locally

1. Start MySQL and the API from `../backend`.
2. Copy `.env.example` to `.env` and set `VITE_API_URL` if the API is not at `http://localhost:5000/api`.
3. From this directory, run `npm install`, then `npm run dev`.

The Vite development server prints its local URL (usually `http://localhost:5173`). Sign-in and role access use the API's existing login, profile, and role-protected endpoints.

## Design system

Tailwind v4 is configured CSS-first in `src/index.css`. Every colour, font and
type step lives in the `@theme` block and becomes a utility, so components use
Tailwind directly rather than custom classes.

| Token | Value | Used for |
| --- | --- | --- |
| `forest` / `forest-deep` / `forest-mid` | `#10251C` / `#0A1712` / `#19382A` | Navbar, hero surfaces, footer, primary buttons |
| `ivory` / `ivory-soft` / `cream` | `#F7F3EA` / `#EFE9DD` / `#FCFAF5` | Page background, quiet panels, card surfaces |
| `gold` / `gold-bright` / `gold-deep` / `gold-mist` | `#E7B83E` / `#F4C84A` / `#9C751A` / `#F8EED4` | Accents, stars, category badges, highlights |
| `ink` / `muted` / `line` | `#172018` / `#77766E` / `#D9D4C8` | Headings, body copy, borders |
| `success` / `danger` (+ `-soft`) | muted natural green / warm red-brown | Status and validation states |

Type pairs **Manrope** (UI, forms, navigation, metadata) with **Playfair
Display** (major editorial headings only). Fluid steps `text-hero`,
`text-page` and `text-section` are defined in `@theme` and clamp across viewports.

Custom CSS is limited to five `@utility` helpers Tailwind cannot express
directly: `display-tight`, `rule-fade`, `grain`, `drift` and `link-underline`.

## Structure

```
src/
  components/
    auth/      AuthBrand, AuthPanel, FormAlert, PasswordField, RolePicker
    common/    Avatar, Badge, Button, EmptyState, ErrorState, Input, Loader,
               Modal, Pagination, Select, StatCard
    dashboard/ Hero, SectionHeader, ActivityList
    layout/    Navbar, MobileMenu, Footer, PageContainer
    store/     StoreCard, StoreGrid, StoreSearch, RatingStars, RatingModal,
               StoreFormModal
    tables/    UserTable, StoreTable, TablePagination
  layouts/     AuthLayout, DashboardLayout
  pages/       auth/ user/ owner/ admin/ NotFound
  routes/ api/ hooks/ context/ utils/
```

`Login` and `Register` share `AuthLayout`, `AuthBrand` (dark-green panel),
`AuthPanel` (ivory form column), `PasswordField`, `FormAlert` and `RolePicker`,
so the two screens stay one design language.

## Images

Photography is bundled under `public/images/{hero,auth,stores}` and referenced
by local path — nothing is hotlinked. Credits are in
[`public/images/README.md`](public/images/README.md). Store records have no image
field, so `src/utils/storeImages.js` picks a bundled photo per store from
keyword matching with a stable hash fallback.
