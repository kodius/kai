# FormCheckbox

`FormCheckbox` wraps shadcn `Checkbox` with react-hook-form `Controller`. It uses a horizontal `Field` layout with `FieldContent` so the label sits next to the checkbox and any error renders below the label.

File location: `components/form/form-checkbox/form-checkbox.tsx`

```tsx
"use client";

import { useId } from "react";
import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
};

export const FormCheckbox = <T extends FieldValues>(props: Props<T>) => {
  const form = useFormContext<T>();
  const id = useId();

  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal" data-invalid={fieldState.invalid || undefined}>
          <Checkbox
            id={id}
            checked={field.value}
            onCheckedChange={field.onChange}
            aria-invalid={fieldState.invalid}
          />
          <FieldContent>
            <FieldLabel htmlFor={id}>{props.label}</FieldLabel>
            {fieldState.invalid ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </FieldContent>
        </Field>
      )}
    />
  );
};
```
