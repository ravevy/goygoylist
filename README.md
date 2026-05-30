# goygoylist

A private shared to-do list app with a retro 8-bit aesthetic. Built with Next.js and Supabase.

## What it is

A full-stack web app for managing multiple named lists, each containing items that can be added, edited, and marked complete. Both users share the same lists and can see who created each item. The UI is styled with [NES.css](https://nostalgic-css.github.io/NES.css/) for a pixel-art retro feel and supports light/dark themes.

## Features

- **Multiple lists** — create, rename, and delete named lists from the dashboard
- **List items** — each item has a title, an optional description, and a completion timestamp
- **Completed section** — completed items are separated into a collapsible section within each list
- **User attribution** — items show the avatar of whoever created them
- **Profiles** — each user has a display name and a Pokémon avatar (Bulbasaur, Charmander, Squirtle, or Pokéball)
- **Light / dark theme** — persisted to localStorage, respects system preference on first visit
- **Auth** — email/password login via Supabase Auth; sessions are protected and expire automatically

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (Pages Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + NES.css |
| UI components | Radix UI + shadcn |
| Backend / DB | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Validation | Zod |
| Git hooks | Husky + lint-staged |

## Architecture

```
src/
├── pages/          # Next.js pages (dashboard, list/[id], profile, login)
├── components/
│   ├── features/   # Domain components (SummaryCard, DetailedList, ProfileCard, …)
│   └── ui-kit/     # Generic UI primitives (Button, Input, Dialog, Checkbox, …)
├── lib/
│   ├── services/   # Supabase data layer (lists, listItems, profiles)
│   └── validation/ # Zod schemas for all data types
├── context/        # Theme context (ThemeProvider + useTheme hook)
└── types/          # Shared result types + auto-generated Supabase types
```

### Data flow

All data operations go through service functions in `lib/services/`. Every service returns a discriminated union:

```typescript
type GetResults<T> =
  | { success: true; data: T }
  | { success: false; type: 'supabase'; error: PostgrestError }
  | { success: false; type: 'validation'; error: ZodError }
```

Supabase responses are validated against Zod schemas before reaching component state, so invalid shapes from the database surface as typed validation errors rather than silent runtime failures.

### Database

Three tables in Supabase PostgreSQL:

- **`profiles`** — `id`, `display_name`, `avatar_icon`
- **`lists`** — `id`, `title`, `created_at`, `created_by`
- **`list_items`** — `id`, `list_id`, `title`, `description`, `created_at`, `created_by`, `completed_at`

Two database views (`list_with_items_ordered`, `list_with_items_view`) handle ordering and denormalization so the client can fetch a list and all its items in a single query.

### Auth & routing

`ProtectedRoute` wraps every page except `/login`. It checks the Supabase session on mount and subscribes to auth state changes — if the session expires, the user is redirected to `/login` automatically. The app entry point (`/`) immediately redirects to `/dashboard`.
