# TypeScript Types — Utility Types

## Use built-in utility types

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

## Exhaustive mapping with Record

When mapping a union type to values or config, use `Record<UnionType, Value>`. TypeScript will error if a new variant is added to the union and the record isn't updated.

Avoid `switch` + `default` for this pattern — `default` silently absorbs new variants without a compile error.

```ts
type Role = "admin" | "user" | "snake";

type Setup = { endpoint: string; label: string };

const roleSetup: Record<Role, Setup> = {
  admin: { endpoint: "/admin", label: "Admin" },
  user:  { endpoint: "/dashboard", label: "User" },
  snake: { endpoint: "/snake", label: "Snake" },
};

const getSetup = (role: Role): Setup => roleSetup[role];
```

`switch` without `default` is acceptable when each branch executes complex logic rather than returning a mapped value.
