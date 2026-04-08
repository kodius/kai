# Forms

Forms use **react-hook-form** with **shadcn/ui** form primitives. Every reusable form field is a generic wrapper component that reads the form context internally — callers only provide `name` and display props.

## StandardFormProps — the shared base type for all form field components

All form field components extend `StandardFormProps<T>` so they share a consistent API and are type-safe against the form's schema.

```tsx
// types.ts (shared, lives at components/form/types.ts)
import { ReactNode } from "react";
import type { FieldValues, Path } from "react-hook-form";
import { PropsWithClassName } from "@/types/globals";

export type StandardFormProps<
  T extends FieldValues = FieldValues,
  F extends string = string,
> = {
  label?: ReactNode;
  name: Path<T>;
  placeholder?: string;
  description?: string;
  onChange?: (option?: FormOption<F>) => void;
} & PropsWithClassName;
```

## Form field components — wrap shadcn primitives with FormField

Each shadcn UI primitive (Input, Textarea, Select, …) gets a matching `Form*` wrapper. The wrapper calls `useFormContext()` so the parent form never passes `control` down manually.

File location: `components/form/form-{name}/index.tsx`

```tsx
// ✓ correct — FormInput wraps shadcn Input
"use client";

import type { FieldValues } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { StandardFormProps } from "../types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type FormInputProps<T extends FieldValues> = StandardFormProps<T> &
  React.ComponentProps<"input">;

export const FormInput = <T extends FieldValues>(props: FormInputProps<T>) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className={props.className}>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <Input {...field} {...props} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// ✗ avoid — passing control as a prop or using useForm inside the field component
export const FormInput = ({ control, name }: { control: Control; name: string }) => (
  <Controller control={control} name={name} render={...} />
);
```

## FormMessage — always include it to surface validation errors

`FormMessage` reads the field error from context and renders it. Include it in every `Form*` component so errors are always visible without extra wiring from the caller.

```tsx
// ✓ correct
<FormItem>
  <FormLabel>{props.label}</FormLabel>
  <FormControl>
    <Input {...field} {...props} />
  </FormControl>
  <FormMessage />
</FormItem>

// ✗ avoid — omitting FormMessage means validation errors are silently swallowed
<FormItem>
  <FormLabel>{props.label}</FormLabel>
  <FormControl>
    <Input {...field} {...props} />
  </FormControl>
</FormItem>
```

## Using Form* components — wrap the form with FormProvider

The parent form must render shadcn's `Form` (which is `FormProvider`) so `useFormContext()` works inside every `Form*` field.

```tsx
// ✓ correct
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/form-input";

const form = useForm<FormValues>({ resolver: zodResolver(schema) });

return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormInput<FormValues> name="email" label="Email" type="email" />
      <FormInput<FormValues> name="password" label="Password" type="password" />
    </form>
  </Form>
);

// ✗ avoid — using the raw shadcn Input directly inside a form; it won't register or validate
<input {...form.register("email")} />
```

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

// ✓ correct — field.onChange receives the full option object
onValueChange={(value) => {
  const selected = options.find((o) => o.value === value);
  field.onChange(selected);
  props.onChange?.(selected);
}}

// ✗ avoid — storing only the string value loses the label needed for display
field.onChange(value);
```
