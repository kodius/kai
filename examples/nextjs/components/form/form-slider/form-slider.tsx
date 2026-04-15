"use client";

import { useId } from "react";
import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  min?: number;
  max?: number;
  step?: number;
};

export const FormSlider = <T extends FieldValues>(props: Props<T>) => {
  const form = useFormContext<T>();
  const id = useId();

  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined}>
          <FieldLabel htmlFor={id}>{props.label}</FieldLabel>
          <Slider
            id={id}
            min={props.min}
            max={props.max}
            step={props.step}
            value={[field.value ?? 0]}
            onValueChange={([value]) => field.onChange(value)}
          />
          {fieldState.invalid ? (
            <FieldError errors={[fieldState.error]} />
          ) : null}
        </Field>
      )}
    />
  );
};
