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

export type FormSelectProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  options: FormOption[];
  placeholder?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isLoading?: boolean;
};

export const FormSelect = <T extends FieldValues>(props: FormSelectProps<T>) => {
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
              onValueChange={field.onChange}
              open={props.open}
              onOpenChange={props.onOpenChange}
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
