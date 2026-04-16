# Project Structure

This project uses a feature-based folder structure with Expo Router.

## Top-level layout

```
my-app/
├── app/                  # Expo Router — routes, layouts, tabs only
├── features/             # Feature modules (core application logic)
├── components/           # Shared UI components used across features
├── hooks/                # Shared React hooks used across features
├── lib/                  # Shared utilities, helpers, API clients, config
├── types/                # Shared TypeScript types and interfaces
├── assets/               # Images, fonts, and other static assets
└── app.config.ts
```

## app/ — routing only

`app/` contains only Expo Router routing concerns: layouts, pages, tabs, and route groups. No business logic here — screens import from `features/`.

```
app/
├── _layout.tsx           # Root layout (providers, fonts, splash)
├── index.tsx             # Home / entry screen
├── (auth)/
│   ├── _layout.tsx       # Auth stack layout
│   ├── login.tsx         # thin — renders <LoginForm /> from features/auth
│   └── register.tsx
├── (tabs)/
│   ├── _layout.tsx       # Tab navigator layout
│   ├── home.tsx
│   ├── profile.tsx
│   └── settings.tsx
└── [id].tsx              # Dynamic route
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
│   ├── api/              # API calls (fetch, axios, react-query hooks)
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

## No barrel files

Import directly from the source file, not from an `index.ts` re-export:

```ts
// ✓ correct
import { LoginForm } from "@/features/auth/components/login-form";

// ✗ avoid
import { LoginForm } from "@/features/auth";
```
