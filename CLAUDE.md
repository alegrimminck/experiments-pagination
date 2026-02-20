# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

```bash
bin/dev                  # Start both Rails and Vite dev servers (via foreman)
bin/rails s              # Rails server only
bin/vite dev             # Vite dev server only
```

### Database

```bash
bin/rails db:setup       # Create, migrate, and seed (first-time setup)
bin/rails db:migrate     # Run pending migrations
bin/rails db:seed        # Load 100 fake products via Faker
```

### Linting & Security

```bash
bin/rubocop -f github    # Lint Ruby (omakase style guide)
bin/brakeman --no-pager  # Rails security scan
```

No JavaScript test suite is configured. CI runs Brakeman, importmap audit, and RuboCop on every push/PR.

## Architecture

Rails 7 + Vue 3 SPA. Rails serves the API and a single HTML shell; Vue Router handles all client-side navigation.

### Request Flow

1. All non-API paths hit `HomeController#index`, which renders `app/views/home/index.html.erb` — a single `<div id="app"></div>`.
2. `app/javascript/entrypoints/application.ts` bootstraps Vue with Vue Router and TanStack Vue Query, then mounts on `#app`.
3. The Vue app fetches data from the Rails REST API (`/api/products`, `/api/ping`).

### Backend (`app/`)

- **`controllers/api/`** — JSON-only API controllers. Products endpoint supports Kaminari pagination (25 per page) via `?page=N`.
- **`models/product.rb`** — Single model: `name`, `description`, `price` (integer, cents).
- **`config/routes.rb`** — API routes under `/api`, plus a catch-all `get '*path'` that falls through to the Vue app.

### Frontend (`app/javascript/`)

- **`entrypoints/application.ts`** — App bootstrap (Vue + Router + VueQuery).
- **`router/`** — Vue Router routes mapping paths to page components.
- **`pages/`** — One component per route:
  - `ProductsPagination.vue` — prev/next pagination using `useQuery`.
  - `ProductsInfinitePagination.vue` — infinite scroll using `useInfiniteQuery` + IntersectionObserver.

### Data Fetching Pattern

Both pagination components use **TanStack Vue Query**. `useQuery` is used for offset pagination (page number in query key), `useInfiniteQuery` for infinite scroll (each page's `meta.next_page` drives the next fetch). VueUse utilities are available for composables.

### Path Alias

`@/` resolves to `app/javascript/` in both TypeScript and Vite.
