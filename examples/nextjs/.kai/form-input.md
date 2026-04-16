# FormInput

`FormInput` wraps shadcn `Input` with react-hook-form `Controller`. It reads the form context internally — callers only provide `name`, `label`, and optional display props.

File location: `components/form/form-input/form-input.tsx`

```tsx
"use client";

import { useId } from "react";
import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  autoComplete?: string;
};

export const FormInput = <T extends FieldValues>(props: Props<T>) => {
  const form = useFormContext<T>();
  const id = useId();

  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{props.label}</FieldLabel>
          <Input
            {...field}
            id={id}
            aria-invalid={fieldState.invalid}
            placeholder={props.placeholder}
            autoComplete={props.autoComplete}
          />
          {fieldState.invalid ? (
            <FieldError errors={[fieldState.error]} />
          ) : null}
        </Field>
      )}
    />
  );
};
```
