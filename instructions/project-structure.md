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
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── hooks/            # React hooks scoped to this feature
│   │   └── use-auth.ts
│   ├── actions/          # Next.js Server Actions
│   │   └── auth-actions.ts
│   ├── api/              # Client-side fetch functions / API calls
│   │   └── auth-api.ts
│   ├── schemas/          # Zod validation schemas
│   │   └── auth-schemas.ts
│   ├── types/            # TypeScript types for this feature
│   │   └── auth.ts
│   ├── store/            # Local state — Zustand slice, context, or reducer
│   │   └── auth-store.ts
│   └── helpers/          # Pure utility functions scoped to this feature
│       └── auth-helpers.ts
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

All files and folders use `kebab-case` — no exceptions.

- **Folders**: `user-profile/`, `billing-history/`
- **Components**: `user-card.tsx`, `login-form.tsx`
- **Hooks**: `use-auth.ts`, `use-user-profile.ts`
- **Everything else**: `auth-api.ts`, `user-helpers.ts`, `auth-schemas.ts`

```
// ✓ correct
features/auth/components/login-form.tsx
features/auth/hooks/use-auth.ts
features/auth/api/auth-api.ts

// ✗ avoid
features/auth/components/LoginForm.tsx
features/auth/hooks/useAuth.ts
features/auth/api/authApi.ts
```

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
features/auth/hooks/use-auth.ts
features/auth/hooks/use-auth.test.ts

features/auth/components/login-form.tsx
features/auth/components/login-form.test.tsx
```

## Server Actions

Server Actions live in `features/[feature]/actions/` and are imported directly by Server or Client Components within the same feature.

```ts
// features/auth/actions/auth-actions.ts
"use server";

export async function loginAction(data: LoginInput) { ... }
```

## No barrel files

Import directly from the source file, not from an `index.ts` re-export:

```ts
// ✓ correct
import { LoginForm } from "@/features/auth/components/login-form";

// ✗ avoid
import { LoginForm } from "@/features/auth";
```
