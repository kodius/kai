# Forms — Common Rules

Forms use **react-hook-form** with **shadcn/ui** form primitives. Every reusable form field is a generic wrapper component that reads the form context internally — callers only provide `name` and display props.

## Form field component structure

Each shadcn UI primitive (Input, Textarea, Select, …) gets a matching `Form*` wrapper. The wrapper calls `useFormContext()` so the parent form never passes `control` down manually.

File location: `components/form/form-{name}/form-{name}.tsx`

Every `Form*` component follows the same structure:

1. `"use client"` directive
2. Generic `<T extends FieldValues>` for type-safe field paths
3. `useFormContext<T>()` to get `control` — never accept `control` as a prop
4. `useId()` for accessible label linking
5. `Controller` from react-hook-form to connect field state
6. `Field` / `FieldLabel` / `FieldError` from `@/components/ui/field` for layout and error display
7. Export the props type so wrapper components can extend it

## Naming — prefix Form + PascalCase component name

```tsx
// ✓ correct
FormInput       // wraps Input
FormTextarea    // wraps Textarea
FormSelect      // wraps Select
FormCombobox    // wraps Combobox

// ✗ avoid
InputField
SelectWrapper
RHFInput
```

## FormOption — use for select-like components

When a field stores a structured value (label + value pair), use the shared `FormOption` type instead of a plain string.

```tsx
export type FormOption<T extends string = string> = {
  label: string;
  value: T;
};
```
