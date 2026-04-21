# Forms — Common Rules

Forms use **react-hook-form** with reusable `Form*` wrapper components. Every reusable form field reads the form context internally — callers only provide `name` and display props.

## Form field component structure

Each input type (`TextInput`, `Select`, …) gets a matching `Form*` wrapper. The wrapper calls `useFormContext()` so the parent form never passes `control` down manually.

File location: `components/form/form-{name}/form-{name}.tsx`

Every `Form*` component follows the same structure:

1. Generic `<T extends FieldValues>` for type-safe field paths.
2. `useFormContext<T>()` to get `control` — never accept `control` as a prop.
3. `Controller` from react-hook-form to connect field state.
4. Field-level error rendering lives inside the wrapper — callers never read `formState.errors[name]` manually.
5. Keep the `Props` type local (unexported) by default. Export it — named `Form{X}Props` — only when another component wraps this one and needs to extend the prop shape.

## Naming — prefix Form + PascalCase component name

```tsx
// ✓ correct
FormInput       // wraps TextInput
FormTextarea    // wraps multiline TextInput
FormSelect      // wraps a select/picker

// ✗ avoid
InputField
TextInputWrapper
RHFInput
```

## Parent form uses FormProvider

The parent form must wrap its children in `FormProvider` so `Form*` children can call `useFormContext()`. The parent never passes `control` down manually.

```tsx
const methods = useForm<LoginInput>({ ... });

return (
  <FormProvider {...methods}>
    <FormInput name="email" label="Email" />
  </FormProvider>
);
```

## Root errors stay in the parent

Field-level errors render inside the `Form*` wrapper. Form-level errors (`formState.errors.root`) render in the parent form, usually above the submit button.
