# Project Structure

This project uses a feature-based folder structure with Expo Router, matching the **Expo SDK 55 default template**: everything lives under `src/`, with `@/*` aliased to `./src/*`.

## Top-level layout

```
my-app/
├── src/
│   ├── app/                  # Expo Router — routes, layouts, tabs only
│   ├── features/             # Feature modules (core application logic)
│   ├── components/           # Shared UI components used across features
│   ├── hooks/                # Shared React hooks used across features
│   ├── lib/                  # Shared utilities, helpers, API clients, config
│   ├── types/                # Shared TypeScript types and interfaces
│   ├── constants/            # Shared constants (theme tokens, etc.)
│   └── global.css            # Tailwind / NativeWind entry
├── assets/                   # Images, fonts, and other static assets (stays at root)
├── scripts/                  # Project scripts (stays at root)
├── app.json                  # or app.config.ts
├── tsconfig.json             # `@/*` → `./src/*`
└── package.json
```

Follow the SDK 55 default — do not move folders from `src/` to the repo root. `assets/` and `scripts/` are the exceptions: Expo expects those at the root.

## Path alias — `@/*` resolves to `./src/*`

The default `tsconfig.json` aliases `@/*` to `./src/*`. Imports look the same as before — `@/features/...`, `@/components/...` — but they resolve to files under `src/`.

```ts
import { LoginForm } from "@/features/auth/components/login-form";
//                                ^ resolves to src/features/auth/components/login-form
```

Do not introduce a second alias or change this mapping.

## app/ — routing only

`src/app/` contains only Expo Router routing concerns: layouts, pages, tabs, and route groups. No business logic here — screens import from `src/features/`.

```
src/app/
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

Each feature is a self-contained module under `src/features/`. A feature owns everything needed to implement one domain slice.

```
src/features/
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
src/features/auth/components/login-form.tsx
src/features/auth/hooks/use-auth.ts
src/features/auth/api/auth-api.ts

// ✗ avoid
src/features/auth/components/LoginForm.tsx
src/features/auth/hooks/useAuth.ts
src/features/auth/api/authApi.ts
```

## Shared vs feature-scoped

| Location | Use when |
|---|---|
| `src/features/[feature]/` | Used only within that feature |
| `src/components/` | UI component used in 2+ features |
| `src/hooks/` | Hook used in 2+ features |
| `src/lib/` | Utility, helper, or client used in 2+ features |
| `src/types/` | Type used in 2+ features |

Move code to the shared layer only when it is actually reused. Default to keeping it inside the feature.

## Tests

Test files are co-located next to the file they test:

```
src/features/auth/hooks/use-auth.ts
src/features/auth/hooks/use-auth.test.ts

src/features/auth/components/login-form.tsx
src/features/auth/components/login-form.test.tsx
```

## Managed Expo — never modify ios/ or android/

This is a managed Expo project. The `ios/` and `android/` folders are generated and maintained by Expo (via prebuild). Never create, modify, or commit files in these directories manually. All native configuration goes through `app.json` / `app.config.ts` and config plugins.

## No barrel files

Import directly from the source file, not from an `index.ts` re-export:

```ts
// ✓ correct
import { LoginForm } from "@/features/auth/components/login-form";

// ✗ avoid
import { LoginForm } from "@/features/auth";
```
