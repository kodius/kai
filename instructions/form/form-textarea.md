# FormTextarea

`FormTextarea` wraps shadcn `Textarea` with react-hook-form `Controller`. It reads the form context internally — callers only provide `name`, `label`, and an optional `placeholder`.

File location: `components/form/form-textarea/form-textarea.tsx`

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
import { Textarea } from "@/components/ui/textarea";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
};

export const FormTextarea = <T extends FieldValues>(props: Props<T>) => {
  const form = useFormContext<T>();
  const id = useId();

  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{props.label}</FieldLabel>
          <Textarea
            {...field}
            id={id}
            aria-invalid={fieldState.invalid}
            placeholder={props.placeholder}
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
