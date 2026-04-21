# TypeScript Types — Common Rules

## type vs interface

Use `type` by default. Use `interface` only when you need declaration merging.

## No `any`

Never use `any`. Use `unknown` for values whose type isn't known, then narrow with a type guard.

## No type assertion casts

Don't use `as` to force a type. It overrides the compiler and hides real bugs. Use a type guard or `satisfies` instead. `as const` is fine on object literals.

## Naming

- PascalCase for all types: `UserProfile`, `CreatePostInput`, `ApiError`
- No `T` prefix on concrete types, no `I` prefix on anything
- Use `T` only for generic type parameters: `function identity<T>(value: T): T`
- Names should describe the shape, not the fact that it's a type: `User` not `UserType`

## Reuse types — never redefine the same shape twice

If a type already exists, import it. Never re-declare the same union, object shape, or enum in another file.

## Discriminated unions

Use discriminated unions to model state variants. Avoid optional fields that implicitly encode state.

```ts
// ✓ correct — exhaustive, safe to switch on
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
```

## Explicit types for objects and arrays

Always annotate object literals and array literals with an explicit named type. Primitives do not need annotations.

```ts
// ✓ correct
const user: User = { id: "1", email: "a@b.com" };
const items: Item[] = [];
const count = 0;
const label = "submit";
```

## Annotate defaulted assignments — don't let inference widen past `??` / `||`

When assigning from a value that uses a fallback (`??`, `||`, or ternary with a literal), annotate the variable with the target union type. Without the annotation, TypeScript infers the union of both sides, so any literal on the right — including a typo or an out-of-domain value — passes type-checking and silently widens the type.
