# Project Structure

This project uses a feature-based folder structure with Next.js App Router.

## Top-level layout

```
my-app/
├── app/                  # Next.js App Router — routes, layouts, pages only
├── features/             # Feature modules (core application logic)
├── components/           # Shared UI components used across features
├── hooks/                # Shared React hooks used across features
├── lib/                  # Shared utilities, helpers, API clients, config
├── types/                # Shared TypeScript types and interfaces
├── public/               # Static assets
└── next.config.ts
```

## app/ — routing only

`app/` contains only Next.js routing concerns: layouts, pages, loading/error boundaries, and route handlers. No business logic here — pages import from `features/`.

```
app/
├── layout.tsx
├── page.tsx
├── (auth)/
│   ├── login/
│   │   └── page.tsx      # thin — renders <LoginForm /> from features/auth
│   └── register/
│       └── page.tsx
├── dashboard/
│   └── page.tsx
└── api/
    └── webhooks/
        └── route.ts
```

## features/ — feature modules

Each feature is a self-contained module. A feature owns everything needed to implement one domain slice.

```
features/
├── auth/
│   ├── components/       # UI components scoped to this feature
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── hooks/            # React hooks scoped to this feature
│   │   └── useAuth.ts
│   ├── actions/          # Next.js Server Actions
│   │   └── authActions.ts
│   ├── api/              # Client-side fetch functions / API calls
│   │   └── authApi.ts
│   ├── schemas/          # Zod validation schemas
│   │   └── authSchemas.ts
│   ├── types/            # TypeScript types for this feature
│   │   └── auth.ts
│   ├── store/            # Local state — Zustand slice, context, or reducer
│   │   └── authStore.ts
│   └── helpers/          # Pure utility functions scoped to this feature
│       └── authHelpers.ts
├── dashboard/
│   ├── components/
│   ├── hooks/
│   └── ...
└── user-profile/
    ├── components/
    ├── hooks/
    └── ...
```

Only include sub-folders that are needed — don't create empty directories.

## Naming conventions

- **Feature folders**: `kebab-case` — `user-profile/`, `billing-history/`
- **Component files**: `PascalCase` — `UserCard.tsx`, `LoginForm.tsx`
- **Hook files**: `camelCase` with `use` prefix — `useAuth.ts`, `useUserProfile.ts`
- **Everything else**: `camelCase` — `authApi.ts`, `userHelpers.ts`, `authSchemas.ts`

## Shared vs feature-scoped

| Location | Use when |
|---|---|
| `features/[feature]/` | Used only within that feature |
| `components/` | UI component used in 2+ features |
| `hooks/` | Hook used in 2+ features |
| `lib/` | Utility, helper, or client used in 2+ features |
| `types/` | Type used in 2+ features |

Move code to the shared layer only when it is actually reused. Default to keeping it inside the feature.

## Tests

Test files are co-located next to the file they test:

```
features/auth/hooks/useAuth.ts
features/auth/hooks/useAuth.test.ts

features/auth/components/LoginForm.tsx
features/auth/components/LoginForm.test.tsx
```

## Server Actions

Server Actions live in `features/[feature]/actions/` and are imported directly by Server or Client Components within the same feature.

```ts
// features/auth/actions/authActions.ts
"use server";

export async function loginAction(data: LoginInput) { ... }
```

## No barrel files

Import directly from the source file, not from an `index.ts` re-export:

```ts
// ✓ correct
import { LoginForm } from "@/features/auth/components/LoginForm";

// ✗ avoid
import { LoginForm } from "@/features/auth";
```
