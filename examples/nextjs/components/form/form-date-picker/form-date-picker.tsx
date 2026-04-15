"use client";

import { useId, useState } from "react";
import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form";
import { format } from "date-fns";
import { IconCalendar } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type FormDatePickerProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
};

export const FormDatePicker = <T extends FieldValues>(
  props: FormDatePickerProps<T>,
) => {
  const form = useFormContext<T>();
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined}>
          <FieldLabel htmlFor={id}>{props.label}</FieldLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id={id}
                variant="outline"
                aria-invalid={fieldState.invalid}
                className="w-fit justify-start gap-1.5 text-xs font-normal"
              >
                <IconCalendar className="size-4 text-muted-foreground" />
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span className="text-muted-foreground">
                    {props.placeholder}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  setOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {fieldState.invalid ? (
            <FieldError errors={[fieldState.error]} />
          ) : null}
        </Field>
      )}
    />
  );
};
