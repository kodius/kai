"use client";

import { useId } from "react";
import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

import type { FormOption } from "@/components/form/types";

export type FormSelectProps<T extends FieldValues, TValue extends string = string> = {
  name: Path<T>;
  label: string;
  options: FormOption<TValue>[];
  placeholder?: string;
  open?: boolean;
  onOpenChangeAction?: (open: boolean) => void;
  onSelectAction?: (option: FormOption<TValue>) => void;
  isLoading?: boolean;
};

export const FormSelect = <T extends FieldValues, TValue extends string = string>(props: FormSelectProps<T, TValue>) => {
  const form = useFormContext<T>();
  const id = useId();

  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field, fieldState }) => {
        const loadingContent = (
          <Spinner className="h-20" />
        );

        const content = props.options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ));

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id}>{props.label}</FieldLabel>
            <Select
              name={field.name}
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                const selected = props.options.find((o) => o.value === value);
                if (selected) props.onSelectAction?.(selected);
              }}
              open={props.open}
              onOpenChange={props.onOpenChangeAction}
            >
              <SelectTrigger id={id} aria-invalid={fieldState.invalid}>
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4}>
                {props.isLoading ? loadingContent : content}
              </SelectContent>
            </Select>
            {fieldState.invalid ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </Field>
        );
      }}
    />
  );
};
