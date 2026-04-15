"use client";

import { useId } from "react";
import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import type { FormOption } from "@/components/form/types";

type Props<T extends FieldValues, TValue extends string = string> = {
  name: Path<T>;
  label: string;
  options: FormOption<TValue>[];
  onSelectAction?: (option: FormOption<TValue>) => void;
};

export const FormRadioGroup = <T extends FieldValues, TValue extends string = string>(
  props: Props<T, TValue>,
) => {
  const form = useFormContext<T>();
  const id = useId();

  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined}>
          <FieldLabel htmlFor={id}>{props.label}</FieldLabel>
          <RadioGroup
            id={id}
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
              const selected = props.options.find((o) => o.value === value);
              if (selected) props.onSelectAction?.(selected);
            }}
            aria-invalid={fieldState.invalid}
          >
            {props.options.map((option) => (
              <Field key={option.value} orientation="horizontal">
                <RadioGroupItem
                  value={option.value}
                  id={`${id}-${option.value}`}
                />
                <FieldLabel htmlFor={`${id}-${option.value}`}>
                  {option.label}
                </FieldLabel>
              </Field>
            ))}
          </RadioGroup>
          {fieldState.invalid ? (
            <FieldError errors={[fieldState.error]} />
          ) : null}
        </Field>
      )}
    />
  );
};
