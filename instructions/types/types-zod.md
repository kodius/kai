# TypeScript Types — Zod

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

## Validate unknown input with Zod

For any runtime validation of unknown input (search params, route params, API payloads, env vars, external responses), define a Zod schema and parse. Do not hand-roll validation with `Set` whitelists, `if` chains, or `as` casts — a schema validates, narrows, and types in one step via `z.infer`.
