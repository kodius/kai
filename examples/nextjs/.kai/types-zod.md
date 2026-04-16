# TypeScript Types — Zod

## Infer from Zod schemas

For any type that has a Zod schema (forms, API responses), derive the TypeScript type from the schema. Never define the same shape twice.

```ts
// ✓ single source of truth
const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

type LoginInput = z.infer<typeof loginSchema>;

// ✗ avoid — schema and type can silently drift
type LoginInput = {
  email: string;
  password: string;
};
```

## Use Zod v4 top-level validators and `{ error }` option

Use the Zod v4 top-level validator API — `z.email()`, `z.url()`, `z.uuid()`, etc. — rather than the v3 chained form `z.string().email()`. For custom error messages, pass `{ error: "..." }` (or `{ error: (issue) => ... }`) as the options argument. Do **not** use the v3 `errorMap` or the string-as-second-argument shorthand.

```ts
// ✓ correct — Zod v4
const schema = z.object({
  email: z.email("Please enter a valid email address."),
  dob: z.date({ error: "Please select a date." }),
  terms: z.literal(true, { error: "You must agree to the terms." }),
});

// ✗ avoid — Zod v3 chained form
const schema = z.object({
  email: z.string().email("Please enter a valid email address."),
});
```

## Validate unknown input with Zod

For any runtime validation of unknown input (search params, route params, API payloads, env vars, external responses), define a Zod schema and parse. Do not hand-roll validation with `Set` whitelists, `if` chains, or `as` casts — a schema validates, narrows, and types in one step via `z.infer`.
