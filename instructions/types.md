# TypeScript Types

## type vs interface

Use `type` by default. Use `interface` only when you need declaration merging.

```ts
// ✓ correct
type User = {
  id: string;
  email: string;
};

type CreateUserInput = {
  email: string;
  password: string;
};

// ✓ acceptable — declaration merging for third-party extension
interface Window {
  analytics: Analytics;
}

// ✗ avoid — no reason to use interface here
interface User {
  id: string;
  email: string;
}
```

## No `any`

Never use `any`. It silently disables type checking and spreads unsafety through the codebase.

Use `unknown` for values whose type isn't known, then narrow with a type guard:

```ts
// ✗ avoid
function parseResponse(data: any) {
  return data.user.name;
}

// ✓ correct — unknown forces you to verify before use
function parseResponse(data: unknown): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "user" in data &&
    typeof (data as { user: unknown }).user === "object"
  ) {
    // or use Zod to parse and infer in one step
  }
  throw new Error("Unexpected response shape");
}

// ✓ better — use Zod for external data
const responseSchema = z.object({ user: z.object({ name: z.string() }) });

function parseResponse(data: unknown) {
  return responseSchema.parse(data); // throws on invalid shape
}
```

## No type assertion casts

Don't use `as` to force a type. It overrides the compiler and hides real bugs.

```ts
// ✗ avoid
const name = (user as { name: string }).name;
const id = someValue as string;
const data = res as unknown as SomeType; // double-cast is always a red flag

// ✓ use a type guard instead
function isUser(value: unknown): value is User {
  return typeof value === "object" && value !== null && "id" in value;
}

// ✓ use satisfies to validate shape without widening
const config = {
  endpoint: "/api/users",
  method: "GET",
} satisfies RequestConfig;
```

`as const` is fine on object literals to narrow literal types without bypassing safety:

```ts
const CONFIG = { endpoint: "/api/users", method: "GET" } as const;
```

For arrays, define the type explicitly instead of using `as const` (see **Explicit types for objects and arrays** below).

## Infer from Zod schemas

For any type that has a Zod schema (forms, API responses), derive the TypeScript type from the schema. Never define the same shape twice.

```ts
// ✓ single source of truth
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginInput = z.infer<typeof loginSchema>;

// ✗ avoid — schema and type can silently drift
type LoginInput = {
  email: string;
  password: string;
};
```

## Naming

- PascalCase for all types: `UserProfile`, `CreatePostInput`, `ApiError`
- No `T` prefix on concrete types, no `I` prefix on anything
- Use `T` only for generic type parameters: `function identity<T>(value: T): T`
- Names should describe the shape, not the fact that it's a type: `User` not `UserType`, `ApiError` not `IApiError`

```ts
// ✓ correct
type UserProfile = { ... };
type CreatePostInput = { ... };
function wrap<T>(value: T): Box<T> { ... }

// ✗ avoid
type IUserProfile = { ... };
type TCreatePostInput = { ... };
type UserType = { ... };
```

## Discriminated unions

Use discriminated unions to model state variants. Avoid optional fields that implicitly encode state.

```ts
// ✓ correct — exhaustive, safe to switch on
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function render(state: RequestState<User>) {
  switch (state.status) {
    case "idle":     return <Idle />;
    case "loading":  return <Spinner />;
    case "success":  return <UserCard user={state.data} />;
    case "error":    return <ErrorMessage message={state.error} />;
  }
}

// ✗ avoid — optional fields make invalid states representable
type RequestState<T> = {
  loading: boolean;
  data?: T;
  error?: string;
};
```

## Utility types

Use built-in utility types instead of redefining shapes manually.

```ts
// ✓ correct
type UpdateUserInput = Partial<User>;
type PublicUser = Omit<User, "passwordHash">;
type UserPreview = Pick<User, "id" | "name" | "avatar">;
type ReadonlyUser = Readonly<User>;

// ✗ avoid — duplicates the shape and drifts over time
type UpdateUserInput = {
  id?: string;
  email?: string;
  name?: string;
};
```

Common utility types: `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `ReturnType`, `Parameters`, `Awaited`.

## Explicit types for objects and arrays

Always annotate object literals and array literals with an explicit named type. Primitives do not need annotations — TypeScript infers them correctly from the value.

```ts
// ✓ correct
const user: User = { id: "1", email: "a@b.com" };
const items: Item[] = [];
const ROLES: Role[] = ["admin", "editor", "viewer"];
const count = 0;
const label = "submit";

// ✗ avoid
const user = { id: "1", email: "a@b.com" };
const items = [];
const ROLES = ["admin", "editor", "viewer"];
```
