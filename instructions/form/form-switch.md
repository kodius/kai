# FormSwitch

`FormSwitch` wraps shadcn `Switch` with react-hook-form `Controller`. Like `FormCheckbox`, it uses a horizontal `Field` layout with `FieldContent` so the label sits next to the switch and any error renders below the label.

File location: `components/form/form-switch/form-switch.tsx`

```tsx
"use client";

import { useId } from "react";
import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form";

import { Switch } from "@/components/ui/switch";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
};

export const FormSwitch = <T extends FieldValues>(props: Props<T>) => {
  const form = useFormContext<T>();
  const id = useId();

  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal" data-invalid={fieldState.invalid || undefined}>
          <Switch
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
